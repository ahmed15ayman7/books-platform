"use client";

import { PageHero } from "@/components/sections/page-hero";
import { ArticleCard } from "./article-card";
import { BooksPagination } from "./books-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { localeHref, type Locale } from "@/lib/i18n";
import {
  mapArticleForCard,
  type ArticleLinkedProduct,
} from "@/lib/i18n/article-linked-book";
import { ScaleIn, StaggerContainer, StaggerItem, FadeIn, BlurIn } from "@/components/motion";
import { mediaHubHref, mediaNavLabel } from "@/lib/nav/site-nav";

interface MediaItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  date?: Date | string | null;
  channel?: string | null;
  readingTimeMinutes?: number | null;
  isFeatured?: boolean;
  videoId?: string | null;
  products?: ArticleLinkedProduct[];
}

interface MediaChannelPageProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  pagination: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  locale: Locale;
  breadcrumbLabel: string;
  heroBgClass?: string;
}

export function MediaChannelPage({
  title,
  subtitle,
  items,
  pagination,
  locale,
  breadcrumbLabel,
  heroBgClass = "bg-[var(--brand-black)]",
}: MediaChannelPageProps) {
  const isAr = locale === "ar";
  const mapped = items.map((item) => mapArticleForCard(item, locale));
  const featured = mapped.find((a) => a.isFeatured) ?? mapped[0];
  const rest = mapped.filter((a) => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={title}
        subtitle={subtitle}
        bgClassName={heroBgClass}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: localeHref(locale, "/") },
          { label: mediaNavLabel(locale), href: mediaHubHref(locale) },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="container-platform py-8">
        {items.length === 0 ? (
          <EmptyState
            title={isAr ? "لا توجد فيديوهات حالياً" : "No videos yet"}
            description={
              isAr
                ? "ستظهر هنا الفيديوهات التي ينشرها فريق المنصة من لوحة الميديا."
                : "Videos published from the admin Media section will appear here."
            }
          />
        ) : (
          <>
            {featured && (
              <ScaleIn className="mb-8">
                <ArticleCard
                  {...featured}
                  date={featured.date ?? undefined}
                  channel={featured.channel ?? undefined}
                  locale={locale}
                  featured
                />
              </ScaleIn>
            )}

            {rest.length > 0 && (
              <StaggerContainer className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <StaggerItem key={item.id}>
                    <BlurIn>
                      <ArticleCard
                        {...item}
                        date={item.date ?? undefined}
                        channel={item.channel ?? undefined}
                        locale={locale}
                      />
                    </BlurIn>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            <FadeIn className="mt-8">
              <BooksPagination pagination={pagination} />
            </FadeIn>
          </>
        )}
      </div>
    </div>
  );
}
