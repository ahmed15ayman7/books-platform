"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmblaShowcaseProps {
  children: ReactNode[];
  locale: string;
  className?: string;
  slideClassName?: string;
  autoplayMs?: number;
  ariaLabel: string;
  showArrows?: boolean;
  showDots?: boolean;
}

/** Shared Embla carousel shell — arrows, dots, optional autoplay */
export function EmblaShowcase({
  children,
  locale,
  className,
  slideClassName = "min-w-0 shrink-0 grow-0 basis-full",
  autoplayMs = 0,
  ariaLabel,
  showArrows = true,
  showDots = true,
}: EmblaShowcaseProps) {
  const isAr = locale === "ar";
  const count = children.length;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: count > 1,
    align: "start",
    duration: 24,
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
  }, [emblaApi, count]);

  useEffect(() => {
    if (!emblaApi || count <= 1 || autoplayMs <= 0) return;
    const timer = setInterval(() => emblaApi.scrollNext(), autoplayMs);
    return () => clearInterval(timer);
  }, [emblaApi, count, autoplayMs]);

  if (count === 0) return null;

  if (count === 1) {
    return <div className={className}>{children[0]}</div>;
  }

  return (
    <section
      className={cn("relative", className)}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {children.map((child, i) => (
            <div key={i} className={slideClassName}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute top-1/2 start-0 z-10 flex h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--brand-gray-200)] bg-white/95 text-[var(--brand-gray-800)] shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-base)] hover:scale-110 hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] md:start-2 md:translate-x-0"
            aria-label={isAr ? "السابق" : "Previous"}
          >
            {isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute top-1/2 end-0 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-[var(--brand-gray-200)] bg-white/95 text-[var(--brand-gray-800)] shadow-lg backdrop-blur-sm transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] md:end-2 md:translate-x-0"
            aria-label={isAr ? "التالي" : "Next"}
          >
            {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </>
      )}

      {showDots && (
        <div className="mt-4 flex justify-center gap-2">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex
                  ? "w-7 bg-[var(--brand-red)]"
                  : "w-2 bg-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-400)]"
              )}
              aria-label={`${isAr ? "شريحة" : "Slide"} ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
