import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/site";

export const alt = siteConfig.nameAr;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 80,
          background: "linear-gradient(135deg, #0b0b0b 0%, #1a0a0c 45%, #0b0b0b 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 12,
              height: 64,
              background: "#b11e2e",
              borderRadius: 6,
            }}
          />
          <span style={{ fontSize: 28, color: "#b11e2e", fontWeight: 700 }}>
            BOOKS PLATFORM
          </span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15, maxWidth: 900 }}>
          {siteConfig.nameAr}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "rgba(255,255,255,0.85)" }}>
          {siteConfig.nameEn}
        </div>
        <div
          style={{
            fontSize: 26,
            marginTop: 40,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 800,
          }}
        >
          {siteConfig.taglineAr}
        </div>
      </div>
    ),
    { ...size }
  );
}
