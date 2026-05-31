import { type NextRequest } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { signPasskeyChallenge } from "@/lib/auth/passkey-challenge";
import { getWebAuthnRpId } from "@/lib/auth/webauthn-config";

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  const passkeys = await db.userPasskey.findMany({
    where: { userId: auth.userId },
  });

  if (passkeys.length === 0) {
    return ApiErrors.badRequest("No passkeys registered");
  }

  const options = await generateAuthenticationOptions({
    rpID: getWebAuthnRpId(),
    allowCredentials: passkeys.map((p) => ({
      id: p.credentialId,
      transports: ["internal", "hybrid"],
    })),
    userVerification: "required",
  });

  const challengeToken = await signPasskeyChallenge(
    auth.userId,
    options.challenge,
    "authenticate"
  );

  return apiSuccess({ options, challengeToken });
}
