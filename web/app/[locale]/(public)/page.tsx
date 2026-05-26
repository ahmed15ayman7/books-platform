import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { BookService } from "@/server/services/book.service";
import { ArticleService } from "@/server/services/article.service";
import { HomeHeroCarousel } from "@/components/sections/home-hero-carousel";
import { HeroSlideService } from "@/server/services/hero-slide.service";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd, websiteJsonLd, organizationJsonLd } from "@/components/seo/json-ld";
import { BookCarousel } from "@/components/sections/book-carousel";
import { CategoryGrid } from "@/components/sections/category-grid";
import { ArticleCard } from "@/components/sections/article-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsCounter } from "@/components/sections/stats-counter";
import { NewsletterStrip } from "@/components/sections/newsletter-strip";
import { PublishersMarquee } from "@/components/sections/publishers-marquee";
import { Button } from "@/components/ui/button";
import { PenTool, Library, PenLine, Building2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  return buildPageMetadata({
    locale,
    path: `/${locale}`,
    title:
      locale === "ar"
        ? "منصة الكتب العالمية — نافذة العالم على الكتب"
        : "Books Platform — Window to World Books",
    description: t("heroSubtitle"),
    keywords:
      locale === "ar"
        ? ["كتب", "ترجمة", "ناشرون", "مقالات"]
        : ["books", "translation", "publishers", "articles"],
  });
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const tArticles = await getTranslations("articles");

  const [
    { newlyReleased, sponsoredPublishers },
    stats,
    articlesByChannel,
    dbSlides,
    categories,
  ] = await Promise.all([
    BookService.getFeaturedForHome().catch(() => ({
      newlyReleased: [],
      sponsoredPublishers: [],
    })),
    BookService.getStats().catch(() => ({
      totalBooks: 0,
      totalPublishers: 0,
      totalTranslatedBooks: 0,
      totalCountries: 0,
    })),
    ArticleService.getFeaturedForHome().catch(() => ({})),
    HeroSlideService.listActive().catch(() => []),
    BookService.getCategories().catch(() => []),
  ]);

  const heroSlides =
    dbSlides.length > 0
      ? dbSlides
      : [
          {
            id: "default",
            titleAr: t("heroTitle"),
            titleEn: t("heroTitle"),
            subtitleAr: t("heroSubtitle"),
            subtitleEn: t("heroSubtitle"),
            imageUrl:
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80",
            foregroundImageUrl: null,
            linkUrl: `/${locale}/books`,
          },
        ];

  const publishers = sponsoredPublishers.map((sp) => sp.publisher);
  const articlesByChannelTyped = articlesByChannel as Record<
    string,
    {
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      imageUrl: string | null;
      date: Date | null;
      channel: string | null;
    } | null
  >;
  const harvestArticle = articlesByChannelTyped["harvest"];
  const ideasArticle = articlesByChannelTyped["ideas"];
  const booksTalkArticle = articlesByChannelTyped["books-talk"];
  const watchArticle = articlesByChannelTyped["watch-your-book"];

  return (
    <div>
      <JsonLd data={websiteJsonLd(locale)} />
      <JsonLd data={organizationJsonLd(locale)} />

      {/* Hero carousel — no animation delay */}
      <HomeHeroCarousel slides={heroSlides} locale={locale} />

      {/* Categories */}
      {categories.length > 0 && (
        <AnimatedSection
          className="section-spacing bg-white"
          aria-labelledby="categories-heading"
        >
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="categories-heading"
                title={locale === "ar" ? "تصفّح حسب التصنيف" : "Browse by Category"}
                subtitle={
                  locale === "ar"
                    ? "مجالات المعرفة والترجمات"
                    : "Knowledge domains and translations"
                }
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books`}>
                  {locale === "ar" ? "كل الكتب" : "All Books"}
                </Link>
              </Button>
            </FadeIn>
            <CategoryGrid categories={categories} locale={locale} />
          </div>
        </AnimatedSection>
      )}

      {/* Newly Released */}
      {newlyReleased.length > 0 && (
        <AnimatedSection
          className="section-spacing bg-white"
          delay={0.05}
          aria-labelledby="newly-released-heading"
        >
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="newly-released-heading"
                title={t("newlyReleased")}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={newlyReleased} locale={locale} />
          </div>
        </AnimatedSection>
      )}

      {/* Harvest Articles */}
      {harvestArticle && (
        <AnimatedSection
          className="section-spacing bg-[var(--brand-gray-50)]"
          aria-labelledby="harvest-heading"
        >
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading id="harvest-heading" title={tArticles("harvest")} />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/articles/harvest`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StaggerItem className="md:col-span-2">
                <ArticleCard
                  {...harvestArticle}
                  date={harvestArticle.date ?? undefined}
                  channel={harvestArticle.channel ?? undefined}
                  locale={locale}
                  featured
                />
              </StaggerItem>
              {ideasArticle && (
                <StaggerItem>
                  <ArticleCard
                    {...ideasArticle}
                    date={ideasArticle.date ?? undefined}
                    channel={ideasArticle.channel ?? undefined}
                    locale={locale}
                  />
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      )}

      {/* Publishers Spotlight */}
      {publishers.length > 0 && (
        <AnimatedSection className="py-10 bg-white" aria-labelledby="publishers-heading">
          <div className="container-platform">
            <FadeIn className="mb-6 flex items-end justify-between gap-4">
              <SectionHeading
                id="publishers-heading"
                title={t("publishersSpotlight")}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/publishers`}>
                  {locale === "ar" ? "كل الناشرين" : "All Publishers"}
                </Link>
              </Button>
            </FadeIn>
            <PublishersMarquee publishers={publishers} locale={locale} />
          </div>
        </AnimatedSection>
      )}

      {/* Media */}
      {(booksTalkArticle ?? watchArticle) && (
        <AnimatedSection
          className="section-spacing bg-[var(--brand-gray-50)]"
          aria-labelledby="media-heading"
        >
          <div className="container-platform">
            <FadeIn className="mb-8">
              <SectionHeading
                id="media-heading"
                title={locale === "ar" ? "الإنتاج الإعلامي" : "Media Creations"}
              />
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {watchArticle && (
                <StaggerItem>
                  <ArticleCard
                    {...watchArticle}
                    date={watchArticle.date ?? undefined}
                    channel={watchArticle.channel ?? undefined}
                    locale={locale}
                  />
                </StaggerItem>
              )}
              {booksTalkArticle && (
                <StaggerItem>
                  <ArticleCard
                    {...booksTalkArticle}
                    date={booksTalkArticle.date ?? undefined}
                    channel={booksTalkArticle.channel ?? undefined}
                    locale={locale}
                  />
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      )}

      {/* Publish CTA Banner */}
      <AnimatedSection
        className="bg-[var(--brand-red)] py-16"
        aria-labelledby="publish-cta-heading"
      >
        <div className="container-platform text-center text-white">
          <div className="mx-auto max-w-xl">
            <FadeIn direction="none" delay={0.1}>
              <PenTool
                className="mx-auto mb-4 h-12 w-12 text-[var(--brand-red-soft)]"
                aria-hidden="true"
              />
              <h2
                id="publish-cta-heading"
                className="font-display text-display-md font-bold"
              >
                {t("publishBanner")}
              </h2>
              <p className="mt-2 text-[var(--brand-red-soft)]">
                {t("publishBannerDesc")}
              </p>
              <Button
                asChild
                size="xl"
                className="mt-6 bg-white text-[var(--brand-red)] hover:bg-[var(--brand-gray-100)]"
              >
                <Link href={`/${locale}/publish`}>
                  {locale === "ar" ? "انشر كتابك الآن" : "Publish Your Book Now"}
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <StatsCounter
        totalBooks={stats.totalBooks}
        totalPublishers={stats.totalPublishers}
        totalTranslatedBooks={stats.totalTranslatedBooks}
        totalCountries={stats.totalCountries}
        locale={locale}
      />

      {/* Newsletter */}
      <NewsletterStrip />

      {/* Final CTA */}
      <AnimatedSection className="bg-white py-10 border-t border-[var(--brand-gray-200)]">
        <div className="container-platform">
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                href: `/${locale}/books`,
                icon: Library,
                label: t("finalCta.browseBooks"),
              },
              {
                href: `/${locale}/articles/harvest`,
                icon: PenLine,
                label: t("finalCta.readArticles"),
              },
              {
                href: `/${locale}/publishers`,
                icon: Building2,
                label: t("finalCta.meetPublishers"),
              },
            ].map(({ href, icon: Icon, label }) => (
              <StaggerItem key={href}>
                <Link
                  href={href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--brand-gray-200)] p-6 text-center transition-all hover:border-[var(--brand-red)] hover:shadow-md"
                >
                  <Icon
                    className="h-10 w-10 text-[var(--brand-red)]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)]">
                    {label}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </AnimatedSection>
    </div>
  );
}
