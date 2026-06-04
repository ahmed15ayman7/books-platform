import { isImageUrl } from "./is-image-url";

export type ArticleContentBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "html"; html: string };

const MD_IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;
const MD_LINK = /^\[([^\]]*)\]\(([^)]+)\)\s*$/;
const MD_HEADING = /^(#{1,3})\s+(.+)$/;

/** Normalize WordPress/HTML snippets into markdown-friendly text before parsing. */
export function htmlToArticleSource(html: string): string {
  let out = html;

  out = out.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, (_, src: string) =>
    `\n\n![image](${src.trim()})\n\n`,
  );

  out = out.replace(
    /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const link = href.trim();
      if (isImageUrl(link)) {
        return `\n\n![${text || "image"}](${link})\n\n`;
      }
      return `[${text || link}](${link})`;
    },
  );

  out = out.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<\/h[1-6]>/gi, "\n\n");
  out = out.replace(/<[^>]+>/g, "");
  out = out.replace(/&nbsp;/g, " ");
  out = out.replace(/&amp;/g, "&");
  out = out.replace(/&lt;/g, "<");
  out = out.replace(/&gt;/g, ">");
  out = out.replace(/&quot;/g, '"');

  return out.replace(/\r\n/g, "\n").trim();
}

function parseLineBlock(line: string): ArticleContentBlock | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const mdImage = MD_IMAGE.exec(trimmed);
  if (mdImage) {
    return { type: "image", src: mdImage[2]!.trim(), alt: mdImage[1]!.trim() || "صورة" };
  }

  const mdLink = MD_LINK.exec(trimmed);
  if (mdLink) {
    const label = mdLink[1]!.trim();
    const href = mdLink[2]!.trim();
    if (isImageUrl(href)) {
      return { type: "image", src: href, alt: label || "صورة", caption: label || undefined };
    }
    return { type: "paragraph", text: `[${label || href}](${href})` };
  }

  if (isImageUrl(trimmed)) {
    return { type: "image", src: trimmed, alt: "صورة" };
  }

  const heading = MD_HEADING.exec(trimmed);
  if (heading) {
    const level = heading[1]!.length as 1 | 2 | 3;
    return { type: "heading", level, text: heading[2]!.trim() };
  }

  if (/^[-*]\s+/.test(trimmed)) {
    return { type: "list", items: [trimmed.replace(/^[-*]\s+/, "")] };
  }

  return { type: "paragraph", text: trimmed };
}

export function parseArticleContent(raw: string): ArticleContentBlock[] {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(normalized);
  const source = looksLikeHtml ? htmlToArticleSource(normalized) : normalized;

  const blocks: ArticleContentBlock[] = [];
  const chunks = source.split(/\n\n+/);

  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const allList = lines.every((l) => /^[-*]\s+/.test(l));
    if (allList) {
      blocks.push({
        type: "list",
        items: lines.map((l) => l.replace(/^[-*]\s+/, "")),
      });
      continue;
    }

    if (lines.length === 1) {
      const block = parseLineBlock(lines[0]!);
      if (block) blocks.push(block);
      continue;
    }

    for (const line of lines) {
      const block = parseLineBlock(line);
      if (block) blocks.push(block);
    }
  }

  return blocks;
}
