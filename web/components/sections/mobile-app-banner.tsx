"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-store-links";

const DISMISSED_KEY = "mobile_app_banner_dismissed";

interface MobileAppBannerProps {
  locale: string;
}

function getStoreUrl(): string {
  if (typeof navigator === "undefined") return APP_STORE_URL || GOOGLE_PLAY_URL;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return APP_STORE_URL;
  if (/android/i.test(ua)) return GOOGLE_PLAY_URL;
  // unknown mobile — prefer App Store, fall back to Play
  return APP_STORE_URL || GOOGLE_PLAY_URL;
}

export function MobileAppBanner({ locale }: MobileAppBannerProps) {
  const [visible, setVisible] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const isAr = locale === "ar";

  useEffect(() => {
    const url = getStoreUrl();
    if (!url) return; // no URLs configured
    setStoreUrl(url);
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
      // storage blocked
    }
  }

  if (!visible || !storeUrl) return null;

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="md:hidden flex items-center gap-3 bg-[var(--brand-black)] px-4 py-2.5 text-white"
      role="banner"
      aria-label={isAr ? "افتح التطبيق" : "Open the app"}
    >
      {/* dismiss */}
      <button
        onClick={dismiss}
        aria-label={isAr ? "إغلاق" : "Dismiss"}
        className="shrink-0 rounded-full p-1 text-white/50 hover:text-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* label */}
      <p className="min-w-0 flex-1 text-sm font-medium leading-tight text-white/90">
        {isAr ? "افتح التطبيق للتجربة الكاملة" : "Get the full experience in our app"}
      </p>

      {/* single open button */}
      <a
        href={storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-full bg-[var(--brand-red)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        {isAr ? "فتح" : "Open"}
      </a>
    </div>
  );
}
