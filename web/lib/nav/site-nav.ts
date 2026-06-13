import {
  BOOK_CATEGORY_LABELS_AR,
  BOOK_CATEGORY_LABELS_EN,
  type BookCategoryLabelAr,
} from "./book-categories";
import { normalizeArabic } from "@/lib/i18n/normalize-arabic";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";

export interface NavCategory {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  linkedCount?: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export const READING_CHANNELS = [
  { slug: "world-reads", labelAr: "العالم يقرأ", labelEn: "World Reads" },
  { slug: "harvest", labelAr: "حصاد الكتب", labelEn: "Book Harvest" },
  { slug: "ideas", labelAr: "زبدة الأفكار", labelEn: "Essence of Ideas" },
] as const;

export const MEDIA_CHANNELS = [
  { slug: "books-talk", labelAr: "حديث الكتب", labelEn: "Book Talk" },
  { slug: "novel-story", labelAr: "رواية فحكاية", labelEn: "Novel & Story" },
] as const;

/** Homepage media spotlight order (novel-story before books-talk). */
export const MEDIA_HOME_CHANNELS = [
  { slug: "novel-story", labelAr: "رواية فحكاية", labelEn: "Novel & Story" },
  { slug: "books-talk", labelAr: "حديث الكتب", labelEn: "Books Talk" },
] as const;

export function bookCategoryLabel(labelAr: BookCategoryLabelAr, locale: string): string {
  return locale === "ar" ? labelAr : BOOK_CATEGORY_LABELS_EN[labelAr];
}

export function buildBookCategoryLinks(locale: string, categories: NavCategory[]): NavLink[] {
  const l = locale as Locale;
  const byNorm = new Map(
    categories.map((c) => [normalizeArabic(c.nameAr ?? c.name), c]),
  );

  return BOOK_CATEGORY_LABELS_AR.map((labelAr) => {
    const cat = byNorm.get(normalizeArabic(labelAr));
    return {
      href: cat ? localeHref(l, `/books/category/${cat.slug}`) : localeHref(l, "/books"),
      label: bookCategoryLabel(labelAr, locale),
    };
  });
}

export function buildReadingChannelLinks(locale: string): NavLink[] {
  const l = locale as Locale;
  const isAr = locale === "ar";
  return READING_CHANNELS.map((ch) => ({
    href: localeHref(l, `/articles/${ch.slug}`),
    label: isAr ? ch.labelAr : ch.labelEn,
  }));
}

export function buildMediaChannelLinks(locale: string): NavLink[] {
  const l = locale as Locale;
  const isAr = locale === "ar";
  return [
    ...MEDIA_CHANNELS.map((ch) => ({
      href: localeHref(l, `/media/${ch.slug}`),
      label: isAr ? ch.labelAr : ch.labelEn,
    })),
  ];
}

export function mediaHubHref(locale: string): string {
  return localeHref(locale as Locale, "/media");
}

export function buildTopLevelBookLinks(locale: string): NavLink[] {
  const l = locale as Locale;
  const isAr = locale === "ar";
  return [
    {
      href: localeHref(l, "/books/nominated-for-translation"),
      label: isAr ? "كتب مرشحة للترجمة" : "For Translation",
    },
    {
      href: localeHref(l, "/books/translated"),
      label: isAr ? "كتب مترجمة" : "Translated Books",
    },
  ];
}

export function mediaNavLabel(locale: string): string {
  return locale === "ar" ? "إبداعات الميديا" : "Media";
}

export function readingsNavLabel(locale: string): string {
  return locale === "ar" ? "قراءات وعروض" : "Readings";
}

export function bookCategoriesNavLabel(locale: string): string {
  return locale === "ar" ? "تصنيفات الكتب" : "Book Categories";
}
