import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { isMediaChannel } from "@/lib/media/youtube";
import { buildPageMetadata } from "./metadata";

const CHANNELS: Record<
  string,
  { titleAr: string; titleEn: string; descAr: string; descEn: string }
> = {
  harvest: {
    titleAr: "حصاد الكتب",
    titleEn: "Book Harvest",
    descAr: "ملخصات ومراجعات للكتب العالمية",
    descEn: "Summaries and reviews of world books",
  },
  ideas: {
    titleAr: "زبدة الأفكار",
    titleEn: "Essence of Ideas",
    descAr: "أفكار مركزة من أهم الكتب والمؤلفين",
    descEn: "Focused ideas from leading books and authors",
  },
  "books-talk": {
    titleAr: "حديث الكتب",
    titleEn: "Book Talk",
    descAr: "حوارات ونقاشات حول الكتب والقراءة",
    descEn: "Conversations and discussions about books",
  },
  "world-reads": {
    titleAr: "العالم يقرأ",
    titleEn: "World Reads",
    descAr: "ما يقرأه العالم الآن من كتب وثقافات",
    descEn: "What the world is reading now",
  },
  "novel-story": {
    titleAr: "رواية فحكاية",
    titleEn: "Novel & Story",
    descAr: "روايات وقصص من الأدب العالمي",
    descEn: "Novels and stories from world literature",
  },
};

export function articleChannelMetadata(locale: Locale, channel: string): Metadata {
  const c = CHANNELS[channel] ?? CHANNELS["harvest"]!;
  const basePath = isMediaChannel(channel) ? "media" : "articles";
  return buildPageMetadata({
    locale,
    path: `/${locale}/${basePath}/${channel}`,
    title: locale === "ar" ? c.titleAr : c.titleEn,
    description: locale === "ar" ? c.descAr : c.descEn,
    type: "website",
    keywords: [locale === "ar" ? c.titleAr : c.titleEn, locale === "ar" ? "مقالات" : "articles"],
  });
}
