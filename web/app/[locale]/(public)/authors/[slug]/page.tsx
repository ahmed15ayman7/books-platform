import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { User } from "lucide-react";
import { AuthorService } from "@/server/services/author.service";
import { SectionHeading } from "@/components/ui/section-heading";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
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
      <div className="bg-[var(--brand-black)] py-10">
        <div className="container-platform">
          <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--brand-gray-400)]">
            <Link href={`/${locale}`} className="hover:text-white">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/books`} className="hover:text-white">
              {isAr ? "الكتب" : "Books"}
            </Link>
            <span>/</span>
            <span className="text-white">{displayName}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--brand-gray-800)] text-[var(--brand-red)]">
              <User className="h-12 w-12" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-display-sm font-black text-white">
                {displayName}
              </h1>
              {alternateName && (
                <p
                  className="mt-2 text-base font-medium text-[var(--brand-gray-400)]"
                  dir={isAr ? "ltr" : "rtl"}
                >
                  {alternateName}
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--brand-gray-400)]">
                {bookCount} {isAr ? "كتاب على المنصة" : "books on the platform"}
              </p>
              {bio && (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--brand-gray-300)] whitespace-pre-wrap">
                  {bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-platform py-8">
        <SectionHeading
          title={isAr ? `كتب ${displayName}` : `Books by ${displayName}`}
          subtitle={`${pagination.total} ${isAr ? "كتاب" : "books"}`}
          className="mb-6"
        />

        {books.length === 0 ? (
          <div className="py-20 text-center text-[var(--brand-gray-500)]">
            <p>{isAr ? "لا توجد كتب منشورة لهذا المؤلف" : "No published books for this author"}</p>
            <Link
              href={`/${locale}/books`}
              className="mt-4 inline-block text-sm text-[var(--brand-red)] hover:underline"
            >
              {isAr ? "تصفح كل الكتب" : "Browse all books"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} {...book} locale={locale} />
              ))}
            </div>
            <div className="mt-8">
              <BooksPagination pagination={pagination} />
            </div>
          </>
        )}
      </div>
    </div>
    </AdminEntityPublicShell>
  );
}
