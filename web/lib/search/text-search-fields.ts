/** Shared Prisma `contains` OR clauses — keep search scope consistent across the app. */

export const BOOK_SEARCH_FIELDS = [
  "nameEn",
  "nameAr",
  "slug",
  "shortDesc",
  "shortDescAr",
  "description",
  "descriptionAr",
  "yoastMetadesc",
] as const;

export const ARTICLE_SEARCH_FIELDS = [
  "title",
  "titleEn",
  "slug",
  "excerpt",
  "excerptEn",
  "content",
  "contentEn",
] as const;

export const PUBLISHER_SEARCH_FIELDS = [
  "title",
  "name",
  "nameAr",
  "slug",
  "excerpt",
  "content",
  "contentAr",
] as const;

export const AUTHOR_SEARCH_FIELDS = [
  "name",
  "nameAr",
  "slug",
  "bio",
  "bioAr",
] as const;

export function buildTextSearchOr(q: string, fields: readonly string[]) {
  return {
    OR: fields.map((field) => ({
      [field]: { contains: q, mode: "insensitive" as const },
    })),
  };
}
