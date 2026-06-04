import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { SectionBlock } from "@/components/sections/section-block";
import { TeamGrid } from "@/components/sections/team-grid";
import { TeamQuoteBlock } from "@/components/sections/team-quote-block";
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
      <SectionBlock lead={content.intro} />

      <TeamGrid members={content.members} locale={locale} />

      <TeamQuoteBlock
        quote={content.quote}
        ctaHref={`/${locale}/contact`}
        ctaLabel={content.cta}
      />
    </ContentPageShell>
  );
}
