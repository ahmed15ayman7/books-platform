import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchLoginHistory } from "@/lib/admin/login-history";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.view);
  if (isAdminAuthError(auth)) return auth;

  const { id } = await params;
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true, email: true, fullName: true },
  });
  if (!target || target.role !== "ADMIN") return ApiErrors.notFound("User");

  const logs = await fetchLoginHistory(id);
  return apiSuccess({ user: target, logs });
}
