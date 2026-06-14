import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import {
  localizedBookDescription,
  localizedBookName,
  localizedBookShortDesc,
} from "@/lib/i18n/book-locale";
import {
  absoluteUrl,
  alternateOpenGraphLocales,
  getDefaultOgImagePath,
  getSiteName,
  getSiteUrl,
  localeOpenGraphLocale,
  localizedPaths,
  resolveMediaUrl,
  siteConfig,
} from "@/lib/seo/site";

export {
  absoluteUrl,
  getSiteUrl,
  resolveMediaUrl,
  siteConfig,
} from "@/lib/seo/site";

export interface PageSeoInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
}

function toIsoDate(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function buildSiteIcons(): NonNullable<Metadata["icons"]> {
  return {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  };
}

/** Root layout metadata — metadataBase + defaults for all pages. */
export function buildRootMetadata(): Metadata {
  const base = getSiteUrl();
  const defaultOg = resolveMediaUrl(getDefaultOgImagePath());

  return {
    metadataBase: new URL(base),
    title: {
      template: `%s | ${siteConfig.nameAr}`,
      default: `${siteConfig.nameAr} — ${siteConfig.nameEn}`,
    },
    description: siteConfig.taglineAr,
    applicationName: siteConfig.nameAr,
    authors: [{ name: siteConfig.nameEn, url: base }],
    creator: siteConfig.nameEn,
    publisher: siteConfig.nameAr,
    category: "books",
    icons: buildSiteIcons(),
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      url: base,
      siteName: siteConfig.nameAr,
      title: siteConfig.nameAr,
      description: siteConfig.taglineAr,
      locale: "ar_AR",
      alternateLocale: ["en_US"],
      images: [
        {
          url: defaultOg,
          width: 1200,
          height: 630,
          alt: siteConfig.nameAr,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.nameAr,
      description: siteConfig.taglineAr,
      images: [defaultOg],
      ...(siteConfig.twitterHandle
        ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
        : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: base,
      languages: {
        ar: `${base}/ar`,
        en: `${base}/en`,
        "x-default": `${base}/ar`,
      },
    },
  };
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const canonical = absoluteUrl(path);
  const siteName = getSiteName(input.locale);
  const fullTitle =
    input.title.includes(siteName) ||
    input.title.includes(siteConfig.nameEn) ||
    input.title.includes(siteConfig.nameAr)
      ? input.title
      : `${input.title} | ${siteName}`;

  const { ar, en } = localizedPaths(path);
  const ogImage = resolveMediaUrl(input.imageUrl);
  const description = input.description.slice(0, 320);
  const ogDescription = input.description.slice(0, 200);
  const published = toIsoDate(input.publishedTime);
  const modified = toIsoDate(input.modifiedTime);

  const isArticle = input.type === "article";

  return {
    title: fullTitle,
    description,
    keywords: input.keywords,
    alternates: {
      canonical,
      languages: {
        ar: absoluteUrl(ar),
        en: absoluteUrl(en),
        "x-default": absoluteUrl(ar),
      },
    },
    openGraph: {
      type: isArticle ? "article" : "website",
      locale: localeOpenGraphLocale(input.locale),
      alternateLocale: alternateOpenGraphLocales(input.locale),
      url: canonical,
      siteName,
      title: input.title,
      description: ogDescription,
      ...(isArticle && published ? { publishedTime: published } : {}),
      ...(isArticle && modified ? { modifiedTime: modified } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: ogDescription,
      images: [ogImage],
      ...(siteConfig.twitterHandle
        ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
        : {}),
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
        ? `كتاب ${name} على ${siteConfig.nameAr}`
        : `${name} on ${siteConfig.nameEn}`),
    imageUrl: book.imageUrl,
    type: "website",
    keywords: [name, locale === "ar" ? "كتب" : "books", locale === "ar" ? "مكتبة" : "library"],
  });
}

export function articleSeoMetadata(
  locale: Locale,
  article: {
    slug: string;
    title: string;
    excerpt?: string | null;
    imageUrl?: string | null;
    date?: Date | string | null;
  }
): Metadata {
  return buildPageMetadata({
    locale,
    path: `/${locale}/articles/${article.slug}`,
    title: article.title,
    description:
      article.excerpt?.trim() ||
      (locale === "ar"
        ? `مقال ${article.title} على ${siteConfig.nameAr}`
        : `${article.title} on ${siteConfig.nameEn}`),
    imageUrl: article.imageUrl,
    type: "article",
    publishedTime: article.date,
    keywords: [article.title, locale === "ar" ? "مقالات" : "articles"],
  });
}
