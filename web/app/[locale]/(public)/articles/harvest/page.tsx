import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { ArticleChannelPage } from "@/components/sections/article-channel-page";
import type { Locale } from "@/lib/i18n";
import { articleChannelMetadata } from "@/lib/seo/article-channels";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return articleChannelMetadata(locale, "harvest");
}

interface Props { searchParams: Promise<{ page?: string }> }

export default async function HarvestPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("articles");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { articles, pagination } = await ArticleService.list({ channel: "harvest", page, limit: 10 })
    .catch(() => ({ articles: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } }));

  return (
    <ArticleChannelPage
      title={t("harvest")}
      subtitle={t("harvestSubtitle")}
      articles={articles}
      pagination={pagination}
      locale={locale}
      breadcrumbLabel={t("harvest")}
    />
  );
}
