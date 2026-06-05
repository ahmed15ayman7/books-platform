import {
  htmlToArticleSource,
  parseArticleContent,
} from "@/lib/markdown/parse-article-content";

function firstImageFromText(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  const source = raw.includes("<") ? htmlToArticleSource(raw) : raw;
  const blocks = parseArticleContent(source);
  const image = blocks.find((block) => block.type === "image");
  return image?.type === "image" ? image.src : null;
}

/** Article card image: featured → linked book cover → first image in excerpt/content. */
export function resolveArticleDisplayImage(params: {
  imageUrl?: string | null;
  bookImageUrl?: string | null;
  excerpt?: string | null;
  content?: string | null;
}): string | null {
  const featured = params.imageUrl?.trim();
  if (featured) return featured;

  const bookCover = params.bookImageUrl?.trim();
  if (bookCover) return bookCover;

  return firstImageFromText(params.excerpt) ?? firstImageFromText(params.content);
}
