"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-5 rounded-2xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <h2 className="font-bold text-[var(--brand-gray-900)]">
        {isAr ? "تصفية" : "Filter"}
      </h2>

      {/* Sort */}
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
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-gray-500)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-sm text-start transition-all duration-[var(--motion-base)]",
        active
          ? "bg-[var(--brand-red-soft)] text-[var(--brand-red)] font-medium shadow-sm"
          : "text-[var(--brand-gray-700)] hover:bg-[var(--brand-gray-100)] hover:scale-[1.01]"
      )}
    >
      {children}
    </button>
  );
}
