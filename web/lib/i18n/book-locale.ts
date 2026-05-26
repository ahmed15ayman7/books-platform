import type { Locale } from "@/lib/i18n/config";

export interface BookLocalizedFields {
  nameEn: string;
  nameAr?: string | null;
  shortDesc?: string | null;
  shortDescAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
}

/** Primary display title for the active UI locale */
export function localizedBookName(book: BookLocalizedFields, locale: Locale | string): string {
  const isAr = locale === "ar";
  if (isAr && book.nameAr?.trim()) return book.nameAr.trim();
  return book.nameEn;
}

/** Secondary title (other language), when both exist */
export function localizedBookAlternateName(
  book: BookLocalizedFields,
  locale: Locale | string
): string | null {
  const isAr = locale === "ar";
  if (isAr && book.nameEn?.trim()) return book.nameEn.trim();
  if (!isAr && book.nameAr?.trim()) return book.nameAr.trim();
  return null;
}

export function localizedBookShortDesc(
  book: BookLocalizedFields,
  locale: Locale | string
): string | null {
  const isAr = locale === "ar";
  const ar = book.shortDescAr?.trim();
  const en = book.shortDesc?.trim();
  if (isAr) return ar ?? en ?? null;
  return en ?? ar ?? null;
}

/** English body uses `description`; Arabic uses `descriptionAr` with EN fallback */
export function localizedBookDescription(
  book: BookLocalizedFields,
  locale: Locale | string
): string | null {
  const isAr = locale === "ar";
  const ar = book.descriptionAr?.trim();
  const en = book.description?.trim();
  if (isAr) return ar ?? en ?? null;
  return en ?? ar ?? null;
}
