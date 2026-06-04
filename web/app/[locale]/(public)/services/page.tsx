import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { SectionBlock } from "@/components/sections/section-block";
import { CtaBand } from "@/components/sections/cta-band";
import { ServicesPillarsGrid } from "@/components/sections/services/services-pillars-grid";
import { ServicesWorkflow } from "@/components/sections/services/services-workflow";
import { ServicesDeliverables } from "@/components/sections/services/services-deliverables";
import { ServicesMediaStrip } from "@/components/sections/services/services-media-strip";
import { ServicesPartnerships } from "@/components/sections/services/services-partnerships";
import { getServicesContent } from "@/lib/content/services";
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
    description: content.intro.lead.slice(0, 155),
    keywords: locale === "ar" ? ["خدمات", "ببليوغرافيا"] : ["services", "bibliography"],
  });
}

export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;
  const content = getServicesContent(locale);
  const isAr = locale === "ar";
  const latestMedia = await ArticleService.getLatestMedia(3).catch(() => []);

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
      <SectionBlock id="introduction" eyebrow={content.intro.eyebrow} title={content.intro.title} lead={content.intro.lead} />

      <ServicesPillarsGrid
        locale={locale}
        eyebrow={content.intro.eyebrow}
        title={isAr ? "ركائز الخدمة" : "Service Pillars"}
        items={content.pillars}
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

      <CtaBand
        quote={content.cta.quote}
        primaryHref={`/${locale}/contact`}
        primaryLabel={content.cta.primary}
        secondaryHref={`/${locale}/publish`}
        secondaryLabel={content.cta.secondary}
      />
    </ContentPageShell>
  );
}
