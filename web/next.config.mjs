import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "framer-motion",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/(_next/static|favicon|icons)(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async rewrites() {
    // beforeFiles rewrites run before middleware and before filesystem routing.
    // They make clean Arabic URLs (e.g. /books) accessible without a browser redirect,
    // while the canonical <link> in metadata still points to /ar/books.
    return {
      beforeFiles: [
        { source: "/books", destination: "/ar/books" },
        { source: "/books/:path*", destination: "/ar/books/:path*" },
        { source: "/articles/:path*", destination: "/ar/articles/:path*" },
        { source: "/media", destination: "/ar/media" },
        { source: "/media/:path*", destination: "/ar/media/:path*" },
        { source: "/publishers", destination: "/ar/publishers" },
        { source: "/publishers/:slug", destination: "/ar/publishers/:slug" },
        { source: "/authors/:slug", destination: "/ar/authors/:slug" },
        { source: "/publish", destination: "/ar/publish" },
        { source: "/about", destination: "/ar/about" },
        { source: "/services", destination: "/ar/services" },
        { source: "/team", destination: "/ar/team" },
        { source: "/contact", destination: "/ar/contact" },
        { source: "/privacy", destination: "/ar/privacy" },
        { source: "/terms", destination: "/ar/terms" },
        { source: "/search", destination: "/ar/search" },
      ],
    };
  },

  async redirects() {
    return [
      // Legacy WordPress URLs → canonical Arabic paths
      { source: "/about-us", destination: "/ar/about", permanent: true },
      { source: "/about-us/:path*", destination: "/ar/about", permanent: true },
      { source: "/our-service", destination: "/ar/services", permanent: true },
      { source: "/our-service/:path*", destination: "/ar/services", permanent: true },
      { source: "/our-team", destination: "/ar/team", permanent: true },
      { source: "/our-team/:path*", destination: "/ar/team", permanent: true },
      { source: "/contact-us", destination: "/ar/contact", permanent: true },
      { source: "/contact-us/:path*", destination: "/ar/contact", permanent: true },
      { source: "/privacy-policy", destination: "/ar/privacy", permanent: true },
      { source: "/privacy-policy/:path*", destination: "/ar/privacy", permanent: true },
      { source: "/terms", destination: "/ar/terms", permanent: true },
      { source: "/terms/:path*", destination: "/ar/terms", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
