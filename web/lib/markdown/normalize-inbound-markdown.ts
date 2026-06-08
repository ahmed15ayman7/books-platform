import { htmlToArticleSource } from "@/lib/markdown/parse-article-content";

export function normalizeInboundMarkdown(raw: string): string {
  const trimmed = raw.replace(/\r\n/g, "\n").trim();
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return htmlToArticleSource(trimmed);
  }
  return trimmed;
}

export function normalizeOutboundMarkdown(md: string): string {
  return md
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
