import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticleService } from "@/server/services/article.service";
import { MediaChannelPage } from "@/components/sections/media-channel-page";
import { MEDIA_CHANNELS as NAV_MEDIA_CHANNELS } from "@/lib/nav/site-nav";
import { MEDIA_CHANNELS } from "@/lib/media/youtube";
import type { Locale } from "@/lib/i18n";
import { articleChannelMetadata } from "@/lib/seo/article-channels";

interface Props {
  params: Promise<{ channel: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

function isMediaChannel(channel: string): channel is (typeof MEDIA_CHANNELS)[number] {
  return (MEDIA_CHANNELS as readonly string[]).includes(channel);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { channel, locale } = await params;
  if (!isMediaChannel(channel)) return { title: "Not Found" };
  return articleChannelMetadata(locale as Locale, channel);
}

export default async function MediaChannelRoutePage({ params, searchParams }: Props) {
  const { channel } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("articles");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  if (!isMediaChannel(channel)) notFound();

  const navMeta = NAV_MEDIA_CHANNELS.find((c) => c.slug === channel);
  const titleKey = channel === "books-talk" ? "booksTalk" : "novelStory";
  const subtitleKey = channel === "books-talk" ? "booksTalkSubtitle" : "novelSubtitle";

  const { articles, pagination } = await ArticleService.list({
    channel,
    page,
    limit: 12,
    mediaOnly: true,
    sort: "newest",
  }).catch(() => ({
    articles: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
  }));

  const title =
    locale === "ar" && navMeta
      ? navMeta.labelAr
      : navMeta?.labelEn ?? t(titleKey as "booksTalk");

  return (
    <MediaChannelPage
      title={title}
      subtitle={t(subtitleKey as "booksTalkSubtitle")}
      items={articles}
      pagination={pagination}
      locale={locale}
      breadcrumbLabel={title}
    />
  );
}
