import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { ArticleCard } from "@/components/sections/article-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";
import readingTime from "reading-time";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const article = await ArticleService.getBySlug(slug).catch(() => null);
  if (!article) return { title: "Article Not Found" };
  return buildPageMetadata({
    locale,
    path: `/${locale}/articles/${slug}`,
    title: article.title,
    description: article.excerpt ?? article.title,
    imageUrl: article.imageUrl,
    type: "article",
    keywords: [article.title, locale === "ar" ? "مقالات" : "articles"],
  });
}

const channelNames: Record<string, { ar: string; en: string; path: string }> = {
  harvest: { ar: "حصاد الكتب", en: "Book Harvest", path: "harvest" },
  ideas: { ar: "زبدة الأفكار", en: "Essence of Ideas", path: "ideas" },
  "world-reads": { ar: "العالم يقرأ", en: "World Reads", path: "world-reads" },
  "books-talk": { ar: "حديث الكتب", en: "Book Talk", path: "books-talk" },
  "watch-your-book": { ar: "شاهد كتابك", en: "Watch Your Book", path: "watch-your-book" },
  "novel-story": { ar: "رواية فحكاية", en: "Novel & Story", path: "novel-story" },
};

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const [article, related] = await Promise.all([
    ArticleService.getBySlug(slug).catch(() => null),
    ArticleService.getRelated(slug, 3).catch(() => []),
  ]);

  if (!article) notFound();

  const channelInfo = article.channel ? channelNames[article.channel] : null;
  const channelLabel = channelInfo
    ? locale === "ar"
      ? channelInfo.ar
      : channelInfo.en
    : null;

  const rt = article.content ? readingTime(article.content) : null;
  const readingTimeMin = rt ? Math.ceil(rt.minutes) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: article.imageUrl,
    datePublished: article.date?.toISOString(),
    description: article.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[var(--brand-gray-50)]">
        {/* Hero Image */}
        {article.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden bg-[var(--brand-gray-200)] md:h-96">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          </div>
        )}

        <div className="container-platform py-8">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--brand-gray-500)]">
              <Link href={`/${locale}`} className="hover:text-[var(--brand-red)]">
                {locale === "ar" ? "الرئيسية" : "Home"}
              </Link>
              {channelInfo && (
                <>
                  <span>/</span>
                  <Link
                    href={`/${locale}/articles/${channelInfo.path}`}
                    className="hover:text-[var(--brand-red)]"
                  >
                    {channelLabel}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-[var(--brand-gray-700)] truncate max-w-[200px]">
                {article.title}
              </span>
            </nav>

            {/* Channel badge */}
            {channelLabel && (
              <Badge variant="default" className="mb-3">
                {channelLabel}
              </Badge>
            )}

            {/* Title */}
            <h1 className="font-display text-display-sm font-black text-[var(--brand-gray-900)] text-balance leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--brand-gray-500)]">
              {article.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {formatDate(article.date, locale)}
                </span>
              )}
              {readingTimeMin && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {readingTimeMin} {locale === "ar" ? "دقيقة قراءة" : "min read"}
                </span>
              )}
              {(article.authorFirstName ?? article.authorLastName) && (
                <span>
                  {locale === "ar" ? "بقلم: " : "By: "}
                  {[article.authorFirstName, article.authorLastName].filter(Boolean).join(" ")}
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="my-6 border-[var(--brand-gray-200)]" />

            {/* Article content */}
            {article.content ? (
              <div
                className="prose-brand text-[var(--brand-gray-800)]"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : article.excerpt ? (
              <p className="text-[var(--brand-gray-700)] leading-relaxed text-lg">
                {article.excerpt}
              </p>
            ) : null}

            {/* Comments Section */}
            <section className="mt-12" aria-labelledby="comments-heading">
              <h2 id="comments-heading" className="mb-4 font-bold text-[var(--brand-gray-900)]">
                {locale === "ar" ? "التعليقات" : "Comments"}
              </h2>
              {article.comments.length === 0 ? (
                <p className="text-sm text-[var(--brand-gray-500)]">
                  {locale === "ar" ? "لا توجد تعليقات بعد" : "No comments yet"}
                </p>
              ) : (
                <div className="space-y-4">
                  {article.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg bg-white p-4 shadow-sm border border-[var(--brand-gray-200)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-[var(--brand-gray-900)]">
                          {comment.authorName}
                        </span>
                        {comment.commentDate && (
                          <span className="text-xs text-[var(--brand-gray-400)]">
                            {formatDate(comment.commentDate, locale, "PP")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--brand-gray-700)]">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="related-heading">
              <div className="mx-auto max-w-5xl">
                <SectionHeading
                  id="related-heading"
                  title={locale === "ar" ? "مقالات ذات صلة" : "Related Articles"}
                  className="mb-6"
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {related.map((art) => (
                    <ArticleCard
                      key={art.id}
                      {...art}
                      date={art.date ?? undefined}
                      channel={art.channel ?? undefined}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
