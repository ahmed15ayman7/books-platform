import { isImageUrl } from "./is-image-url";
import { normalizeImageSrc } from "./normalize-image-url";

/** True when a URL should render as an inline/block image (not an external link). */
export function isArticleImageUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;

  const normalized = normalizeImageSrc(trimmed);
  if (normalized) return isImageUrl(normalized);

  return isImageUrl(trimmed);
}

/** Resolved absolute image src, or null when the URL is not an image asset. */
export function resolveArticleImageSrc(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const normalized = normalizeImageSrc(trimmed);
  if (normalized && isImageUrl(normalized)) return normalized;

  if (isImageUrl(trimmed)) return trimmed;

  return null;
}
