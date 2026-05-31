import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken, type AuthPayload } from "./jwt";
import { ApiErrors } from "@/lib/api-client/response";
import {
  ALL_PERMISSIONS,
  hasPermission,
  parsePermissionsJson,
  type Permission,
} from "./permissions";

export interface AdminAuthContext {
  payload: AuthPayload;
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: Permission[];
}

export async function loadAdminUser(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isSuperAdmin: true,
      permissions: true,
    },
  });
}

export function permissionsFromUser(user: {
  isSuperAdmin: boolean;
  permissions: unknown;
}): Permission[] {
  if (user.isSuperAdmin) return [...ALL_PERMISSIONS];
  return parsePermissionsJson(user.permissions);
}

export async function requireAdminAuth(
  request: NextRequest,
  permission?: Permission
): Promise<AdminAuthContext | ReturnType<typeof ApiErrors.unauthorized>> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return ApiErrors.unauthorized();
  }

  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return ApiErrors.unauthorized();
  }

  const user = await loadAdminUser(payload.userId);
  if (!user || !user.isActive || user.role !== "ADMIN") {
    return ApiErrors.unauthorized();
  }

  const permissions = permissionsFromUser(user);

  if (
    permission &&
    !hasPermission({ isSuperAdmin: user.isSuperAdmin, permissions }, permission)
  ) {
    return ApiErrors.forbidden();
  }

  return {
    payload,
    userId: user.id,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    permissions,
  };
}

export function isAdminAuthError(
  result: AdminAuthContext | ReturnType<typeof ApiErrors.unauthorized>
): result is ReturnType<typeof ApiErrors.unauthorized> {
  return !("userId" in result);
}
