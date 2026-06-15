import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { CatalogCollageHero } from "@/components/sections/catalog-collage-hero";
import { AboutStorySplit } from "@/components/sections/about/about-story-split";
import { AboutGalleryStrip } from "@/components/sections/about/about-gallery-strip";
import { AboutValuesGrid } from "@/components/sections/about/about-values-grid";
import { AboutTimeline } from "@/components/sections/about/about-timeline";
import { AboutUniquenessSplit } from "@/components/sections/about/about-uniqueness-split";
import { AboutPartnersStrip } from "@/components/sections/about/about-partners-strip";
import { AboutQuoteBand } from "@/components/sections/about/about-quote-band";
import { AboutMediaShowcase } from "@/components/sections/about/about-media-showcase";
import { AboutTeamPreview } from "@/components/sections/about/about-team-preview";
import { AboutCta } from "@/components/sections/about/about-cta";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { Button } from "@/components/ui/button";
import { getAboutContent } from "@/lib/content/about";
import { pickLocale } from "@/lib/content/types";
import { TEAM_MEMBERS } from "@/lib/content/team";
import { ArticleService } from "@/server/services/article.service";
import { localeHref, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getAboutContent(locale);
  const description = content.intro.paragraphs[0]?.slice(0, 155) ?? "";

  return buildPageMetadata({
    locale,
    path: localeHref(locale, "/about"),
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

  const latestMedia = await ArticleService.getLatestMedia(3).catch(() => []);

  const teamMembers = TEAM_MEMBERS.filter((m) =>
    content.teamPreview.memberSlugs.includes(m.slug),
  );

  const heroCovers = content.hero.images.map((img) => ({
    src: img.src,
    alt: pickLocale(img.alt, locale),
  }));

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <CatalogCollageHero
        locale={locale}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        covers={heroCovers}
        variant="translated"
        coverMode="photo"
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: localeHref(locale, "/") },
          { label: content.hero.title },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={localeHref(locale, "/books")}>{content.cta.primary}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-[var(--brand-red)]"
          >
            <Link href={localeHref(locale, "/services")}>
              {isAr ? "خدماتنا" : "Our Services"}
            </Link>
          </Button>
        </div>
      </CatalogCollageHero>

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

          <AboutValuesGrid
            locale={locale}
            eyebrow={content.values.eyebrow}
            title={content.values.title}
            items={content.values.items}
          />

          <AboutGalleryStrip
            eyebrow={isAr ? "معرض" : "Gallery"}
            title={isAr ? "رحلة المعرفة" : "Knowledge Journey"}
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

          <AboutUniquenessSplit
            eyebrow={content.unique.eyebrow}
            title={content.unique.title}
            items={content.unique.items}
            locale={locale}
          />

          <AboutTimeline
            id="efforts"
            eyebrow={content.efforts.eyebrow}
            title={content.efforts.title}
            items={content.efforts.items}
          />

          <AboutPartnersStrip
            locale={locale}
            eyebrow={content.partnersSection.eyebrow}
            title={content.partnersSection.title}
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

          <AboutQuoteBand quote={content.closing.quote} tagline={content.closing.tagline} />

          <AboutCta
            quote={content.closing.quote}
            tagline={content.closing.tagline}
            primaryHref={localeHref(locale, "/books")}
            primaryLabel={content.cta.primary}
            secondaryHref={localeHref(locale, "/publish")}
            secondaryLabel={content.cta.secondary}
          />
        </AnimatedContentSections>
      </div>
    </div>
  );
}
