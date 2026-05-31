import type { Locale } from "@/lib/i18n";

/** Publisher bilingual fields (DB mapping: title/imageTitle, content/excerpt). */
export interface PublisherLocalizedFields {
  title: string;
  imageTitle?: string | null;
  content?: string | null;
  excerpt?: string | null;
}

export function localizedPublisherName(
  publisher: PublisherLocalizedFields,
  locale: Locale | string,
): string {
  const isAr = locale === "ar";
  if (isAr) return publisher.title;
  const en = publisher.imageTitle?.trim();
  return en || publisher.title;
}

export function localizedPublisherDescription(
  publisher: PublisherLocalizedFields,
  locale: Locale | string,
): string | null {
  const isAr = locale === "ar";
  const ar = publisher.content?.trim();
  const en = publisher.excerpt?.trim();
  if (isAr) return ar ?? en ?? null;
  return en ?? ar ?? null;
}
