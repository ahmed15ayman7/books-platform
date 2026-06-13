import { defaultLocale, type Locale } from "./config";

/**
 * Build a locale-aware href using the "as-needed" prefix strategy:
 * - Arabic (default locale): clean path with no locale prefix, e.g. /books
 * - English: prefixed with /en, e.g. /en/books
 *
 * @param locale - the current locale
 * @param path - the locale-neutral path, e.g. "/" or "/books/some-slug"
 */
export function localeHref(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean || "/";
  }
  return `/${locale}${clean}` || `/${locale}`;
}
