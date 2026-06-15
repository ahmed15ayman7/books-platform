"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import { localeHref, type Locale } from "@/lib/i18n";
import type { BreadcrumbItem } from "@/components/sections/page-hero";
import { FadeIn, RevealText, StaggerContainer, StaggerItem } from "@/components/motion";

export interface CoverItem {
  src: string;
  alt: string;
  href?: string;
}

interface CatalogCollageHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  covers: CoverItem[];
  breadcrumbs?: BreadcrumbItem[];
  variant?: "translated" | "nominated";
  /** book = object-contain for covers; photo = object-cover for uniform tiles */
  coverMode?: "book" | "photo";
  children?: React.ReactNode;
}

const ROTATIONS = [-8, 6, -4, 10, -6, 8, -10, 5, -5, 7, -7, 4];

const COVER_TILE_CLASS = "aspect-[2/3] w-full";

function CollageCover({
  cover,
  coverMode,
  className,
  style,
  sizes,
  priority,
}: {
  cover: CoverItem;
  coverMode: "book" | "photo";
  className?: string;
  style?: React.CSSProperties;
  sizes: string;
  priority?: boolean;
}) {
  const isPhoto = coverMode === "photo";
  const inner = (
    <SafeImage
      src={cover.src}
      alt={cover.alt}
      fill
      className={cn(isPhoto ? "object-cover" : "object-contain p-1")}
      sizes={sizes}
      priority={priority}
    />
  );

  const shellClass = cn(
    "relative overflow-hidden rounded-lg shadow-lg ring-1 ring-white/20",
    isPhoto ? "bg-white/5" : "bg-white/10",
    COVER_TILE_CLASS,
    cover.href && "transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:ring-white/40",
    className,
  );

  if (cover.href) {
    return (
      <Link
        href={cover.href}
        className={shellClass}
        style={style}
        aria-label={cover.alt}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={shellClass} style={style}>
      {inner}
    </div>
  );
}

export function CatalogCollageHero({
  locale,
  title,
  subtitle,
  covers,
  breadcrumbs = [],
  variant = "translated",
  coverMode = "book",
  children,
}: CatalogCollageHeroProps) {
  const isAr = locale === "ar";
  const homeLabel = isAr ? "الرئيسية" : "Home";
  const crumbs =
    breadcrumbs.length > 0 ? breadcrumbs : [{ label: homeLabel, href: localeHref(locale, "/") }];

  const accentGradient =
    variant === "nominated"
      ? "from-amber-950 via-[var(--brand-black)] to-[var(--brand-black)]"
      : "from-[var(--brand-red)]/30 via-[var(--brand-black)] to-[var(--brand-black)]";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[var(--brand-black)] py-12 md:py-16",
        `bg-gradient-to-br ${accentGradient}`,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <div className="absolute -end-20 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -start-10 bottom-0 h-48 w-48 rounded-full bg-[var(--brand-red)] blur-3xl" />
      </div>

      <div className="container-platform relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
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

            <RevealText text={title} as="h1" className="font-display text-display-md font-bold text-white" />
            <FadeIn delay={0.2}>
              <p className="mt-3 max-w-xl text-base text-[var(--brand-gray-300)] md:text-lg">
                {subtitle}
              </p>
            </FadeIn>
            {children && <FadeIn delay={0.3} className="mt-4">{children}</FadeIn>}
          </div>

          <div className="relative hidden min-h-[280px] sm:block lg:min-h-[320px]">
            <div className="grid grid-cols-4 gap-3 p-4">
              {covers.slice(0, 8).map((cover, i) => (
                <CollageCover
                  key={`${cover.href ?? cover.src}-${i}`}
                  cover={cover}
                  coverMode={coverMode}
                  style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
                  sizes="120px"
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile cover strip */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:hidden">
          {covers.slice(0, 6).map((cover, i) => (
            <CollageCover
              key={`m-${cover.href ?? cover.src}-${i}`}
              cover={cover}
              coverMode={coverMode}
              className="w-20 shrink-0"
              sizes="80px"
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
