"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  requestNotificationPermission,
  saveNotificationPrompt,
  shouldShowNotificationPrompt,
} from "@/lib/consent/notification-prompt";

const PROMPT_DELAY_MS = 60_000;

export function NotificationPromptBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);

  useEffect(() => {
    import("@/lib/consent/cookie-consent").then(({ shouldShowCookieConsent }) => {
      setCookieBannerVisible(shouldShowCookieConsent());
    });
  }, []);

  useEffect(() => {
    if (!shouldShowNotificationPrompt()) return undefined;

    const timer = window.setTimeout(() => {
      if (shouldShowNotificationPrompt()) {
        import("@/lib/consent/cookie-consent").then(({ shouldShowCookieConsent }) => {
          setCookieBannerVisible(shouldShowCookieConsent());
        });
        setVisible(true);
      }
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  async function enable() {
    await requestNotificationPermission();
    setVisible(false);
  }

  function dismiss() {
    saveNotificationPrompt("dismissed");
    setVisible(false);
  }

  return (
    <div
      className={`fixed inset-x-0 z-[65] border border-[var(--brand-gray-200)] bg-[var(--brand-black)]/95 p-4 text-white shadow-lg backdrop-blur-md ${
        cookieBannerVisible ? "bottom-24 sm:bottom-28" : "bottom-4"
      }`}
      role="dialog"
      aria-live="polite"
      aria-label={t("notificationTitle")}
    >
      <div className="container-platform flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-red)]" aria-hidden="true" />
          <p className="max-w-xl text-sm leading-relaxed text-[var(--brand-gray-200)]">
            {t("notificationMessage")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void enable()}>
            {t("notificationEnable")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={dismiss}
          >
            {t("notificationLater")}
          </Button>
        </div>
      </div>
    </div>
  );
}
