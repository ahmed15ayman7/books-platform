import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import {
  ACCESS_TOKEN_JWT_EXPIRY,
  REFRESH_TOKEN_JWT_EXPIRY,
} from "@/lib/auth/session-config";

function getAccessSecret() {
  return new TextEncoder().encode(
    process.env["JWT_SECRET"] ?? "dev-jwt-secret-change-in-production-32chars"
  );
}

function getRefreshSecret() {
  return new TextEncoder().encode(
    process.env["JWT_REFRESH_SECRET"] ?? "dev-refresh-secret-change-in-prod-32chars"
  );
}

export interface AuthPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signAccessToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env["JWT_ACCESS_EXPIRES_IN"] ?? ACCESS_TOKEN_JWT_EXPIRY)
    .sign(getAccessSecret());
}

export async function signRefreshToken(payload: Pick<AuthPayload, "userId" | "email" | "role">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env["JWT_REFRESH_EXPIRES_IN"] ?? REFRESH_TOKEN_JWT_EXPIRY)
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return payload as AuthPayload;
  } catch {
    return null;
  }
}
