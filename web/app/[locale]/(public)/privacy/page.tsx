import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { LegalProseLayout } from "@/components/sections/legal-prose-layout";
import {
  getPrivacyHero,
  getPrivacyLastUpdated,
  getPrivacySections,
} from "@/lib/content/privacy";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const hero = getPrivacyHero(locale);

  return buildPageMetadata({
    locale,
    path: `/${locale}/privacy`,
    title:
      locale === "ar"
        ? "سياسة الخصوصية | منصة الكتب العالمية"
        : "Privacy Policy | Books Platform",
    description: hero.subtitle,
    keywords:
      locale === "ar"
        ? ["خصوصية", "بيانات", "منصة كتب"]
        : ["privacy", "data", "books platform"],
  });
}

export default async function PrivacyPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";
  const hero = getPrivacyHero(locale);
  const sections = getPrivacySections(locale);
  const lastUpdated = getPrivacyLastUpdated(locale);

  return (
    <ContentPageShell
      locale={locale}
      hero={{
        title: hero.title,
        subtitle: hero.subtitle,
        variant: "light",
        size: "md",
        backgroundImage: ABOUT_IMAGES.legal,
        backgroundImageAlt: hero.title,
        breadcrumbs: [
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: hero.title },
        ],
      }}
    >
      <LegalProseLayout
        locale={locale}
        sections={sections}
        lastUpdated={lastUpdated}
      />
    </ContentPageShell>
  );
}
