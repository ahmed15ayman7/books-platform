import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/jwt";
import { ApiErrors } from "@/lib/api-client/response";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: { code: "REFRESH_TOKEN_MISSING", message: "No refresh token" } },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: "REFRESH_TOKEN_EXPIRED", message: "Refresh token expired" } },
        { status: 401 }
      );
    }

    // Check in DB
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const storedToken = await db.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gte: new Date() } },
    });

    if (!storedToken) {
      return NextResponse.json(
        { success: false, error: { code: "REFRESH_TOKEN_REVOKED", message: "Token revoked" } },
        { status: 401 }
      );
    }

    const accessToken = await signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return NextResponse.json({
      success: true,
      data: { accessToken, expiresIn: 900 },
    });
  } catch (error) {
    console.error("[POST /api/v1/auth/refresh]", error);
    return ApiErrors.internal();
  }
}
