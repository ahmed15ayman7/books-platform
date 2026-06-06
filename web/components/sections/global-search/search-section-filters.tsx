"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterButton, FilterPanel, FilterSection } from "@/components/ui/filter-panel";
import { READING_CHANNELS, MEDIA_CHANNELS } from "@/lib/nav/site-nav";
import type { SearchSectionType } from "@/lib/search/search-types";

interface CategoryOption {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
}

interface CountryOption {
  slug: string;
  name: string;
  nameAr?: string | null;
}

interface SearchSectionFiltersProps {
  locale: string;
  type: SearchSectionType;
  bookCategories: CategoryOption[];
  articleCategories: CategoryOption[];
  countries: CountryOption[];
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

const articleSortOptions = [
  { value: "newest", labelAr: "الأحدث", labelEn: "Newest" },
  { value: "oldest", labelAr: "الأقدم", labelEn: "Oldest" },
  { value: "title", labelAr: "العنوان", labelEn: "Title" },
];

export function SearchSectionFilters({
  locale,
  type,
  bookCategories,
  articleCategories,
  countries,
}: SearchSectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";

  const current = {
    sort: searchParams.get("sort") ?? "newest",
    status: searchParams.get("status") ?? "",
    category: searchParams.get("category") ?? "",
    channel: searchParams.get("channel") ?? "",
    country: searchParams.get("country") ?? "",
  };

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  if (type === "all") return null;

  const title = isAr ? "تصفية" : "Filters";

  return (
    <FilterPanel title={title} className="lg:sticky lg:top-28">
      <FilterSection title={isAr ? "الترتيب" : "Sort By"}>
        <div className="flex flex-col gap-1">
          {(type === "media" ? articleSortOptions.slice(0, 2) : type === "authors" || type === "publishers" ? sortOptions.slice(0, 2) : sortOptions).map(
            (opt) => (
              <FilterButton
                key={opt.value}
                active={current.sort === opt.value || (!searchParams.get("sort") && opt.value === "newest")}
                onClick={() => updateFilter("sort", opt.value)}
              >
                {isAr ? opt.labelAr : opt.labelEn}
              </FilterButton>
            ),
          )}
        </div>
      </FilterSection>

      {type === "books" && (
        <>
          <FilterSection title={isAr ? "حالة الترجمة" : "Translation Status"}>
            <div className="flex flex-col gap-1">
              {translationStatuses.map((status) => (
                <FilterButton
                  key={status.value || "all"}
                  active={current.status === status.value}
                  onClick={() => updateFilter("status", status.value)}
                >
                  {isAr ? status.labelAr : status.labelEn}
                </FilterButton>
              ))}
            </div>
          </FilterSection>
          {bookCategories.length > 0 && (
            <FilterSection title={isAr ? "التصنيف" : "Category"}>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                <FilterButton active={!current.category} onClick={() => updateFilter("category", "")}>
                  {isAr ? "الكل" : "All"}
                </FilterButton>
                {bookCategories.map((cat) => (
                  <FilterButton
                    key={cat.id}
                    active={current.category === cat.slug}
                    onClick={() => updateFilter("category", cat.slug)}
                  >
                    {isAr && cat.nameAr ? cat.nameAr : cat.name}
                  </FilterButton>
                ))}
              </div>
            </FilterSection>
          )}
        </>
      )}

      {type === "articles" && (
        <>
          <FilterSection title={isAr ? "القناة" : "Channel"}>
            <div className="flex flex-col gap-1">
              <FilterButton active={!current.channel} onClick={() => updateFilter("channel", "")}>
                {isAr ? "الكل" : "All"}
              </FilterButton>
              {READING_CHANNELS.map((ch) => (
                <FilterButton
                  key={ch.slug}
                  active={current.channel === ch.slug}
                  onClick={() => updateFilter("channel", ch.slug)}
                >
                  {isAr ? ch.labelAr : ch.labelEn}
                </FilterButton>
              ))}
            </div>
          </FilterSection>
          {articleCategories.length > 0 && (
            <FilterSection title={isAr ? "التصنيف" : "Category"}>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                <FilterButton active={!current.category} onClick={() => updateFilter("category", "")}>
                  {isAr ? "الكل" : "All"}
                </FilterButton>
                {articleCategories.map((cat) => (
                  <FilterButton
                    key={cat.id}
                    active={current.category === cat.slug}
                    onClick={() => updateFilter("category", cat.slug)}
                  >
                    {isAr && cat.nameAr ? cat.nameAr : cat.name}
                  </FilterButton>
                ))}
              </div>
            </FilterSection>
          )}
        </>
      )}

      {type === "media" && (
        <FilterSection title={isAr ? "القناة" : "Channel"}>
          <div className="flex flex-col gap-1">
            <FilterButton active={!current.channel} onClick={() => updateFilter("channel", "")}>
              {isAr ? "الكل" : "All"}
            </FilterButton>
            {MEDIA_CHANNELS.map((ch) => (
              <FilterButton
                key={ch.slug}
                active={current.channel === ch.slug}
                onClick={() => updateFilter("channel", ch.slug)}
              >
                {isAr ? ch.labelAr : ch.labelEn}
              </FilterButton>
            ))}
          </div>
        </FilterSection>
      )}

      {type === "publishers" && countries.length > 0 && (
        <FilterSection title={isAr ? "الدولة" : "Country"}>
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            <FilterButton active={!current.country} onClick={() => updateFilter("country", "")}>
              {isAr ? "الكل" : "All"}
            </FilterButton>
            {countries.map((country) => (
              <FilterButton
                key={country.slug}
                active={current.country === country.slug}
                onClick={() => updateFilter("country", country.slug)}
              >
                {isAr && country.nameAr ? country.nameAr : country.name}
              </FilterButton>
            ))}
          </div>
        </FilterSection>
      )}
    </FilterPanel>
  );
}
