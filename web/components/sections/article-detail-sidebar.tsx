"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { resolveArticleDisplayImage } from "@/lib/articles/resolve-display-image";
import { cn } from "@/lib/utils";

export interface ArticleSidebarItem {
  slug: string;
  title: string;
  imageUrl: string | null;
  excerpt?: string | null;
  content?: string | null;
  products?: Array<{ imageUrl: string | null }>;
}

interface ArticleDetailSidebarProps {
  locale: Locale;
  articles: ArticleSidebarItem[];
  className?: string;
}

function sidebarThumb(item: ArticleSidebarItem): string | null {
  return resolveArticleDisplayImage({
    imageUrl: item.imageUrl?? item.products?.[0]?.imageUrl,
    bookImageUrls: item.products?.map((p) => p.imageUrl),
    excerpt: item.excerpt,
    content: item.content,
  });
}

export function ArticleDetailSidebar({ locale, articles, className }: ArticleDetailSidebarProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <aside className={cn("space-y-8", className)}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? "ابحث..." : "Search..."}
          className="w-full rounded-md border border-[var(--brand-gray-300)] bg-white py-2.5 pe-12 ps-3 text-sm text-[var(--brand-gray-900)] outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)]"
          aria-label={isAr ? "بحث" : "Search"}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]"
          aria-label={isAr ? "بحث" : "Search"}
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {articles.length > 0 && (
        <section aria-labelledby="sidebar-latest-heading">
          <h2
            id="sidebar-latest-heading"
            className="mb-4 border-b-2 border-[var(--brand-red)] pb-2 text-sm font-bold text-[var(--brand-red)]"
          >
            {isAr ? "آخر المقالات" : "Latest Articles"}
          </h2>
          <ul className="space-y-4">
            {articles.map((item) => {
              const thumb = sidebarThumb(item);
              return (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/articles/${item.slug}`}
                    className="group flex gap-3 transition-opacity hover:opacity-85"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[var(--brand-gray-200)] bg-[var(--brand-gray-100)]">
                      {thumb ? (
                        <Image src={thumb} alt="" fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--brand-gray-400)]">
                          —
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-3 flex-1 text-sm leading-snug text-[var(--brand-gray-800)] group-hover:text-[var(--brand-red)]">
                      {item.title}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </aside>
  );
}
