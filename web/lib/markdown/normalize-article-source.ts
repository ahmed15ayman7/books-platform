/** Decode a readable link label from a URL (e.g. Wikipedia slug → Arabic title). */
export function linkLabelFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
    if (lastSegment) {
      const decoded = decodeURIComponent(lastSegment.replace(/_/g, " "));
      if (decoded.trim()) return decoded;
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
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

/** Turn bare (https://...) URLs into markdown links with decoded labels. Skips markdown image/link syntax. */
export function linkifyParenthesizedUrls(text: string): string {
  return text.replace(/(?<!\])\(https?:\/\/[^\s)]+\)/g, (match) => {
    const url = match.slice(1, -1);
    const label = linkLabelFromUrl(url);
    return `[${label}](${url})`;
  });
}

/** Full WordPress/markdown cleanup before block parsing. */
export function normalizeArticleSource(raw: string): string {
  let out = unescapeWordPressEscapes(raw);
  out = replaceCaptionShortcodes(out);
  out = linkifyParenthesizedUrls(out);
  return out;
}
