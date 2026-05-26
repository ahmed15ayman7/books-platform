import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { BookService } from "@/server/services/book.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookCarousel } from "@/components/sections/book-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { BookOpen, ExternalLink, Share2, Heart, ShoppingCart, Star } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import {
  localizedBookAlternateName,
  localizedBookDescription,
  localizedBookName,
} from "@/lib/i18n/book-locale";
import { bookSeoMetadata } from "@/lib/seo/metadata";

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

  const [book, similarBooks] = await Promise.all([
    BookService.getBySlug(slug).catch(() => null),
    BookService.getSimilar(slug, 6).catch(() => []),
  ]);

  if (!book) notFound();

  const displayName = localizedBookName(book, locale);
  const alternateName = localizedBookAlternateName(book, locale);
  const description = localizedBookDescription(book, locale);

  // Compute rating
  const ratings = book.ratings;
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, r: { stars: number }) => sum + r.stars, 0) / ratings.length
      : null;

  const translationStatusVariant =
    book.translationStatus === "TRANSLATED"
      ? "translated"
      : book.translationStatus === "NOMINATED"
        ? "nominated"
        : ("not-translated" as const);

  const translationStatusLabel = t(
    `translationStatus.${book.translationStatus}` as
      | "translationStatus.NOT_TRANSLATED"
      | "translationStatus.NOMINATED"
      | "translationStatus.TRANSLATED"
  );

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: displayName,
    isbn: book.isbn,
    inLanguage: book.language,
    publisher: book.publisher
      ? { "@type": "Organization", name: book.publisher.title }
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
        {/* Breadcrumb */}
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

        {/* Main Content */}
        <div className="container-platform py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            {/* Left: Cover + Actions */}
            <div className="flex flex-col gap-4">
              {/* Cover */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--brand-gray-100)] shadow-lg">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={displayName}
                    fill
                    sizes="300px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--brand-gray-400)]">
                    <BookOpen className="h-16 w-16" strokeWidth={1.25} aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {book.purchaseOption === "DIRECT" && book.price && (
                  <Button size="lg" className="w-full">
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {t("buyNow")} — ${String(book.price)}
                  </Button>
                )}
                {book.purchaseOption === "REFERRAL" && book.referralLink && (
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <a
                      href={book.referralLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      {t("visitPublisher")}
                    </a>
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1" aria-label={t("addToWishlist")}>
                    <Heart className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1" aria-label={locale === "ar" ? "مشاركة" : "Share"}>
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Book Info */}
            <div>
              {/* Categories */}
              <div className="mb-2 flex flex-wrap gap-2">
                {book.categories.map((cat) => (
                  <Link key={cat.id} href={`/${locale}/books/category/${cat.slug}`}>
                    <Badge variant="category">
                      {locale === "ar" && cat.nameAr ? cat.nameAr : cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display text-display-md font-black text-[var(--brand-gray-900)] text-balance">
                {displayName}
              </h1>
              {alternateName && (
                <p
                  className="mt-1 text-sm font-medium text-[var(--brand-gray-500)]"
                  dir={locale === "ar" ? "ltr" : "rtl"}
                >
                  {alternateName}
                </p>
              )}

              {/* Translation status */}
              <div className="mt-3">
                <Badge variant={translationStatusVariant} className="text-sm px-3 py-1">
                  {translationStatusLabel}
                </Badge>
              </div>

              {/* Rating */}
              {avgRating && (
                <div className="mt-3 flex items-center gap-1" aria-label={`Rating: ${avgRating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={
                        star <= Math.round(avgRating)
                          ? "h-5 w-5 fill-[var(--warning)] text-[var(--warning)]"
                          : "h-5 w-5 text-[var(--brand-gray-300)]"
                      }
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ms-2 text-sm text-[var(--brand-gray-500)]">
                    ({ratings.length})
                  </span>
                </div>
              )}

              {/* Book metadata */}
              <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg bg-white p-4 shadow-sm border border-[var(--brand-gray-200)]">
                {book.publisher && (
                  <MetaItem
                    label={t("publisher")}
                    value={
                      <Link
                        href={`/${locale}/publishers/${book.publisher.slug}`}
                        className="text-[var(--brand-red)] hover:underline"
                      >
                        {book.publisher.title}
                      </Link>
                    }
                  />
                )}
                {book.language && (
                  <MetaItem label={t("language")} value={book.language.toUpperCase()} />
                )}
                {book.publicationYear && (
                  <MetaItem label={t("year")} value={String(book.publicationYear)} />
                )}
                {book.isbn && (
                  <MetaItem label={t("isbn")} value={book.isbn} />
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="mt-6">
                  <h2 className="mb-3 font-bold text-[var(--brand-gray-900)]">
                    {t("summary")}
                  </h2>
                  <div
                    className="prose-brand text-[var(--brand-gray-700)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Similar Books */}
          {similarBooks.length > 0 && (
            <section className="mt-16" aria-labelledby="similar-books-heading">
              <div className="mb-6 flex items-end justify-between">
                <SectionHeading
                  id="similar-books-heading"
                  title={t("similarBooks")}
                />
              </div>
              <BookCarousel books={similarBooks} locale={locale} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[var(--brand-gray-500)] uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-[var(--brand-gray-900)]">{value}</dd>
    </div>
  );
}
