"use client";

import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { usePublicChromeOptional } from "@/lib/public/public-chrome-context";
import { modKeyLabel } from "@/lib/search/shortcut-labels";

export function HeaderSearch() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const isAr = locale === "ar";
  const chrome = usePublicChromeOptional();

  function openSearch() {
    chrome?.openSearch();
  }

  return (
    <button
      type="button"
      onClick={openSearch}
      className="group relative w-full max-w-xl transition-all duration-[var(--motion-base)] rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[0_0_0_3px_rgba(177,30,46,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]/40"
      aria-label={isAr ? "بحث في المنصة" : "Search the platform"}
    >
      <div className="flex h-10 items-stretch overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search
            className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-gray-500)] ${
              isAr ? "end-3" : "start-3"
            }`}
            aria-hidden="true"
          />
          <span
            className={`block w-full truncate text-sm text-[var(--brand-gray-400)] ${
              isAr ? "pe-10 ps-4 text-right" : "ps-10 pe-4 text-left"
            }`}
          >
            {isAr ? "ابحث عن كتاب، مقال، ناشر، مؤلف..." : "Search books, articles, publishers, authors..."}
          </span>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 border-s border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-3 text-[10px] text-[var(--brand-gray-500)] sm:flex">
          <kbd className="rounded border border-[var(--brand-gray-200)] bg-white px-1 py-0.5">
            {modKeyLabel()}K
          </kbd>
        </span>
        <span className="flex shrink-0 items-center justify-center rounded-e-2xl bg-[var(--brand-red)] px-5 text-sm font-semibold text-white transition-all duration-[var(--motion-base)] group-hover:bg-[var(--brand-red-hover)]">
          {isAr ? "بحث" : "Search"}
        </span>
      </div>
    </button>
  );
}
