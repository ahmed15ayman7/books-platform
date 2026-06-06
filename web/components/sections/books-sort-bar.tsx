"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterButton } from "@/components/ui/filter-panel";

const sortOptions = [
  { value: "newest", labelAr: "الأحدث", labelEn: "Newest" },
  { value: "oldest", labelAr: "الأقدم", labelEn: "Oldest" },
  { value: "title", labelAr: "العنوان", labelEn: "Title" },
];

interface BooksSortBarProps {
  locale: string;
}

export function BooksSortBar({ locale }: BooksSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";
  const currentSort = searchParams.get("sort") ?? "newest";

  const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "newest") params.set("sort", value);
      else params.delete("sort");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-[var(--brand-gray-600)]">
        {isAr ? "الترتيب:" : "Sort:"}
      </span>
      {sortOptions.map((opt) => (
        <FilterButton
          key={opt.value}
          active={currentSort === opt.value || (!searchParams.get("sort") && opt.value === "newest")}
          onClick={() => updateSort(opt.value)}
        >
          {isAr ? opt.labelAr : opt.labelEn}
        </FilterButton>
      ))}
    </div>
  );
}
