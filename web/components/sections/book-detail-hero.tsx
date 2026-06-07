import Link from "next/link";
import { ExternalLink, Heart, Share2, ShoppingCart, Star } from "lucide-react";
import { BookDetailCover } from "@/components/sections/book-detail-cover";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookSummaryMarkdown } from "@/lib/markdown/book-summary-markdown";
import type { Locale } from "@/lib/i18n";

/** Fixed cover size for all books on detail page (4:3) */
export const BOOK_DETAIL_COVER_WIDTH = 360;
export const BOOK_DETAIL_COVER_HEIGHT = Math.round((BOOK_DETAIL_COVER_WIDTH * 3) / 2);

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
}

interface BookDetailHeroProps {
  locale: Locale;
  displayName: string;
  alternateName: string | null;
  imageUrl: string | null;
  summaryMarkdown: string | null;
  leadText: string | null;
  categories: Category[];
  translationStatusVariant: string;
  translationStatusLabel: string;
  avgRating: number | null;
  ratingsCount: number;
  purchaseOption: string;
  price: unknown;
  referralLink: string | null;
  buyNowLabel: string;
  visitPublisherLabel: string;
  addToWishlistLabel: string;
  shareLabel: string;
}

export function BookDetailHero({
  locale,
  displayName,
  alternateName,
  imageUrl,
  summaryMarkdown,
  leadText,
  categories,
  translationStatusVariant,
  translationStatusLabel,
  avgRating,
  ratingsCount,
  purchaseOption,
  price,
  referralLink,
  buyNowLabel,
  visitPublisherLabel,
  addToWishlistLabel,
  shareLabel,
}: BookDetailHeroProps) {
  const isAr = locale === "ar";

  const summaryColumn = (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/${locale}/books/category/${cat.slug}`}>
            <Badge variant="category">{isAr && cat.nameAr ? cat.nameAr : cat.name}</Badge>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--brand-red-soft)] bg-gradient-to-br from-[var(--brand-red-soft)]/40 to-white px-5 py-6 md:px-7 md:py-8">
        <h1 className="font-display text-3xl font-black leading-tight text-[var(--brand-red)]  sm:text-4xl md:text-[2.5rem]">
          {displayName}
        </h1>
        {alternateName && (
          <p
            className="mt-2 text-base font-medium text-[var(--brand-gray-500)]"
            dir={isAr ? "ltr" : "rtl"}
          >
            {alternateName}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge
            variant={
              (translationStatusVariant === "partial"
                ? "nominated"
                : translationStatusVariant) as BadgeProps["variant"]
            }
            className="px-3 py-1 text-sm"
          >
            {translationStatusLabel}
          </Badge>
          {avgRating != null && (
            <div className="flex items-center gap-1" aria-label={`Rating: ${avgRating} out of 5`}>
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
              <span className="text-sm text-[var(--brand-gray-500)]">({ratingsCount})</span>
            </div>
          )}
        </div>

        {leadText && (
          <p className="mt-5 text-lg font-medium leading-relaxed text-[var(--brand-gray-800)]">
            {leadText}
          </p>
        )}

        {summaryMarkdown && (
          <div className="mt-5 border-t border-[var(--brand-red)]/15 pt-5">
            <BookSummaryMarkdown content={summaryMarkdown} />
          </div>
        )}
      </div>
    </div>
  );

  const coverColumn = (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 sm:max-w-none sm:mx-0 lg:w-[360px] lg:shrink-0">
      <BookDetailCover
        src={imageUrl}
        alt={displayName}
        width={BOOK_DETAIL_COVER_WIDTH}
        height={BOOK_DETAIL_COVER_HEIGHT}
      />

      <div className="flex flex-col gap-2">
        {purchaseOption === "DIRECT" && price != null && (
          <Button size="lg" className="w-full">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {buyNowLabel} — ${String(price)}
          </Button>
        )}
        {purchaseOption === "REFERRAL" && referralLink && (
          <Button asChild size="lg" variant="outline" className="w-full">
            <a href={referralLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {visitPublisherLabel}
            </a>
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 border border-[var(--brand-gray-200)] text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
            aria-label={addToWishlistLabel}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 border border-[var(--brand-gray-200)] text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
            aria-label={shareLabel}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--brand-gray-200)] bg-white shadow-[var(--shadow-soft-lg)]">
      {/*
        لا نضع dir=rtl على الـ grid — يعكس ترتيب الأعمدة ويوسّع الفراغ بين الملخص والغلاف.
        العربي: ملخص يسار (1fr) + غلاف يمين (280px) مع نص RTL داخل عمود الملخص.
      */}
      <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div dir={isAr ? "rtl" : "ltr"} className="min-w-0">
          {summaryColumn}
        </div>
        <div className="min-w-0 lg:justify-self-start">
          {coverColumn}
        </div>
      </div>
    </section>
  );
}
