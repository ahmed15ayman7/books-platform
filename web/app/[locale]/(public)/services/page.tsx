import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { AboutHeroSplit } from "@/components/sections/about/about-hero-split";
import { AboutStorySplit } from "@/components/sections/about/about-story-split";
import { AboutTimeline } from "@/components/sections/about/about-timeline";
import { AboutPartnersStrip } from "@/components/sections/about/about-partners-strip";
import { AboutQuoteBand } from "@/components/sections/about/about-quote-band";
import { AboutMediaShowcase } from "@/components/sections/about/about-media-showcase";
import { AboutCta } from "@/components/sections/about/about-cta";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { ServicesPillarsGrid } from "@/components/sections/services/services-pillars-grid";
import { ServicesDeliverables } from "@/components/sections/services/services-deliverables";
import { ServicesPartnerships } from "@/components/sections/services/services-partnerships";
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
  const isAr = locale === "ar";
  const latestMedia = await ArticleService.getLatestMedia(3).catch(() => []);

  const heroImage = {
    src: ABOUT_IMAGES.hero,
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
      <AboutHeroSplit
        variant="light"
        textSize="lg"
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
          <AboutStorySplit
            id="introduction"
            locale={locale}
            eyebrow={content.intro.eyebrow}
            title={content.intro.title}
            paragraphs={content.intro.paragraphs}
            image={introImage}
            imagePosition="right"
            textSize="lg"
          />

          <ServicesPillarsGrid
            locale={locale}
            eyebrow={content.pillars.eyebrow}
            title={content.pillars.title}
            items={content.pillars.items}
          />

          <ServicesDeliverables
            locale={locale}
            eyebrow={content.deliverables.eyebrow}
            title={content.deliverables.title}
            items={content.deliverables.items}
          />

          <AboutTimeline
            id="workflow"
            eyebrow={content.workflow.eyebrow}
            title={content.workflow.title}
            steps={content.workflow.steps}
            textSize="lg"
          />

          <ServicesPartnerships
            eyebrow={content.partnerships.eyebrow}
            title={content.partnerships.title}
            items={content.partnerships.items}
          />

          <AboutPartnersStrip
            locale={locale}
            eyebrow={isAr ? "شركاؤنا" : "Our Partners"}
            title={isAr ? "دور نشر ومؤسسات ثقافية" : "Publishers & Cultural Institutions"}
            textSize="lg"
          />

          <AboutMediaShowcase
            locale={locale}
            eyebrow={content.media.eyebrow}
            title={content.media.title}
            lead={content.media.lead}
            videos={latestMedia}
            textSize="lg"
          />

          <AboutQuoteBand
            variant="light"
            textSize="lg"
            quote={content.cta.quote}
            tagline={content.hero.subtitle}
          />

          <AboutCta
            quote={content.cta.quote}
            tagline={content.hero.subtitle}
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
