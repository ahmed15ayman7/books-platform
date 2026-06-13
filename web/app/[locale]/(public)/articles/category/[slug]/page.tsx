import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { ArticleChannelPage } from "@/components/sections/article-channel-page";
import type { Locale } from "@/lib/i18n";
import { PAGINATION } from "@/lib/utils/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const result = await ArticleService.listByCategory(slug).catch(() => null);
  if (!result) return { title: "Category Not Found" };
  const name = locale === "ar" && result.category.nameAr ? result.category.nameAr : result.category.name;
  return buildPageMetadata({
    locale,
    path: `/${locale}/articles/category/${slug}`,
    title: `${name} — ${locale === "ar" ? "مقالات" : "Articles"}`,
    description:
      locale === "ar"
        ? `مقالات تصنيف ${name} على منصة الكتب العالمية`
        : `Articles in the ${name} category on Books Platform`,
    keywords: [name, locale === "ar" ? "مقالات" : "articles"],
  });
}

export default async function ArticleCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const result = await ArticleService.listByCategory(slug, page, PAGINATION.DEFAULT_PAGE_SIZE).catch(
    () => null,
  );
  if (!result) notFound();

  const { category, articles, pagination } = result;
  const catName = locale === "ar" && category.nameAr ? category.nameAr : category.name;

  return (
    <ArticleChannelPage
      title={catName}
      subtitle={locale === "ar" ? `مقالات تصنيف: ${catName}` : `Articles in: ${catName}`}
      articles={articles}
      pagination={pagination}
      locale={locale}
      breadcrumbLabel={catName}
    />
  );
}
