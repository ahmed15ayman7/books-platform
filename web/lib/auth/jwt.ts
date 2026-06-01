import { SignJWT, jwtVerify, type JWTPayload } from "jose";

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
    .setExpirationTime(process.env["JWT_ACCESS_EXPIRES_IN"] ?? "5h")
    .sign(getAccessSecret());
}

export async function signRefreshToken(payload: Pick<AuthPayload, "userId" | "email" | "role">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d")
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
