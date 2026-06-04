"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { BreadcrumbItem } from "@/components/sections/page-hero";
import { FadeIn, RevealText, StaggerContainer, StaggerItem } from "@/components/motion";

interface PublisherLogo {
  src: string;
  alt: string;
  slug?: string;
}

interface PublishersHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  logos: PublisherLogo[];
  breadcrumbs?: BreadcrumbItem[];
}

export function PublishersHero({
  locale,
  title,
  subtitle,
  logos,
  breadcrumbs = [],
}: PublishersHeroProps) {
  const isAr = locale === "ar";
  const homeLabel = isAr ? "الرئيسية" : "Home";
  const crumbs =
    breadcrumbs.length > 0 ? breadcrumbs : [{ label: homeLabel, href: `/${locale}` }];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-black)] via-[#1a1a1a] to-[var(--brand-red)]/20 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
      </div>

      <div className="container-platform relative z-10">
        <StaggerContainer className="mb-4 flex flex-wrap items-center gap-1 text-sm text-[var(--brand-gray-400)]">
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <StaggerItem key={`${item.label}-${index}`}>
                <span className="inline-flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                  {item.href && !isLast ? (
                    <Link href={item.href} className="transition-colors hover:text-white hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && "text-white")}>{item.label}</span>
                  )}
                </span>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <RevealText text={title} as="h1" className="font-display text-display-md font-bold text-white" />
            <FadeIn delay={0.15}>
              <p className="mt-3 max-w-lg text-base text-[var(--brand-gray-300)]">{subtitle}</p>
            </FadeIn>
          </div>

          {logos.length > 0 && (
            <FadeIn delay={0.25}>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-hidden="true">
                {logos.slice(0, 8).map((logo, i) => (
                  <div
                    key={`${logo.src}-${i}`}
                    className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white p-3 shadow-md ring-1 ring-white/10"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={120}
                      height={80}
                      unoptimized={logo.src.startsWith("http")}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
