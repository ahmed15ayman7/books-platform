import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { LegalProseLayout } from "@/components/sections/legal-prose-layout";
import {
  getDataDeletionHero,
  getDataDeletionLastUpdated,
  getDataDeletionSections,
} from "@/lib/content/data-deletion";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const hero = getDataDeletionHero(locale);

  return buildPageMetadata({
    locale,
    path: `/${locale}/data-deletion`,
    title: locale === "ar" ? "حذف البيانات | منصة الكتب العالمية" : "Data Deletion | Books Platform",
    description: hero.subtitle,
    keywords: locale === "ar" ? ["حذف البيانات", "خصوصية", "منصة كتب"] : ["data deletion", "privacy", "books platform"],
  });
}

export default async function DataDeletionPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";
  const hero = getDataDeletionHero(locale);

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
          { label: isAr ? "سياسة الخصوصية" : "Privacy Policy", href: `/${locale}/privacy` },
          { label: hero.title },
        ],
      }}
    >
      <LegalProseLayout
        locale={locale}
        sections={getDataDeletionSections(locale)}
        lastUpdated={getDataDeletionLastUpdated(locale)}
      />
    </ContentPageShell>
  );
}
