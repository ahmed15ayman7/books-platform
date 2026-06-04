const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?[^#]*)?$/i;

const IMAGE_HOST_HINTS = [
  "wp-content/uploads",
  "images.unsplash.com",
  "i.imgur.com",
  "cdn.",
  "/uploads/",
];

/** Returns true when a URL likely points to an image asset. */
export function isImageUrl(raw: string): boolean {
  const url = raw.trim();
  if (!url) return false;

  if (IMAGE_EXT.test(url)) return true;

  try {
    const parsed = new URL(url, "https://example.com");
    if (IMAGE_EXT.test(parsed.pathname)) return true;
    const joined = `${parsed.hostname}${parsed.pathname}`;
    return IMAGE_HOST_HINTS.some((hint) => joined.includes(hint));
  } catch {
    return IMAGE_EXT.test(url.split("?")[0] ?? url);
  }
}
