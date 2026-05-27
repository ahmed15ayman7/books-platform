import { absoluteUrl, getSiteUrl, resolveMediaUrl, siteConfig } from "@/lib/seo/site";

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
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: `${base}/${locale}`,
    inLanguage: locale === "ar" ? "ar" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/books?q={search_term_string}`,
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
    url: `${base}/${locale}`,
    logo: resolveMediaUrl("/logo.webp"),
    sameAs: siteConfig.twitterHandle
      ? [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`]
      : undefined,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
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
