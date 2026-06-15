"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import {
  FadeIn,
  RevealText,
  StaggerContainer,
  StaggerItem,
  ParallaxLayer,
  BlurIn,
} from "@/components/motion";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  locale: Locale;
  variant?: "dark" | "light";
  align?: "start" | "center";
  size?: "md" | "lg";
  className?: string;
  bgClassName?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  parallax?: boolean;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  locale,
  variant = "dark",
  align = "start",
  size = "md",
  className,
  bgClassName,
  backgroundImage,
  backgroundImageAlt = "",
  parallax = true,
  children,
}: PageHeroProps) {
  const isDark = variant === "dark";
  const homeLabel = locale === "ar" ? "الرئيسية" : "Home";

  const crumbs: BreadcrumbItem[] =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ label: homeLabel, href: `/${locale}` }];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isDark ? "bg-[var(--brand-black)]" : "border-b border-[var(--brand-gray-200)] bg-white",
        size === "lg" ? "py-12 md:py-16" : "py-10",
        bgClassName,
        className,
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          {parallax ? (
            <ParallaxLayer className="h-full w-full">
              <Image
                src={backgroundImage}
                alt={backgroundImageAlt}
                fill
                className="object-cover opacity-40"
                priority
                sizes="100vw"
              />
            </ParallaxLayer>
          ) : (
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-black)]/60 to-[var(--brand-black)]" />
        </div>
      )}

      <div className="container-platform relative z-10">
        <StaggerContainer className={cn("mb-4 flex flex-wrap items-center gap-1 text-sm", align === "center" && "justify-center", isDark ? "text-[var(--brand-gray-400)]" : "text-[var(--brand-gray-500)]")}>
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <StaggerItem key={`${item.label}-${index}`}>
                <span className="inline-flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180" aria-hidden="true" />
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "transition-colors hover:underline",
                        isDark ? "hover:text-white" : "hover:text-[var(--brand-red)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && (isDark ? "text-white" : "font-medium text-[var(--brand-gray-900)]"))}>
                      {item.label}
                    </span>
                  )}
                </span>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <BlurIn delay={0.1}>
          <div className={cn(align === "center" && "text-center mx-auto")}>
            <RevealText
              text={title}
              as="h1"
              className={cn(
                "font-display font-bold block",
                isDark ? "text-display-md text-white" : "text-display-sm text-[var(--brand-gray-900)]",
              )}
            />
            {subtitle && (
              <FadeIn delay={0.2}>
                <p
                  className={cn(
                    "mt-3 max-w-2xl text-base md:text-lg",
                    isDark ? "text-[var(--brand-gray-300)]" : "text-[var(--brand-gray-600)]",
                    align === "center" && "mx-auto",
                  )}
                >
                  {subtitle}
                </p>
              </FadeIn>
            )}
          </div>
        </BlurIn>

        {children && (
          <FadeIn delay={0.3} className={cn("mt-4", align === "center" && "flex flex-col items-center")}>
            {children}
          </FadeIn>
        )}
      </div>
    </div>
  );
}
