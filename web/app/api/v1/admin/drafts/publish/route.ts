import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  canPublishDraftType,
  publishDraftItem,
} from "@/lib/admin/content-hub";

const bodySchema = z.object({
  type: z.enum(["books", "articles", "publishers"]),
  id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  try {
    const body = (await request.json()) as unknown;
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { type, id } = parsed.data;
    if (!canPublishDraftType(auth, type)) return ApiErrors.forbidden();

    const published = await publishDraftItem(type, id, auth.userId);
    if (!published) return ApiErrors.notFound("Draft");

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: `PUBLISH_${type.toUpperCase()}`,
        entity: type,
        entityId: id,
      },
    });

    return apiSuccess({ published: true });
  } catch (error) {
    console.error("[POST /api/v1/admin/drafts/publish]", error);
    return ApiErrors.internal();
  }
}
