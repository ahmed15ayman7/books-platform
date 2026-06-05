"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { AnimatedSection, FadeIn } from "@/components/motion";

export interface HomeArticleItem {
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string;
}

export interface HomeArticleChannel {
  key: string;
  title: string;
  href: string;
  articles: HomeArticleItem[];
}

interface HomeArticlesShowcaseProps {
  locale: Locale;
  channels: HomeArticleChannel[];
}

function ArticleTitleBar({
  title,
  className,
  compact,
  onExpand,
  expandLabel,
}: {
  title: string;
  className?: string;
  compact?: boolean;
  onExpand?: () => void;
  expandLabel?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[44px] items-stretch overflow-hidden bg-[var(--brand-gray-900)]",
        className,
      )}
    >
      <p
        className={cn(
          "flex flex-1 items-center px-3 py-2 font-semibold leading-snug text-white",
          compact ? "text-xs line-clamp-2" : "text-sm line-clamp-2 sm:text-base",
        )}
      >
        {title}
      </p>
      {onExpand ? (
        <button
          type="button"
          onClick={onExpand}
          className="flex w-10 shrink-0 items-center justify-center bg-[var(--brand-red)] transition-colors hover:bg-[var(--brand-red-hover)] sm:w-11"
          aria-label={expandLabel ?? title}
        >
          <ChevronDown className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>
      ) : (
        <span
          className="flex w-10 shrink-0 items-center justify-center bg-[var(--brand-red)] sm:w-11"
          aria-hidden="true"
        >
          <ChevronDown className="h-5 w-5 text-white" strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
}

function ArticleColumn({
  locale,
  channel,
}: {
  locale: Locale;
  channel: HomeArticleChannel;
}) {
  const articles = channel.articles.filter((a) => a.slug && a.title && a.imageUrl);
  const [featuredSlug, setFeaturedSlug] = useState(articles[0]?.slug ?? "");

  if (articles.length === 0) return null;

  const featured = articles.find((a) => a.slug === featuredSlug) ?? articles[0]!;
  const list = articles.filter((a) => a.slug !== featured.slug).slice(0, 3);
  const articleHref = `/${locale}/articles/${featured.slug}`;

  return (
    <div className="flex min-w-0 flex-col">
      <Link
        href={channel.href}
        className="mb-4 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <h3 className="font-display text-xl font-bold text-[var(--brand-red)] sm:text-2xl">
          {channel.title}
        </h3>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--brand-red)]"
          aria-hidden="true"
        >
          <Bookmark className="h-5 w-5 fill-white text-white" />
        </span>
      </Link>

      <article className="flex flex-1 flex-col">
        <ArticleTitleBar title={featured.title} />

        <Link
          href={articleHref}
          className="group relative block aspect-video overflow-hidden bg-[var(--brand-gray-200)]"
        >
          <Image
            src={featured.imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>

        {featured.excerpt && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--brand-gray-800)]">
            {featured.excerpt}
          </p>
        )}

        {list.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {list.map((article) => (
              <ArticleTitleBar
                key={article.slug}
                title={article.title}
                compact
                onExpand={() => setFeaturedSlug(article.slug)}
                expandLabel={
                  locale === "ar" ? `عرض مقال: ${article.title}` : `Show article: ${article.title}`
                }
              />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

export function HomeArticlesShowcase({ locale, channels }: HomeArticlesShowcaseProps) {
  const visible = channels.filter((c) => c.articles.length > 0);
  if (visible.length === 0) return null;

  return (
    <AnimatedSection
      className="section-spacing bg-[#fff7f6]"
      aria-labelledby="home-articles-showcase-heading"
    >
      <div className="container-platform">
        <FadeIn className="sr-only">
          <h2 id="home-articles-showcase-heading">
            {locale === "ar" ? "أقسام المقالات" : "Article Sections"}
          </h2>
        </FadeIn>

        <div
          className={cn(
            "grid gap-8",
            visible.length === 1 && "max-w-md mx-auto",
            visible.length === 2 && "md:grid-cols-2",
            visible.length >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {visible.map((channel) => (
            <ArticleColumn key={channel.key} locale={locale} channel={channel} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
