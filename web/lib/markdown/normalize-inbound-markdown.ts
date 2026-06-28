import { htmlToArticleSource } from "@/lib/markdown/parse-article-content";
import { normalizeMarkdownHardBreaks } from "@/lib/markdown/normalize-article-source";

export function normalizeInboundMarkdown(raw: string): string {
  const trimmed = normalizeMarkdownHardBreaks(raw.replace(/\r\n/g, "\n").trim());
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return htmlToArticleSource(trimmed);
  }
  return trimmed;
}

export function normalizeOutboundMarkdown(md: string): string {
  return normalizeMarkdownHardBreaks(
    md
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}
