import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.nameAr,
    short_name: siteConfig.nameEn,
    description: siteConfig.taglineAr,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#b11e2e",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
