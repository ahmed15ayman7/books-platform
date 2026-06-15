import { localeHref } from "@/lib/i18n/href";
import { isMediaChannel } from "@/lib/media/youtube";

export function publicBookUrl(locale: string, slug: string): string {
  return localeHref(locale, `/books/${slug}`);
}

export function publicArticleUrl(locale: string, slug: string): string {
  return localeHref(locale, `/articles/${slug}`);
}

export function publicPublisherUrl(locale: string, slug: string): string {
  return localeHref(locale, `/publishers/${slug}`);
}

export function publicAuthorUrl(locale: string, slug: string): string {
  return localeHref(locale, `/authors/${slug}`);
}

export function adminBookViewPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/books/${id}`);
}

export function adminBookEditPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/books/${id}/edit`);
}

export function adminArticleViewPath(
  locale: string,
  id: string,
  channel?: string | null,
): string {
  if (isMediaChannel(channel ?? null)) {
    return localeHref(locale, `/admin/media/${id}`);
  }
  return localeHref(locale, `/admin/articles/${id}`);
}

export function adminArticleEditPath(
  locale: string,
  id: string,
  channel?: string | null,
): string {
  if (isMediaChannel(channel ?? null)) {
    return localeHref(locale, `/admin/media/${id}/edit`);
  }
  return localeHref(locale, `/admin/articles/${id}/edit`);
}

export function adminMediaViewPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/media/${id}`);
}

export function adminMediaEditPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/media/${id}/edit`);
}

export function adminPublisherViewPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/publishers/${id}`);
}

export function adminPublisherEditPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/publishers/${id}/edit`);
}

export function adminAuthorViewPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/authors/${id}`);
}

export function adminAuthorEditPath(locale: string, id: string): string {
  return localeHref(locale, `/admin/authors/${id}/edit`);
}

export function formatArticleApiResponse(article: {
  content: string | null;
  contentEn?: string | null;
  titleEn?: string | null;
  excerptEn?: string | null;
  products: { id: string }[];
  [key: string]: unknown;
}) {
  return {
    ...article,
    body: article.content,
    bodyEn: article.contentEn ?? "",
    titleEn: article.titleEn ?? "",
    excerptEn: article.excerptEn ?? "",
    productIds: article.products.map((p) => p.id),
  };
}
