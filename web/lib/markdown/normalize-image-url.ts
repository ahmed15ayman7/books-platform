import { isImageUrl } from "./is-image-url";

const INVALID_LITERALS = new Set(["null", "undefined", "false", "0", "none", "#", "n/a", "na"]);

/** Normalize and validate an image URL from article HTML/markdown. */
export function normalizeImageSrc(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || INVALID_LITERALS.has(trimmed.toLowerCase())) return null;

  let candidate = trimmed;
  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`;
  } else if (candidate.startsWith("/")) {
    candidate = `https://booksplatform.net${candidate}`;
  }

  if (!/^https?:\/\//i.test(candidate)) return null;
  if (!isImageUrl(candidate)) return null;

  return candidate;
}
