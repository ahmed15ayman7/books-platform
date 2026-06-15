"use client";

import { useEffect, useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { saveCookieConsent, shouldShowCookieConsent } from "@/lib/consent/cookie-consent";

export function CookieConsentBanner() {
  const locale = useLocale();
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShowCookieConsent());
  }, []);

  if (!visible) return null;

  function accept() {
    saveCookieConsent("accepted");
    setVisible(false);
  }

  function dismiss() {
    saveCookieConsent("dismissed");
    setVisible(false);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--brand-gray-200)] bg-white/95 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-live="polite"
      aria-label={t("cookieTitle")}
    >
      <div className="container-platform flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--brand-gray-700)]">
          {t("cookieMessage")}{" "}
          <Link
            href={localeHref(locale, "/privacy")}
            className="font-medium text-[var(--brand-red)] hover:underline"
          >
            {t("cookiePrivacy")}
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" size="sm" onClick={accept}>
            {t("cookieAccept")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={dismiss}>
            {t("cookieLater")}
          </Button>
        </div>
      </div>
    </div>
  );
}
