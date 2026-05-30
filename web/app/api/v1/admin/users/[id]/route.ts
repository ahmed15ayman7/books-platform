import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS, sanitizePermissions } from "@/lib/auth/permissions";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { withSoftDelete, withUpdate } from "@/lib/admin/audit-fields";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateUserSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  password: z.string().min(8).optional(),
  permissions: z.array(z.string()).optional(),
  isSuperAdmin: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.update);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const { id } = await params;
    const body = await request.json() as unknown;
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const target = await db.user.findUnique({ where: { id } });
    if (!target || target.role !== "ADMIN") return ApiErrors.notFound("User");

    if (target.isSuperAdmin && !auth.isSuperAdmin && target.id !== auth.userId) {
      return ApiErrors.forbidden();
    }

    const data = parsed.data;

    if (data.isSuperAdmin === true && !auth.isSuperAdmin) {
      return ApiErrors.forbidden();
    }

    if (
      data.isActive === false &&
      target.isSuperAdmin &&
      target.id !== auth.userId
    ) {
      const superCount = await db.user.count({
        where: { role: "ADMIN", isSuperAdmin: true, isActive: true },
      });
      if (superCount <= 1) {
        return ApiErrors.badRequest("Cannot deactivate the last super admin");
      }
    }

    const updateData: {
      fullName?: string;
      passwordHash?: string;
      permissions?: ReturnType<typeof sanitizePermissions>;
      isSuperAdmin?: boolean;
      isActive?: boolean;
    } = {};

    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.permissions !== undefined) {
      updateData.permissions = sanitizePermissions(data.permissions);
    }
    if (data.isSuperAdmin !== undefined && auth.isSuperAdmin) {
      updateData.isSuperAdmin = data.isSuperAdmin;
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.password) {
      const strength = validatePasswordStrength(data.password);
      if (!strength.valid) {
        return ApiErrors.badRequest(strength.message ?? "Weak password");
      }
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updated = await db.user.update({
      where: { id },
      data: { ...updateData, ...withUpdate(auth.userId) },
      select: {
        id: true,
        email: true,
        fullName: true,
        isSuperAdmin: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "UPDATE_ADMIN_USER",
        entity: "User",
        entityId: id,
        changes: updateData as object,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/users/[id]]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(request, PERMISSIONS.users.delete);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const { id } = await params;

    if (id === auth.userId) {
      return ApiErrors.badRequest("Cannot deactivate your own account");
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target || target.role !== "ADMIN") return ApiErrors.notFound("User");

    if (target.isSuperAdmin && !auth.isSuperAdmin) {
      return ApiErrors.forbidden();
    }

    if (target.isSuperAdmin) {
      const superCount = await db.user.count({
        where: { role: "ADMIN", isSuperAdmin: true, isActive: true },
      });
      if (superCount <= 1) {
        return ApiErrors.badRequest("Cannot deactivate the last super admin");
      }
    }

    await db.user.update({
      where: { id },
      data: {
        isActive: false,
        ...withSoftDelete(auth.userId),
        ...withUpdate(auth.userId),
      },
    });

    await db.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "DEACTIVATE_ADMIN_USER",
        entity: "User",
        entityId: id,
      },
    });

    return apiSuccess({ deactivated: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/users/[id]]", error);
    return ApiErrors.internal();
  }
}
