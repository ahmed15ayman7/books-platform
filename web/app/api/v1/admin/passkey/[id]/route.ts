import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(request, PERMISSIONS.passkey.manage);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  const { id } = await params;
  const row = await db.userPasskey.findFirst({
    where: { id, userId: auth.userId },
  });
  if (!row) return ApiErrors.notFound("Passkey");

  await db.userPasskey.delete({ where: { id } });

  await db.auditLog.create({
    data: {
      userId: auth.userId,
      action: "DELETE_PASSKEY",
      entity: "UserPasskey",
      entityId: id,
    },
  });

  return apiSuccess({ deleted: true });
}
