import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { LegalProseLayout } from "@/components/sections/legal-prose-layout";
import { getTermsHero, getTermsLastUpdated, getTermsSections } from "@/lib/content/terms";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { localeHref, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const hero = getTermsHero(locale);
  return buildPageMetadata({
    locale,
    path: localeHref(locale, "/terms"),
    title: locale === "ar" ? "الشروط والأحكام | منصة الكتب العالمية" : "Terms & Conditions | Books Platform",
    description: hero.subtitle,
    keywords: locale === "ar" ? ["شروط", "أحكام"] : ["terms", "conditions"],
  });
}

export default async function TermsPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";
  const hero = getTermsHero(locale);
  const sections = getTermsSections(locale);
  const lastUpdated = getTermsLastUpdated(locale);

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
          { label: isAr ? "الرئيسية" : "Home", href: localeHref(locale, "/") },
          { label: hero.title },
        ],
      }}
    >
      <LegalProseLayout locale={locale} sections={sections} lastUpdated={lastUpdated} />
    </ContentPageShell>
  );
}
