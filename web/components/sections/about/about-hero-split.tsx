"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/content/types";
import type { AboutImage } from "@/lib/content/about";
import {
  AnimatedSection,
  RevealText,
  FadeIn,
  BlurIn,
  ParallaxLayer,
  StaggerContainer,
  StaggerItem,
  HoverLift,
} from "@/components/motion";

interface AboutHeroSplitProps {
  locale: Locale;
  title: string;
  subtitle: string;
  image: AboutImage;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function AboutHeroSplit({
  locale,
  title,
  subtitle,
  image,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: AboutHeroSplitProps) {
  const imageAlt = pickLocale(image.alt, locale);

  return (
    <AnimatedSection className="bg-[var(--brand-black)] text-white">
      <div className="container-platform py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <RevealText text={title} as="h1" className="font-display text-display-md font-bold text-white block" />
            <FadeIn delay={0.2}>
              <p className="mt-4 max-w-xl text-lg text-[var(--brand-gray-300)]">{subtitle}</p>
            </FadeIn>
            <StaggerContainer className="mt-8 flex flex-wrap gap-4" delay={0.35}>
              <StaggerItem>
                <HoverLift>
                  <Button asChild size="lg">
                    <Link href={primaryHref}>{primaryLabel}</Link>
                  </Button>
                </HoverLift>
              </StaggerItem>
              <StaggerItem>
                <HoverLift>
                  <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[var(--brand-red)]">
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
                </HoverLift>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <BlurIn>
            <ParallaxLayer className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <SafeImage src={image.src} alt={imageAlt} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-black)]/40 to-transparent" />
            </ParallaxLayer>
          </BlurIn>
        </div>
      </div>
    </AnimatedSection>
  );
}
