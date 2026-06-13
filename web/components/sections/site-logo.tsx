import Image from "next/image";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";

interface SiteLogoProps {
  locale: string;
  className?: string;
}

export function SiteLogo({ locale, className }: SiteLogoProps) {
  return (
    <Link
      href={localeHref(locale as Locale, "/")}
      className={`inline-flex flex-shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)] rounded-sm ${className ?? ""}`}
      aria-label="منصة الكتب العالمية — Books Platform"
    >
      <Image
        src="/logo.webp"
        alt="Books Platform — منصة الكتب العالمية"
        width={200}
        height={56}
        className="h-11 w-auto max-w-[200px] object-contain"
        priority
      />
    </Link>
  );
}
