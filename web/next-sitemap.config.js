/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://booksplatform.net",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ar/admin", "/en/admin", "/api/"],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || "https://booksplatform.net"}/sitemap.xml`,
    ],
  },
  // Exclude admin routes
  exclude: [
    "*/admin*",
    "*/ambassador*",
    "/api/*",
  ],
  // Generate sitemap for both locales
  alternateRefs: [
    { href: `${process.env.NEXT_PUBLIC_APP_URL || "https://booksplatform.net"}/ar`, hreflang: "ar" },
    { href: `${process.env.NEXT_PUBLIC_APP_URL || "https://booksplatform.net"}/en`, hreflang: "en" },
  ],
};

module.exports = config;
