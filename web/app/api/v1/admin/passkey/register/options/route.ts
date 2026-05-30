import { type NextRequest } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { db } from "@/lib/db";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getWebAuthnRpId, getWebAuthnRpName } from "@/lib/auth/webauthn-config";
import { signPasskeyChallenge } from "@/lib/auth/passkey-challenge";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.passkey.manage);
  if (isAdminAuthError(auth)) return ApiErrors.unauthorized();

  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: { email: true, fullName: true },
  });
  if (!user) return ApiErrors.notFound("User not found");

  const existing = await db.userPasskey.findMany({
    where: { userId: auth.userId },
    select: { credentialId: true },
  });

  const options = await generateRegistrationOptions({
    rpName: getWebAuthnRpName(),
    rpID: getWebAuthnRpId(),
    userName: user.email,
    userDisplayName: user.fullName,
    userID: new TextEncoder().encode(auth.userId),
    attestationType: "none",
    excludeCredentials: existing.map((e) => ({
      id: e.credentialId,
      transports: ["internal", "hybrid"],
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });

  const challengeToken = await signPasskeyChallenge(
    auth.userId,
    options.challenge,
    "register"
  );

  return apiSuccess({ options, challengeToken });
}
