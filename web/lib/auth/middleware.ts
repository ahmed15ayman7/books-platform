import { type NextRequest } from "next/server";
import { verifyAccessToken, type AuthPayload } from "./jwt";
import { ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "./rbac";
import type { Permission } from "./permissions";

export type { AdminAuthContext } from "./rbac";

export async function requireAuth(
  request: NextRequest,
  requiredRole?: string,
  permission?: Permission
): Promise<{ payload: AuthPayload } | ReturnType<typeof ApiErrors.unauthorized>> {
  if (requiredRole === "ADMIN") {
    const adminAuth = await requireAdminAuth(request, permission);
    if (isAdminAuthError(adminAuth)) return adminAuth;
    return { payload: adminAuth.payload };
  }

  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return ApiErrors.unauthorized();
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return ApiErrors.unauthorized();
  }

  if (requiredRole && payload.role !== requiredRole && payload.role !== "ADMIN") {
    return ApiErrors.forbidden();
  }

  return { payload };
}

export function isErrorResponse(
  result: { payload: AuthPayload } | ReturnType<typeof ApiErrors.unauthorized>
): result is ReturnType<typeof ApiErrors.unauthorized> {
  return !("payload" in result);
}
