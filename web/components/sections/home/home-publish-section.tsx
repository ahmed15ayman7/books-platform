"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { carouselAutoplayReverse } from "@/lib/carousel/autoplay";
import { useEmblaAutoplay } from "@/hooks/use-embla-autoplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localeHref, type Locale } from "@/lib/i18n";
import {
  localizedBookName,
  localizedBookShortDesc,
  type BookLocalizedFields,
} from "@/lib/i18n/book-locale";
import { AnimatedSection, FadeIn } from "@/components/motion";

export interface HomePublishBook extends BookLocalizedFields {
  id: string;
  slug: string;
  imageUrl?: string | null;
}

interface HomePublishSectionProps {
  locale: Locale;
  title: string;
  description: string;
  ctaLabel: string;
  booksTitle: string;
  books: HomePublishBook[];
  pageOrder?: number;
}

function LatestBooksSpotlight({
  locale,
  title,
  books,
  pageOrder = 0,
}: {
  locale: Locale;
  title: string;
  books: HomePublishBook[];
  pageOrder?: number;
}) {
  const isAr = locale === "ar";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: books.length > 1,
    align: "center",
    direction: isAr ? "rtl" : "ltr",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEmblaAutoplay(emblaApi, books.length, {
    intervalMs: 6000,
    reverse: carouselAutoplayReverse(pageOrder),
    enabled: books.length > 1,
  });

  const active = books[selectedIndex] ?? books[0];
  if (!active) return null;

  const displayName = localizedBookName(active, locale);
  const caption = localizedBookShortDesc(active, locale) ?? displayName;

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-5 flex items-center gap-2.5">
        <h3 className="font-display text-lg font-bold text-[var(--brand-red)] sm:text-xl">
          {title}
        </h3>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--brand-red)]"
          aria-hidden="true"
        >
          <Bookmark className="h-4 w-4 fill-white text-white" />
        </span>
      </div>

      <div className="relative flex flex-1 flex-col rounded-2xl border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)]/60 p-4 sm:p-5">
        {books.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute top-[calc(50%-1.5rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg border border-[var(--brand-red)] bg-white text-[var(--brand-red)] shadow-sm transition-colors hover:bg-[var(--brand-red-soft)] start-2 sm:start-3"
              aria-label={isAr ? "الكتاب السابق" : "Previous book"}
            >
              {isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute top-[calc(50%-1.5rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg border border-[var(--brand-red)] bg-white text-[var(--brand-red)] shadow-sm transition-colors hover:bg-[var(--brand-red-soft)] end-2 sm:end-3"
              aria-label={isAr ? "الكتاب التالي" : "Next book"}
            >
              {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </>
        )}

        <div ref={emblaRef} className="overflow-hidden px-8 sm:px-10">
          <div className="flex">
            {books.map((book) => (
              <div key={book.id} className="min-w-0 shrink-0 grow-0 basis-full">
                <Link
                  href={localeHref(locale, `/books/${book.slug}`)}
                  className="group mx-auto block max-w-[220px] sm:max-w-[240px]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-[var(--brand-gray-200)] transition-transform duration-300 group-hover:scale-[1.02]">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="240px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--brand-gray-100)] text-xs text-[var(--brand-gray-400)]">
                        —
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Link
          href={localeHref(locale, `/books/${active.slug}`)}
          className="mt-4 block text-center text-sm font-semibold leading-snug text-[var(--brand-red)] transition-opacity hover:opacity-80 sm:text-base"
        >
          {caption}
        </Link>

        {books.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {books.map((book, i) => (
              <span
                key={book.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === selectedIndex
                    ? "w-5 bg-[var(--brand-red)]"
                    : "w-1.5 bg-[var(--brand-gray-300)]",
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HomePublishSection({
  locale,
  title,
  description,
  ctaLabel,
  booksTitle,
  books,
  pageOrder = 0,
}: HomePublishSectionProps) {
  const publishHref = localeHref(locale, "/publish");

  return (
    <AnimatedSection
      className="section-spacing bg-white"
      aria-labelledby="home-publish-heading"
    >
      <div className="container-platform">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <FadeIn className="flex flex-col text-center lg:text-start">
            <div className="mb-3 flex flex-col items-center gap-2 lg:items-start">
              <h2
                id="home-publish-heading"
                className="font-display text-3xl font-bold text-[var(--brand-red)] sm:text-4xl"
              >
                {title}
              </h2>
              <span
                className="flex h-9 w-9 items-center justify-center bg-[var(--brand-red)]"
                aria-hidden="true"
              >
                <Bookmark className="h-5 w-5 fill-white text-white" />
              </span>
            </div>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-[var(--brand-gray-700)] sm:text-base lg:mx-0">
              {description}
            </p>

            <Button
              asChild
              size="lg"
              className="mt-6 self-center rounded-full bg-[var(--brand-gray-600)] px-8 text-white hover:bg-[var(--brand-gray-800)] lg:self-start"
            >
              <Link href={publishHref}>{ctaLabel}</Link>
            </Button>
          </FadeIn>

          {books.length > 0 && (
            <FadeIn delay={0.1}>
              <LatestBooksSpotlight
                locale={locale}
                title={booksTitle}
                books={books}
                pageOrder={pageOrder}
              />
            </FadeIn>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
