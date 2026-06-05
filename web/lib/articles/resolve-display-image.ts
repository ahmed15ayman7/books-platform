import { isImageUrl } from "@/lib/markdown/is-image-url";
import {
  htmlToArticleSource,
  parseArticleContent,
} from "@/lib/markdown/parse-article-content";

const INVALID_LITERALS = new Set(["null", "undefined", "false", "0", "none", "#", "n/a", "na"]);

/** Normalize and validate a URL before using it as a card/thumbnail image. */
export function normalizeArticleImageUrl(raw: string | null | undefined): string | null {
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

function firstImageFromText(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  const source = raw.includes("<") ? htmlToArticleSource(raw) : raw;
  const blocks = parseArticleContent(source);

  for (const block of blocks) {
    if (block.type !== "image") continue;
    const normalized = normalizeArticleImageUrl(block.src);
    if (normalized) return normalized;
  }

  return null;
}

/** Article card image: featured → linked book covers → first image in excerpt/content. */
export function resolveArticleDisplayImage(params: {
  imageUrl?: string | null;
  bookImageUrls?: Array<string | null | undefined>;
  excerpt?: string | null;
  content?: string | null;
}): string | null {
  const featured = normalizeArticleImageUrl(params.imageUrl);
  if (featured) return featured;

  for (const raw of params.bookImageUrls ?? []) {
    const cover = normalizeArticleImageUrl(raw);
    if (cover) return cover;
  }

  return firstImageFromText(params.excerpt) ?? firstImageFromText(params.content);
}

export function articleHasDisplayImage(params: {
  imageUrl?: string | null;
  bookImageUrls?: Array<string | null | undefined>;
  excerpt?: string | null;
  content?: string | null;
}): boolean {
  return resolveArticleDisplayImage(params) !== null;
}
