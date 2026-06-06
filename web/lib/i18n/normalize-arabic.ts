/** Normalize Arabic for fuzzy category name matching (legacy import variants). */
export function normalizeArabic(text: string): string {
  return text
    .trim()
    .replace(/[\u0640\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ى]/g, "ي")
    .replace(/\s+/g, " ")
    .toLowerCase();
}
