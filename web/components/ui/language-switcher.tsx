"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // Strip any existing /ar or /en prefix to get the logical path,
    // then build the target URL for the chosen locale.
    const withoutLocale = pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
    const target =
      newLocale === "en"
        ? withoutLocale === "/" ? "/en" : `/en${withoutLocale}`
        : withoutLocale === "/" ? "/" : `/ar${withoutLocale}`;
    router.push(target);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full bg-white/10 p-0.5 text-xs",
        className
      )}
      role="navigation"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-[var(--motion-base)]",
          locale === "en"
            ? "bg-[var(--brand-red)] text-white"
            : "text-white/70 hover:text-white"
        )}
        aria-label="Switch to English"
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("ar")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-[var(--motion-base)]",
          locale === "ar"
            ? "bg-[var(--brand-red)] text-white"
            : "text-white/70 hover:text-white"
        )}
        aria-label="Switch to Arabic"
        aria-current={locale === "ar" ? "true" : undefined}
      >
        AR
      </button>
    </div>
  );
}
