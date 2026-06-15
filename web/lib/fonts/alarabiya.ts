import localFont from "next/font/local";

/** Alarabiya — primary Arabic/display typeface for the public site. */
export const alarabiya = localFont({
  src: "../../app/fonts/alarabiya-normal.ttf",
  variable: "--font-arabic",
  display: "swap",
  weight: "400",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});
