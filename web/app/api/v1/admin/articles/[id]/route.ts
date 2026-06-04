import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { notDeleted, withSoftDelete } from "@/lib/admin/audit-fields";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import {
  adminArticleProductSelect,
  articleBodySchema,
  resolveArticleWriteData,
} from "@/lib/admin/article-payload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.view);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const article = await db.article.findFirst({
      where: { id, ...notDeleted },
      include: { products: adminArticleProductSelect },
    });
    if (!article) return ApiErrors.notFound("Article");

    return apiSuccess({
      ...article,
      body: article.content,
      productIds: article.products.map((p) => p.id),
      titleEn: "",
      excerptEn: "",
      bodyEn: "",
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/articles/:id]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.update);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = articleBodySchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const existing = await db.article.findFirst({ where: { id, ...notDeleted } });
    if (!existing) return ApiErrors.notFound("Article");

    let resolved;
    try {
      resolved = await resolveArticleWriteData(parsed.data, {
        channel: existing.channel,
        imageUrl: existing.imageUrl,
        videoId: existing.videoId,
      });
    } catch (err) {
      return ApiErrors.badRequest(err instanceof Error ? err.message : "Validation failed");
    }

    const { body: content, title, excerpt, channel, status, date } = parsed.data;

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(channel !== undefined && { channel }),
        ...(status !== undefined && { status }),
        ...(date !== undefined && { date }),
        ...(resolved.imageUrl !== undefined && {
          imageUrl: resolved.imageUrl === "" ? null : resolved.imageUrl,
        }),
        ...(resolved.youtubeUrl !== undefined && { youtubeUrl: resolved.youtubeUrl }),
        ...(resolved.videoId !== undefined && { videoId: resolved.videoId }),
        ...(resolved.productIds !== undefined
          ? { products: { set: resolved.productIds.map((id) => ({ id })) } }
          : {}),
        postModifiedDate: new Date(),
      },
      include: { products: adminArticleProductSelect },
    });

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "UPDATE_ARTICLE",
        entity: "Article",
        entityId: id,
      },
    });

    return apiSuccess(article);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/articles/:id]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.delete);
  if (isErrorResponse(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.payload.userId);
  if (passkeyErr) return passkeyErr;

  const { id } = await params;
  try {
    const existing = await db.article.findFirst({ where: { id, ...notDeleted } });
    if (!existing) return ApiErrors.notFound("Article");

    await db.article.update({
      where: { id },
      data: withSoftDelete(auth.payload.userId),
    });

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "DELETE_ARTICLE",
        entity: "Article",
        entityId: id,
      },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/articles/:id]", error);
    return ApiErrors.internal();
  }
}
