import { db } from "@/lib/db";

const MAX_INT = 2_147_483_647;

async function nextSequentialId(currentMax: number | null): Promise<number> {
  const next = (currentMax ?? 0) + 1;
  if (next > MAX_INT) {
    throw new Error("تم تجاوز الحد الأقصى لمعرّف النظام القديم");
  }
  return next;
}

export async function nextProductOriginalId(): Promise<number> {
  const result = await db.product.aggregate({ _max: { originalId: true } });
  return nextSequentialId(result._max.originalId);
}

export async function nextAuthorTermId(): Promise<number> {
  const result = await db.author.aggregate({ _max: { termId: true } });
  return nextSequentialId(result._max.termId);
}

export async function nextCategoryTermId(): Promise<number> {
  const result = await db.productCategory.aggregate({ _max: { termId: true } });
  return nextSequentialId(result._max.termId);
}

export async function nextPublisherOriginalId(): Promise<number> {
  const result = await db.publisher.aggregate({ _max: { originalId: true } });
  return nextSequentialId(result._max.originalId);
}
