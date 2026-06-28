import { db } from "@/lib/db";

/** Next display position so new books surface in home/catalog carousels immediately. */
export async function nextProductPosition(): Promise<number> {
  const result = await db.product.aggregate({ _max: { position: true } });
  return (result._max.position ?? 0) + 1;
}
