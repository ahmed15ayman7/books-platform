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
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsletterStrip } from "@/components/sections/newsletter-strip";
import { PublishersMarquee } from "@/components/sections/publishers-marquee";
import { PublisherCard } from "@/components/sections/publisher-card";
import { Button } from "@/components/ui/button";
import { Library, PenLine, Building2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { getHomeEditorial } from "@/lib/content/home-editorial";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { HomeMissionStrip } from "@/components/sections/home/home-mission-strip";
import { HomeMediaSpotlight } from "@/components/sections/home/home-media-spotlight";
import { HomeArticlesShowcase } from "@/components/sections/home/home-articles-showcase";
import { HomePublishSection } from "@/components/sections/home/home-publish-section";
import { HomeServicesPreview } from "@/components/sections/home/home-services-preview";
import { shuffleArray } from "@/lib/utils/shuffle";
import { resolveArticleDisplayImage } from "@/lib/articles/resolve-display-image";

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

const READING_ARTICLE_CHANNELS = [
  { key: "ideas",       ar: "زبدة الأفكار",  en: "Essence of Ideas", path: "articles/ideas" },
  { key: "harvest",     ar: "حصاد الكتب",     en: "Book Harvest",     path: "articles/harvest" },
  { key: "world-reads", ar: "العالم يقرأ",    en: "World Reads",      path: "articles/world-reads" },
] as const;

const MEDIA_HOME_CHANNELS = [
  { key: "novel-story", ar: "رواية فحكاية", en: "Novel & Story", path: "media/novel-story" },
  { key: "books-talk", ar: "حديث الكتب", en: "Books Talk", path: "media/books-talk" },
] as const;

// Alternates bg-white / bg-[#fff7f6] for each section rendered
function buildBgList(count: number, startParity = 0): string[] {
  return Array.from({ length: count }, (_, i) =>
    (i + startParity) % 2 === 0 ? "bg-white" : "bg-[#fff7f6]"
  );
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");

  const [homeBooks, articlesMap, dbSlides, categories, mediaNovel, mediaBooksTalk] =
    await Promise.all([
    BookService.getHomeData().catch(() => ({
      newlyReleased: [],
      translated: [],
      nominated: [],
      publishers: [],
      publisherGrid: [],
      categorySections: [],
    })),
    ArticleService.getFeaturedForHome().catch(() => ({})),
    HeroSlideService.listActive().catch(() => []),
    BookService.getCategories().catch(() => []),
    ArticleService.list({ page: 1, limit: 10, mediaOnly: true, channel: "novel-story", sort: "newest" }).catch(
      () => ({ articles: [] }),
    ),
    ArticleService.list({ page: 1, limit: 10, mediaOnly: true, channel: "books-talk", sort: "newest" }).catch(
      () => ({ articles: [] }),
    ),
  ]);

  const editorial = getHomeEditorial(locale);

  const mediaChannelResults = [mediaNovel, mediaBooksTalk];
  const mediaChannels = MEDIA_HOME_CHANNELS.map((ch, index) => ({
    key: ch.key,
    title: locale === "ar" ? ch.ar : ch.en,
    href: `/${locale}/${ch.path}`,
    videos: (mediaChannelResults[index]?.articles ?? [])
      .filter((a) => a.videoId)
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        videoId: a.videoId as string,
        imageUrl: a.imageUrl,
      })),
  }));

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
            imageUrl: ABOUT_IMAGES.hero,
            foregroundImageUrl: null,
            linkUrl: `/${locale}/books`,
          },
        ];

  const { newlyReleased, translated, nominated, publishers, publisherGrid = [], categorySections } = homeBooks as typeof homeBooks & {
    publisherGrid?: Array<{
      id: string;
      title: string;
      name: string;
      nameAr?: string | null;
      slug: string;
      imageUrl: string | null;
      websiteUrl: string | null;
      country: string | null;
      bookCount: number;
    }>;
  };

  type ArticleSnippet = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content?: string | null;
    imageUrl: string | null;
    date: Date | null;
    channel: string | null;
    videoId?: string | null;
    products: Array<{
      slug: string;
      nameEn: string;
      nameAr: string | null;
      imageUrl: string | null;
    }>;
  };
  const articles = articlesMap as Record<string, ArticleSnippet[]>;

  const stripExcerpt = (html: string | null) =>
    html?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() ?? null;

  const readingArticleChannels = READING_ARTICLE_CHANNELS.map((ch) => ({
    key: ch.key,
    title: locale === "ar" ? ch.ar : ch.en,
    href: `/${locale}/${ch.path}`,
    articles: shuffleArray(articles[ch.key] ?? [])
      .filter((a) => a.slug && a.title)
      .map((a) => {
        const imageUrl = resolveArticleDisplayImage({
          imageUrl: a.imageUrl,
          bookImageUrls: (a.products ?? []).map((p) => p.imageUrl),
          excerpt: a.excerpt,
          content: a.content,
        });
        if (!imageUrl) return null;
        return {
          slug: a.slug,
          title: a.title ?? "",
          excerpt: stripExcerpt(a.excerpt),
          imageUrl,
        };
      })
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .slice(0, 4),
  }));

  // Split category sections: first 3, then interleave "آخر الكتب المنشورة", rest
  const catsBefore = categorySections.slice(0, 3);
  const catsAfter  = categorySections.slice(3);

  // Pre-compute backgrounds for every section in render order:
  // 0: categories  1: صدر حديثًا  2-4: catsBefore  5: آخر الكتب المنشورة  6+: catsAfter
  const preDarkCount = 2 + catsBefore.length + catsAfter.length; // newly released + category batches before dark publishers
  const preDarkBgs   = buildBgList(preDarkCount);

  // After dark publishers section backgrounds reset to 0
  const postDarkBgs = buildBgList(
    4, // publishers grid + translated + nominated + article categories
  );

  let preIdx  = 0;
  let postIdx = 0;
  const preBg  = () => preDarkBgs[preIdx++]  ?? "bg-white";
  const postBg = () => postDarkBgs[postIdx++] ?? "bg-white";

  let carouselOrder = 0;
  const nextCarouselOrder = () => carouselOrder++;

  return (
    <div>
      <JsonLd data={websiteJsonLd(locale)} />
      <JsonLd data={organizationJsonLd(locale)} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <HomeHeroCarousel slides={heroSlides} locale={locale} pageOrder={nextCarouselOrder()} />

      <HomeMissionStrip
        locale={locale}
        quote={editorial.mission.quote}
        primaryLabel={editorial.mission.primary}
        secondaryLabel={editorial.mission.secondary}
      />

     

      {/* ── صدر حديثًا ─────────────────────────────────────── */}
      {newlyReleased.length > 0 && (
        <AnimatedSection className={`section-spacing ${preBg()}`} aria-labelledby="newly-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="newly-heading"
                title={locale === "ar" ? "صدر حديثًا" : "Newly Released"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={newlyReleased} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      )}

      {/* <HomeReaderJourney
        locale={locale}
        title={editorial.readerJourney.title}
        steps={editorial.readerJourney.steps}
      /> */}

      {/* ── Category sections — first batch ─────────────────── */}
      {catsBefore.map(({ category, books }) => (
        <AnimatedSection
          key={category.id}
          className={`section-spacing ${preBg()}`}
          aria-labelledby={`cat-${category.slug}-heading`}
        >
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id={`cat-${category.slug}-heading`}
                title={locale === "ar" && category.nameAr ? category.nameAr : category.name}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books/category/${category.slug}`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={books} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      ))}


      {/* ── Category sections — second batch ────────────────── */}
      {catsAfter.map(({ category, books }) => (
        <AnimatedSection
          key={category.id}
          className={`section-spacing ${preBg()}`}
          aria-labelledby={`cat-${category.slug}-heading`}
        >
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id={`cat-${category.slug}-heading`}
                title={locale === "ar" && category.nameAr ? category.nameAr : category.name}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books/category/${category.slug}`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={books} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      ))}
        {/* ── كتب مرشحة للترجمة ───────────────────────────────── */}
      {nominated.length > 0 && (
        <AnimatedSection className={`section-spacing ${postBg()}`} aria-labelledby="nominated-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="nominated-heading"
                title={locale === "ar" ? "كتب مرشحة للترجمة" : "Books for Translation"}
                subtitle={locale === "ar" ? "كتب تستحق أن تصل للقارئ العربي" : "Books worth translating"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books/nominated-for-translation`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={nominated} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      )}
      {/* ── كتب مترجمة ──────────────────────────────────────── */}
      {translated.length > 0 && (
        <AnimatedSection className={`section-spacing ${postBg()}`} aria-labelledby="translated-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="translated-heading"
                title={locale === "ar" ? "كتب مترجمة" : "Translated Books"}
                subtitle={locale === "ar" ? "من لغات العالم إلى العربية" : "From world languages to Arabic"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books/translated`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <BookCarousel books={translated} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      )}
            {/* ── انشر كتابك + آخر الكتب المنشورة ─────────────────── */}
            <HomePublishSection
        locale={locale}
        title={editorial.publishStrip.title}
        description={editorial.publishStrip.description}
        ctaLabel={editorial.publishStrip.cta}
        booksTitle={editorial.publishStrip.booksTitle}
        books={newlyReleased}
        pageOrder={nextCarouselOrder()}
      />

      {/* ── تصنيفات المقالات ───────────────────────────────────
      {articleCategories.length > 0 && (
        <AnimatedSection className={`section-spacing ${postBg()}`} aria-labelledby="article-cats-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="article-cats-heading"
                title={locale === "ar" ? "تصنيفات المقالات" : "Article Categories"}
                subtitle={locale === "ar" ? "تصفّح المقالات حسب التصنيف" : "Browse articles by category"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/articles/harvest`}>
                  {locale === "ar" ? "كل المقالات" : "All Articles"}
                </Link>
              </Button>
            </FadeIn>
            <StaggerContainer className="flex flex-wrap gap-3">
              {articleCategories.slice(0, 14).map((cat) => (
                <StaggerItem key={cat.id}>
                  <Link
                    href={`/${locale}/articles/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-gray-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-gray-700)] transition-all hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
                  >
                    {locale === "ar" && cat.nameAr ? cat.nameAr : cat.name}
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      )} */}

          {/* ── أقسام المقالات (زبدة الأفكار | حصاد الكتب | العالم يقرأ) ── */}
          <HomeArticlesShowcase locale={locale} channels={readingArticleChannels} />

      <HomeMediaSpotlight
        locale={locale}
        title={editorial.mediaSpotlight.title}
        channels={mediaChannels}
      />
 {/* ── تصفّح حسب التصنيف ──────────────────────────────── */}
 {categories.length > 0 && (
        <AnimatedSection className={`section-spacing ${preBg()}`} aria-labelledby="categories-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="categories-heading"
                title={locale === "ar" ? "تصفّح حسب التصنيف" : "Browse by Category"}
                subtitle={locale === "ar" ? "مجالات المعرفة والترجمات" : "Knowledge domains"}
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


      {/* ── دور النشر — dark ────────────────────────────────── */}
      {publishers.length > 0 && (
        <AnimatedSection className="py-14 bg-[var(--brand-gray-900)]" aria-labelledby="publishers-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="publishers-heading"
                title={locale === "ar" ? "دور النشر" : "Publishers"}
                subtitle={
                  locale === "ar"
                    ? "شركاؤنا من دور النشر حول العالم"
                    : "Our publishing partners worldwide"
                }
                tone="onDark"
              />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={`/${locale}/publishers`}>
                  {locale === "ar" ? "كل الناشرين" : "All Publishers"}
                </Link>
              </Button>
            </FadeIn>
            <PublishersMarquee publishers={publishers} locale={locale} pageOrder={nextCarouselOrder()} />
          </div>
        </AnimatedSection>
      )}

      {/* ── شبكة دور النشر ──────────────────────────────────── */}
      {publisherGrid.length > 0 && (
        <AnimatedSection className={`section-spacing ${postBg()}`} aria-labelledby="pub-grid-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="pub-grid-heading"
                title={locale === "ar" ? "أبرز دور النشر" : "Top Publishers"}
                subtitle={locale === "ar" ? "شركاؤنا من دور النشر حول العالم" : "Our publishing partners worldwide"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/publishers`}>
                  {locale === "ar" ? "كل الناشرين" : "All Publishers"}
                </Link>
              </Button>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {publisherGrid.map((pub) => (
                <StaggerItem key={pub.id}>
                  <PublisherCard
                    id={pub.id}
                    title={localizedPublisherName(pub, locale)}
                    slug={pub.slug}
                    imageUrl={pub.imageUrl}
                    websiteUrl={pub.websiteUrl}
                    country={pub.country}
                    locale={locale}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      )}



      <HomeServicesPreview
        locale={locale}
        title={editorial.servicesPreview.title}
        subtitle={editorial.servicesPreview.subtitle}
        cta={editorial.servicesPreview.cta}
        items={editorial.servicesPreview.items}
      />

      {/* ── Newsletter ────────────────────────────────────────── */}
      <NewsletterStrip />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <AnimatedSection className="bg-white py-10 border-t border-[var(--brand-gray-200)]">
        <div className="container-platform">
          <StaggerContainer className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
            {[
              { href: `/${locale}/books`,            icon: Library,   label: t("finalCta.browseBooks") },
              { href: `/${locale}/articles/harvest`, icon: PenLine,   label: t("finalCta.readArticles") },
              { href: `/${locale}/publishers`,        icon: Building2, label: t("finalCta.meetPublishers") },
            ].map(({ href, icon: Icon, label }) => (
              <StaggerItem key={href}>
                <Link
                  href={href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--brand-gray-200)] p-6 text-center transition-all hover:border-[var(--brand-red)] hover:shadow-md"
                >
                  <Icon className="h-10 w-10 text-[var(--brand-red)]" strokeWidth={1.5} aria-hidden="true" />
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
