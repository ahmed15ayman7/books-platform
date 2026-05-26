import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { BookService } from "@/server/services/book.service";
import { PageHero } from "@/components/sections/page-hero";
import { BooksFeaturedCarousel } from "@/components/sections/books-featured-carousel";
import { BookCard } from "@/components/sections/book-card";
import { BooksFilters } from "@/components/sections/books-filters";
import { BooksPagination } from "@/components/sections/books-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/books`,
    title: locale === "ar" ? "الكتب" : "Books",
    description:
      locale === "ar"
        ? "استكشف آلاف الكتب من دور النشر العالمية"
        : "Explore thousands of books from publishers worldwide",
    keywords: locale === "ar" ? ["كتب", "مكتبة", "قراءة"] : ["books", "library", "reading"],
  });
}

interface BooksPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    language?: string;
    publisher?: string;
    status?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("books");

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const [{ books, pagination }, featuredResult, categories] = await Promise.all([
    BookService.list({
      page,
      limit: 16,
      category: params.category,
      language: params.language,
      publisher: params.publisher,
      status: params.status,
      sort: (params.sort as "newest" | "oldest" | "title") ?? "newest",
      search: params.q,
    }).catch(() => ({
      books: [],
      pagination: { page: 1, limit: 16, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
    BookService.list({ limit: 8, featured: true, sort: "newest" }).catch(() => ({ books: [] })),
    BookService.getCategories().catch(() => []),
  ]);

  const featuredBooks =
    featuredResult.books.length > 0
      ? featuredResult.books
      : await BookService.list({ limit: 8, sort: "newest" })
          .then((r) => r.books)
          .catch(() => []);

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={t("catalog")}
        subtitle={locale === "ar" ? `${pagination.total}+ كتاب` : `${pagination.total}+ books`}
        className="relative overflow-hidden border-b border-[var(--brand-gray-200)] bg-gradient-to-br from-white via-[var(--brand-red-soft)]/25 to-[var(--brand-gray-50)]"
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: locale === "ar" ? "الكتب" : "Books" },
        ]}
      />

      <div className="container-platform py-8">
        {featuredBooks.length > 0 && page === 1 && !params.q && (
          <section className="mb-10" aria-labelledby="featured-books-heading">
            <h2
              id="featured-books-heading"
              className="mb-4 font-display text-lg font-bold text-[var(--brand-gray-900)]"
            >
              {locale === "ar" ? "كتب مميزة" : "Featured Books"}
            </h2>
            <BooksFeaturedCarousel books={featuredBooks} locale={locale} />
          </section>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="rounded-2xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-[var(--shadow-soft)] lg:sticky lg:top-28">
            <BooksFilters
              categories={categories}
              locale={locale}
              currentFilters={{
                category: params.category,
                language: params.language,
                status: params.status,
                sort: params.sort,
              }}
            />
            </div>
          </aside>

          {/* Books grid */}
          <main className="flex-1">
            {books.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={locale === "ar" ? "لا توجد كتب" : "No books found"}
                description={
                  locale === "ar"
                    ? "حاول تغيير الفلاتر أو كلمات البحث"
                    : "Try changing your filters or search terms"
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      locale={locale}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <BooksPagination pagination={pagination} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
