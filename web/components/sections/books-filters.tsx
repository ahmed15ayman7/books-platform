"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterButton, FilterPanel, FilterSection } from "@/components/ui/filter-panel";

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
}

interface BooksFiltersProps {
  categories: Category[];
  locale: string;
  currentFilters: {
    category?: string;
    language?: string;
    status?: string;
    sort?: string;
  };
}

const translationStatuses = [
  { value: "", labelAr: "الكل", labelEn: "All" },
  { value: "NOT_TRANSLATED", labelAr: "غير مترجم", labelEn: "Not Translated" },
  { value: "NOMINATED", labelAr: "مرشح للترجمة", labelEn: "For Translation" },
  { value: "TRANSLATED", labelAr: "مترجم", labelEn: "Translated" },
];

const sortOptions = [
  { value: "newest", labelAr: "الأحدث", labelEn: "Newest" },
  { value: "oldest", labelAr: "الأقدم", labelEn: "Oldest" },
  { value: "title", labelAr: "العنوان", labelEn: "Title" },
];

export function BooksFilters({ categories, locale, currentFilters }: BooksFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const isAr = locale === "ar";

  return (
    <FilterPanel title={isAr ? "تصفية" : "Filter"}>
      <FilterSection title={isAr ? "الترتيب" : "Sort By"}>
        <div className="flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <FilterButton
              key={opt.value}
              active={currentFilters.sort === opt.value || (!currentFilters.sort && opt.value === "newest")}
              onClick={() => updateFilter("sort", opt.value)}
            >
              {isAr ? opt.labelAr : opt.labelEn}
            </FilterButton>
          ))}
        </div>
      </FilterSection>

      {/* Translation Status */}
      <FilterSection title={isAr ? "حالة الترجمة" : "Translation Status"}>
        <div className="flex flex-col gap-1">
          {translationStatuses.map((status) => (
            <FilterButton
              key={status.value}
              active={
                (currentFilters.status ?? "") === status.value
              }
              onClick={() => updateFilter("status", status.value)}
            >
              {isAr ? status.labelAr : status.labelEn}
            </FilterButton>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title={isAr ? "التصنيف" : "Category"}>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            <FilterButton
              active={!currentFilters.category}
              onClick={() => updateFilter("category", "")}
            >
              {isAr ? "الكل" : "All"}
            </FilterButton>
            {categories.map((cat) => (
              <FilterButton
                key={cat.id}
                active={currentFilters.category === cat.slug}
                onClick={() => updateFilter("category", cat.slug)}
              >
                {isAr && cat.nameAr ? cat.nameAr : cat.name}
              </FilterButton>
            ))}
          </div>
        </FilterSection>
      )}
    </FilterPanel>
  );
}
