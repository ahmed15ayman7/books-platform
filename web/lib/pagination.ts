/** Page numbers to render, with ellipsis for large page counts. */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible = 7
): (number | "ellipsis")[] {
  if (totalPages <= 1) return [];
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let p = currentPage - 1; p <= currentPage + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }

  return result;
}
