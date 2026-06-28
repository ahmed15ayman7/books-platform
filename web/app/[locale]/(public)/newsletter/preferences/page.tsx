import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { NewsletterPreferencesClient } from "./preferences-client";

export const metadata: Metadata = { robots: "noindex, nofollow" };

export default async function NewsletterPreferencesPage() {
  const locale = (await getLocale()) as Locale;
  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)] py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Suspense fallback={<div className="py-16 text-center text-[var(--brand-gray-500)]">جاري التحميل…</div>}>
          <NewsletterPreferencesClient locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
