import { z } from "zod";
import { isMediaChannel, parseYoutubeUrl, youtubeThumbnail } from "@/lib/media/youtube";
import { notDeleted } from "@/lib/admin/audit-fields";
import { db } from "@/lib/db";

export const articleBodySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  titleEn: z.string().max(500).optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  body: z.string().optional(),
  bodyEn: z.string().optional(),
  channel: z.string().max(50).optional(),
  status: z.enum(["draft", "publish", "scheduled"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().optional().or(z.literal("")),
  productIds: z.array(z.string()).max(10).optional(),
  date: z.coerce.date().optional().nullable(),
});

export const articleCreateSchema = articleBodySchema.extend({
  title: z.string().min(1).max(500),
  status: z.enum(["draft", "publish", "scheduled"]).default("draft"),
});

export type ArticlePayload = z.infer<typeof articleBodySchema>;

export async function resolveArticleWriteData(
  data: ArticlePayload,
  existing?: { channel: string | null; imageUrl: string | null; videoId: string | null },
) {
  const channel = data.channel ?? existing?.channel ?? null;
  const youtubeInput = data.youtubeUrl?.trim() ?? "";
  let videoId: string | null = null;
  let youtubeUrl: string | null = null;

  if (youtubeInput) {
    const parsed = parseYoutubeUrl(youtubeInput);
    if (!parsed.videoId) {
      throw new Error(parsed.error ?? "Invalid YouTube URL");
    }
    videoId = parsed.videoId;
    youtubeUrl = youtubeInput;
  } else if (data.youtubeUrl === "") {
    videoId = null;
    youtubeUrl = null;
  }

  if (isMediaChannel(channel) && !videoId && data.youtubeUrl !== "") {
    const keepExisting = Boolean(existing?.videoId) && data.youtubeUrl === undefined;
    if (!keepExisting) {
      throw new Error("YouTube URL is required for media channels");
    }
  }

  let imageUrl = data.imageUrl;
  if (imageUrl === "") imageUrl = "";
  if (videoId && (!imageUrl || imageUrl === "")) {
    imageUrl = youtubeThumbnail(videoId);
  } else if (imageUrl === undefined) {
    imageUrl = undefined;
  }

  let productIds: string[] | undefined;
  if (data.productIds !== undefined) {
    const ids = [...new Set(data.productIds)];
    if (ids.length > 0) {
      const found = await db.product.findMany({
        where: { id: { in: ids }, ...notDeleted },
        select: { id: true },
      });
      if (found.length !== ids.length) {
        throw new Error("One or more selected books were not found");
      }
      productIds = ids;
    } else {
      productIds = [];
    }
  }

  return {
    channel,
    videoId: data.youtubeUrl === "" ? null : videoId ?? undefined,
    youtubeUrl: data.youtubeUrl === "" ? null : youtubeUrl ?? undefined,
    imageUrl,
    productIds,
    titleEn: data.titleEn !== undefined ? (data.titleEn || null) : undefined,
    excerptEn: data.excerptEn !== undefined ? (data.excerptEn || null) : undefined,
    contentEn: data.bodyEn !== undefined ? (data.bodyEn || null) : undefined,
  };
}

export const adminArticleProductSelect = {
  select: {
    id: true,
    slug: true,
    nameEn: true,
    nameAr: true,
    imageUrl: true,
  },
  orderBy: { position: "desc" as const },
};
