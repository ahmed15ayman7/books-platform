"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselAutoplayReverse } from "@/lib/carousel/autoplay";
import { useEmblaAutoplay } from "@/hooks/use-embla-autoplay";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./article-card";
import type { ArticleLinkedBookDisplay } from "@/lib/i18n/article-linked-book";
import type { Locale } from "@/lib/i18n";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  date?: Date | string | null;
  channel?: string | null;
  readingTimeMinutes?: number | null;
  linkedBook?: ArticleLinkedBookDisplay;
}

interface ArticleCarouselProps {
  articles: Article[];
  locale: Locale;
  className?: string;
  pageOrder?: number;
  autoplayMs?: number;
  autoplayReverse?: boolean;
}

export function ArticleCarousel({
  articles,
  locale,
  className,
  pageOrder = 0,
  autoplayMs = 5000,
  autoplayReverse: autoplayReverseProp,
}: ArticleCarouselProps) {
  const autoplayReverse = autoplayReverseProp ?? carouselAutoplayReverse(pageOrder);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: articles.length > 3,
    direction: locale === "ar" ? "rtl" : "ltr",
    slidesToScroll: 2,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEmblaAutoplay(emblaApi, articles.length, {
    intervalMs: autoplayMs,
    reverse: autoplayReverse,
    enabled: articles.length > 1,
  });

  if (!articles.length) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex min-w-0 shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ArticleCard
                {...article}
                date={article.date ?? undefined}
                channel={article.channel ?? undefined}
                locale={locale}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={locale === "ar" ? scrollNext : scrollPrev}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center",
          "rounded-full bg-white shadow-md border border-[var(--brand-gray-200)]",
          "text-[var(--brand-gray-700)] hover:text-[var(--brand-red)] hover:border-[var(--brand-red)]",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
          locale === "ar" ? "-end-4" : "-start-4",
        )}
        aria-label={locale === "ar" ? "التالي" : "Previous"}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={locale === "ar" ? scrollPrev : scrollNext}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center",
          "rounded-full bg-white shadow-md border border-[var(--brand-gray-200)]",
          "text-[var(--brand-gray-700)] hover:text-[var(--brand-red)] hover:border-[var(--brand-red)]",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
          locale === "ar" ? "-start-4" : "-end-4",
        )}
        aria-label={locale === "ar" ? "السابق" : "Next"}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
