import type { Locale } from "@/lib/i18n";

export interface PublisherLocalizedFields {
  name?: string | null;
  nameAr?: string | null;
  content?: string | null;
  contentAr?: string | null;
  /** @deprecated Legacy fallback */
  title?: string;
}

export function localizedPublisherName(
  publisher: PublisherLocalizedFields,
  locale: Locale | string,
): string {
  const isAr = locale === "ar";
  const ar = publisher.nameAr?.trim();
  const en = publisher.name?.trim();
  const legacy = publisher.title?.trim();
  if (isAr) return ar ?? en ?? legacy ?? "";
  return en ?? ar ?? legacy ?? "";
}

export function localizedPublisherAlternateName(
  publisher: PublisherLocalizedFields,
  locale: Locale | string,
): string | null {
  const isAr = locale === "ar";
  const ar = publisher.nameAr?.trim();
  const en = publisher.name?.trim();
  if (isAr && en) return en;
  if (!isAr && ar) return ar;
  return null;
}

export function localizedPublisherDescription(
  publisher: PublisherLocalizedFields,
  locale: Locale | string,
): string | null {
  const isAr = locale === "ar";
  const ar = publisher.contentAr?.trim();
  const en = publisher.content?.trim();
  if (isAr) return ar ?? en ?? null;
  return en ?? ar ?? null;
}
