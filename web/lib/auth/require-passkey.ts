import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ApiErrors } from "@/lib/api-client/response";
import {
  PASSKEY_VERIFICATION_HEADER,
  verifyPasskeyVerification,
} from "./passkey-jwt";

export async function userHasPasskeys(userId: string): Promise<boolean> {
  const count = await db.userPasskey.count({ where: { userId } });
  return count > 0;
}

/** يتطلب توكن Passkey إذا كان للمستخدم مفتاح واحد على الأقل */
export async function requirePasskeyVerification(
  request: NextRequest,
  userId: string
): Promise<ReturnType<typeof ApiErrors.forbidden> | null> {
  const hasKeys = await userHasPasskeys(userId);
  if (!hasKeys) return null;

  const token = request.headers.get(PASSKEY_VERIFICATION_HEADER);
  if (!token) {
    return ApiErrors.forbidden("Passkey verification required");
  }

  const payload = await verifyPasskeyVerification(token);
  if (!payload || payload.userId !== userId) {
    return ApiErrors.forbidden("Invalid or expired passkey verification");
  }

  return null;
}
