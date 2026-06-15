"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { localeHref, type Locale } from "@/lib/i18n";
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

function ArticleAccordionItem({
  article,
  locale,
  isOpen,
  onToggle,
  compact,
  onImageError,
}: {
  article: HomeArticleItem;
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  compact?: boolean;
  onImageError: () => void;
}) {
  const articleHref = localeHref(locale, `/articles/${article.slug}`);
  const toggleLabel =
    locale === "ar" ? `عرض مقال: ${article.title}` : `Show article: ${article.title}`;

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex min-h-[44px] items-stretch overflow-hidden bg-[var(--brand-gray-900)]",
          !isOpen && compact !== false && "rounded-sm",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex flex-1 items-center px-3 py-2 text-start font-semibold leading-snug text-white transition-opacity hover:opacity-90",
            compact ? "text-xs line-clamp-2" : "text-sm line-clamp-2 sm:text-base",
          )}
        >
          {article.title}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex w-10 shrink-0 items-center justify-center bg-[var(--brand-red)] transition-colors hover:bg-[var(--brand-red-hover)] sm:w-11"
          aria-expanded={isOpen}
          aria-label={toggleLabel}
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 text-white transition-transform duration-300",
              isOpen && "rotate-180",
            )}
            strokeWidth={2.5}
          />
        </button>
      </div>

      {isOpen && (
        <div className="pb-1">
          <Link
            href={articleHref}
            className="group relative block aspect-video overflow-hidden bg-[var(--brand-gray-200)]"
          >
            <Image
              src={article.imageUrl.split(',')[0] ?? article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={onImageError}
            />
          </Link>
          {article.excerpt && (
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--brand-gray-800)]">
              {article.excerpt}
            </p>
          )}
        </div>
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
  const [openSlug, setOpenSlug] = useState(articles[0]?.slug ?? "");
  const [brokenSlugs, setBrokenSlugs] = useState<Set<string>>(() => new Set());

  const visibleArticles = useMemo(
    () => articles.filter((a) => !brokenSlugs.has(a.slug)),
    [articles, brokenSlugs],
  );

  useEffect(() => {
    if (visibleArticles.length === 0) return;
    if (!openSlug || brokenSlugs.has(openSlug)) {
      setOpenSlug(visibleArticles[0]!.slug);
    }
  }, [brokenSlugs, openSlug, visibleArticles]);

  if (visibleArticles.length === 0) return null;

  const markBroken = (slug: string) => {
    setBrokenSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  };

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

      <div className="flex flex-col gap-2" role="presentation">
        {visibleArticles.map((article) => (
          <ArticleAccordionItem
            key={article.slug}
            article={article}
            locale={locale}
            isOpen={openSlug === article.slug}
            compact={openSlug !== article.slug}
            onToggle={() => setOpenSlug(article.slug)}
            onImageError={() => markBroken(article.slug)}
          />
        ))}
      </div>
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
