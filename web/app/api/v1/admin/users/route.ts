import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS, sanitizePermissions, type Permission } from "@/lib/auth/permissions";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { withCreate } from "@/lib/admin/audit-fields";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(120),
  permissions: z.array(z.string()).default([]),
  isSuperAdmin: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.view);
  if (isAdminAuthError(auth)) return auth;

  const users = await db.user.findMany({
    where: { role: "ADMIN", deletedAt: null },
    select: {
      id: true,
      email: true,
      fullName: true,
      isSuperAdmin: true,
      permissions: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(users);
}

const DEFAULT_ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS.dashboard.view,
  PERMISSIONS.account.view,
  PERMISSIONS.account.update,
  PERMISSIONS.passkey.manage,
];

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.create);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const body = await request.json() as unknown;
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { email, password, fullName, permissions, isSuperAdmin } = parsed.data;

    if (isSuperAdmin && !auth.isSuperAdmin) {
      return ApiErrors.forbidden();
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return ApiErrors.badRequest(strength.message ?? "Weak password");
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return ApiErrors.badRequest("Email already registered");

    const passwordHash = await hashPassword(password);
    const merged = new Set([
      ...DEFAULT_ADMIN_PERMISSIONS,
      ...sanitizePermissions(permissions),
    ]);
    const safePermissions = [...merged];

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "ADMIN",
        isSuperAdmin: isSuperAdmin && auth.isSuperAdmin,
        permissions: safePermissions,
        isActive: true,
        ...withCreate(auth.userId),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isSuperAdmin: true,
        permissions: true,
        isActive: true,
        createdAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "CREATE_ADMIN_USER",
        entity: "User",
        entityId: user.id,
        changes: { email, isSuperAdmin: user.isSuperAdmin, permissions: safePermissions },
      },
    });

    return apiCreated(user);
  } catch (error) {
    console.error("[POST /api/v1/admin/users]", error);
    return ApiErrors.internal();
  }
}
