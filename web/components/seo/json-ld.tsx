export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd(locale: string) {
  const base = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://booksplatform.net";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? "منصة الكتب العالمية" : "Books Platform",
    url: `${base}/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/books?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: string) {
  const base = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://booksplatform.net";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? "منصة الكتب العالمية" : "Books Platform",
    url: `${base}/${locale}`,
    logo: `${base}/og-default.jpg`,
  };
}
