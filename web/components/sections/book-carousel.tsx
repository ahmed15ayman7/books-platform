"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard } from "./book-card";

interface Book {
  id: string;
  slug: string;
  nameEn: string;
  nameAr?: string | null;
  imageUrl?: string | null;
  translationStatus?: string;
  featured?: boolean;
  primaryCategory?: { nameAr?: string | null; name: string; slug: string } | null;
}

interface BookCarouselProps {
  books: Book[];
  locale: string;
  className?: string;
}

export function BookCarousel({ books, locale, className }: BookCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: locale === "ar" ? "rtl" : "ltr",
    slidesToScroll: 2,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!books.length) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {books.map((book, i) => (
            <div
              key={book.id}
              className="flex min-w-0 shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <BookCard
                {...book}
                locale={locale}
                isNew={i < 4}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons — left = ChevronLeft, right = ChevronRight; handlers swap in RTL */}
      <button
        onClick={locale === "ar" ? scrollNext : scrollPrev}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center",
          "rounded-full bg-white shadow-md border border-[var(--brand-gray-200)]",
          "text-[var(--brand-gray-700)] hover:text-[var(--brand-red)] hover:border-[var(--brand-red)]",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
          locale === "ar" ? "-end-4" : "-start-4"
        )}
        aria-label={locale === "ar" ? "التالي" : "Previous"}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={locale === "ar" ? scrollPrev : scrollNext}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center",
          "rounded-full bg-white shadow-md border border-[var(--brand-gray-200)]",
          "text-[var(--brand-gray-700)] hover:text-[var(--brand-red)] hover:border-[var(--brand-red)]",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
          locale === "ar" ? "-start-4" : "-end-4"
        )}
        aria-label={locale === "ar" ? "السابق" : "Next"}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
