import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { RelatedBooksSection } from "@/components/sections/related-books-section";
import { ArticleDetailSidebar } from "@/components/sections/article-detail-sidebar";
import { ArticleShareStrip } from "@/components/sections/article-share-strip";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { articleSeoMetadata } from "@/lib/seo/metadata";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/media/youtube";
import { AdminEntityPublicShell } from "@/components/admin/admin-entity-public-shell";
import { isMediaChannel } from "@/lib/media/youtube";
import { mediaHubHref, mediaNavLabel } from "@/lib/nav/site-nav";
import { adminArticleEditPath, adminArticleViewPath } from "@/lib/admin/public-urls";
import { ArticleDetailHero } from "@/components/sections/article-detail-hero";
import { ArticleContent } from "@/lib/markdown/article-content";
import { ArticleCommentsSection } from "@/components/sections/article-comments-section";
import { articleLinkedBookDisplay } from "@/lib/i18n/article-linked-book";
import { resolveArticleDisplayImage } from "@/lib/articles/resolve-display-image";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const article = await ArticleService.getBySlug(slug).catch(() => null);
  if (!article) return { title: "Article Not Found" };
  return articleSeoMetadata(locale, {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    date: article.date,
  });
}

const channelNames: Record<string, { ar: string; en: string; path: string }> = {
  harvest: { ar: "حصاد الكتب", en: "Book Harvest", path: "harvest" },
  ideas: { ar: "زبدة الأفكار", en: "Essence of Ideas", path: "ideas" },
  "world-reads": { ar: "العالم يقرأ", en: "World Reads", path: "world-reads" },
  "books-talk": { ar: "حديث الكتب", en: "Book Talk", path: "books-talk" },
  "novel-story": { ar: "رواية فحكاية", en: "Novel & Story", path: "novel-story" },
};

function stripHtml(html: string | null | undefined): string {
  return html?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() ?? "";
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const article = await ArticleService.getBySlug(slug).catch(() => null);
  if (!article) notFound();

  const sidebarResult = await ArticleService.list({
    channel: article.channel ?? undefined,
    page: 1,
    limit: 10,
    sort: "newest",
    mediaOnly: isMediaChannel(article.channel),
  }).catch(() => ({ articles: [] }));

  const sidebarArticles = sidebarResult.articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 6)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      imageUrl: a.imageUrl,
      excerpt: a.excerpt,
      products: a.products?.map((p) => ({ imageUrl: p.imageUrl })),
    }));

  const channelInfo = article.channel ? channelNames[article.channel] : null;
  const channelLabel = channelInfo
    ? locale === "ar"
      ? channelInfo.ar
      : channelInfo.en
    : null;

  const intro = stripHtml(article.excerpt);
  const isMedia = isMediaChannel(article.channel);
  const articleUrl = `https://booksplatform.net/${locale}/articles/${article.slug}`;

  const linkedBook = articleLinkedBookDisplay(article.products?.[0], locale);
  const heroCoverUrl =
    resolveArticleDisplayImage({
      imageUrl: linkedBook?.imageUrl ?? article.imageUrl,
      bookImageUrls: article.products?.map((p) => p.imageUrl),
      excerpt: article.excerpt,
      content: article.content,
    }) ?? null;
  const heroCoverAlt = linkedBook?.name ?? article.title;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      image: article.imageUrl?.split(",")[0] ?? article.imageUrl,
      datePublished: article.date?.toISOString(),
      description: article.excerpt,
    },
  ];

  if (article.videoId) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: article.title,
      description: article.excerpt ?? article.title,
      thumbnailUrl: youtubeThumbnail(article.videoId),
      embedUrl: youtubeEmbedUrl(article.videoId),
      uploadDate: article.date?.toISOString(),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd) }}
      />
      <AdminEntityPublicShell
        entityType={isMedia ? "media" : "article"}
        entityId={article.id}
        editHref={adminArticleEditPath(locale, article.id, article.channel)}
        adminViewHref={adminArticleViewPath(locale, article.id, article.channel)}
        publicHref={`/${locale}/articles/${article.slug}`}
        title={article.title}
      >
        <div className="min-h-screen bg-white pb-20">
          <ArticleDetailHero
            locale={locale}
            title={locale === "ar" ? article.title : article.titleEn ?? article.title}
            coverUrl={heroCoverUrl}
            coverAlt={heroCoverAlt}
          />

          <div className="container-platform py-8 md:py-10">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--brand-gray-500)]">
              <Link href={`/${locale}`} className="hover:text-[var(--brand-red)]">
                {locale === "ar" ? "الرئيسية" : "Home"}
              </Link>
              {channelInfo && (
                <>
                  <span aria-hidden="true">/</span>
                  {isMedia ? (
                    <>
                      <Link href={mediaHubHref(locale)} className="hover:text-[var(--brand-red)]">
                        {mediaNavLabel(locale)}
                      </Link>
                      <span aria-hidden="true">/</span>
                      <Link
                        href={`/${locale}/media/${channelInfo.path}`}
                        className="hover:text-[var(--brand-red)]"
                      >
                        {channelLabel}
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/${locale}/articles/${channelInfo.path}`}
                      className="hover:text-[var(--brand-red)]"
                    >
                      {channelLabel}
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
              <main className="min-w-0">
                {(intro || article.date) && (
                  <header className="mb-8">
                    {intro && (
                      <p className="text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg">
                        {intro}
                      </p>
                    )}

                    {article.date && (
                      <p
                        className={cn(
                          "flex items-center gap-1.5 text-sm text-[var(--brand-gray-500)]",
                          intro && "mt-4",
                        )}
                      >
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        {formatDate(article.date, locale)}
                        {(article.authorFirstName ?? article.authorLastName) && (
                          <>
                            <span className="mx-1">·</span>
                            {[article.authorFirstName, article.authorLastName].filter(Boolean).join(" ")}
                          </>
                        )}
                      </p>
                    )}
                  </header>
                )}

                {article.videoId && (
                  <div className="mb-8">
                    <YoutubeEmbed videoId={article.videoId} title={article.title} />
                  </div>
                )}

                {article.content ? (
                  <ArticleContent content={locale === "ar" ? article.content : article.contentEn ?? article.content} />
                ) : intro ? null : (
                  <p className="text-base leading-relaxed text-[var(--brand-gray-700)]">{intro}</p>
                )}

                <ArticleShareStrip locale={locale} url={articleUrl} title={article.title} />

                {article.products && article.products.length > 0 && (
                  <RelatedBooksSection locale={locale} books={article.products} />
                )}

                <ArticleCommentsSection
                  articleId={article.id}
                  locale={locale}
                  initialComments={article.comments.map((comment) => ({
                    id: comment.id,
                    authorName: comment.authorName,
                    content: comment.content,
                    commentDate: comment.commentDate,
                  }))}
                />
              </main>

              <ArticleDetailSidebar locale={locale} articles={sidebarArticles} className="lg:sticky lg:top-24" />
            </div>
          </div>
        </div>
      </AdminEntityPublicShell>
    </>
  );
}
