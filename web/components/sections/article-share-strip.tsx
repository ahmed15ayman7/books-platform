"use client";

import { Link2, MessageCircle } from "lucide-react";
import type { ComponentType } from "react";
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconTelegram,
  IconX,
} from "@/components/icons";
import type { Locale } from "@/lib/i18n";
import {
  buildPlatformShareUrl,
  buildSharePostText,
  PUBLIC_SHARE_PLATFORM_STYLES,
  SHARE_PLATFORMS,
  type SharePlatform,
} from "@/lib/share/entity-share";

interface ArticleShareStripProps {
  locale: Locale;
  url: string;
  title: string;
  imageUrl?: string | null;
}

const STRIP_PLATFORM_ICONS: Record<
  SharePlatform,
  ComponentType<{ className?: string }>
> = {
  Facebook: IconFacebook,
  "X (Twitter)": IconX,
  LinkedIn: IconLinkedin,
  WhatsApp: ({ className }) => <MessageCircle className={className} />,
  Telegram: IconTelegram,
  Instagram: IconInstagram,
};

const STRIP_PLATFORM_LABELS: Record<SharePlatform, string> = {
  Facebook: "Facebook",
  "X (Twitter)": "X",
  LinkedIn: "LinkedIn",
  WhatsApp: "WhatsApp",
  Telegram: "Telegram",
  Instagram: "Instagram",
};

export function ArticleShareStrip({ locale, url, title, imageUrl }: ArticleShareStripProps) {
  const isAr = locale === "ar";
  const payload = { title, publicUrl: url, imageUrl };
  const postText = buildSharePostText(payload);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(postText);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-10 border-t border-[var(--brand-gray-200)] pt-8">
      <p className="mb-4 text-center text-base font-semibold text-[var(--brand-gray-900)]">
        {isAr ? "شارك المقالة على..." : "Share this article on..."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SHARE_PLATFORMS.map((platform) => {
          const Icon = STRIP_PLATFORM_ICONS[platform];
          const label = STRIP_PLATFORM_LABELS[platform];
          const isInstagram = platform === "Instagram";
          const href = buildPlatformShareUrl(platform, payload, postText);
          const style =
            platform !== "Instagram" ? PUBLIC_SHARE_PLATFORM_STYLES[platform] : null;

          if (isInstagram) {
            return (
              <button
                key={platform}
                type="button"
                onClick={() => void copyPost()}
                className="inline-flex items-center gap-2 rounded bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            );
          }

          return (
            <a
              key={platform}
              href={href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!href) {
                  e.preventDefault();
                  void copyPost();
                }
              }}
              className={`inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white transition-colors ${style?.className ?? ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </a>
          );
        })}
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-2 rounded bg-[var(--brand-gray-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-gray-800)]"
        >
          <Link2 className="h-4 w-4" />
          {isAr ? "نسخ الرابط" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
