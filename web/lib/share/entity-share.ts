export type SharePlatform =
  | "X (Twitter)"
  | "Facebook"
  | "LinkedIn"
  | "WhatsApp"
  | "Telegram"
  | "Instagram";

export interface EntitySharePayload {
  title: string;
  publicUrl: string;
  imageUrl?: string | null;
}

export function buildSharePostText({ title, publicUrl, imageUrl }: EntitySharePayload): string {
  const lines = [title, publicUrl];
  if (imageUrl?.trim()) lines.push(imageUrl.trim());
  return lines.join("\n");
}

export function buildPlatformShareUrl(
  platform: SharePlatform,
  payload: EntitySharePayload,
  postText?: string,
): string | null {
  const encodedUrl = encodeURIComponent(payload.publicUrl);
  const encodedTitle = encodeURIComponent(payload.title);

  switch (platform) {
    case "X (Twitter)":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "LinkedIn":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "WhatsApp": {
      const waText = postText ?? `${payload.title} ${payload.publicUrl}`;
      return `https://wa.me/?text=${encodeURIComponent(waText)}`;
    }
    case "Telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case "Instagram":
      return null;
    default:
      return null;
  }
}

export const SHARE_PLATFORMS: SharePlatform[] = [
  "Facebook",
  "X (Twitter)",
  "LinkedIn",
  "WhatsApp",
  "Telegram",
  "Instagram",
];

export const PUBLIC_SHARE_PLATFORM_STYLES: Record<
  Exclude<SharePlatform, "Instagram">,
  { className: string }
> = {
  Facebook: { className: "bg-[#1877f2] hover:bg-[#166fe5]" },
  "X (Twitter)": { className: "bg-[#0f1419] hover:bg-black" },
  LinkedIn: { className: "bg-[#0a66c2] hover:bg-[#095bab]" },
  WhatsApp: { className: "bg-[#25d366] hover:bg-[#20bd5a]" },
  Telegram: { className: "bg-[#0088cc] hover:bg-[#0077b5]" },
};

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function tryNativeShare(payload: EntitySharePayload): Promise<boolean> {
  if (!canUseNativeShare()) return false;
  try {
    await navigator.share({
      title: payload.title,
      text: payload.title,
      url: payload.publicUrl,
    });
    return true;
  } catch {
    return false;
  }
}
