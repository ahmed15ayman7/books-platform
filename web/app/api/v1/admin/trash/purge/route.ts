import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  TRASH_TYPES,
  type TrashType,
  canAccessTrashType,
} from "@/lib/admin/content-hub";
import { TrashPurgeError, purgeTrashItem } from "@/lib/admin/trash-purge";

const bodySchema = z.object({
  type: z.enum(TRASH_TYPES),
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
    if (!canAccessTrashType(auth, type as TrashType)) return ApiErrors.forbidden();

    await purgeTrashItem(type, id);

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: `PURGE_${type.toUpperCase()}`,
        entity: type,
        entityId: id,
      },
    });

    return apiSuccess({ purged: true });
  } catch (error) {
    if (error instanceof TrashPurgeError) {
      return ApiErrors.badRequest(error.message, { code: error.code });
    }
    console.error("[POST /api/v1/admin/trash/purge]", error);
    return ApiErrors.internal();
  }
}
