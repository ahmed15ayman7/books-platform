import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { PublisherService } from "@/server/services/publisher.service";
import { BookService } from "@/server/services/book.service";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import {
  CardMedia,
  CardMediaImage,
  CardMediaPlaceholder,
} from "@/components/ui/card-media";
import { BooksPagination } from "@/components/sections/books-pagination";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/publishers`,
    title: locale === "ar" ? "الناشرون" : "Publishers",
    description:
      locale === "ar"
        ? "دار نشر من كل أنحاء العالم — دليل دور النشر العالمية"
        : "Publishers from around the world",
    keywords: locale === "ar" ? ["ناشرون", "دور نشر"] : ["publishers", "publishing houses"],
  });
}

interface PublishersPageProps {
  searchParams: Promise<{ page?: string; country?: string; search?: string }>;
}

export default async function PublishersPage({ searchParams }: PublishersPageProps) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("publishers");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [{ publishers, pagination }, stats, countries] = await Promise.all([
    PublisherService.list({
      page,
      limit: 20,
      country: sp.country,
      search: sp.search,
    }).catch(() => ({
      publishers: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
    BookService.getStats().catch(() => ({ totalBooks: 0, totalPublishers: 0, totalTranslatedBooks: 0, totalCountries: 0 })),
    PublisherService.getAllCountries().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={t("title")}
        subtitle={
          locale === "ar"
            ? `${stats.totalPublishers} ناشر من ${stats.totalCountries} دولة`
            : `${stats.totalPublishers} publishers from ${stats.totalCountries} countries`
        }
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: t("title") },
        ]}
      />

      <div className="container-platform py-8">
        {/* Search + Country Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form className="flex-1" method="get">
            <label htmlFor="publisher-search" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <Input
              id="publisher-search"
              name="search"
              type="search"
              defaultValue={sp.search}
              placeholder={t("searchPlaceholder")}
            />
          </form>
        </div>

        {/* Country chips */}
        {countries.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/publishers`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                !sp.country
                  ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                  : "border-[var(--brand-gray-300)] text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
              }`}
            >
              {locale === "ar" ? "الكل" : "All"}
            </Link>
            {countries.slice(0, 15).map((country) => (
              <Link
                key={country.id}
                href={`/${locale}/publishers?country=${country.slug}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  sp.country === country.slug
                    ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                    : "border-[var(--brand-gray-300)] text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                }`}
              >
                {locale === "ar" && country.nameAr ? country.nameAr : country.name}
              </Link>
            ))}
          </div>
        )}

        {/* Publishers Grid */}
        {publishers.length === 0 ? (
          <div className="py-20 text-center text-[var(--brand-gray-500)]">
            {locale === "ar" ? "لا توجد نتائج" : "No publishers found"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {publishers.map((publisher) => (
                <PublisherListingCard
                  key={publisher.id}
                  publisher={publisher}
                  locale={locale}
                />
              ))}
            </div>
            <div className="mt-8">
              <BooksPagination pagination={pagination} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface PublisherListingCardProps {
  publisher: {
    id: string;
    title: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    imageUrl?: string | null;
    booksCount: number;
    isSponsored: boolean;
    countries: { name: string; nameAr?: string | null; slug: string }[];
  };
  locale: string;
}

function PublisherListingCard({ publisher, locale }: PublisherListingCardProps) {
  const isAr = locale === "ar";
  const displayName = localizedPublisherName(publisher, locale);
  const country = publisher.countries[0];

  return (
    <Link
      href={`/${locale}/publishers/${publisher.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[var(--brand-gray-200)] bg-white text-center transition-all hover:border-[var(--brand-red)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
    >
      {publisher.isSponsored && (
        <Badge variant="sponsored" className="absolute top-2 end-2 z-10 text-[10px]">
          {isAr ? "مميز" : "Featured"}
        </Badge>
      )}

      <CardMedia rounded="top" className="bg-[var(--brand-gray-50)]">
        {publisher.imageUrl ? (
          <CardMediaImage
            src={publisher.imageUrl}
            alt={displayName}
            objectFit="contain"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <CardMediaPlaceholder className="from-[var(--brand-gray-50)] to-[var(--brand-red-soft)]">
            <Globe className="h-8 w-8 text-[var(--brand-red)]" aria-hidden="true" />
          </CardMediaPlaceholder>
        )}
      </CardMedia>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-xs font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] line-clamp-2">
          {displayName}
        </h3>

        {country && (
          <span className="text-[10px] text-[var(--brand-gray-400)]">
            {isAr && country.nameAr ? country.nameAr : country.name}
          </span>
        )}

        <span className="mt-auto text-[10px] text-[var(--brand-gray-500)]">
          {publisher.booksCount} {isAr ? "كتاب" : "books"}
        </span>
      </div>
    </Link>
  );
}
