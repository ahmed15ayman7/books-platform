"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { AnimatedSection, ParallaxLayer, RevealLines, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface AboutQuoteBandProps {
  quote: string;
  tagline: string;
  variant?: "dark" | "light";
}

export function AboutQuoteBand({ quote, tagline, variant = "dark" }: AboutQuoteBandProps) {
  const isLight = variant === "light";

  return (
    <AnimatedSection>
      <div className="relative overflow-hidden rounded-2xl">
        <ParallaxLayer className="absolute inset-0">
          <SafeImage
            src={ABOUT_IMAGES.hero}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </ParallaxLayer>
        <div
          className={cn(
            "absolute inset-0",
            isLight ? "bg-white/90" : "bg-[var(--brand-black)]/75",
          )}
        />
        <div className="relative px-6 py-14 text-center md:px-10 md:py-16">
          <RevealLines
            lines={[quote]}
            lineClassName={cn(
              "mx-auto max-w-3xl font-display text-xl font-bold md:text-2xl",
              isLight ? "text-[var(--brand-gray-900)]" : "text-white",
            )}
          />
          <FadeIn delay={0.3}>
            <p
              className={cn(
                "mx-auto mt-4 max-w-xl",
                isLight
                  ? "text-base text-[var(--brand-gray-600)] md:text-lg"
                  : "text-sm text-[var(--brand-gray-300)] md:text-base",
              )}
            >
              {tagline}
            </p>
          </FadeIn>
        </div>
      </div>
    </AnimatedSection>
  );
}
