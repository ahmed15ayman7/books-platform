import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { CtaBand } from "@/components/sections/cta-band";
import { ServicesHeroSplit } from "@/components/sections/services/services-hero-split";
import { ServicesIntroSplit } from "@/components/sections/services/services-intro-split";
import { ServicesPillarsGrid } from "@/components/sections/services/services-pillars-grid";
import { ServicesWorkflow } from "@/components/sections/services/services-workflow";
import { ServicesDeliverables } from "@/components/sections/services/services-deliverables";
import { ServicesMediaStrip } from "@/components/sections/services/services-media-strip";
import { ServicesPartnerships } from "@/components/sections/services/services-partnerships";
import { ServicesQuoteBand } from "@/components/sections/services/services-quote-band";
import { getServicesContent } from "@/lib/content/services";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { ArticleService } from "@/server/services/article.service";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getServicesContent(locale);
  return buildPageMetadata({
    locale,
    path: `/${locale}/services`,
    title: locale === "ar" ? "خدماتنا | منصة الكتب العالمية" : "Our Services | Books Platform",
    description: content.intro.paragraphs[0]?.slice(0, 155) ?? "",
    keywords: locale === "ar" ? ["خدمات", "ببليوغرافيا"] : ["services", "bibliography"],
  });
}

export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;
  const content = getServicesContent(locale);
  const latestMedia = await ArticleService.getLatestMedia(3).catch(() => []);

  const heroImage = {
    src: ABOUT_IMAGES.concept,
    alt: {
      ar: "خدمات منصة الكتب",
      en: "Books Platform services",
    },
  };

  const introImage = {
    src: ABOUT_IMAGES.intro,
    alt: {
      ar: "محتوى وخدمات ثقافية",
      en: "Cultural content and services",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <ServicesHeroSplit
        locale={locale}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={heroImage}
        primaryHref={`/${locale}/contact`}
        primaryLabel={content.cta.primary}
        secondaryHref={`/${locale}/publish`}
        secondaryLabel={content.cta.secondary}
      />

      <div className="container-platform py-14 md:py-16">
        <AnimatedContentSections>
          <ServicesIntroSplit
            id="introduction"
            locale={locale}
            eyebrow={content.intro.eyebrow}
            title={content.intro.title}
            paragraphs={content.intro.paragraphs}
            image={introImage}
            imagePosition="right"
          />

          <ServicesPillarsGrid
            locale={locale}
            eyebrow={content.pillars.eyebrow}
            title={content.pillars.title}
            items={content.pillars.items}
          />

          <ServicesWorkflow
            eyebrow={content.workflow.eyebrow}
            title={content.workflow.title}
            steps={content.workflow.steps}
          />

          <ServicesDeliverables
            eyebrow={content.deliverables.eyebrow}
            title={content.deliverables.title}
            items={content.deliverables.items}
          />

          <ServicesMediaStrip
            locale={locale}
            eyebrow={content.media.eyebrow}
            title={content.media.title}
            lead={content.media.lead}
            videos={latestMedia}
          />

          <ServicesPartnerships
            eyebrow={content.partnerships.eyebrow}
            title={content.partnerships.title}
            items={content.partnerships.items}
          />

          <ServicesQuoteBand quote={content.cta.quote} />

          <CtaBand
            primaryHref={`/${locale}/contact`}
            primaryLabel={content.cta.primary}
            secondaryHref={`/${locale}/publish`}
            secondaryLabel={content.cta.secondary}
          />
        </AnimatedContentSections>
      </div>
    </div>
  );
}
