import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { PublisherService } from "@/server/services/publisher.service";
import { PublishersHero } from "@/components/sections/publishers-hero";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { PublisherCard } from "@/components/sections/publisher-card";
import { SectionBlock } from "@/components/sections/section-block";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import { publicPublisherUrl } from "@/lib/admin/public-urls";
import { Badge } from "@/components/ui/badge";
import {
  CardMedia,
  CardMediaImage,
  CardMediaPlaceholder,
} from "@/components/ui/card-media";
import { PublisherCountryFilter } from "@/components/sections/publisher-country-filter";
import { BooksPagination } from "@/components/sections/books-pagination";
import { Input } from "@/components/ui/input";
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

  const [{ publishers, pagination }, countries, sponsored, logoPublishers] =
    await Promise.all([
    PublisherService.list({
      page,
      limit: 20,
      country: sp.country,
      search: sp.search,
    }).catch(() => ({
      publishers: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
    PublisherService.getAllCountries().catch(() => []),
    PublisherService.getSponsored(4).catch(() => []),
    PublisherService.list({ page: 1, limit: 8 }).catch(() => ({ publishers: [] })),
  ]);

  const heroLogos = [
    ...sponsored.filter((p) => p.imageUrl).map((p) => ({
      src: p.imageUrl!,
      alt: localizedPublisherName(p, locale),
      href: publicPublisherUrl(locale, p.slug),
    })),
    ...logoPublishers.publishers
      .filter((p) => p.imageUrl && !sponsored.some((s) => s.id === p.id))
      .slice(0, 8 - sponsored.length)
      .map((p) => ({
        src: p.imageUrl!,
        alt: localizedPublisherName(p, locale),
        href: publicPublisherUrl(locale, p.slug),
      })),
  ].slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PublishersHero
        locale={locale}
        title={t("title")}
        subtitle={
          locale === "ar"
            ? "دار نشر من كل أنحاء العالم — دليل دور النشر العالمية"
            : "Publishing houses from around the world — your global directory"
        }
        logos={heroLogos}
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: t("title") },
        ]}
      />

      <div className="container-platform py-14 md:py-16">
        <AnimatedContentSections>
      {sponsored.length > 0 && page === 1 && !sp.search && !sp.country && (
        <SectionBlock
          id="featured-publishers"
          eyebrow={locale === "ar" ? "مميزون" : "Featured"}
          title={locale === "ar" ? "ناشرون مميزون" : "Featured Publishers"}
        >
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sponsored.map((pub) => (
              <StaggerItem key={pub.id}>
                <PublisherCard
                  id={pub.id}
                  title={pub.title}
                  slug={pub.slug}
                  imageUrl={pub.imageUrl}
                  locale={locale}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SectionBlock>
      )}

      <div>
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

        <PublisherCountryFilter
          locale={locale}
          countries={countries}
          activeCountry={sp.country}
          searchQuery={sp.search}
        />

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
        </AnimatedContentSections>
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
      </div>
    </Link>
  );
}
