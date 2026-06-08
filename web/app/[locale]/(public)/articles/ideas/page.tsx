import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { ArticleChannelPage } from "@/components/sections/article-channel-page";
import type { Locale } from "@/lib/i18n";
import { PAGINATION } from "@/lib/utils/constants";

import { articleChannelMetadata } from "@/lib/seo/article-channels";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return articleChannelMetadata(locale, "ideas");
}

interface Props { searchParams: Promise<{ page?: string }> }

export default async function IdeasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("articles");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { articles, pagination } = await ArticleService.list({
    channel: "ideas",
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
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

  return (
    <ArticleChannelPage
      title={t("ideas")}
      subtitle={t("ideasSubtitle")}
      articles={articles}
      pagination={pagination}
      locale={locale}
      breadcrumbLabel={t("ideas")}
    />
  );
}
