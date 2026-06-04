import type { Locale } from "@/lib/i18n";

export type BilingualString = { ar: string; en: string };

export function pickLocale(text: BilingualString, locale: Locale): string {
  return locale === "ar" ? text.ar : text.en;
}

export function pickLocaleList(items: BilingualString[], locale: Locale): string[] {
  return items.map((item) => pickLocale(item, locale));
}
