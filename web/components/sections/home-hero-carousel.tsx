"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselAutoplayReverse } from "@/lib/carousel/autoplay";
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
  isActive,
}: {
  slide: HeroSlideData;
  locale: string;
  isActive: boolean;
}) {
  const isAr = locale === "ar";
  const title = isAr ? slide.titleAr : (slide.titleEn ?? slide.titleAr);
  const subtitle = isAr ? slide.subtitleAr : (slide.subtitleEn ?? slide.subtitleAr);

  return (
    <div className="relative h-[min(70vh,520px)] w-full overflow-hidden md:h-[min(72vh,560px)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        fetchPriority={isActive ? "high" : "auto"}
        referrerPolicy="no-referrer"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.foregroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-2xl"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pausedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollPrev = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const scrollNext = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const scrollTo = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    slides.forEach((slide) => {
      if (!slide.imageUrl) return;
      const bg = new window.Image();
      bg.referrerPolicy = "no-referrer";
      bg.src = slide.imageUrl;
      if (slide.foregroundImageUrl) {
        const fg = new window.Image();
        fg.referrerPolicy = "no-referrer";
        fg.src = slide.foregroundImageUrl;
      }
    });
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1 || autoplayMs <= 0) return;

    const root = sectionRef.current;
    if (!root) return;

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("pointerdown", pause);
    root.addEventListener("pointerup", resume);

    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setSelectedIndex((i) => {
        if (autoplayReverse) return (i - 1 + slides.length) % slides.length;
        return (i + 1) % slides.length;
      });
    }, autoplayMs);

    return () => {
      clearInterval(timer);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
      root.removeEventListener("pointerdown", pause);
      root.removeEventListener("pointerup", resume);
    };
  }, [slides.length, autoplayMs, autoplayReverse]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    const slide = slides[0]!;
    const inner = <HeroSlideContent slide={slide} locale={locale} isActive />;
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
      ref={sectionRef}
      className="relative w-full bg-[var(--brand-black)]"
      aria-roledescription="carousel"
      aria-label={isAr ? "شرائح الرئيسية" : "Homepage slides"}
    >
      {/* Crossfade stack — avoids Embla translate3d repaint bugs on off-screen slides */}
      <div className="relative w-full">
        {slides.map((slide, index) => {
          const isActive = index === selectedIndex;
          const content = (
            <HeroSlideContent slide={slide} locale={locale} isActive={isActive} />
          );

          return (
            <div
              key={slide.id}
              className={cn(
                "transition-opacity duration-700 ease-in-out",
                isActive
                  ? "relative z-10 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 opacity-0",
              )}
              aria-hidden={!isActive}
            >
              {slide.linkUrl && isActive ? (
                <Link href={slide.linkUrl} className="block h-full w-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
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
              i === selectedIndex ? "w-8 bg-[var(--brand-red)]" : "w-2 bg-white/45 hover:bg-white/70",
            )}
            aria-label={`${isAr ? "شريحة" : "Slide"} ${i + 1}`}
            aria-current={i === selectedIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
