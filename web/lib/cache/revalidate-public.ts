import { revalidatePath } from "next/cache";

/** Invalidate cached public pages after book/catalog mutations. */
export function revalidatePublicBookCaches(): void {
  revalidatePath("/", "layout");
  revalidatePath("/ar", "page");
  revalidatePath("/en", "page");
  revalidatePath("/ar/books", "page");
  revalidatePath("/en/books", "page");
}
