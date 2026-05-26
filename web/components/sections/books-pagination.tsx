"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface BooksPaginationProps {
  pagination: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function BooksPagination({ pagination }: BooksPaginationProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (pagination.totalPages <= 1) return null;

  const pageItems = getVisiblePageNumbers(pagination.page, pagination.totalPages);
  const isRTL = locale === "ar";

  return (
    <nav
      className="flex items-center justify-center gap-1 flex-wrap"
      aria-label={locale === "ar" ? "التصفح" : "Pagination"}
    >
      <button
        type="button"
        onClick={() => goToPage(pagination.page - 1)}
        disabled={!pagination.hasPrevPage}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--brand-gray-200)] text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={locale === "ar" ? "السابق" : "Previous"}
      >
        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {pageItems.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-9 min-w-[2.25rem] items-center justify-center px-1 text-sm text-[var(--brand-gray-500)]"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goToPage(item)}
            className={cn(
              "flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
              item === pagination.page
                ? "bg-[var(--brand-red)] text-white"
                : "border border-[var(--brand-gray-200)] text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
            )}
            aria-label={`${locale === "ar" ? "صفحة" : "Page"} ${item}`}
            aria-current={item === pagination.page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goToPage(pagination.page + 1)}
        disabled={!pagination.hasNextPage}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--brand-gray-200)] text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={locale === "ar" ? "التالي" : "Next"}
      >
        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </nav>
  );
}
