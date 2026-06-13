import { absoluteUrl, getSiteUrl, resolveMediaUrl, siteConfig, stripLocale } from "@/lib/seo/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd(locale: string) {
  const base = getSiteUrl();
  const searchBase = locale === "en" ? `${base}/en` : base;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: base,
    inLanguage: locale === "ar" ? "ar" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${searchBase}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: string) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    alternateName: locale === "ar" ? siteConfig.nameEn : siteConfig.nameAr,
    url: base,
    logo: resolveMediaUrl("/logo.webp"),
    sameAs: siteConfig.twitterHandle
      ? [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`]
      : undefined,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  // paths are locale-neutral (already stripped) or full page paths
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(stripLocale(item.path)),
    })),
  };
}

interface PersonJsonLdInput {
  name: string;
  url: string;
  description?: string | null;
  image?: string | null;
  sameAs?: string[];
}

export function personJsonLd(input: PersonJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
  };
}

interface PublisherOrgJsonLdInput {
  name: string;
  url: string;
  description?: string | null;
  logo?: string | null;
  websiteUrl?: string | null;
  sameAs?: string[];
}

export function publisherOrganizationJsonLd(input: PublisherOrgJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description.slice(0, 500) } : {}),
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.websiteUrl ? { sameAs: [input.websiteUrl, ...(input.sameAs ?? [])] } : {}),
  };
}

interface BookJsonLdInput {
  name: string;
  url: string;
  description?: string | null;
  image?: string | null;
  isbn?: string | null;
  language?: string | null;
  publisherName?: string | null;
  authors?: string[];
  ratingValue?: number | null;
  ratingCount?: number;
}

export function bookJsonLd(input: BookJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description.slice(0, 500) } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.isbn ? { isbn: input.isbn } : {}),
    ...(input.language ? { inLanguage: input.language } : {}),
    ...(input.publisherName
      ? { publisher: { "@type": "Organization", name: input.publisherName } }
      : {}),
    ...(input.authors?.length
      ? { author: input.authors.map((a) => ({ "@type": "Person", name: a })) }
      : {}),
    ...(input.ratingValue && input.ratingCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.ratingValue.toFixed(1),
            reviewCount: input.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

interface ArticleJsonLdInput {
  headline: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  description?: string | null;
  image?: string | null;
  authorName?: string | null;
  publisherName: string;
  publisherLogo: string;
  articleSection?: string | null;
}

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline.slice(0, 110),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    url: input.url,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.description ? { description: input.description.slice(0, 500) } : {}),
    ...(input.image ? { image: { "@type": "ImageObject", url: input.image } } : {}),
    ...(input.authorName
      ? { author: { "@type": "Person", name: input.authorName } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      logo: { "@type": "ImageObject", url: input.publisherLogo },
    },
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
  };
}
