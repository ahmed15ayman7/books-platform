import { normalizeImageSrc } from "@/lib/markdown/normalize-image-url";
import {
  htmlToArticleSource,
  parseArticleContent,
} from "@/lib/markdown/parse-article-content";

/** Normalize and validate a URL before using it as a card/thumbnail image. */
export function normalizeArticleImageUrl(raw: string | null | undefined): string | null {
  return normalizeImageSrc(raw);
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
