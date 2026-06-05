"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselAutoplayReverse } from "@/lib/carousel/autoplay";
import { useEmblaAutoplay } from "@/hooks/use-embla-autoplay";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  id: string;
  titleAr: string;
  titleEn?: string | null;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  imageUrl: string;
  foregroundImageUrl?: string | null;
  linkUrl?: string | null;
}

interface HomeHeroCarouselProps {
  slides: HeroSlideData[];
  locale: string;
  pageOrder?: number;
  autoplayMs?: number;
  autoplayReverse?: boolean;
}

function HeroSlideContent({
  slide,
  locale,
}: {
  slide: HeroSlideData;
  locale: string;
}) {
  const isAr = locale === "ar";
  const title = isAr ? slide.titleAr : (slide.titleEn ?? slide.titleAr);
  const subtitle = isAr ? slide.subtitleAr : (slide.subtitleEn ?? slide.subtitleAr);

  return (
    <div className="relative h-[min(70vh,520px)] w-full overflow-hidden md:h-[min(72vh,560px)]">
      <Image
        src={slide.imageUrl}
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        unoptimized={slide.imageUrl.startsWith("http")}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute start-[5%] top-1/2 hidden -translate-y-1/2 select-none font-display text-[min(22vw,280px)] font-black leading-none text-transparent opacity-[0.12] md:block"
        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.4)" }}
        aria-hidden="true"
      >
        3
      </div>

      <div className="container-platform relative z-10 flex h-full flex-col items-center justify-center px-4 pb-16 pt-8 text-center md:pb-20">
        <h1 className="max-w-4xl font-display text-2xl font-bold leading-snug text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-[2.75rem] text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg text-balance">
            {subtitle}
          </p>
        )}
      </div>

      {slide.foregroundImageUrl && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-[5] h-[32%] w-[min(380px,75vw)] -translate-x-1/2 md:h-[40%]">
          <Image
            src={slide.foregroundImageUrl}
            alt=""
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            sizes="(max-width: 768px) 75vw, 380px"
            unoptimized={slide.foregroundImageUrl.startsWith("http")}
          />
        </div>
      )}
    </div>
  );
}

export function HomeHeroCarousel({
  slides,
  locale,
  pageOrder = 0,
  autoplayMs = 7000,
  autoplayReverse: autoplayReverseProp,
}: HomeHeroCarouselProps) {
  const isAr = locale === "ar";
  const autoplayReverse = autoplayReverseProp ?? carouselAutoplayReverse(pageOrder);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    align: "start",
    duration: 28,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, slides.length]);

  useEmblaAutoplay(emblaApi, slides.length, {
    intervalMs: autoplayMs,
    reverse: autoplayReverse,
    enabled: slides.length > 1,
  });

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    const slide = slides[0]!;
    const inner = <HeroSlideContent slide={slide} locale={locale} />;
    return (
      <section className="relative w-full bg-[var(--brand-black)]" aria-label={isAr ? "البانر الرئيسي" : "Hero banner"}>
        {slide.linkUrl ? (
          <Link href={slide.linkUrl} className="block">
            {inner}
          </Link>
        ) : (
          inner
        )}
      </section>
    );
  }

  return (
    <section
      className="hero-embla relative w-full bg-[var(--brand-black)]"
      aria-roledescription="carousel"
      aria-label={isAr ? "شرائح الرئيسية" : "Homepage slides"}
    >
      <div ref={emblaRef} className="hero-embla__viewport w-full overflow-hidden">
        <div className="hero-embla__container flex">
          {slides.map((slide) => (
            <div key={slide.id} className="hero-embla__slide min-w-0 shrink-0 grow-0 basis-full">
              {slide.linkUrl ? (
                <Link href={slide.linkUrl} className="block w-full">
                  <HeroSlideContent slide={slide} locale={locale} />
                </Link>
              ) : (
                <HeroSlideContent slide={slide} locale={locale} />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        className="absolute top-1/2 start-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:start-6"
        aria-label={isAr ? "السابق" : "Previous slide"}
      >
        {isAr ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute top-1/2 end-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:end-6"
        aria-label={isAr ? "التالي" : "Next slide"}
      >
        {isAr ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === selectedIndex ? "w-8 bg-[var(--brand-red)]" : "w-2 bg-white/45 hover:bg-white/70"
            )}
            aria-label={`${isAr ? "شريحة" : "Slide"} ${i + 1}`}
            aria-current={i === selectedIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
