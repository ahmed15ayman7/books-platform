import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS, sanitizePermissions } from "@/lib/auth/permissions";
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
    where: { role: "ADMIN" },
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

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.create);
  if (isAdminAuthError(auth)) return auth;

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
    const safePermissions = sanitizePermissions(permissions);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "ADMIN",
        isSuperAdmin: isSuperAdmin && auth.isSuperAdmin,
        permissions: safePermissions,
        isActive: true,
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
