import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { AboutHeroSplit } from "@/components/sections/about/about-hero-split";
import { AboutStorySplit } from "@/components/sections/about/about-story-split";
import { AboutGalleryStrip } from "@/components/sections/about/about-gallery-strip";
import { AboutStatsBand } from "@/components/sections/about/about-stats-band";
import { AboutValuesGrid } from "@/components/sections/about/about-values-grid";
import { AboutTimeline } from "@/components/sections/about/about-timeline";
import { AboutMediaShowcase } from "@/components/sections/about/about-media-showcase";
import { AboutTeamPreview } from "@/components/sections/about/about-team-preview";
import { AboutCta } from "@/components/sections/about/about-cta";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { getAboutContent } from "@/lib/content/about";
import { TEAM_MEMBERS } from "@/lib/content/team";
import { BookService } from "@/server/services/book.service";
import { ArticleService } from "@/server/services/article.service";
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

  const [stats, latestMedia] = await Promise.all([
    BookService.getStats().catch(() => ({
      totalBooks: 0,
      totalPublishers: 0,
      totalTranslatedBooks: 0,
      totalCountries: 0,
    })),
    ArticleService.getLatestMedia(3).catch(() => []),
  ]);

  const teamMembers = TEAM_MEMBERS.filter((m) =>
    content.teamPreview.memberSlugs.includes(m.slug),
  );

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <AboutHeroSplit
        locale={locale}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={content.hero.image}
        primaryHref={`/${locale}/books`}
        primaryLabel={content.cta.primary}
        secondaryHref={`/${locale}/services`}
        secondaryLabel={locale === "ar" ? "خدماتنا" : "Our Services"}
      />

      <div className="container-platform py-14 md:py-16">
        <AnimatedContentSections>
          <AboutStorySplit
            id="introduction"
            eyebrow={content.intro.eyebrow}
            title={content.intro.title}
            paragraphs={content.intro.paragraphs}
            image={content.intro.image}
            imagePosition={content.intro.imagePosition}
            locale={locale}
          />

          <AboutStatsBand locale={locale} {...stats} />

          <AboutValuesGrid
            locale={locale}
            eyebrow={content.values.eyebrow}
            title={content.values.title}
            items={content.values.items}
          />

          <AboutGalleryStrip
            eyebrow={locale === "ar" ? "معرض" : "Gallery"}
            title={locale === "ar" ? "رحلة المعرفة" : "Knowledge Journey"}
            items={content.storyGallery}
            locale={locale}
          />

          <AboutStorySplit
            id="concept"
            eyebrow={content.concept.eyebrow}
            title={content.concept.title}
            paragraphs={content.concept.paragraphs}
            image={content.concept.image}
            imagePosition={content.concept.imagePosition}
            locale={locale}
          />

          <AboutTimeline
            id="unique"
            eyebrow={content.unique.eyebrow}
            title={content.unique.title}
            items={content.unique.items}
          />

          <AboutTimeline
            id="efforts"
            eyebrow={content.efforts.eyebrow}
            title={content.efforts.title}
            items={content.efforts.items}
          />

          <AboutMediaShowcase
            locale={locale}
            eyebrow={content.mediaSection.eyebrow}
            title={content.mediaSection.title}
            lead={content.mediaSection.lead}
            videos={latestMedia}
          />

          <AboutTeamPreview
            locale={locale}
            eyebrow={content.teamPreview.eyebrow}
            title={content.teamPreview.title}
            members={teamMembers}
          />

          <AboutCta
            quote={content.closing.quote}
            tagline={content.closing.tagline}
            primaryHref={`/${locale}/books`}
            primaryLabel={content.cta.primary}
            secondaryHref={`/${locale}/publish`}
            secondaryLabel={content.cta.secondary}
          />
        </AnimatedContentSections>
      </div>
    </div>
  );
}
