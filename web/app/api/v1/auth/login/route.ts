import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { ApiErrors } from "@/lib/api-client/response";
import { permissionsFromUser } from "@/lib/auth/rbac";
import crypto from "node:crypto";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Invalid credentials");

    const { email, password } = parsed.data;
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return ApiErrors.unauthorized();
    }

    // Check lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { success: false, error: { code: "ACCOUNT_LOCKED", message: "Account temporarily locked" } },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      const failedAttempts = user.failedAttempts + 1;
      const lockedUntil = failedAttempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        : null;

      await db.user.update({
        where: { id: user.id },
        data: { failedAttempts, lockedUntil },
      });

      await db.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN_FAILED",
          entity: "User",
          entityId: user.id,
          ipAddress,
          userAgent,
        },
      });

      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    // Reset failed attempts
    await db.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(payload),
    ]);

    // Store refresh token hash in DB
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt, userAgent, ipAddress },
    });

    // Audit log
    await db.auditLog.create({
      data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, ipAddress },
    });

    const permissionList =
      user.role === "ADMIN"
        ? permissionsFromUser({
            isSuperAdmin: user.isSuperAdmin,
            permissions: user.permissions,
          })
        : [];

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken,
        expiresIn: 900,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
          permissions: permissionList,
        },
      },
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/api/v1/auth",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/v1/auth/login]", error);
    return ApiErrors.internal();
  }
}
