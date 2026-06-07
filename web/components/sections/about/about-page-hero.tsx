"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import type { AboutHeroImage } from "@/lib/content/about";
import { pickLocale } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";
import {
  BlurIn,
  FadeIn,
  HoverLift,
  RevealText,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { cn } from "@/lib/utils";

interface AboutPageHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  images: AboutHeroImage[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

const MOSAIC_LAYOUT: Array<{ aspect: "4/3" | "2/3" }> = [
  { aspect: "4/3" },
  { aspect: "2/3" },
  { aspect: "2/3" },
  { aspect: "4/3" },
];

function HeroImageTile({
  image,
  locale,
  aspect,
  priority,
}: {
  image: AboutHeroImage;
  locale: Locale;
  aspect: "4/3" | "2/3";
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-[var(--shadow-soft)]",
        aspect === "2/3" ? "aspect-[2/3]" : "aspect-[4/3]",
      )}
    >
      <SafeImage
        src={image.src}
        alt={pickLocale(image.alt, locale)}
        fill
        className="object-cover"
        sizes="(max-width:768px) 45vw, 280px"
        priority={priority}
      />
    </div>
  );
}

export function AboutPageHero({
  locale,
  title,
  subtitle,
  images,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: AboutPageHeroProps) {
  const homeLabel = locale === "ar" ? "الرئيسية" : "Home";

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--brand-gray-200)] bg-gradient-to-br from-white via-[var(--brand-red-soft)]/25 to-[var(--brand-gray-50)] py-10 md:py-14"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container-platform relative z-10">
        <StaggerContainer className="mb-4 flex flex-wrap items-center gap-1 text-sm text-[var(--brand-gray-500)]">
          <StaggerItem>
            <span className="inline-flex items-center gap-1">
              <Link href={`/${locale}`} className="transition-colors hover:text-[var(--brand-red)] hover:underline">
                {homeLabel}
              </Link>
            </span>
          </StaggerItem>
          <StaggerItem>
            <span className="inline-flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180" aria-hidden="true" />
              <span className="font-medium text-[var(--brand-gray-900)]">{title}</span>
            </span>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <BlurIn delay={0.1}>
              <RevealText
                text={title}
                as="h1"
                className="font-display text-display-sm font-bold text-[var(--brand-gray-900)] md:text-display-md"
              />
            </BlurIn>
            <FadeIn delay={0.2}>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--brand-gray-600)] md:text-lg">
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

          <BlurIn delay={0.15} className="min-w-0 lg:max-w-md lg:justify-self-end">
            <StaggerContainer className="grid grid-cols-2 gap-3">
              {images.slice(0, 4).map((image, index) => {
                const layout = MOSAIC_LAYOUT[index] ?? { aspect: image.aspect };
                return (
                  <StaggerItem key={index}>
                    <HeroImageTile
                      image={image}
                      locale={locale}
                      aspect={layout.aspect ?? image.aspect}
                      priority={index === 0}
                    />
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </BlurIn>
        </div>
      </div>
    </section>
  );
}
