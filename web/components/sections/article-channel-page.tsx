import { PageHero } from "@/components/sections/page-hero";
import { ArticleCard } from "./article-card";
import { BooksPagination } from "./books-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { Locale } from "@/lib/i18n";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  date?: Date | string | null;
  channel?: string | null;
  readingTimeMinutes?: number | null;
  isFeatured?: boolean;
}

interface ArticleChannelPageProps {
  title: string;
  subtitle?: string;
  articles: Article[];
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

export function ArticleChannelPage({
  title,
  subtitle,
  articles,
  pagination,
  locale,
  breadcrumbLabel,
  heroBgClass = "bg-[var(--brand-black)]",
}: ArticleChannelPageProps) {
  const featured = articles.find((a) => a.isFeatured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={title}
        subtitle={subtitle}
        bgClassName={heroBgClass}
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: locale === "ar" ? "المقالات" : "Articles", href: `/${locale}/articles/harvest` },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="container-platform py-8">
        {articles.length === 0 ? (
          <EmptyState
            title={locale === "ar" ? "لا توجد مقالات حالياً" : "No articles yet"}
          />
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <div className="mb-8">
                <ArticleCard
                  {...featured}
                  date={featured.date ?? undefined}
                  channel={featured.channel ?? undefined}
                  locale={locale}
                  featured
                />
              </div>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard
                    key={article.id}
                    {...article}
                    date={article.date ?? undefined}
                    channel={article.channel ?? undefined}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            <div className="mt-8">
              <BooksPagination pagination={pagination} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
