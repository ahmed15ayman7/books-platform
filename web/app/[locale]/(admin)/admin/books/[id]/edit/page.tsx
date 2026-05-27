import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BookEditForm } from "./book-edit-form";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const book = await db.product.findUnique({ where: { id }, select: { nameEn: true, nameAr: true } });
  return { title: book ? `تعديل: ${book.nameAr ?? book.nameEn}` : "تعديل كتاب" };
}

export default async function BookEditPage({ params }: Props) {
  const { id, locale } = await params;

  const [book, publishers, categories, allAuthors] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        publisher: { select: { id: true } },
        primaryCategory: { select: { id: true } },
        categories: { select: { id: true } },
        authors: { select: { id: true } },
      },
    }),
    db.publisher.findMany({
      where: { status: "publish" },
      select: { id: true, title: true, slug: true },
      orderBy: { title: "asc" },
    }),
    db.productCategory.findMany({
      select: { id: true, name: true, nameAr: true, slug: true },
      orderBy: { name: "asc" },
    }),
    db.author.findMany({
      where: { spamFlag: null },
      select: { id: true, name: true, nameAr: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!book) notFound();

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      {/* Header */}
      <div className="border-b border-[var(--brand-gray-200)] bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center gap-4">
          <Link
            href={`/${locale}/admin/books`}
            className="flex items-center gap-1.5 text-sm text-[var(--brand-gray-500)] hover:text-[var(--brand-gray-900)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة للكتب
          </Link>
          <span className="text-[var(--brand-gray-300)]">/</span>
          <h1 className="text-base font-semibold text-[var(--brand-gray-900)] truncate">
            {book.nameAr ?? book.nameEn}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <BookEditForm
          book={{
            id: book.id,
            nameEn: book.nameEn,
            nameAr: book.nameAr ?? "",
            slug: book.slug,
            isbn: book.isbn ?? "",
            imageUrl: book.imageUrl ?? "",
            language: book.language ?? "",
            publicationYear: book.publicationYear?.toString() ?? "",
            country: book.country ?? "",
            pageCount: book.pageCount?.toString() ?? "",
            edition: book.edition ?? "",
            dimensions: book.dimensions ?? "",
            translationStatus: book.translationStatus,
            purchaseOption: book.purchaseOption,
            price: book.price?.toString() ?? "",
            currency: book.currency ?? "USD",
            referralLink: book.referralLink ?? "",
            shortDesc: book.shortDesc ?? "",
            shortDescAr: book.shortDescAr ?? "",
            description: book.description ?? "",
            descriptionAr: book.descriptionAr ?? "",
            notes: book.notes ?? "",
            published: book.published,
            featured: book.featured,
            inStock: book.inStock,
            publisherId: book.publisher?.id ?? "",
            primaryCategoryId: book.primaryCategory?.id ?? "",
            categoryIds: book.categories.map((c) => c.id),
            authorIds: book.authors.map((a) => a.id),
          }}
          publishers={publishers}
          categories={categories}
          authors={allAuthors}
          locale={locale}
        />
      </div>
    </div>
  );
}
