import type { Locale } from "./config";

/** Remove /ar or /en locale prefix, returning the logical path. */
export function stripLocale(path: string): string {
  const clean = path.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

/**
 * Build a navigation href for a given locale and logical path.
 * Arabic home → "/"; Arabic other → "/ar/..."; English → "/en/..."
 */
export function localeHref(locale: Locale | string, logicalPath: string): string {
  const p = logicalPath.startsWith("/") ? logicalPath : `/${logicalPath}`;
  const clean = stripLocale(p);
  if (locale === "en") return clean === "/" ? "/en" : `/en${clean}`;
  // Arabic
  return clean === "/" ? "/" : `/ar${clean}`;
}

/**
 * Canonical URL path for SEO per the hybrid strategy:
 * - Arabic home → "/"
 * - All other Arabic pages → "/ar/..."
 * - English pages → "/en/..."
 */
export function seoCanonicalPath(locale: Locale | string, logicalPath: string): string {
  const p = logicalPath.startsWith("/") ? logicalPath : `/${logicalPath}`;
  const clean = stripLocale(p);
  if (locale === "en") return clean === "/" ? "/en" : `/en${clean}`;
  // Arabic
  return clean === "/" ? "/" : `/ar${clean}`;
}
