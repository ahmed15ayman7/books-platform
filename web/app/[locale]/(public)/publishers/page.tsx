import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { PublisherService } from "@/server/services/publisher.service";
import { BookService } from "@/server/services/book.service";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { BooksPagination } from "@/components/sections/books-pagination";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";
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
            <input
              id="publisher-search"
              name="search"
              type="search"
              defaultValue={sp.search}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-md border border-[var(--brand-gray-300)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]"
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {publishers.map((publisher) => (
                <PublisherCard
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

interface PublisherCardProps {
  publisher: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    booksCount: number;
    isSponsored: boolean;
    countries: { name: string; nameAr?: string | null; slug: string }[];
  };
  locale: string;
}

function PublisherCard({ publisher, locale }: PublisherCardProps) {
  const isAr = locale === "ar";
  const country = publisher.countries[0];

  return (
    <Link
      href={`/${locale}/publishers/${publisher.slug}`}
      className="group relative flex flex-col items-center gap-2 rounded-lg border border-[var(--brand-gray-200)] bg-white p-4 text-center transition-all hover:border-[var(--brand-red)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
    >
      {publisher.isSponsored && (
        <Badge variant="sponsored" className="absolute top-2 end-2 text-[10px]">
          {isAr ? "مميز" : "Featured"}
        </Badge>
      )}

      {/* Logo/Image */}
      <div className="flex h-16 w-full items-center justify-center">
        {publisher.imageUrl ? (
          <Image
            src={publisher.imageUrl}
            alt={publisher.title}
            width={100}
            height={48}
            className="h-12 w-auto max-w-full object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)]">
            <Globe className="h-6 w-6 text-[var(--brand-red)]" aria-hidden="true" />
          </div>
        )}
      </div>

      <h3 className="text-xs font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] line-clamp-2">
        {publisher.title}
      </h3>

      {country && (
        <span className="text-[10px] text-[var(--brand-gray-400)]">
          {isAr && country.nameAr ? country.nameAr : country.name}
        </span>
      )}

      <span className="text-[10px] text-[var(--brand-gray-500)]">
        {publisher.booksCount} {isAr ? "كتاب" : "books"}
      </span>
    </Link>
  );
}
