import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { AuthorService } from "@/server/services/author.service";
import { SectionBlock } from "@/components/sections/section-block";
import { AuthorDetailHero } from "@/components/sections/author-detail-hero";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
import { AnimatedContentSections } from "@/components/sections/content-page-shell.client";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import type { Locale } from "@/lib/i18n";
import {
  localizedAuthorAlternateName,
  localizedAuthorBio,
  localizedAuthorName,
} from "@/lib/i18n/book-locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { AdminEntityPublicShell } from "@/components/admin/admin-entity-public-shell";
import { adminAuthorEditPath, adminAuthorViewPath } from "@/lib/admin/public-urls";

interface AuthorPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const author = await AuthorService.getBySlug(slug).catch(() => null);
  if (!author) return { title: "Author Not Found" };

  const displayName = localizedAuthorName(author, locale as Locale);
  const bio = localizedAuthorBio(author, locale as Locale);

  return buildPageMetadata({
    locale: locale as Locale,
    path: `/${locale}/authors/${slug}`,
    title: displayName,
    description:
      bio ??
      (locale === "ar" ? `كتب المؤلف ${displayName}` : `Books by ${displayName}`),
    keywords: [displayName, locale === "ar" ? "مؤلفون" : "authors"],
  });
}

export default async function AuthorDetailPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [author, { books, pagination }] = await Promise.all([
    AuthorService.getBySlug(slug).catch(() => null),
    AuthorService.getAuthorBooks(slug, page, 16).catch(() => ({
      books: [],
      pagination: {
        page: 1,
        limit: 16,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    })),
  ]);

  if (!author) notFound();

  const isAr = locale === "ar";
  const displayName = localizedAuthorName(author, locale);
  const alternateName = localizedAuthorAlternateName(author, locale);
  const bio = localizedAuthorBio(author, locale);
  const bookCount = author._count.products;
  const coverImage = books[0]?.imageUrl ?? null;

  return (
    <AdminEntityPublicShell
      entityType="author"
      entityId={author.id}
      editHref={adminAuthorEditPath(locale, author.id)}
      adminViewHref={adminAuthorViewPath(locale, author.id)}
      publicHref={`/${locale}/authors/${author.slug}`}
      title={displayName}
    >
      <div className="min-h-screen bg-[var(--brand-gray-50)] pb-24">
        <AuthorDetailHero
          locale={locale}
          name={displayName}
          alternateName={alternateName}
          bio={bio}
          bookCount={bookCount}
          imageUrl={coverImage}
          slug={author.slug}
          homeHref={`/${locale}`}
          booksHref={`/${locale}/books`}
        />

        <div className="container-platform py-8">
          <AnimatedContentSections>
            {bio && (
              <SectionBlock id="bio" title={isAr ? "نبذة" : "Biography"}>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--brand-gray-700)]">
                  {bio}
                </p>
              </SectionBlock>
            )}

            <SectionBlock
              id="books"
              title={isAr ? `كتب ${displayName}` : `Books by ${displayName}`}
              lead={`${pagination.total} ${isAr ? "كتاب" : "books"}`}
            >
              {books.length === 0 ? (
                <div className="py-20 text-center text-[var(--brand-gray-500)]">
                  <p>{isAr ? "لا توجد كتب منشورة لهذا المؤلف" : "No published books for this author"}</p>
                  <Link
                    href={`/${locale}/books`}
                    className="mt-4 inline-block text-sm text-[var(--brand-red)] hover:underline"
                  >
                    {isAr ? "تصفّح كل الكتب" : "Browse all books"}
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
  );
}
