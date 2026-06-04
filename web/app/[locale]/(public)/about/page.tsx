import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { AboutIntro, AboutConcept } from "@/components/sections/about/about-intro";
import { AboutValuesGrid } from "@/components/sections/about/about-values-grid";
import { AboutUniqueness, AboutEfforts } from "@/components/sections/about/about-uniqueness";
import { AboutCta } from "@/components/sections/about/about-cta";
import { getAboutContent } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getAboutContent(locale);
  const description = content.intro.paragraphs[0]?.slice(0, 155) ?? "";

  return buildPageMetadata({
    locale,
    path: `/${locale}/about`,
    title:
      locale === "ar"
        ? "من نحن | منصة الكتب العالمية"
        : "About Us | Books Platform",
    description,
    keywords:
      locale === "ar"
        ? ["من نحن", "منصة كتب", "ترجمة", "قراءة"]
        : ["about", "books platform", "translation", "Arab readers"],
  });
}

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const content = getAboutContent(locale);
  const isAr = locale === "ar";

  return (
    <ContentPageShell
      locale={locale}
      hero={{
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        variant: "dark",
        size: "lg",
        breadcrumbs: [
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: content.hero.title },
        ],
      }}
    >
      <AboutIntro
        eyebrow={content.intro.eyebrow}
        title={content.intro.title}
        paragraphs={content.intro.paragraphs}
      />

      <AboutConcept
        eyebrow={content.concept.eyebrow}
        title={content.concept.title}
        paragraphs={content.concept.paragraphs}
      />

      <AboutValuesGrid
        locale={locale}
        eyebrow={content.values.eyebrow}
        title={content.values.title}
        items={content.values.items}
      />

      <AboutUniqueness
        eyebrow={content.unique.eyebrow}
        title={content.unique.title}
        items={content.unique.items}
      />

      <AboutEfforts
        eyebrow={content.efforts.eyebrow}
        title={content.efforts.title}
        items={content.efforts.items}
      />

      <AboutCta
        quote={content.closing.quote}
        tagline={content.closing.tagline}
        primaryHref={`/${locale}/books`}
        primaryLabel={content.cta.primary}
        secondaryHref={`/${locale}/publish`}
        secondaryLabel={content.cta.secondary}
      />
    </ContentPageShell>
  );
}
