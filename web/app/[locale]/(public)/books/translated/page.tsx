import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { BookService } from "@/server/services/book.service";
import { PageHero } from "@/components/sections/page-hero";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/books/translated`,
    title: locale === "ar" ? "الكتب المترجمة" : "Translated Books",
    description:
      locale === "ar"
        ? "كتب عالمية تُرجمت إلى العربية — مكتبة الترجمات"
        : "World books translated into Arabic",
    keywords: locale === "ar" ? ["ترجمة", "كتب مترجمة"] : ["translation", "translated books"],
  });
}

interface Props {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function TranslatedBooksPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("books");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { books, pagination } = await BookService.list({
    page,
    limit: 20,
    status: "TRANSLATED",
    sort: (sp.sort as "newest" | "oldest") ?? "newest",
  }).catch(() => ({ books: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } }));

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={t("translatedTitle")}
        subtitle={`${pagination.total}+ ${locale === "ar" ? "كتاب مترجم" : "translated books"} — ${t("translatedSubtitle")}`}
        size="lg"
        className="relative overflow-hidden"
        bgClassName="relative overflow-hidden"
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: locale === "ar" ? "الكتب" : "Books", href: `/${locale}/books` },
          { label: t("translatedTitle") },
        ]}
      />

      <div className="container-platform py-8">
        {books.length === 0 ? (
          <div className="py-20 text-center text-[var(--brand-gray-500)]">
            {locale === "ar" ? "لا توجد كتب مترجمة حالياً" : "No translated books yet"}
          </div>
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

        {/* Cross-link to Nominated */}
        <div className="mt-12 rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 text-center">
          <p className="mb-3 font-bold text-[var(--brand-gray-900)]">
            {locale === "ar"
              ? "اكتشف كتباً تنتظر الترجمة"
              : "Discover books waiting to be translated"}
          </p>
          <Link
            href={`/${locale}/books/nominated-for-translation`}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--brand-red)] px-6 py-2 text-sm font-semibold text-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]"
          >
            {locale === "ar" ? "كتب مرشحة للترجمة" : "Books Recommended for Translation"}
          </Link>
        </div>
      </div>
    </div>
  );
}
