import type { Locale } from "@/lib/i18n/config";

const FALLBACK_URL = "https://booksplatform.net";

/** Canonical site origin from `NEXT_PUBLIC_APP_URL` (any domain in prod/staging). */
export function getSiteUrl(): string {
  const raw = process.env["NEXT_PUBLIC_APP_URL"]?.trim();
  if (!raw) {
    if (process.env["NODE_ENV"] === "production") {
      console.warn(
        "[seo] NEXT_PUBLIC_APP_URL is not set — using fallback. Set it to your public domain."
      );
    }
    return process.env["NODE_ENV"] === "development"
      ? "http://localhost:3000"
      : FALLBACK_URL;
  }
  return raw.replace(/\/$/, "");
}

/** Absolute URL for a path on this site (uses NEXT_PUBLIC_APP_URL). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Turn relative paths or absolute URLs into a full URL for OG/Twitter. */
export function resolveMediaUrl(url?: string | null): string {
  if (!url?.trim()) return absoluteUrl(getDefaultOgImagePath());
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return absoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
}

/**
 * Default OG image path (dynamic `/opengraph-image` or custom asset).
 * Override: NEXT_PUBLIC_OG_IMAGE=/og-custom.jpg (1200×630 recommended).
 */
export function getDefaultOgImagePath(): string {
  const custom = process.env["NEXT_PUBLIC_OG_IMAGE"]?.trim();
  if (custom) {
    return custom.startsWith("/") ? custom : `/${custom}`;
  }
  return "/opengraph-image";
}

export function getSiteName(locale: Locale | string): string {
  return locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn;
}

export const siteConfig = {
  nameAr: process.env["NEXT_PUBLIC_SITE_NAME_AR"]?.trim() || "منصة الكتب العالمية",
  nameEn: process.env["NEXT_PUBLIC_SITE_NAME_EN"]?.trim() || "Books Platform",
  taglineAr:
    process.env["NEXT_PUBLIC_SITE_TAGLINE_AR"]?.trim() ||
    "نافذة العالم على الكتب — اكتشف، اقرأ، انشر",
  taglineEn:
    process.env["NEXT_PUBLIC_SITE_TAGLINE_EN"]?.trim() ||
    "A window to world books — discover, read, publish",
  twitterHandle: process.env["NEXT_PUBLIC_TWITTER_HANDLE"]?.trim() || undefined,
  facebookAppId: process.env["NEXT_PUBLIC_FACEBOOK_APP_ID"]?.trim() || undefined,
  localeDefault: "ar" as const,
  locales: ["ar", "en"] as const,
};

export function localeOpenGraphLocale(locale: Locale | string): string {
  return locale === "ar" ? "ar_AR" : "en_US";
}

export function alternateOpenGraphLocales(locale: Locale | string): string[] {
  return locale === "ar" ? ["en_US"] : ["ar_AR"];
}

/**
 * Strip the locale prefix from a path.
 * "/ar/books/slug" → "/books/slug"
 * "/en/books/slug" → "/books/slug"
 * "/books/slug"    → "/books/slug"
 */
export function stripLocale(path: string): string {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/^\/(ar|en)(\/|$)/, "/").replace(/^\/$/, "") || "/";
}

/**
 * Return clean canonical (no /ar prefix) and /en-prefixed URLs for a
 * locale-neutral path (already stripped of any locale prefix).
 *
 * Arabic = clean: booksplatform.net/books/slug
 * English = prefixed: booksplatform.net/en/books/slug
 */
export function localizedPaths(path: string): { ar: string; en: string } {
  // Normalise: strip any existing locale prefix first
  const neutral = stripLocale(path);
  return {
    ar: neutral === "/" ? "/" : neutral,
    en: neutral === "/" ? "/en" : `/en${neutral}`,
  };
}
