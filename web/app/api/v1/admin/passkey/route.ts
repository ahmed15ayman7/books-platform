import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.passkey.manage);
  if (isAdminAuthError(auth)) return auth;

  const passkeys = await db.userPasskey.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      deviceName: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  const count = passkeys.length;
  return apiSuccess({ passkeys, hasPasskeys: count > 0 });
}
