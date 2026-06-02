import type { Prisma } from "@prisma/client";

export type AdminViewMode = "table" | "grid";
export type SortOrder = "asc" | "desc";

export function parseSortOrder(value: string | null | undefined): SortOrder {
  return value === "asc" ? "asc" : "desc";
}

/** Parse combined sort value e.g. "updatedAt:desc" */
export function parseSortParam(
  value: string | null | undefined,
  defaultField: string,
  defaultOrder: SortOrder = "desc",
): { sortBy: string; sortOrder: SortOrder } {
  if (!value || !value.includes(":")) {
    return { sortBy: defaultField, sortOrder: defaultOrder };
  }
  const [sortBy, order] = value.split(":");
  return { sortBy: sortBy || defaultField, sortOrder: parseSortOrder(order) };
}

/** Build Prisma orderBy from allowlist; falls back to defaultField. */
export function buildOrderBy<T extends string>(
  sortBy: string | null | undefined,
  sortOrder: string | null | undefined,
  allowed: readonly T[],
  defaultField: T,
): Record<T, SortOrder> {
  const field = sortBy && allowed.includes(sortBy as T) ? (sortBy as T) : defaultField;
  return { [field]: parseSortOrder(sortOrder) } as Record<T, SortOrder>;
}

export function parseOptionalBool(
  value: string | null | undefined,
): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export type ProductListOrderField =
  | "updatedAt"
  | "createdAt"
  | "nameEn"
  | "nameAr"
  | "position";

export const PRODUCT_SORT_FIELDS: readonly ProductListOrderField[] = [
  "updatedAt",
  "createdAt",
  "nameEn",
  "nameAr",
  "position",
];

export function productListOrderBy(
  sortBy: string | null | undefined,
  sortOrder: string | null | undefined,
): Prisma.ProductOrderByWithRelationInput {
  return buildOrderBy(sortBy, sortOrder, PRODUCT_SORT_FIELDS, "updatedAt");
}

/** Append sort/filter params when non-default */
export function appendListParams(
  q: URLSearchParams,
  opts: {
    sort?: string;
    published?: string;
    translationStatus?: string;
    featured?: string;
    status?: string;
    channel?: string;
    sponsored?: string;
    isActive?: string;
    authorCount?: string;
  },
) {
  if (opts.sort) q.set("sort", opts.sort);
  if (opts.published && opts.published !== "all") q.set("published", opts.published);
  if (opts.translationStatus && opts.translationStatus !== "all") {
    q.set("translationStatus", opts.translationStatus);
  }
  if (opts.featured && opts.featured !== "all") q.set("featured", opts.featured);
  if (opts.status && opts.status !== "all") q.set("status", opts.status);
  if (opts.channel && opts.channel !== "all") q.set("channel", opts.channel);
  if (opts.sponsored && opts.sponsored !== "all") q.set("sponsored", opts.sponsored);
  if (opts.isActive && opts.isActive !== "all") q.set("isActive", opts.isActive);
  if (opts.authorCount && opts.authorCount !== "all") q.set("authorCount", opts.authorCount);
}
