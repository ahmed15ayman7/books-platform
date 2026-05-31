import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/auth/password";
import { withUpdate } from "@/lib/admin/audit-fields";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.account.update);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed");

    const user = await db.user.findUnique({ where: { id: auth.userId } });
    if (!user) return ApiErrors.unauthorized();

    const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!valid) return ApiErrors.badRequest("Current password is incorrect");

    const strength = validatePasswordStrength(parsed.data.newPassword);
    if (!strength.valid) {
      return ApiErrors.badRequest(strength.message ?? "Weak password");
    }

    await db.user.update({
      where: { id: auth.userId },
      data: {
        passwordHash: await hashPassword(parsed.data.newPassword),
        ...withUpdate(auth.userId),
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "CHANGE_PASSWORD",
        entity: "User",
        entityId: auth.userId,
      },
    });

    return apiSuccess({ changed: true });
  } catch (error) {
    console.error("[POST /api/v1/admin/me/password]", error);
    return ApiErrors.internal();
  }
}
