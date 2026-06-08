const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)(\?[^#]*)?$/i;

const IMAGE_HOST_HINTS = [
  "wp-content/uploads",
  "images.unsplash.com",
  "i.imgur.com",
  "cdn.",
  "/uploads/",
  "gstatic.com",
  "googleusercontent.com",
  "ggpht.com",
  "ytimg.com",
  "fbcdn.net",
  "cloudinary.com",
  "imgix.net",
];

const IMAGE_QUERY_HINTS = ["tbn=", "format=image", "imgurl=", "imgrefurl=", "image="];

const URL_PREFIX = /^(https?:\/\/|\/\/|\/|data:image\/)/i;

/** Returns true when a string is a bare image URL (not prose containing a URL). */
export function isImageUrl(raw: string): boolean {
  const url = raw.trim();
  if (!url) return false;

  // Prose lines that embed URLs must not be treated as image-only blocks.
  if (!url.startsWith("data:image/") && /\s/.test(url)) return false;

  if (!URL_PREFIX.test(url) && !IMAGE_EXT.test(url)) return false;

  if (IMAGE_EXT.test(url)) return true;

  if (url.startsWith("data:image/")) return true;

  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    if (IMAGE_EXT.test(parsed.pathname)) return true;

    const joined = `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();
    if (IMAGE_HOST_HINTS.some((hint) => joined.includes(hint))) return true;
    if (IMAGE_QUERY_HINTS.some((hint) => joined.includes(hint))) return true;

    if (parsed.pathname === "/images" && parsed.search.includes("tbn")) return true;

    return false;
  } catch {
    const lower = url.toLowerCase();
    if (IMAGE_EXT.test(url.split("?")[0] ?? url)) return true;
    if (!URL_PREFIX.test(url)) return false;
    return (
      IMAGE_HOST_HINTS.some((hint) => lower.includes(hint)) ||
      IMAGE_QUERY_HINTS.some((hint) => lower.includes(hint))
    );
  }
}
