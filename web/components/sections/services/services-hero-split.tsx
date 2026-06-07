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

interface ServicesHeroSplitProps {
  locale: Locale;
  title: string;
  subtitle: string;
  image: AboutImage;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function ServicesHeroSplit({
  locale,
  title,
  subtitle,
  image,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: ServicesHeroSplitProps) {
  const imageAlt = pickLocale(image.alt, locale);

  return (
    <AnimatedSection className="border-b border-[var(--brand-gray-200)] bg-white text-[var(--brand-gray-900)]">
      <div className="container-platform py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <RevealText
              text={title}
              as="h1"
              className="font-display text-display-md font-bold text-[var(--brand-gray-900)] block"
            />
            <FadeIn delay={0.2}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--brand-gray-600)] md:text-xl">
                {subtitle}
              </p>
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
                  <Button asChild size="lg" variant="outline">
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
                </HoverLift>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <BlurIn>
            <ParallaxLayer className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--brand-gray-200)] shadow-sm">
              <SafeImage
                src={image.src}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </ParallaxLayer>
          </BlurIn>
        </div>
      </div>
    </AnimatedSection>
  );
}
