"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { GlobalSearchPalette } from "@/components/search/global-search-palette";
import { usePublicChrome } from "@/lib/public/public-chrome-context";
import { mapPublicSearchSections, type GlobalSearchPayload } from "@/lib/search/map-search-sections";
import { publicSearchTheme } from "@/lib/search/palette-themes";
import { searchShortcutKeyLabel, searchShortcutLabel } from "@/lib/search/shortcut-labels";

export function PublicCommandPalette() {
  const { searchOpen, closeSearch } = usePublicChrome();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const isAr = locale === "ar";

  const fetchResults = useCallback(
    async (query: string, signal: AbortSignal) => {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`, { signal });
      const json = (await res.json()) as { success: boolean; data?: GlobalSearchPayload };
      if (!res.ok || !json.success || !json.data) return [];
      return mapPublicSearchSections(json.data, locale, {
        books: isAr ? "الكتب" : "Books",
        articles: isAr ? "المقالات" : "Articles",
        media: isAr ? "الميديا" : "Media",
        publishers: isAr ? "الناشرون" : "Publishers",
        authors: isAr ? "المؤلفون" : "Authors",
      });
    },
    [isAr, locale],
  );

  return (
    <GlobalSearchPalette
      open={searchOpen}
      onClose={closeSearch}
      theme={publicSearchTheme}
      topClassName="top-[max(7rem,12vh)]"
      modKeyLabel={searchShortcutLabel()}
      placeholder={
        isAr
          ? "ابحث عن كتاب، مقال، ميديا، ناشر، مؤلف..."
          : "Search books, articles, media, publishers, authors..."
      }
      emptyHint={
        isAr
          ? "اكتب حرفين على الأقل للبحث في المنصة"
          : "Type at least 2 characters to search the platform"
      }
      noResultsHint={(q) =>
        isAr ? `لا توجد نتائج لـ «${q}»` : `No results for “${q}”`
      }
      ariaLabel={isAr ? "بحث المنصة" : "Platform search"}
      fetchResults={fetchResults}
      footer={
        <span>
          <kbd className="rounded border border-[var(--brand-gray-200)] px-1">{searchShortcutKeyLabel()}</kbd>{" "}
          {isAr ? "بحث" : "Search"} ·{" "}
          <kbd className="rounded border border-[var(--brand-gray-200)] px-1">Esc</kbd>{" "}
          {isAr ? "إغلاق" : "Close"}
        </span>
      }
    />
  );
}
