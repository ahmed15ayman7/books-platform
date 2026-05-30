import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  return new TextEncoder().encode(
    process.env["PASSKEY_JWT_SECRET"] ??
      process.env["JWT_SECRET"] ??
      "dev-passkey-secret-change-in-production-32chars"
  );
}

export interface PasskeyVerificationPayload {
  userId: string;
  sub: string;
}

export async function signPasskeyVerification(userId: string): Promise<string> {
  return new SignJWT({ userId, sub: "passkey_verification" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getSecret());
}

export async function verifyPasskeyVerification(
  token: string
): Promise<PasskeyVerificationPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.sub !== "passkey_verification" || typeof payload.userId !== "string") {
      return null;
    }
    return { userId: payload.userId, sub: payload.sub as string };
  } catch {
    return null;
  }
}

export const PASSKEY_VERIFICATION_HEADER = "x-passkey-verification";
