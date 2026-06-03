import crypto from "node:crypto";
import { db } from "@/lib/db";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";

export interface RefreshedSession {
  accessToken: string;
  userId: string;
  email: string;
  role: string;
}

/** Validate refresh token in DB and issue a new access token. */
export async function refreshSessionFromToken(
  refreshToken: string,
): Promise<RefreshedSession | null> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload?.userId || !payload.email || !payload.role) return null;

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const storedToken = await db.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null, expiresAt: { gte: new Date() } },
  });
  if (!storedToken) return null;

  const accessToken = await signAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  return {
    accessToken,
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}
