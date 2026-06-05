import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { BookService } from "@/server/services/book.service";
import { CatalogCollageHero } from "@/components/sections/catalog-collage-hero";
import { BookCard } from "@/components/sections/book-card";
import { BooksSortBar } from "@/components/sections/books-sort-bar";
import { BooksPagination } from "@/components/sections/books-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Globe2 } from "lucide-react";
import { localizedBookName } from "@/lib/i18n/book-locale";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/books/nominated-for-translation`,
    title: locale === "ar" ? "كتب مرشحة للترجمة" : "Books Nominated for Translation",
    description:
      locale === "ar"
        ? "كتب أجنبية تستحق أن تصل للقارئ العربي — اكتشف ما لم يُترجم بعد"
        : "Foreign books deserving translation into Arabic",
    keywords: locale === "ar" ? ["ترجمة", "كتب مرشحة"] : ["translation", "nominated books"],
  });
}

interface Props {
  searchParams: Promise<{ page?: string; language?: string; sort?: string }>;
}

export default async function NominatedForTranslationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("books");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const sort = (sp.sort as "newest" | "oldest" | "title") ?? "newest";

  const [{ books, pagination }, heroResult] = await Promise.all([
    BookService.list({
      page,
      limit: 16,
      status: "NOMINATED",
      language: sp.language,
      sort,
    }).catch(() => ({
      books: [],
      pagination: { page: 1, limit: 16, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
    BookService.list({ page: 1, limit: 12, status: "NOMINATED", sort: "newest" }).catch(() => ({
      books: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
  ]);

  const covers = heroResult.books
    .filter((b) => b.imageUrl)
    .map((b) => ({
      src: b.imageUrl!,
      alt: localizedBookName(b, locale),
    }));

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <CatalogCollageHero
        locale={locale}
        title={t("nominatedTitle")}
        subtitle={t("nominatedSubtitle")}
        covers={covers}
        variant="nominated"
        breadcrumbs={[
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: locale === "ar" ? "الكتب" : "Books", href: `/${locale}/books` },
          { label: t("nominatedTitle") },
        ]}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm text-amber-100">
          <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{locale === "ar" ? "هل تريد ترجمة كتاب؟" : "Want to translate a book?"}</span>
          <Link href={`/${locale}/publish`} className="font-bold underline hover:no-underline">
            {locale === "ar" ? "انشر كتابك" : "Publish Your Book"}
          </Link>
        </div>
      </CatalogCollageHero>

      <div className="container-platform py-8">
        <BooksSortBar locale={locale} />
        <main>
          {books.length === 0 ? (
            <EmptyState title={locale === "ar" ? "لا توجد كتب حالياً" : "No books found"} />
          ) : (
            <>
              <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {books.map((book) => (
                  <BookCard key={book.id} {...book} locale={locale} />
                ))}
              </div>
              <div className="mt-8">
                <BooksPagination pagination={pagination} />
              </div>
            </>
          )}
        </main>

        <div className="mt-12 rounded-xl bg-[var(--brand-red-soft)] p-6 text-center">
          <p className="mb-3 font-bold text-[var(--brand-gray-900)]">
            {locale === "ar"
              ? "اكتشف الكتب التي وصلت بالفعل إلى العربية"
              : "Discover books already translated to Arabic"}
          </p>
          <Link
            href={`/${locale}/books/translated`}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--brand-red)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-red-hover)]"
          >
            {locale === "ar" ? "الكتب المترجمة ←" : "Translated Books →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
