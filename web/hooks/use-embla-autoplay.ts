"use client";

import { useEffect, useRef } from "react";
import type { EmblaCarouselType } from "embla-carousel";

interface UseEmblaAutoplayOptions {
  intervalMs?: number;
  reverse?: boolean;
  enabled?: boolean;
}

export function useEmblaAutoplay(
  emblaApi: EmblaCarouselType | undefined,
  slideCount: number,
  { intervalMs = 5000, reverse = false, enabled = true }: UseEmblaAutoplayOptions = {},
) {
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!emblaApi || !enabled || slideCount <= 1 || intervalMs <= 0) return;

    const root = emblaApi.rootNode();

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
      if (reverse) emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    }, intervalMs);

    return () => {
      clearInterval(timer);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
      root.removeEventListener("pointerdown", pause);
      root.removeEventListener("pointerup", resume);
    };
  }, [emblaApi, slideCount, intervalMs, reverse, enabled]);
}
