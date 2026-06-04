"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { AnimatedSection, ParallaxLayer, RevealLines, FadeIn } from "@/components/motion";

interface AboutQuoteBandProps {
  quote: string;
  tagline: string;
}

export function AboutQuoteBand({ quote, tagline }: AboutQuoteBandProps) {
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
        <div className="absolute inset-0 bg-[var(--brand-black)]/75" />
        <div className="relative px-6 py-14 text-center md:px-10 md:py-16">
          <RevealLines
            lines={[quote]}
            lineClassName="mx-auto max-w-3xl font-display text-xl font-bold text-white md:text-2xl"
          />
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--brand-gray-300)] md:text-base">
              {tagline}
            </p>
          </FadeIn>
        </div>
      </div>
    </AnimatedSection>
  );
}
