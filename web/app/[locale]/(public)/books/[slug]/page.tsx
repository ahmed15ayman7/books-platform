import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { BookService } from "@/server/services/book.service";
import { ArticleService } from "@/server/services/article.service";
import { BookCarousel } from "@/components/sections/book-carousel";
import { ArticleCarousel } from "@/components/sections/article-carousel";
import { BookDetailHero } from "@/components/sections/book-detail-hero";
import { BookBiblioTable } from "@/components/sections/book-biblio-table";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/lib/i18n";
import { mapArticleForCard } from "@/lib/i18n/article-linked-book";
import {
  localizedBookAlternateName,
  localizedBookDescription,
  localizedBookEdition,
  localizedBookName,
  localizedBookShortDesc,
} from "@/lib/i18n/book-locale";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import { bookSeoMetadata } from "@/lib/seo/metadata";
import { loadAdminSession } from "@/lib/admin/permissions-client";
import { MotionButton } from "@/components/motion";
import { Edit } from "lucide-react";

interface BookPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const book = await BookService.getBySlug(slug).catch(() => null);
  if (!book) return { title: "Book Not Found" };

  return bookSeoMetadata(locale as Locale, book);
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("books");
  const session = loadAdminSession();

  const [book, similarResult, linkedArticlesRaw] = await Promise.all([
    BookService.getBySlug(slug).catch(() => null),
    BookService.getSimilar(slug, 12).catch(() => ({ books: [], isGeneralFallback: false })),
    ArticleService.getByProductSlug(slug, 12).catch(() => []),
  ]);

  const similarBooks = similarResult.books;
  const similarBooksGeneral = similarResult.isGeneralFallback;

  if (!book) notFound();

  const displayName = localizedBookName(book, locale);
  const linkedArticles = linkedArticlesRaw.map((article) => ({
    ...mapArticleForCard(article, locale),
    linkedBook: {
      slug: book.slug,
      name: displayName,
      imageUrl: book.imageUrl ?? null,
    },
  }));
  const alternateName = localizedBookAlternateName(book, locale);
  const description = localizedBookDescription(book, locale);
  const leadText = localizedBookShortDesc(book, locale);

  const ratings = book.ratings;
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, r: { stars: number }) => sum + r.stars, 0) / ratings.length
      : null;

  const translationStatusVariant =
    book.translationStatus === "PARTIAL"
      ? "partial"
      : book.translationStatus === "TRANSLATED"
        ? "translated"
        : book.translationStatus === "NOMINATED"
          ? "nominated"
          : "not-translated";

  const translationStatusLabel = t(
    `translationStatus.${book.translationStatus}` as
      | "translationStatus.NOT_TRANSLATED"
      | "translationStatus.NOMINATED"
      | "translationStatus.TRANSLATED"
      | "translationStatus.PARTIAL",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: displayName,
    isbn: book.isbn,
    inLanguage: book.language,
    publisher: book.publisher
      ? { "@type": "Organization", name: localizedPublisherName(book.publisher, locale) }
      : undefined,
    image: book.imageUrl,
    description: description?.slice(0, 500),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[var(--brand-gray-50)]">
        <nav
          className="bg-white border-b border-[var(--brand-gray-200)] py-3"
          aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}
        >
          <div className="container-platform flex items-center gap-2 text-sm text-[var(--brand-gray-500)]">
            <Link href={`/${locale}`} className="hover:text-[var(--brand-red)]">
              {locale === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/books`} className="hover:text-[var(--brand-red)]">
              {t("title")}
            </Link>
            <span>/</span>
            <span className="text-[var(--brand-gray-700)] truncate max-w-[200px]">
              {displayName}
            </span>
          </div>
        </nav>
        { session && <div className=" absolute top-44 rtl:left-10 right-10 w-40 z-50">
        <Link href={`/admin/books/${book.id}`} className="">
        <MotionButton className=" text-[var(--brand-red)] flex gap-2 cursor-pointer">
        <Edit/>
        </MotionButton>
        </Link>
      </div>}
        <div className="container-platform py-8 space-y-10">
          <BookDetailHero
            locale={locale}
            displayName={displayName}
            alternateName={alternateName}
            imageUrl={book.imageUrl}
            summaryMarkdown={description}
            leadText={leadText}
            categories={book.categories}
            translationStatusVariant={translationStatusVariant}
            translationStatusLabel={translationStatusLabel}
            avgRating={avgRating}
            ratingsCount={ratings.length}
            purchaseOption={book.purchaseOption}
            price={book.price}
            referralLink={book.referralLink}
            buyNowLabel={t("buyNow")}
            visitPublisherLabel={t("visitPublisher")}
            addToWishlistLabel={t("addToWishlist")}
            shareLabel={locale === "ar" ? "مشاركة" : "Share"}
          />

          <BookBiblioTable
            className="mt-0"
            isbn={book.isbn}
            language={book.language}
            publicationYear={book.publicationYear}
            country={book.country}
            pageCount={book.pageCount}
            edition={localizedBookEdition(book, locale)}
            dimensions={book.dimensions}
            translationStatus={book.translationStatus}
            notes={book.notes}
            publisher={book.publisher}
            primaryCategory={book.primaryCategory}
            categories={book.categories}
            tags={book.tags}
            authors={book.authors}
            locale={locale}
          />

          {linkedArticles.length > 0 && (
            <section aria-labelledby="linked-articles-heading">
              <SectionHeading
                id="linked-articles-heading"
                title={t("linkedArticles")}
                className="mb-6"
              />
              <ArticleCarousel articles={linkedArticles} locale={locale} />
            </section>
          )}

          {similarBooks.length > 0 && (
            <section aria-labelledby="similar-books-heading">
              <SectionHeading
                id="similar-books-heading"
                title={t("similarBooks")}
                subtitle={similarBooksGeneral ? t("similarBooksGeneral") : undefined}
                className="mb-6"
              />
              <BookCarousel books={similarBooks} locale={locale} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
