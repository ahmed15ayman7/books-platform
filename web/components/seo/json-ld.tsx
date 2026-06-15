import { absoluteUrl, resolveMediaUrl, siteConfig } from "@/lib/seo/site";
import { localeHref } from "@/lib/i18n/href";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: absoluteUrl(localeHref(locale, "/")),
    inLanguage: locale === "ar" ? "ar" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(localeHref(locale, "/books"))}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.nameEn,
    url: absoluteUrl(localeHref(locale, "/")),
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
