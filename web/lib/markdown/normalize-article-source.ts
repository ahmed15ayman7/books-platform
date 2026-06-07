/** Decode a readable link label from a URL (e.g. Wikipedia slug → Arabic title). */
import { isArticleImageUrl } from "./article-media-url";

const ENCODED_LABEL = /%[0-9A-Fa-f]{2}/;

/** Decode URL-encoded or slug-style link labels for display. */
export function decodeLinkLabel(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  if (ENCODED_LABEL.test(trimmed)) {
    try {
      return decodeURIComponent(trimmed.replace(/\+/g, " ")).replace(/_/g, " ").trim();
    } catch {
      /* fall through */
    }
  }

  return trimmed.replace(/_/g, " ");
}

export function linkLabelFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i -= 1) {
      const decoded = decodeLinkLabel(segments[i]!);
      if (decoded && !decoded.startsWith("wiki") && decoded.length > 1) {
        return decoded;
      }
    }
    if (parsed.hash) {
      const fromHash = decodeLinkLabel(parsed.hash.replace(/^#/, ""));
      if (fromHash) return fromHash;
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return decodeLinkLabel(url);
  }
}

/** Best display label for a markdown or auto-generated link. */
export function resolveLinkLabel(label: string, href: string): string {
  const trimmed = label.trim();
  if (trimmed && trimmed !== href && !/^https?:\/\//i.test(trimmed)) {
    return decodeLinkLabel(trimmed);
  }
  return linkLabelFromUrl(href);
}

/** Unescape WordPress/export-style backslash escapes in shortcodes and links. */
export function unescapeWordPressEscapes(text: string): string {
  return text.replace(/\\([[\]_()\\])/g, "$1");
}

const CAPTION_SHORTCODE =
  /\[caption\b[^\]]*\]([\s\S]*?)\[\/caption\]/gi;

const MD_IMAGE_INNER = /!\[([^\]]*)\]\(([^)]+)\)/;
const HTML_IMG_SRC = /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/i;

/** Convert WordPress [caption] shortcodes into markdown images or caption text. */
export function replaceCaptionShortcodes(text: string): string {
  return text.replace(CAPTION_SHORTCODE, (_, inner: string) => {
    const trimmed = inner.trim();
    if (!trimmed) return "";

    const htmlSrc = HTML_IMG_SRC.exec(trimmed)?.[1]?.trim();
    const mdMatch = MD_IMAGE_INNER.exec(trimmed);
    const mdSrc = mdMatch?.[2]?.trim();
    const src = htmlSrc ?? mdSrc;

    let caption = trimmed
      .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, " ")
      .replace(/<img[^>]*\/?>/gi, " ")
      .replace(MD_IMAGE_INNER, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (mdMatch?.[1]?.trim()) {
      caption = caption || mdMatch[1].trim();
    }

    if (src) {
      return `\n\n![${caption || "image"}](${src})\n\n`;
    }

    return caption ? `\n\n*${caption}*\n\n` : "";
  });
}

const EXTERNAL_URL_INNER = String.raw`https?:\/\/[^\s)\]،؛\[]+`;

/** Turn (https://...) URLs into markdown links with decoded Arabic labels. */
export function linkifyParenthesizedUrls(text: string): string {
  const openGuard = String.raw`(?<!\]\()(?<!!)`;
  let out = text.replace(
    new RegExp(String.raw`${openGuard}(${EXTERNAL_URL_INNER})\)`, "g"),
    (_match, url: string) => `[${linkLabelFromUrl(url)}](${url})`,
  );
  out = out.replace(
    new RegExp(String.raw`${openGuard}(${EXTERNAL_URL_INNER})(?=[،؛]|$|\s)`, "g"),
    (_match, url: string) => `[${linkLabelFromUrl(url)}](${url})`,
  );
  return out;
}

/** Linkify bare http(s) URLs in prose (not inside markdown [label](url) syntax). */
export function linkifyBareExternalUrls(text: string): string {
  return text.replace(
    new RegExp(String.raw`(^|[\s،؛!?…])(${EXTERNAL_URL_INNER})(?=[\s)\]،؛\[]|$)`, "g"),
    (match, before: string, url: string) => {
      if (isArticleImageUrl(url)) return match;
      return `${before}[${linkLabelFromUrl(url)}](${url})`;
    },
  );
}

/** Convert markdown-image syntax that points at a non-image URL into a text link. */
export function demoteNonImageMarkdownImages(text: string): string {
  return text.replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, (full, alt: string, url: string) => {
    if (isArticleImageUrl(url)) return full;
    const label = alt.trim() || linkLabelFromUrl(url);
    return `[${label}](${url})`;
  });
}

/** Normalize markdown links whose label is URL-encoded to decoded Arabic text. */
export function decodeMarkdownLinkLabels(text: string): string {
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (full, label: string, url: string) => {
    const resolved = resolveLinkLabel(label, url);
    if (resolved === label.trim()) return full;
    return `[${resolved}](${url})`;
  });
}

/** Full WordPress/markdown cleanup before block parsing. */
export function normalizeArticleSource(raw: string): string {
  let out = unescapeWordPressEscapes(raw);
  out = replaceCaptionShortcodes(out);
  out = demoteNonImageMarkdownImages(out);
  out = linkifyParenthesizedUrls(out);
  out = linkifyBareExternalUrls(out);
  out = decodeMarkdownLinkLabels(out);
  return out;
}
