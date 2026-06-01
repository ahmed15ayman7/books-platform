import { localizedBookName, type BookLocalizedFields } from "@/lib/i18n/book-locale";

export type ArticleLinkedProduct = BookLocalizedFields & {
  slug: string;
  imageUrl?: string | null;
};

export type ArticleLinkedBookDisplay = {
  slug: string;
  name: string;
  imageUrl?: string | null;
};

export function articleLinkedBookDisplay(
  product: ArticleLinkedProduct | null | undefined,
  locale: string,
): ArticleLinkedBookDisplay | undefined {
  if (!product) return undefined;
  return {
    slug: product.slug,
    name: localizedBookName(product, locale),
    imageUrl: product.imageUrl,
  };
}

export function mapArticleForCard<
  T extends { products?: ArticleLinkedProduct[] },
>(
  article: T,
  locale: string,
): Omit<T, "products"> & { linkedBook?: ArticleLinkedBookDisplay } {
  const { products, ...rest } = article;
  const linkedBook = articleLinkedBookDisplay(products?.[0], locale);
  return linkedBook ? { ...rest, linkedBook } : rest;
}
