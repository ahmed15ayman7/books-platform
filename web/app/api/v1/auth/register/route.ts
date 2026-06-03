import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { ApiErrors } from "@/lib/api-client/response";
import { claimDraftSchema } from "@/lib/validation/submission.schema";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/lib/auth/access-token-cookie";
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/session-config";
import crypto from "node:crypto";

const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(100),
  draftToken: z.string().min(16).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { email, password, fullName, draftToken } = parsed.data;

    const strength = validatePasswordStrength(password);
    if (!strength.valid) return ApiErrors.badRequest(strength.message ?? "Weak password");

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return ApiErrors.badRequest("Email already registered");

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "AUTHOR",
        permissions: [],
      },
    });

    if (draftToken) {
      const claimParsed = claimDraftSchema.safeParse({ draftToken });
      if (claimParsed.success) {
        await db.publishBookSubmission.updateMany({
          where: { draftToken: claimParsed.data.draftToken, status: "draft", userId: null },
          data: { userId: user.id },
        });
      }
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await db.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_SECONDS * 1000),
        userAgent: request.headers.get("user-agent") ?? undefined,
        ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken,
        expiresIn: ACCESS_TOKEN_MAX_AGE_SECONDS,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });

    response.cookies.set(refreshTokenCookieOptions(refreshToken));
    response.cookies.set(accessTokenCookieOptions(accessToken));

    return response;
  } catch (error) {
    console.error("[POST /api/v1/auth/register]", error);
    return ApiErrors.internal();
  }
}
