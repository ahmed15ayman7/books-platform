import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

const updateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  titleEn: z.string().max(500).optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  body: z.string().optional(),
  bodyEn: z.string().optional(),
  channel: z.string().max(50).optional(),
  status: z.enum(["draft", "publish", "scheduled"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  date: z.coerce.date().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const article = await db.article.findUnique({ where: { id } });
    if (!article) return ApiErrors.notFound("Article");

    return apiSuccess({
      ...article,
      body: article.content,
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
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { body: content, title, excerpt, channel, status, imageUrl, date } = parsed.data;

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(channel !== undefined && { channel }),
        ...(status !== undefined && { status }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(date !== undefined && { date }),
        postModifiedDate: new Date(),
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "UPDATE_ARTICLE", entity: "Article", entityId: id },
    });

    return apiSuccess(article);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/articles/:id]", error);
    return ApiErrors.internal();
  }
}
