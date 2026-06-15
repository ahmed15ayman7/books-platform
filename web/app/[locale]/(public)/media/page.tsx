import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { MediaChannelPage } from "@/components/sections/media-channel-page";
import { mediaNavLabel } from "@/lib/nav/site-nav";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGINATION } from "@/lib/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/media`,
    title: locale === "ar" ? "إبداعات الميديا" : "Media Creations",
    description:
      locale === "ar"
        ? "فيديوهات ومحتوى مرئي — حديث الكتب، رواية فحكاية"
        : "Video content — Book Talk, Novel & Story",
    keywords: locale === "ar" ? ["فيديو", "ميديا", "كتب"] : ["video", "media", "books"],
  });
}

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function MediaHubPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { articles, pagination } = await ArticleService.list({
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    mediaOnly: true,
    sort: "newest",
  }).catch(() => ({
    articles: [],
    pagination: {
      page: 1,
      limit: PAGINATION.DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }));

  const title = mediaNavLabel(locale);
  const subtitle =
    locale === "ar"
      ? "فيديوهات ينشرها فريق المنصة من لوحة الميديا"
      : "Videos published by the platform team from the admin Media section";

  return (
    <MediaChannelPage
      title={title}
      subtitle={subtitle}
      items={articles}
      pagination={pagination}
      locale={locale}
      breadcrumbLabel={locale === "ar" ? "كل الفيديوهات" : "All Videos"}
    />
  );
}
