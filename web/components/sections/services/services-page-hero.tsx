"use client";

import { SafeImage } from "@/components/ui/safe-image";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FadeIn, RevealText } from "@/components/motion";

interface ServicesPageHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export function ServicesPageHero({
  locale,
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: ServicesPageHeroProps) {
  const isAr = locale === "ar";

  return (
    <section className="relative min-h-[280px] overflow-hidden md:min-h-[360px] lg:min-h-[420px]">
      <SafeImage
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--brand-black)]/70 via-[var(--brand-black)]/55 to-[var(--brand-black)]/75"
        aria-hidden="true"
      />
      <div className="container-platform relative flex min-h-[inherit] flex-col items-center justify-center px-4 py-16 text-center md:py-20">
        <RevealText
          text={title}
          as="h1"
          className="font-display text-display-md font-bold text-white md:text-display-lg"
        />
        <FadeIn delay={0.15}>
          <p
            className={cn(
              "mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl lg:text-2xl",
              isAr ? "text-center" : "text-center",
            )}
          >
            {subtitle}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
