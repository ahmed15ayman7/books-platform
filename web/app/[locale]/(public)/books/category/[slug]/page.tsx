import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { BookService } from "@/server/services/book.service";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/sections/page-hero";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const categories = await BookService.getCategories().catch(() => []);
  const cat = categories.find((c) => c.slug === slug);
  const name = cat ? (locale === "ar" && cat.nameAr ? cat.nameAr : cat.name) : slug;
  return buildPageMetadata({
    locale: locale as Locale,
    path: `/${locale}/books/category/${slug}`,
    title: name,
    description:
      locale === "ar"
        ? `كتب تصنيف ${name} على منصة الكتب العالمية`
        : `${name} books on Books Platform`,
    keywords: [name, locale === "ar" ? "تصنيفات" : "categories"],
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [categories, { books, pagination }] = await Promise.all([
    BookService.getCategories().catch(() => []),
    BookService.list({ page, limit: 16, category: slug }).catch(() => ({
      books: [],
      pagination: { page: 1, limit: 16, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);
  const categoryName =
    locale === "ar" && currentCategory?.nameAr
      ? currentCategory.nameAr
      : (currentCategory?.name ?? slug);

  // Related categories (up to 4 others)
  const relatedCategories = categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={categoryName}
        subtitle={locale === "ar" ? `${pagination.total} كتاب` : `${pagination.total} books`}
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: locale === "ar" ? "الكتب" : "Books", href: `/${locale}/books` },
          { label: categoryName },
        ]}
      />

      <div className="container-platform py-8">
        {/* Books Grid */}
        {books.length === 0 ? (
          <EmptyState
            title={locale === "ar" ? "لا توجد كتب في هذا التصنيف" : "No books in this category"}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} {...book} locale={locale} />
              ))}
            </div>
            <div className="mt-8">
              <BooksPagination pagination={pagination} />
            </div>
          </>
        )}

        {/* Related categories */}
        {relatedCategories.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-bold text-[var(--brand-gray-900)]">
              {locale === "ar" ? "تصنيفات ذات صلة" : "Related Categories"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/books/category/${cat.slug}`}
                  className="rounded-full border border-[var(--brand-gray-200)] bg-white px-4 py-1.5 text-sm text-[var(--brand-gray-700)] transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                >
                  {locale === "ar" && cat.nameAr ? cat.nameAr : cat.name}
                  <span className="ms-1 text-[var(--brand-gray-400)]">({cat.linkedCount})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
