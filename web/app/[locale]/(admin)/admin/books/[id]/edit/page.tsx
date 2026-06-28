import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { Button } from "@/components/ui/button";
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

  const book = await db.product.findFirst({
    where: { id, ...notDeleted },
    include: {
      publisher: { select: { id: true } },
      primaryCategory: { select: { id: true } },
      categories: { select: { id: true } },
      authors: { select: { id: true } },
    },
  });

  if (!book) notFound();

  const publicUrl = absoluteUrl(`/${locale}/books/${book.slug}`);
  const linkedAuthorIds = book.authors.map((a) => a.id);

  const [publishers, categories, allAuthors] = await Promise.all([
    db.publisher.findMany({
      where: { status: "publish" },
      select: { id: true, title: true, name: true, nameAr: true, slug: true },
      orderBy: { title: "asc" },
    }),
    db.productCategory.findMany({
      select: { id: true, name: true, nameAr: true, slug: true },
      orderBy: { name: "asc" },
    }),
    db.author.findMany({
      where: {
        OR: [
          { spamFlag: null },
          ...(linkedAuthorIds.length > 0 ? [{ id: { in: linkedAuthorIds } }] : []),
        ],
      },
      select: { id: true, name: true, nameAr: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="text-[var(--admin-text)]">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--admin-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/${locale}/admin/books/${id}`}
            className="flex shrink-0 items-center gap-1.5 text-sm text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-accent)]"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة للكتاب
          </Link>
          <span className="text-[var(--admin-text-subtle)]">/</span>
          <h1 className="truncate text-base font-semibold">
            تعديل: {book.nameAr ?? book.nameEn}
          </h1>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="gap-2">
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              الصفحة العامة
            </a>
          </Button>
          <BookDeleteButton
            bookId={id}
            bookTitle={book.nameAr ?? book.nameEn}
            locale={locale}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <BookEditForm
          bookId={book.id}
          locale={locale}
          bookSlug={book.slug}
          bookOriginalId={book.originalId}
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
            editionAr: book.editionAr ?? "",
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
