"use server";

import { db } from "@/lib/db";
import { nextProductOriginalId } from "@/lib/admin/legacy-ids";
import { nextProductPosition } from "@/lib/admin/product-position";
import { revalidatePublicBookCaches } from "@/lib/cache/revalidate-public";
import { slugify } from "@/lib/admin/slugify";
import { revalidatePath } from "next/cache";

export interface BookEditData {
  nameEn: string;
  nameAr: string;
  slug: string;
  isbn: string;
  imageUrl: string;
  language: string;
  publicationYear: string;
  country: string;
  pageCount: string;
  edition: string;
  editionAr: string;
  dimensions: string;
  translationStatus: string;
  purchaseOption: string;
  price: string;
  currency: string;
  referralLink: string;
  shortDesc: string;
  shortDescAr: string;
  description: string;
  descriptionAr: string;
  notes: string;
  published: boolean;
  featured: boolean;
  inStock: boolean;
  publisherId: string;
  primaryCategoryId: string;
  categoryIds: string[];
  authorIds: string[];
}

export type BookActionResult =
  | { ok: true; id?: string; slug?: string }
  | { ok: false; error: string };

function resolveNameEn(nameEn: string, nameAr: string): string {
  const en = nameEn.trim();
  if (en) return en;
  const ar = nameAr.trim();
  if (ar) return ar;
  return "";
}

export async function updateBook(id: string, data: BookEditData): Promise<BookActionResult> {
  try {
    const nameEn = resolveNameEn(data.nameEn, data.nameAr);
    if (!nameEn) {
      return { ok: false, error: "الاسم بالإنجليزية أو العربية مطلوب" };
    }

    const slug = data.slug.trim() || slugify(nameEn);
    if (!slug) {
      return { ok: false, error: "الرابط المختصر (Slug) مطلوب" };
    }

    const {
      categoryIds,
      authorIds,
      publisherId,
      primaryCategoryId,
      publicationYear,
      pageCount,
      price,
      edition,
      editionAr,
      ...rest
    } = data;

    const parsedYear = publicationYear.trim() !== "" ? parseInt(publicationYear, 10) : null;
    const parsedPages = pageCount.trim() !== "" ? parseInt(pageCount, 10) : null;
    const parsedPrice = price.trim() !== "" ? parseFloat(price) : null;

    const existing = await db.product.findFirst({ where: { id } });
    if (!existing) {
      return { ok: false, error: "الكتاب غير موجود" };
    }

    const shouldBoostPosition =
      data.published && (!existing.published || existing.position === 0);

    await db.product.update({
      where: { id },
      data: {
        ...rest,
        nameEn,
        slug,
        edition: edition.trim() || null,
        editionAr: editionAr.trim() || null,
        publicationYear: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
        pageCount: parsedPages && !isNaN(parsedPages) ? parsedPages : null,
        price: parsedPrice !== null && !isNaN(parsedPrice) ? parsedPrice : null,
        publisherId: publisherId || null,
        primaryCategoryId: primaryCategoryId || null,
        ...(shouldBoostPosition ? { position: await nextProductPosition() } : {}),
        categories: {
          set: categoryIds.map((cid) => ({ id: cid })),
        },
        authors: {
          set: authorIds.map((aid) => ({ id: aid })),
        },
      },
    });

    revalidatePublicBookCaches();
    revalidatePath(`/`, "layout");
    return { ok: true, id, slug };
  } catch (err) {
    console.error("[updateBook]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الكتاب",
    };
  }
}

export async function createBook(data: BookEditData): Promise<BookActionResult> {
  try {
    const nameEn = resolveNameEn(data.nameEn, data.nameAr);
    if (!nameEn) {
      return { ok: false, error: "الاسم بالإنجليزية أو العربية مطلوب" };
    }

    const slug = data.slug.trim() || slugify(nameEn);
    if (!slug) {
      return { ok: false, error: "الرابط المختصر (Slug) مطلوب" };
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return { ok: false, error: "هذا الرابط المختصر مستخدم بالفعل لكتاب آخر" };
    }

    const {
      categoryIds,
      authorIds,
      publisherId,
      primaryCategoryId,
      publicationYear,
      pageCount,
      price,
      edition,
      editionAr,
      ...rest
    } = data;

    const parsedYear = publicationYear.trim() !== "" ? parseInt(publicationYear, 10) : null;
    const parsedPages = pageCount.trim() !== "" ? parseInt(pageCount, 10) : null;
    const parsedPrice = price.trim() !== "" ? parseFloat(price) : null;
    const originalId = await nextProductOriginalId();
    const position = await nextProductPosition();

    const book = await db.product.create({
      data: {
        ...rest,
        nameEn,
        slug,
        originalId,
        position,
        edition: edition.trim() || null,
        editionAr: editionAr.trim() || null,
        publicationYear: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
        pageCount: parsedPages && !isNaN(parsedPages) ? parsedPages : null,
        price: parsedPrice !== null && !isNaN(parsedPrice) ? parsedPrice : null,
        publisherId: publisherId || null,
        primaryCategoryId: primaryCategoryId || null,
        categories: {
          connect: categoryIds.map((cid) => ({ id: cid })),
        },
        authors: {
          connect: authorIds.map((aid) => ({ id: aid })),
        },
      },
    });

    revalidatePublicBookCaches();
    revalidatePath(`/`, "layout");
    return { ok: true, id: book.id, slug: book.slug };
  } catch (err) {
    console.error("[createBook]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الكتاب",
    };
  }
}

