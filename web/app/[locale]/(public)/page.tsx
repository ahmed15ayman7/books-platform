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
import { BookCard } from "@/components/sections/book-card";
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

const ARTICLE_CHANNELS = [
  { key: "ideas",           ar: "زبدة الأفكار",  en: "Essence of Ideas", path: "ideas" },
  { key: "harvest",         ar: "حصاد الكتب",     en: "Book Harvest",     path: "harvest" },
  { key: "world-reads",     ar: "العالم يقرأ",    en: "World Reads",      path: "world-reads" },
  { key: "watch-your-book", ar: "شاهد كتابك",     en: "Watch Your Book",  path: "watch-your-book" },
  { key: "books-talk",      ar: "حديث الكتب",     en: "Books Talk",       path: "books-talk" },
  { key: "novel-story",     ar: "رواية فحكاية",   en: "Novel & Story",    path: "novel-story" },
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

  const [homeBooks, stats, articlesMap, dbSlides, categories] = await Promise.all([
    BookService.getHomeData().catch(() => ({
      newlyReleased: [],
      translated: [],
      nominated: [],
      publishers: [],
      categorySections: [],
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

  const { newlyReleased, translated, nominated, publishers, categorySections } = homeBooks;

  type ArticleSnippet = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    imageUrl: string | null;
    date: Date | null;
    channel: string | null;
  };
  const articles = articlesMap as Record<string, ArticleSnippet[]>;

  // Split category sections: first 3, then interleave "آخر الكتب المنشورة", rest
  const catsBefore = categorySections.slice(0, 3);
  const catsAfter  = categorySections.slice(3);

  // Pre-compute backgrounds for every section in render order:
  // 0: categories  1: صدر حديثًا  2-4: catsBefore  5: آخر الكتب المنشورة  6+: catsAfter
  const preDarkCount = 2 + catsBefore.length + 1 + catsAfter.length; // sections before dark publishers
  const preDarkBgs   = buildBgList(preDarkCount);

  // After dark publishers section backgrounds reset to 0
  const postDarkBgs = buildBgList(
    2 + ARTICLE_CHANNELS.length, // translated + nominated + 6 channels
  );

  let preIdx  = 0;
  let postIdx = 0;
  const preBg  = () => preDarkBgs[preIdx++]  ?? "bg-white";
  const postBg = () => postDarkBgs[postIdx++] ?? "bg-white";

  return (
    <div>
      <JsonLd data={websiteJsonLd(locale)} />
      <JsonLd data={organizationJsonLd(locale)} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <HomeHeroCarousel slides={heroSlides} locale={locale} />

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
            <BookCarousel books={newlyReleased} locale={locale} />
          </div>
        </AnimatedSection>
      )}

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
            <BookCarousel books={books} locale={locale} />
          </div>
        </AnimatedSection>
      ))}

      {/* ── آخر الكتب المنشورة ─────────────────────────────── */}
      {newlyReleased.length > 0 && (
        <AnimatedSection className={`section-spacing ${preBg()}`} aria-labelledby="latest-heading">
          <div className="container-platform">
            <FadeIn className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                id="latest-heading"
                title={locale === "ar" ? "آخر الكتب المنشورة" : "Latest Published Books"}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/books`}>
                  {locale === "ar" ? "عرض الكل" : "See All"}
                </Link>
              </Button>
            </FadeIn>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {newlyReleased.map((book) => (
                <BookCard
                  key={book.id}
                  slug={book.slug}
                  nameEn={book.nameEn}
                  nameAr={book.nameAr}
                  imageUrl={book.imageUrl}
                  translationStatus={book.translationStatus ?? undefined}
                  primaryCategory={book.primaryCategory}
                  locale={locale}
                  compact
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

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
            <BookCarousel books={books} locale={locale} />
          </div>
        </AnimatedSection>
      ))}

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
            <PublishersMarquee publishers={publishers} locale={locale} />
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
            <BookCarousel books={translated} locale={locale} />
          </div>
        </AnimatedSection>
      )}

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
            <BookCarousel books={nominated} locale={locale} />
          </div>
        </AnimatedSection>
      )}

      {/* ── Article channel sections ──────────────────────────── */}
      {ARTICLE_CHANNELS.map((ch) => {
        const channelArticles = articles[ch.key] ?? [];
        if (!channelArticles.length) return null;
        const bg = postBg();
        const [featured, ...rest] = channelArticles;
        if (!featured?.slug) return null;
        return (
          <AnimatedSection
            key={ch.key}
            className={`section-spacing ${bg}`}
            aria-labelledby={`ch-${ch.key}-heading`}
          >
            <div className="container-platform">
              <FadeIn className="mb-8 flex items-end justify-between gap-4">
                <SectionHeading
                  id={`ch-${ch.key}-heading`}
                  title={locale === "ar" ? ch.ar : ch.en}
                />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${locale}/articles/${ch.path}`}>
                    {locale === "ar" ? "عرض الكل" : "See All"}
                  </Link>
                </Button>
              </FadeIn>
              <StaggerContainer
                className={rest.length > 0 ? "grid grid-cols-1 gap-6 md:grid-cols-3" : "max-w-2xl"}
              >
                <StaggerItem className={rest.length > 0 ? "md:col-span-2" : ""}>
                  <ArticleCard
                    slug={featured.slug}
                    title={featured.title ?? ""}
                    excerpt={featured.excerpt}
                    imageUrl={featured.imageUrl}
                    date={featured.date ?? undefined}
                    channel={featured.channel ?? undefined}
                    locale={locale}
                    featured={rest.length > 0}
                  />
                </StaggerItem>
                {rest.filter((a) => !!a.slug).map((a) => (
                  <StaggerItem key={a.id}>
                    <ArticleCard
                      slug={a.slug!}
                      title={a.title ?? ""}
                      excerpt={a.excerpt}
                      imageUrl={a.imageUrl}
                      date={a.date ?? undefined}
                      channel={a.channel ?? undefined}
                      locale={locale}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </AnimatedSection>
        );
      })}

      {/* ── انشر كتابك CTA ───────────────────────────────────── */}
      <AnimatedSection className="bg-[var(--brand-red)] py-16" aria-labelledby="publish-cta-heading">
        <div className="container-platform text-center text-white">
          <div className="mx-auto max-w-xl">
            <FadeIn direction="none" delay={0.1}>
              <PenTool className="mx-auto mb-4 h-12 w-12 text-[var(--brand-red-soft)]" aria-hidden="true" />
              <h2 id="publish-cta-heading" className="font-display text-display-md font-bold">
                {t("publishBanner")}
              </h2>
              <p className="mt-2 text-[var(--brand-red-soft)]">{t("publishBannerDesc")}</p>
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

      {/* ── Stats ─────────────────────────────────────────────── */}
      <StatsCounter
        totalBooks={stats.totalBooks}
        totalPublishers={stats.totalPublishers}
        totalTranslatedBooks={stats.totalTranslatedBooks}
        totalCountries={stats.totalCountries}
        locale={locale}
      />

      {/* ── Newsletter ────────────────────────────────────────── */}
      <NewsletterStrip />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <AnimatedSection className="bg-white py-10 border-t border-[var(--brand-gray-200)]">
        <div className="container-platform">
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
