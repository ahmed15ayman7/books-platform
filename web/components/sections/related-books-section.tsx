import { BookCard } from "@/components/sections/book-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/lib/i18n";

interface RelatedBook {
  slug: string;
  nameEn: string;
  nameAr: string | null;
  imageUrl: string | null;
  translationStatus?: string | null;
  primaryCategory?: { name: string; nameAr: string | null } | null;
}

interface RelatedBooksSectionProps {
  locale: Locale;
  books: RelatedBook[];
}

export function RelatedBooksSection({ locale, books }: RelatedBooksSectionProps) {
  const isAr = locale === "ar";
  if (books.length === 0) return null;

  return (
    <section aria-labelledby="related-books-heading" className="mt-10">
      <SectionHeading
        id="related-books-heading"
        title={isAr ? "الكتب في هذا المحتوى" : "Books in this content"}
        className="mb-6"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={book.slug}
            slug={book.slug}
            nameEn={book.nameEn}
            nameAr={book.nameAr}
            imageUrl={book.imageUrl}
            translationStatus={book.translationStatus ?? undefined}
            primaryCategory={book.primaryCategory ?? undefined}
            locale={locale}
            compact
          />
        ))}
      </div>
    </section>
  );
}
