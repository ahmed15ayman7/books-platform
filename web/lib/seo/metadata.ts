import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import {
  localizedBookDescription,
  localizedBookName,
  localizedBookShortDesc,
} from "@/lib/i18n/book-locale";

const SITE_NAME_AR = "منصة الكتب العالمية";
const SITE_NAME_EN = "Books Platform";

function appBaseUrl(): string {
  return process.env["NEXT_PUBLIC_APP_URL"] ?? "https://booksplatform.net";
}

export interface PageSeoInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const base = appBaseUrl().replace(/\/$/, "");
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const canonical = `${base}${path}`;
  const siteName = input.locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN;
  const fullTitle =
    input.title.includes(siteName) || input.title.includes("Books Platform")
      ? input.title
      : `${input.title} | ${siteName}`;

  const arPath = path.replace(/^\/(ar|en)/, "/ar");
  const enPath = path.replace(/^\/(ar|en)/, "/en");

  const ogImage = input.imageUrl
    ? input.imageUrl.startsWith("http")
      ? input.imageUrl
      : `${base}${input.imageUrl.startsWith("/") ? "" : "/"}${input.imageUrl}`
    : `${base}/og-default.jpg`;

  return {
    title: fullTitle,
    description: input.description.slice(0, 320),
    keywords: input.keywords,
    alternates: {
      canonical,
      languages: {
        ar: `${base}${arPath}`,
        en: `${base}${enPath}`,
        "x-default": `${base}${arPath}`,
      },
    },
    openGraph: {
      type: input.type ?? "website",
      locale: input.locale === "ar" ? "ar_AR" : "en_US",
      alternateLocale: input.locale === "ar" ? ["en_US"] : ["ar_AR"],
      url: canonical,
      siteName,
      title: input.title,
      description: input.description.slice(0, 200),
      images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description.slice(0, 200),
      images: [ogImage],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function bookSeoMetadata(
  locale: Locale,
  book: {
    slug: string;
    nameEn: string;
    nameAr?: string | null;
    shortDesc?: string | null;
    shortDescAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    imageUrl?: string | null;
    yoastMetadesc?: string | null;
  }
): Metadata {
  const name = localizedBookName(book, locale);
  const desc =
    localizedBookDescription(book, locale) ??
    localizedBookShortDesc(book, locale) ??
    book.yoastMetadesc ??
    "";

  return buildPageMetadata({
    locale,
    path: `/${locale}/books/${book.slug}`,
    title: name,
    description:
      desc ||
      (locale === "ar"
        ? `كتاب ${name} على منصة الكتب العالمية`
        : `${name} on Books Platform`),
    imageUrl: book.imageUrl,
    keywords: [name, locale === "ar" ? "كتب" : "books"],
  });
}
