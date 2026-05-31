import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BookEditForm } from "../[id]/edit/book-edit-form";
import type { BookEditData } from "../[id]/edit/actions";

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata = { title: "إضافة كتاب جديد" };

const emptyBook: BookEditData = {
  nameEn: "",
  nameAr: "",
  slug: "",
  isbn: "",
  imageUrl: "",
  language: "",
  publicationYear: "",
  country: "",
  pageCount: "",
  edition: "",
  editionAr: "",
  dimensions: "",
  translationStatus: "NOT_TRANSLATED",
  purchaseOption: "NOT_AVAILABLE",
  price: "",
  currency: "USD",
  referralLink: "",
  shortDesc: "",
  shortDescAr: "",
  description: "",
  descriptionAr: "",
  notes: "",
  published: true,
  featured: false,
  inStock: true,
  publisherId: "",
  primaryCategoryId: "",
  categoryIds: [],
  authorIds: [],
};

export default async function AdminBookNewPage({ params }: Props) {
  const { locale } = await params;

  const [publishers, categories, allAuthors] = await Promise.all([
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

  return (
    <div className="text-white">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--brand-gray-800)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/${locale}/admin/books`}
            className="flex shrink-0 items-center gap-1.5 text-sm text-[var(--brand-gray-400)] transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة للقائمة
          </Link>
          <span className="text-[var(--brand-gray-600)]">/</span>
          <h1 className="truncate text-base font-semibold">إضافة كتاب جديد</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <BookEditForm
          locale={locale}
          initial={emptyBook}
          publishers={publishers}
          categories={categories}
          authors={allAuthors}
        />
      </div>
    </div>
  );
}
