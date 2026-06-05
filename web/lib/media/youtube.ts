export const MEDIA_CHANNELS = ["books-talk", "novel-story"] as const;

/** @deprecated Legacy channel — redirects to /media */
export const LEGACY_MEDIA_CHANNEL = "watch-your-book";

export type MediaChannel = (typeof MEDIA_CHANNELS)[number];

export function isMediaChannel(channel: string | null | undefined): boolean {
  if (!channel) return false;
  return (MEDIA_CHANNELS as readonly string[]).includes(channel);
}

export function parseYoutubeUrl(url: string): { videoId: string | null; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) return { videoId: null };

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id ? { videoId: id } : { videoId: null, error: "Invalid YouTube URL" };
    }

    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtube-nocookie.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/")[2];
        return id ? { videoId: id } : { videoId: null, error: "Invalid YouTube URL" };
      }
      const v = parsed.searchParams.get("v");
      if (v) return { videoId: v };
    }

    return { videoId: null, error: "Invalid YouTube URL" };
  } catch {
    return { videoId: null, error: "Invalid YouTube URL" };
  }
}

export function youtubeThumbnail(videoId: string, size: "hq" | "mq" = "hq"): string {
  const suffix = size === "hq" ? "hqdefault" : "mqdefault";
  return `https://img.youtube.com/vi/${videoId}/${suffix}.jpg`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
