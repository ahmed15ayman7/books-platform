"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { EmblaShowcase } from "@/components/ui/embla-showcase";
import { Badge } from "@/components/ui/badge";
import { localizedBookName, type BookLocalizedFields } from "@/lib/i18n/book-locale";

export interface FeaturedBookSlide extends BookLocalizedFields {
  id: string;
  slug: string;
  imageUrl?: string | null;
  translationStatus?: string;
  primaryCategory?: { name: string; nameAr?: string | null } | null;
}

interface BooksFeaturedCarouselProps {
  books: FeaturedBookSlide[];
  locale: string;
}

export function BooksFeaturedCarousel({ books, locale }: BooksFeaturedCarouselProps) {
  const isAr = locale === "ar";
  if (books.length === 0) return null;

  const slides = books.map((book) => {
    const title = localizedBookName(book, locale);
    const category =
      isAr && book.primaryCategory?.nameAr
        ? book.primaryCategory.nameAr
        : book.primaryCategory?.name;

    const statusLabel =
      book.translationStatus === "PARTIAL"
        ? isAr
          ? "مرشح للترجمة"
          : "For Translation"
        : book.translationStatus === "TRANSLATED"
        ? isAr
          ? "مترجم"
          : "Translated"
        : book.translationStatus === "NOMINATED"
          ? isAr
            ? "مرشح للترجمة"
            : "For Translation"
          : null;

    return (
      <Link
        key={book.id}
        href={`/${locale}/books/${book.slug}`}
        className="group mx-1 flex min-h-[200px] overflow-hidden surface-card book-card-hover md:min-h-[220px]"
      >
        <div className="relative w-[38%] min-w-[120px] shrink-0 bg-[var(--brand-gray-100)] sm:w-[32%]">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--brand-gray-400)]">
              <BookOpen className="h-14 w-14" strokeWidth={1.25} aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 p-5 md:p-6">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-red)]">
              {category}
            </span>
          )}
          <h3 className="font-display text-lg font-bold leading-snug text-[var(--brand-gray-900)] transition-colors group-hover:text-[var(--brand-red)] md:text-xl line-clamp-2">
            {title}
          </h3>
          {statusLabel && (
            <Badge variant="nominated" className="w-fit text-[10px]">
              {statusLabel}
            </Badge>
          )}
          <span className="mt-1 text-sm font-medium text-[var(--brand-gray-500)] group-hover:text-[var(--brand-red)]">
            {isAr ? "عرض التفاصيل ←" : "View details →"}
          </span>
        </div>
      </Link>
    );
  });

  return (
    <EmblaShowcase
      locale={locale}
      ariaLabel={isAr ? "كتب مميزة" : "Featured books"}
      autoplayMs={6000}
      slideClassName="min-w-0 shrink-0 grow-0 basis-full px-1"
      className="px-2"
    >
      {slides}
    </EmblaShowcase>
  );
}
