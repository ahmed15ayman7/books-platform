"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EmblaShowcase } from "@/components/ui/embla-showcase";
import type { AboutHeroImage } from "@/lib/content/about";
import { pickLocale } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";
import { PageHero } from "@/components/sections/page-hero";
import { HoverLift } from "@/components/motion";
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

function AboutHeroCoverSlide({
  image,
  locale,
  priority,
  className,
}: {
  image: AboutHeroImage;
  locale: Locale;
  priority?: boolean;
  className?: string;
}) {
  const alt = pickLocale(image.alt, locale);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full min-w-[140px] sm:min-w-[160px] md:min-w-0">
        <Image
          src={image.src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width:640px) 140px, 180px"
          priority={priority}
          unoptimized
        />
      </div>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
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
  const showcaseLabel = locale === "ar" ? "معرض صور المنصة" : "Platform imagery";

  return (
    <PageHero
      locale={locale}
      variant="light"
      title={title}
      subtitle={subtitle}
      className="relative overflow-hidden border-b border-[var(--brand-gray-200)] bg-gradient-to-br from-white via-[var(--brand-red-soft)]/25 to-[var(--brand-gray-50)]"
      breadcrumbs={[
        { label: homeLabel, href: `/${locale}` },
        { label: title },
      ]}
    >
      <div className="mt-6 w-full space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold text-[var(--brand-gray-700)]">
            {showcaseLabel}
          </p>
          <div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-6">
            {images.map((image, index) => (
              <AboutHeroCoverSlide
                key={image.src}
                image={image}
                locale={locale}
                priority={index === 0}
              />
            ))}
          </div>
          <div className="md:hidden">
            <EmblaShowcase
              locale={locale}
              ariaLabel={showcaseLabel}
              pageOrder={0}
              slideClassName="min-w-0 shrink-0 grow-0 basis-auto px-1"
            >
              {images.map((image, index) => (
                <AboutHeroCoverSlide
                  key={image.src}
                  image={image}
                  locale={locale}
                  priority={index === 0}
                  className="mx-1 w-[140px] shrink-0"
                />
              ))}
            </EmblaShowcase>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <HoverLift>
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
          </HoverLift>
          <HoverLift>
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </HoverLift>
        </div>
      </div>
    </PageHero>
  );
}
