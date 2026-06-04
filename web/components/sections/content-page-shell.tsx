import type { ReactNode } from "react";
import { PageHero, type BreadcrumbItem } from "@/components/sections/page-hero";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface ContentPageShellProps {
  locale: Locale;
  hero: {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    variant?: "dark" | "light";
    size?: "md" | "lg";
    backgroundImage?: string;
    backgroundImageAlt?: string;
  };
  background?: "gray-50" | "white";
  children: ReactNode;
  className?: string;
  animateSections?: boolean;
}

export function ContentPageShell({
  locale,
  hero,
  background = "gray-50",
  children,
  className,
  animateSections = true,
}: ContentPageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        background === "gray-50" ? "bg-[var(--brand-gray-50)]" : "bg-white",
        className,
      )}
    >
      <PageHero locale={locale} {...hero} />
      <div className="container-platform py-14 md:py-16">
        {animateSections ? (
          <AnimatedContentSections>{children}</AnimatedContentSections>
        ) : (
          <div className="space-y-20">{children}</div>
        )}
      </div>
    </div>
  );
}
