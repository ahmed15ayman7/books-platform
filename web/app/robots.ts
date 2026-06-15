import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // API routes
          "/api/",
          // Admin panels (both locale-prefixed and unprefixed alias)
          "/admin/",
          "/ar/admin/",
          "/en/admin/",
          // Auth flows
          "/auth/",
          "/ar/auth/",
          "/en/auth/",
          // Author dashboard
          "/author/",
          "/ar/author/",
          "/en/author/",
          // Ambassador dashboard
          "/ambassador/",
          "/ar/ambassador/",
          "/en/ambassador/",
          // Search results (thin content, parameterised)
          "/search",
          "/ar/search",
          "/en/search",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
