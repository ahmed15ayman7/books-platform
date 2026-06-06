"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Video,
} from "lucide-react";
import { BookCard } from "@/components/sections/book-card";
import { ArticleCard } from "@/components/sections/article-card";
import { PublisherCard } from "@/components/sections/publisher-card";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import type { Locale } from "@/lib/i18n";
import type { GlobalSearchResult, SearchSectionType } from "@/lib/search/search-types";
import { cn } from "@/lib/utils";

interface GlobalSearchResultsProps {
  locale: Locale;
  data: GlobalSearchResult | null;
  loading: boolean;
  onSectionChange: (type: SearchSectionType) => void;
}

const sectionMeta: Record<
  Exclude<SearchSectionType, "all">,
  { icon: typeof BookOpen; labelAr: string; labelEn: string }
> = {
  books: { icon: BookOpen, labelAr: "الكتب", labelEn: "Books" },
  articles: { icon: FileText, labelAr: "المقالات", labelEn: "Articles" },
  media: { icon: Video, labelAr: "الميديا", labelEn: "Media" },
  publishers: { icon: Building2, labelAr: "الناشرون", labelEn: "Publishers" },
  authors: { icon: User, labelAr: "المؤلفون", labelEn: "Authors" },
};

function AuthorSearchCard({
  name,
  slug,
  locale,
}: {
  name: string;
  slug: string;
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/authors/${slug}`}
      className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 text-center transition-all hover:border-[var(--brand-red)] hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
        <User className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="line-clamp-2 text-sm font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)]">
        {name}
      </p>
    </Link>
  );
}

function PreviewSection({
  locale,
  sectionKey,
  label,
  icon: Icon,
  total,
  onViewAll,
  children,
}: {
  locale: Locale;
  sectionKey: string;
  label: string;
  icon: typeof BookOpen;
  total: number;
  onViewAll: () => void;
  children: React.ReactNode;
}) {
  const isAr = locale === "ar";
  if (total === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-4"
      aria-labelledby={`search-section-${sectionKey}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2
            id={`search-section-${sectionKey}`}
            className="font-display text-lg font-bold text-[var(--brand-gray-900)]"
          >
            {label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-red)] hover:underline"
        >
          {isAr ? "عرض الكل" : "View all"}
          {isAr ? (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {children}
    </motion.section>
  );
}

function ResultsSkeleton({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  return (
    <div className="space-y-8" aria-busy="true" aria-label={isAr ? "جاري التحميل" : "Loading"}>
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-[var(--brand-gray-200)]" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--brand-gray-200)]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GlobalSearchResults({
  locale,
  data,
  loading,
  onSectionChange,
}: GlobalSearchResultsProps) {
  const isAr = locale === "ar";

  if (loading) return <ResultsSkeleton locale={locale} />;

  if (!data) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--brand-gray-300)] bg-white px-6 py-16 text-center">
        <p className="font-display text-lg font-bold text-[var(--brand-gray-900)]">
          {isAr ? "ابدأ بالبحث" : "Start searching"}
        </p>
        <p className="mt-2 text-sm text-[var(--brand-gray-600)]">
          {isAr
            ? "اكتب كلمتين على الأقل للبحث في الكتب والمقالات والناشرين والمؤلفين"
            : "Type at least 2 characters to search books, articles, publishers, and authors"}
        </p>
      </div>
    );
  }

  if (data.mode === "preview") {
    const hasAny =
      data.books.total +
        data.articles.total +
        data.media.total +
        data.publishers.total +
        data.authors.total >
      0;

    if (!hasAny) {
      return (
        <div className="rounded-2xl border border-[var(--brand-gray-200)] bg-white px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-[var(--brand-gray-900)]">
            {isAr ? "لا توجد نتائج" : "No results found"}
          </p>
          <p className="mt-2 text-sm text-[var(--brand-gray-600)]">
            {isAr ? "حاول تغيير كلمات البحث أو الفلاتر" : "Try changing your search terms or filters"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <PreviewSection
          locale={locale}
          sectionKey="books"
          label={isAr ? sectionMeta.books.labelAr : sectionMeta.books.labelEn}
          icon={sectionMeta.books.icon}
          total={data.books.total}
          onViewAll={() => onSectionChange("books")}
        >
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.books.items.map((book) => (
              <BookCard
                key={book.id}
                slug={book.slug}
                nameEn={book.nameEn}
                nameAr={book.nameAr}
                imageUrl={book.imageUrl}
                translationStatus={book.translationStatus ?? undefined}
                locale={locale}
              />
            ))}
          </div>
        </PreviewSection>

        <PreviewSection
          locale={locale}
          sectionKey="articles"
          label={isAr ? sectionMeta.articles.labelAr : sectionMeta.articles.labelEn}
          icon={sectionMeta.articles.icon}
          total={data.articles.total}
          onViewAll={() => onSectionChange("articles")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.articles.items.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.imageUrl}
                date={article.date}
                channel={article.channel}
                readingTimeMinutes={article.readingTimeMinutes}
                locale={locale}
              />
            ))}
          </div>
        </PreviewSection>

        <PreviewSection
          locale={locale}
          sectionKey="media"
          label={isAr ? sectionMeta.media.labelAr : sectionMeta.media.labelEn}
          icon={sectionMeta.media.icon}
          total={data.media.total}
          onViewAll={() => onSectionChange("media")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.media.items.map((item) => (
              <ArticleCard
                key={item.id}
                slug={item.slug}
                title={item.title}
                excerpt={item.excerpt}
                imageUrl={item.imageUrl}
                date={item.date}
                channel={item.channel}
                videoId={item.videoId}
                locale={locale}
              />
            ))}
          </div>
        </PreviewSection>

        <PreviewSection
          locale={locale}
          sectionKey="publishers"
          label={isAr ? sectionMeta.publishers.labelAr : sectionMeta.publishers.labelEn}
          icon={sectionMeta.publishers.icon}
          total={data.publishers.total}
          onViewAll={() => onSectionChange("publishers")}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.publishers.items.map((pub) => (
              <PublisherCard
                key={pub.id}
                id={pub.id}
                title={localizedPublisherName(pub, locale)}
                slug={pub.slug}
                imageUrl={pub.imageUrl}
                locale={locale}
              />
            ))}
          </div>
        </PreviewSection>

        <PreviewSection
          locale={locale}
          sectionKey="authors"
          label={isAr ? sectionMeta.authors.labelAr : sectionMeta.authors.labelEn}
          icon={sectionMeta.authors.icon}
          total={data.authors.total}
          onViewAll={() => onSectionChange("authors")}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.authors.items.map((author) => (
              <AuthorSearchCard
                key={author.id}
                name={author.nameAr ?? author.name}
                slug={author.slug}
                locale={locale}
              />
            ))}
          </div>
        </PreviewSection>
      </div>
    );
  }

  const items =
    data.books ?? data.articles ?? data.media ?? data.publishers ?? data.authors ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--brand-gray-200)] bg-white px-6 py-16 text-center">
        <p className="font-display text-lg font-bold text-[var(--brand-gray-900)]">
          {isAr ? "لا توجد نتائج" : "No results found"}
        </p>
        <p className="mt-2 text-sm text-[var(--brand-gray-600)]">
          {isAr ? "حاول تغيير كلمات البحث أو الفلاتر" : "Try changing your search terms or filters"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {data.type === "books" && data.books && (
        <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {data.books.map((book) => (
            <BookCard
              key={book.id}
              slug={book.slug}
              nameEn={book.nameEn}
              nameAr={book.nameAr}
              imageUrl={book.imageUrl}
              translationStatus={book.translationStatus ?? undefined}
              locale={locale}
            />
          ))}
        </div>
      )}

      {data.type === "articles" && data.articles && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              imageUrl={article.imageUrl}
              date={article.date}
              channel={article.channel}
              readingTimeMinutes={article.readingTimeMinutes}
              locale={locale}
            />
          ))}
        </div>
      )}

      {data.type === "media" && data.media && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.media.map((item) => (
            <ArticleCard
              key={item.id}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              imageUrl={item.imageUrl}
              date={item.date}
              channel={item.channel}
              videoId={item.videoId}
              locale={locale}
            />
          ))}
        </div>
      )}

      {data.type === "publishers" && data.publishers && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data.publishers.map((pub) => (
            <PublisherCard
              key={pub.id}
              id={pub.id}
              title={localizedPublisherName(pub, locale)}
              slug={pub.slug}
              imageUrl={pub.imageUrl}
              locale={locale}
            />
          ))}
        </div>
      )}

      {data.type === "authors" && data.authors && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.authors.map((author) => (
            <AuthorSearchCard
              key={author.id}
              name={author.nameAr ?? author.name}
              slug={author.slug}
              locale={locale}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function SearchSectionTabs({
  locale,
  active,
  onChange,
}: {
  locale: Locale;
  active: SearchSectionType;
  onChange: (type: SearchSectionType) => void;
}) {
  const isAr = locale === "ar";
  const tabs: Array<{ key: SearchSectionType; labelAr: string; labelEn: string; icon: typeof BookOpen }> = [
    { key: "all", labelAr: "الكل", labelEn: "All", icon: BookOpen },
    ...Object.entries(sectionMeta).map(([key, meta]) => ({
      key: key as Exclude<SearchSectionType, "all">,
      labelAr: meta.labelAr,
      labelEn: meta.labelEn,
      icon: meta.icon,
    })),
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
      role="tablist"
      aria-label={isAr ? "أقسام البحث" : "Search sections"}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-[var(--motion-base)]",
              selected
                ? "bg-[var(--brand-red)] text-white shadow-md"
                : "border border-[var(--brand-gray-200)] bg-white text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]",
            )}
          >
            {tab.key !== "all" && <Icon className="h-4 w-4" aria-hidden="true" />}
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        );
      })}
    </div>
  );
}
