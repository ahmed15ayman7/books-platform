export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Updates slug when English name changes, unless the user customized the slug
 * (current slug no longer matches the slug derived from the previous English name).
 */
export function autoSlugFromEnglish(
  englishName: string,
  currentSlug: string,
  previousEnglishName: string,
): string {
  const en = englishName.trim();
  if (!en) return currentSlug;

  const next = slugify(en);
  if (!currentSlug.trim()) return next;

  const prev = previousEnglishName.trim();
  if (!prev) return currentSlug;

  if (currentSlug === slugify(prev)) return next;
  return currentSlug;
}

export const AUTO_SLUG_HINT =
  "يُولَّد تلقائياً من الاسم الإنجليزي — يمكنك تعديله يدوياً";
