export { locales, defaultLocale } from "./config";
export type { Locale } from "./config";
export { stripLocale, localeHref, getLocaleFromPathname } from "./href";

export function getDirection(locale: string): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRTL(locale: string): boolean {
  return locale === "ar";
}
