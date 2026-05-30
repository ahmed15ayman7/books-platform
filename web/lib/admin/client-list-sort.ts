import { parseSortParam } from "./list-query";

type SortAccessor<T> = (item: T) => string | number | Date | null | undefined;

export function sortClientList<T>(
  items: T[],
  sort: string,
  accessors: Record<string, SortAccessor<T>>,
  defaultField: string,
): T[] {
  const { sortBy, sortOrder } = parseSortParam(sort, defaultField);
  const accessor = accessors[sortBy] ?? accessors[defaultField];
  if (!accessor) return items;

  const dir = sortOrder === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * dir;
    }
    const as = av instanceof Date ? String(av.getTime()) : String(av);
    const bs = bv instanceof Date ? String(bv.getTime()) : String(bv);
    return as.localeCompare(bs, "ar") * dir;
  });
}
