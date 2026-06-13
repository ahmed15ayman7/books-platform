import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PublisherService } from "@/server/services/publisher.service";
import { SectionBlock } from "@/components/sections/section-block";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { PublisherDetailHeader } from "@/components/sections/publisher-detail-header";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";
import {
  localizedPublisherDescription,
  localizedPublisherName,
} from "@/lib/i18n/publisher-locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGINATION } from "@/lib/utils/constants";
import { AdminEntityPublicShell } from "@/components/admin/admin-entity-public-shell";
import { adminPublisherEditPath, adminPublisherViewPath } from "@/lib/admin/public-urls";
import { absoluteUrl, stripLocale } from "@/lib/seo/site";
import { JsonLd, publisherOrganizationJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

interface PublisherPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PublisherPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const publisher = await PublisherService.getBySlug(slug).catch(() => null);
  if (!publisher) return { title: "Publisher Not Found" };
  const displayName = localizedPublisherName(publisher, locale as Locale);
  const displayDesc = localizedPublisherDescription(publisher, locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: `/${locale}/publishers/${slug}`,
    title: displayName,
    description: displayDesc ?? (locale === "ar" ? `ناشر ${displayName}` : `Publisher ${displayName}`),
    imageUrl: publisher.imageUrl,
    keywords: [displayName, locale === "ar" ? "ناشرون" : "publishers"],
  });
}

export default async function PublisherDetailPage({
  params,
  searchParams,
}: PublisherPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [publisher, { books, pagination }] = await Promise.all([
    PublisherService.getBySlug(slug).catch(() => null),
    PublisherService.getPublisherBooks(slug, page).catch(() => ({
      books: [],
      pagination: {
        page: 1,
        limit: PAGINATION.DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    })),
  ]);

  if (!publisher) notFound();

  const isAr = locale === "ar";
  const displayName = localizedPublisherName(publisher, locale);
  const displayDescription = localizedPublisherDescription(publisher, locale);
  const isSponsored = Boolean(
    publisher.sponsored?.isActive && publisher.sponsored.endsAt > new Date(),
  );

  const publisherUrl = absoluteUrl(stripLocale(`/${locale}/publishers/${publisher.slug}`));
  const orgSchema = publisherOrganizationJsonLd({
    name: displayName,
    url: publisherUrl,
    description: displayDescription,
    logo: publisher.imageUrl,
    websiteUrl: publisher.websiteUrl,
  });
  const breadcrumbs = breadcrumbJsonLd([
    { name: isAr ? "الرئيسية" : "Home", path: "/" },
    { name: isAr ? "الناشرون" : "Publishers", path: "/publishers" },
    { name: displayName, path: `/publishers/${publisher.slug}` },
  ]);

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbs} />
      <AdminEntityPublicShell
      entityType="publisher"
      entityId={publisher.id}
      editHref={adminPublisherEditPath(locale, publisher.id)}
      adminViewHref={adminPublisherViewPath(locale, publisher.id)}
      publicHref={`/${locale}/publishers/${publisher.slug}`}
      title={displayName}
    >
      <div className="min-h-screen bg-[var(--brand-gray-50)] pb-24">
        <PublisherDetailHeader
          locale={locale}
          displayName={displayName}
          displayDescription={displayDescription}
          imageUrl={publisher.imageUrl}
          isSponsored={isSponsored}
          countries={publisher.countries}
          websiteUrl={publisher.websiteUrl}
          contactEmail={publisher.contactEmail}
          homeHref={`/${locale}`}
          publishersHref={`/${locale}/publishers`}
        />

        <div className="container-platform py-8">
          <AnimatedContentSections>
            {displayDescription && (
              <EditorialSplit
                id="about-publisher"
                eyebrow={isAr ? "عن الناشر" : "About the Publisher"}
                title={displayName}
                image={{
                  src: publisher.imageUrl ?? ABOUT_IMAGES.gallery5,
                  alt: displayName,
                }}
                imagePosition="left"
                locale={locale}
              >
                <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--brand-gray-700)]">
                  {displayDescription}
                </p>
              </EditorialSplit>
            )}

            <SectionBlock
              id="books"
              title={isAr ? `كتب ${displayName}` : `Books by ${displayName}`}
            >
              {books.length === 0 ? (
                <div className="py-20 text-center text-[var(--brand-gray-500)]">
                  <p>{isAr ? "لا توجد كتب منشورة لهذا الناشر" : "No published books for this publisher"}</p>
                  <Link
                    href={`/${locale}/publishers`}
                    className="mt-4 inline-block text-sm text-[var(--brand-red)] hover:underline"
                  >
                    {isAr ? "تصفح كل الناشرين" : "Browse all publishers"}
                  </Link>
                </div>
              ) : (
                <>
                  <StaggerContainer className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {books.map((book) => (
                      <StaggerItem key={book.id}>
                        <BookCard {...book} locale={locale} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                  <div className="mt-8">
                    <BooksPagination pagination={pagination} />
                  </div>
                </>
              )}
            </SectionBlock>
          </AnimatedContentSections>
        </div>
      </div>
    </AdminEntityPublicShell>
    </>
  );
}
