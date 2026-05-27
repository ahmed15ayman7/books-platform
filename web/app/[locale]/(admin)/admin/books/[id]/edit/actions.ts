"use server";

import { db } from "@/lib/db";
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

export async function updateBook(id: string, data: BookEditData) {
  const {
    categoryIds,
    authorIds,
    publisherId,
    primaryCategoryId,
    publicationYear,
    pageCount,
    price,
    ...rest
  } = data;

  const parsedYear = publicationYear.trim() !== "" ? parseInt(publicationYear, 10) : null;
  const parsedPages = pageCount.trim() !== "" ? parseInt(pageCount, 10) : null;
  const parsedPrice = price.trim() !== "" ? parseFloat(price) : null;

  await db.product.update({
    where: { id },
    data: {
      ...rest,
      publicationYear: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
      pageCount: parsedPages && !isNaN(parsedPages) ? parsedPages : null,
      price: parsedPrice !== null && !isNaN(parsedPrice) ? parsedPrice : null,
      publisherId: publisherId || null,
      primaryCategoryId: primaryCategoryId || null,
      categories: {
        set: categoryIds.map((cid) => ({ id: cid })),
      },
      authors: {
        set: authorIds.map((aid) => ({ id: aid })),
      },
    },
  });

  revalidatePath(`/`, "layout");

  return { success: true };
}
