"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-store-links";

const DISMISSED_KEY = "mobile_app_banner_dismissed";

interface MobileAppBannerProps {
  locale: string;
}

export function MobileAppBanner({ locale }: MobileAppBannerProps) {
  const [visible, setVisible] = useState(false);
  const isAr = locale === "ar";

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // storage blocked — banner won't reappear this session anyway
    }
  }

  // No store URLs configured at all → don't render
  if (!APP_STORE_URL && !GOOGLE_PLAY_URL) return null;
  if (!visible) return null;

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="md:hidden flex items-center gap-3 bg-[var(--brand-black)] px-4 py-3 text-white"
      role="banner"
      aria-label={isAr ? "افتح التطبيق" : "Open the app"}
    >
      {/* dismiss */}
      <button
        onClick={dismiss}
        aria-label={isAr ? "إغلاق" : "Dismiss"}
        className="shrink-0 rounded-full p-1 text-white/60 hover:text-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* label */}
      <p className="min-w-0 flex-1 text-sm font-medium leading-tight">
        {isAr ? "افتح التطبيق للتجربة الكاملة" : "Get the full experience in our app"}
      </p>

      {/* store buttons */}
      <div className="flex shrink-0 items-center gap-2">
        {APP_STORE_URL && (
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isAr ? "حمّل من App Store" : "Download on the App Store"}
            className="transition-opacity hover:opacity-85"
          >
            <Image
              src="/badges/app-store.svg"
              alt={isAr ? "App Store" : "App Store"}
              width={96}
              height={32}
              className="h-8 w-auto"
            />
          </a>
        )}
        {GOOGLE_PLAY_URL && (
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isAr ? "حمّل من Google Play" : "Get it on Google Play"}
            className="transition-opacity hover:opacity-85"
          >
            <Image
              src="/badges/google-play.svg"
              alt={isAr ? "Google Play" : "Google Play"}
              width={96}
              height={32}
              className="h-8 w-auto"
            />
          </a>
        )}
      </div>
    </div>
  );
}
