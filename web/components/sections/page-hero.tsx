import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

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
        isDark ? "bg-[var(--brand-black)]" : "border-b border-[var(--brand-gray-200)] bg-white",
        size === "lg" ? "py-12 md:py-16" : "py-10",
        bgClassName,
        className
      )}
    >
      <div className="container-platform">
        <nav
          className={cn(
            "mb-4 flex flex-wrap items-center gap-1 text-sm",
            isDark ? "text-[var(--brand-gray-400)]" : "text-[var(--brand-gray-500)]",
            align === "center" && "justify-center"
          )}
          aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}
        >
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180"
                    aria-hidden="true"
                  />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors hover:underline",
                      isDark ? "hover:text-white" : "hover:text-[var(--brand-red)]"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      isLast &&
                        (isDark ? "text-white" : "font-medium text-[var(--brand-gray-900)]")
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <SectionHeading
          title={title}
          subtitle={subtitle}
          align={align}
          tone={isDark ? "onDark" : "onLight"}
          className={cn(
            isDark ? "[&_h2]:text-display-md" : "[&_h2]:text-display-sm",
            align === "center" && "mx-auto"
          )}
        />

        {children && (
          <div className={cn("mt-4", align === "center" && "flex flex-col items-center")}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
