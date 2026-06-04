import { type NextRequest, NextResponse } from "next/server";
import { ApiErrors } from "@/lib/api-client/response";
import { refreshSessionFromToken } from "@/lib/auth/refresh-session";
import {
  accessTokenCookieOptions,
} from "@/lib/auth/access-token-cookie";
import { ACCESS_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/session-config";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: { code: "REFRESH_TOKEN_MISSING", message: "No refresh token" } },
        { status: 401 },
      );
    }

    const session = await refreshSessionFromToken(refreshToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: "REFRESH_TOKEN_EXPIRED", message: "Refresh token expired" } },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      data: { accessToken: session.accessToken, expiresIn: ACCESS_TOKEN_MAX_AGE_SECONDS },
    });
    response.cookies.set(accessTokenCookieOptions(session.accessToken));
    return response;
  } catch (error) {
    console.error("[POST /api/v1/auth/refresh]", error);
    return ApiErrors.internal();
  }
}
