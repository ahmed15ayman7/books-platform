import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { SectionBlock } from "@/components/sections/section-block";
import { TeamGrid } from "@/components/sections/team-grid";
import { TeamCollageHero } from "@/components/sections/team-collage-hero";
import { TeamQuoteBlock } from "@/components/sections/team-quote-block";
import { TeamDepartments } from "@/components/sections/team-departments";
import { CtaBand } from "@/components/sections/cta-band";
import { TeamDesignCredit } from "@/components/sections/team-design-credit";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { getTeamContent } from "@/lib/content/team";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getTeamContent(locale);

  return buildPageMetadata({
    locale,
    path: `/${locale}/team`,
    title:
      locale === "ar"
        ? "فريق العمل | منصة الكتب العالمية"
        : "Our Team | Books Platform",
    description: content.intro.slice(0, 155),
    keywords:
      locale === "ar"
        ? ["فريق", "منصة كتب", "نشر"]
        : ["team", "books platform", "publishing"],
  });
}

export default async function TeamPage() {
  const locale = (await getLocale()) as Locale;
  const content = getTeamContent(locale);
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <TeamCollageHero
        locale={locale}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        members={content.members}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: content.hero.title },
        ]}
      />

      <div className="container-platform py-14 md:py-16">
        <AnimatedContentSections>
          <SectionBlock lead={content.intro} />

          <SectionBlock id="leadership" title={content.leadershipSection.title}>
            <TeamGrid members={content.members} locale={locale} filter="featured" />
          </SectionBlock>

          <SectionBlock id="team" title={content.teamSection.title}>
            <TeamGrid members={content.members} locale={locale} filter="non-featured" />
          </SectionBlock>

          <TeamDepartments
            locale={locale}
            eyebrow={content.departments.eyebrow}
            title={content.departments.title}
            items={content.departments.items}
          />

          <TeamQuoteBlock
            quote={content.quote}
            ctaHref={`/${locale}/contact`}
            ctaLabel={content.cta}
          />

          <CtaBand
            primaryHref={`/${locale}/contact`}
            primaryLabel={content.cta}
            secondaryHref={`/${locale}/about`}
            secondaryLabel={isAr ? "من نحن" : "About Us"}
          />

          <TeamDesignCredit locale={locale} />
        </AnimatedContentSections>
      </div>
    </div>
  );
}
