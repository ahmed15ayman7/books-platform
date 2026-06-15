import { defaultLocale, type Locale } from "./config";

/** Strip `/ar` or `/en` prefix from a pathname, keeping the rest. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "ar" || segments[0] === "en") {
    segments.shift();
  }
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

/**
 * Build a locale-aware href.
 * Arabic (default): no prefix — `/books`, `/about`
 * English: `/en/books`, `/en/about`
 */
export function localeHref(locale: Locale | string, path: string): string {
  const clean = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (locale === defaultLocale) {
    return clean;
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Derive locale from pathname — unprefixed and `/ar` paths are Arabic. */
export function getLocaleFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return first === "en" ? "en" : "ar";
}
