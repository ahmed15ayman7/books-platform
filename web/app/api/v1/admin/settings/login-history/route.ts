import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { fetchLoginHistory } from "@/lib/admin/login-history";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  if (!auth.isSuperAdmin) {
    return ApiErrors.forbidden();
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    const users = await db.user.findMany({
      where: { role: "ADMIN", deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        isSuperAdmin: true,
        lastLoginAt: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ users });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
  if (!user || user.role !== "ADMIN") return ApiErrors.notFound("User");

  const logs = await fetchLoginHistory(userId, 100);
  return apiSuccess({ user, logs });
}
