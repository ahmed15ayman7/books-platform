import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError, permissionsFromUser } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { withUpdate } from "@/lib/admin/audit-fields";

const patchSchema = z.object({
  fullName: z.string().min(2).max(120),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.account.view);
  if (isAdminAuthError(auth)) return auth;

  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isSuperAdmin: true,
      permissions: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      passkeyRequired: true,
    },
  });
  if (!user) return ApiErrors.unauthorized();

  const passkeyCount = await db.userPasskey.count({ where: { userId: auth.userId } });

  return apiSuccess({
    ...user,
    permissions: permissionsFromUser(user),
    hasPasskeys: passkeyCount > 0,
    passkeyCount,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.account.update);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const body = await request.json() as unknown;
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed");

    const updated = await db.user.update({
      where: { id: auth.userId },
      data: { fullName: parsed.data.fullName, ...withUpdate(auth.userId) },
      select: {
        id: true,
        email: true,
        fullName: true,
        isSuperAdmin: true,
        lastLoginAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "UPDATE_ACCOUNT",
        entity: "User",
        entityId: auth.userId,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/me/account]", error);
    return ApiErrors.internal();
  }
}
