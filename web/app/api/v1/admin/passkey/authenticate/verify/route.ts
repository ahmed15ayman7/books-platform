import { type NextRequest } from "next/server";
import {
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { getWebAuthnOrigin, getWebAuthnRpId } from "@/lib/auth/webauthn-config";
import { verifyPasskeyChallenge } from "@/lib/auth/passkey-challenge";
import { passkeyToWebAuthnCredential } from "@/lib/auth/passkey-store";
import { signPasskeyVerification } from "@/lib/auth/passkey-jwt";

const bodySchema = z.object({
  response: z.record(z.string(), z.unknown()),
  challengeToken: z.string(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  try {
    const raw = await request.json() as unknown;
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed");

    const { response, challengeToken } = parsed.data;
    const challengeData = await verifyPasskeyChallenge(challengeToken, "authenticate");
    if (!challengeData || challengeData.userId !== auth.userId) {
      return ApiErrors.badRequest("Invalid or expired challenge");
    }

    const credentialId =
      typeof response.id === "string" ? response.id : String(response.id ?? "");

    const passkey = await db.userPasskey.findFirst({
      where: { userId: auth.userId, credentialId },
    });
    if (!passkey) return ApiErrors.badRequest("Unknown passkey");

    const verification = await verifyAuthenticationResponse({
      response: response as unknown as AuthenticationResponseJSON,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: getWebAuthnRpId(),
      credential: passkeyToWebAuthnCredential(passkey),
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return ApiErrors.badRequest("Passkey verification failed");
    }

    const newCounter = verification.authenticationInfo.newCounter;
    await db.userPasskey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(newCounter),
        lastUsedAt: new Date(),
      },
    });

    const verificationToken = await signPasskeyVerification(auth.userId);

    return apiSuccess({ verified: true, verificationToken });
  } catch (error) {
    console.error("[POST passkey/authenticate/verify]", error);
    return ApiErrors.internal();
  }
}
