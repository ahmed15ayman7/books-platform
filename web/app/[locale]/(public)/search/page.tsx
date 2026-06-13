import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { GlobalSearchPageClient } from "@/components/sections/global-search/global-search-page";
import type { Locale } from "@/lib/i18n";
import { parseSearchSectionType } from "@/lib/search/search-types";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ArticleService } from "@/server/services/article.service";
import { BookService } from "@/server/services/book.service";
import { PublisherService } from "@/server/services/publisher.service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/search`,
    title: locale === "ar" ? "بحث" : "Search",
    description:
      locale === "ar"
        ? "ابحث في الكتب والمقالات والميديا والناشرين والمؤلفين"
        : "Search books, articles, media, publishers, and authors",
    keywords: locale === "ar" ? ["بحث", "كتب", "مقالات"] : ["search", "books", "articles"],
    noIndex: true,
  });
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const initialQuery = sp.q?.trim() ?? "";
  const initialType = parseSearchSectionType(sp.type);

  const [bookCategories, articleCategories, countries] = await Promise.all([
    BookService.getCategories().catch(() => []),
    ArticleService.getCategories().catch(() => []),
    PublisherService.getAllCountries().catch(() => []),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--brand-gray-500)]">
          …
        </div>
      }
    >
      <GlobalSearchPageClient
        locale={locale}
        bookCategories={bookCategories}
        articleCategories={articleCategories}
        countries={countries}
        initialQuery={initialQuery}
        initialType={initialType}
      />
    </Suspense>
  );
}
