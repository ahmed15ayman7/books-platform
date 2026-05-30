import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  return new TextEncoder().encode(
    process.env["PASSKEY_JWT_SECRET"] ??
      process.env["JWT_SECRET"] ??
      "dev-passkey-secret-change-in-production-32chars"
  );
}

export async function signPasskeyChallenge(
  userId: string,
  challenge: string,
  flow: "register" | "authenticate"
): Promise<string> {
  return new SignJWT({ userId, challenge, flow, sub: "passkey_challenge" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getSecret());
}

export async function verifyPasskeyChallenge(
  token: string,
  expectedFlow: "register" | "authenticate"
): Promise<{ userId: string; challenge: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.sub !== "passkey_challenge" ||
      typeof payload.userId !== "string" ||
      typeof payload.challenge !== "string" ||
      payload.flow !== expectedFlow
    ) {
      return null;
    }
    return { userId: payload.userId, challenge: payload.challenge };
  } catch {
    return null;
  }
}
