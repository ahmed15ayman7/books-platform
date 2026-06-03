import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import {
  TRASH_TYPES,
  type TrashType,
  canAccessTrashType,
  restoreTrashItem,
} from "@/lib/admin/content-hub";

const bodySchema = z.object({
  type: z.enum(TRASH_TYPES),
  id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const body = (await request.json()) as unknown;
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { type, id } = parsed.data;
    if (!canAccessTrashType(auth, type as TrashType)) return ApiErrors.forbidden();

    const restored = await restoreTrashItem(type, id, auth.userId);
    if (!restored) return ApiErrors.notFound("Item");

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: `RESTORE_${type.toUpperCase()}`,
        entity: type,
        entityId: id,
      },
    });

    return apiSuccess({ restored: true });
  } catch (error) {
    console.error("[POST /api/v1/admin/trash/restore]", error);
    return ApiErrors.internal();
  }
}
