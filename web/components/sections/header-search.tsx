"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search } from "lucide-react";

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const isAr = locale === "ar";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${locale}/books?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-xl transition-all duration-[var(--motion-base)] ${
        focused ? "shadow-[0_0_0_3px_rgba(177,30,46,0.35)]" : "shadow-[var(--shadow-soft)]"
      }`}
      role="search"
    >
      <div className="flex h-10 items-stretch overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search
            className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-gray-500)] ${
              isAr ? "end-3" : "start-3"
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={
              isAr ? "ابحث عن كتاب، مؤلف، ناشر..." : "Search books, authors, publishers..."
            }
            className={`h-full w-full border-0 bg-transparent text-sm text-[var(--brand-gray-900)] placeholder:text-[var(--brand-gray-400)] focus:outline-none ${
              isAr ? "pe-10 ps-4 text-right" : "ps-10 pe-4 text-left"
            }`}
            aria-label={isAr ? "بحث في الكتب" : "Search books"}
          />
        </div>
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-e-2xl bg-[var(--brand-red)] px-5 text-sm font-semibold text-white transition-all duration-[var(--motion-base)] hover:scale-[1.02] hover:bg-[var(--brand-red-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
        >
          {isAr ? "بحث" : "Search"}
        </button>
      </div>
    </form>
  );
}
