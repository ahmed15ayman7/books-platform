import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { BookEditForm } from "./book-edit-form";
import { BookDeleteButton } from "../book-delete-button";

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
    db.product.findFirst({
      where: { id, ...notDeleted },
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
    <div className="text-white">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--brand-gray-800)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/${locale}/admin/books/${id}`}
            className="flex shrink-0 items-center gap-1.5 text-sm text-[var(--brand-gray-400)] transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة للكتاب
          </Link>
          <span className="text-[var(--brand-gray-600)]">/</span>
          <h1 className="truncate text-base font-semibold">
            تعديل: {book.nameAr ?? book.nameEn}
          </h1>
        </div>
        <BookDeleteButton
          bookId={id}
          bookTitle={book.nameAr ?? book.nameEn}
          locale={locale}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        <BookEditForm
          bookId={book.id}
          locale={locale}
          initial={{
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
        />
      </div>
    </div>
  );
}
