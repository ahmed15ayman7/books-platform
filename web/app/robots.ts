import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  // Private areas (with & without /en prefix since Arabic has no prefix)
  const privateAreas = [
    "/api/",
    "/admin",
    "/en/admin",
    "/auth",
    "/en/auth",
    "/author",
    "/en/author",
    "/ambassador",
    "/en/ambassador",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateAreas,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
