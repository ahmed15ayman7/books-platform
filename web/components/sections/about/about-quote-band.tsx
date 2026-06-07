"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { AnimatedSection, ParallaxLayer, RevealLines, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface AboutQuoteBandProps {
  quote: string;
  tagline: string;
  variant?: "dark" | "light";
  textSize?: "default" | "lg";
}

export function AboutQuoteBand({
  quote,
  tagline,
  variant = "dark",
  textSize = "default",
}: AboutQuoteBandProps) {
  const isLight = variant === "light";
  const isLarge = textSize === "lg";

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
              "mx-auto max-w-3xl font-display font-bold",
              isLarge ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
              isLight ? "text-[var(--brand-gray-900)]" : "text-white",
            )}
          />
          <FadeIn delay={0.3}>
            <p
              className={cn(
                "mx-auto mt-4 max-w-xl",
                isLight
                  ? cn(
                      "text-[var(--brand-gray-600)]",
                      isLarge ? "text-lg md:text-xl" : "text-base md:text-lg",
                    )
                  : cn(
                      "text-[var(--brand-gray-300)]",
                      isLarge ? "text-base md:text-lg" : "text-sm md:text-base",
                    ),
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
