import { absoluteUrl, resolveMediaUrl, siteConfig } from "@/lib/seo/site";
import { seoCanonicalPath } from "@/lib/i18n/href";
import { markdownToPlainText } from "@/lib/markdown/markdown-to-plain-text";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd(locale: string) {
  const homeUrl = absoluteUrl(seoCanonicalPath(locale, "/"));
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: homeUrl,
    inLanguage: locale === "ar" ? "ar" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(seoCanonicalPath(locale, "/search"))}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: string) {
  const homeUrl = absoluteUrl(seoCanonicalPath(locale, "/"));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: homeUrl,
    logo: resolveMediaUrl("/logo.webp"),
    sameAs: siteConfig.twitterHandle
      ? [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`]
      : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function bookJsonLd(
  locale: string,
  book: {
    slug: string;
    nameAr?: string | null;
    nameEn: string;
    isbn?: string | null;
    language?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    publisher?: { nameAr?: string | null; nameEn?: string | null } | null;
  },
) {
  const name = locale === "ar" && book.nameAr ? book.nameAr : book.nameEn;
  const desc =
    locale === "ar" && book.descriptionAr
      ? book.descriptionAr
      : book.description;
  const publisherName =
    book.publisher
      ? (locale === "ar" && book.publisher.nameAr
          ? book.publisher.nameAr
          : book.publisher.nameEn ?? undefined)
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name,
    url: absoluteUrl(seoCanonicalPath(locale, `/books/${book.slug}`)),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.language ? { inLanguage: book.language } : {}),
    ...(book.imageUrl ? { image: resolveMediaUrl(book.imageUrl) } : {}),
    ...(desc ? { description: markdownToPlainText(desc).slice(0, 500) } : {}),
    ...(publisherName
      ? { publisher: { "@type": "Organization", name: publisherName } }
      : {}),
  };
}

export function articleJsonLd(
  locale: string,
  article: {
    slug: string;
    title: string;
    titleEn?: string | null;
    excerpt?: string | null;
    excerptEn?: string | null;
    imageUrl?: string | null;
    date?: Date | string | null;
    updatedAt?: Date | string | null;
    authorName?: string | null;
  },
) {
  const name = locale === "ar" ? article.title : (article.titleEn ?? article.title);
  const desc =
    locale === "ar"
      ? article.excerpt
      : (article.excerptEn ?? article.excerpt);
  const url = absoluteUrl(seoCanonicalPath(locale, `/articles/${article.slug}`));
  const published = article.date ? new Date(article.date).toISOString() : undefined;
  const modified = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : published;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(article.imageUrl ? { image: resolveMediaUrl(article.imageUrl) } : {}),
    ...(desc ? { description: markdownToPlainText(desc).slice(0, 300) } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(article.authorName
      ? { author: { "@type": "Person", name: article.authorName } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
      logo: resolveMediaUrl("/logo.webp"),
    },
  };
}

export function personJsonLd(
  locale: string,
  person: {
    slug: string;
    name: string;
    nameAr?: string | null;
    bio?: string | null;
    bioAr?: string | null;
    imageUrl?: string | null;
  },
) {
  const name = locale === "ar" && person.nameAr ? person.nameAr : person.name;
  const bio = locale === "ar" && person.bioAr ? person.bioAr : person.bio;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: absoluteUrl(seoCanonicalPath(locale, `/authors/${person.slug}`)),
    ...(bio ? { description: bio.slice(0, 300) } : {}),
    ...(person.imageUrl ? { image: resolveMediaUrl(person.imageUrl) } : {}),
  };
}

export function organizationEntityJsonLd(
  locale: string,
  publisher: {
    slug: string;
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    imageUrl?: string | null;
  },
) {
  const name =
    locale === "ar" && publisher.nameAr ? publisher.nameAr : publisher.name;
  const desc =
    locale === "ar" && publisher.descriptionAr
      ? publisher.descriptionAr
      : publisher.description;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: absoluteUrl(seoCanonicalPath(locale, `/publishers/${publisher.slug}`)),
    ...(desc ? { description: markdownToPlainText(desc).slice(0, 300) } : {}),
    ...(publisher.imageUrl ? { logo: resolveMediaUrl(publisher.imageUrl) } : {}),
  };
}
