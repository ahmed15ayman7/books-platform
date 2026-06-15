import localFont from "next/font/local";

/**
 * alarabiyaBoutros2026 — the typeface used on alarabiya.net (Mourad Boutros, 2020 rebrand).
 * Regular (400) and bold (700) extracted from the site's inline @font-face declarations.
 */
export const alarabiya = localFont({
  src: [
    {
      path: "../../app/fonts/alarabiya-boutros2026/alarabiya-boutros2026-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/alarabiya-boutros2026/alarabiya-boutros2026-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
});
