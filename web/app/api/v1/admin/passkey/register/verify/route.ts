import { type NextRequest } from "next/server";
import {
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getWebAuthnOrigin, getWebAuthnRpId } from "@/lib/auth/webauthn-config";
import { verifyPasskeyChallenge } from "@/lib/auth/passkey-challenge";
import { encodePublicKey } from "@/lib/auth/passkey-store";

const bodySchema = z.object({
  response: z.record(z.string(), z.unknown()),
  challengeToken: z.string(),
  deviceName: z.string().max(120).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.passkey.manage);
  if (isAdminAuthError(auth)) return auth;

  try {
    const raw = await request.json() as unknown;
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed");

    const { response, challengeToken, deviceName } = parsed.data;
    const challengeData = await verifyPasskeyChallenge(challengeToken, "register");
    if (!challengeData || challengeData.userId !== auth.userId) {
      return ApiErrors.badRequest("Invalid or expired challenge");
    }

    const verification = await verifyRegistrationResponse({
      response: response as unknown as RegistrationResponseJSON,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: getWebAuthnRpId(),
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return ApiErrors.badRequest("Passkey registration failed");
    }

    const { credential, credentialDeviceType } = verification.registrationInfo;
    const publicKey = encodePublicKey(credential.publicKey);

    const passkey = await db.userPasskey.create({
      data: {
        userId: auth.userId,
        credentialId: credential.id,
        publicKey,
        counter: BigInt(credential.counter),
        deviceName:
          deviceName ??
          (credentialDeviceType === "singleDevice" ? "جهاز واحد" : "مفتاح أمان"),
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: "REGISTER_PASSKEY",
        entity: "UserPasskey",
        entityId: passkey.id,
      },
    });

    return apiSuccess({ verified: true, id: passkey.id });
  } catch (error) {
    console.error("[POST passkey/register/verify]", error);
    return ApiErrors.internal();
  }
}
