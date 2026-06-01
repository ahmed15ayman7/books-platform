import { type NextRequest } from "next/server";
import { verifyAccessToken, type AuthPayload } from "./jwt";

export async function getOptionalAuth(
  request: NextRequest,
): Promise<AuthPayload | null> {
  const cookieToken = request.cookies.get("access_token")?.value;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = bearer ?? cookieToken;
  if (!token) return null;
  return verifyAccessToken(token);
}

export function getDraftToken(request: NextRequest): string | null {
  return request.headers.get("x-draft-token");
}
