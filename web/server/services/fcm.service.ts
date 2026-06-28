import { db } from "@/lib/db";
import {
  sendFcmToTokens,
  type FcmNotificationPayload,
  type FcmSendResult,
} from "@/lib/firebase/messaging";

export interface FcmSendFilters {
  platform?: "ios" | "android";
  locale?: "ar" | "en";
  tokenIds?: string[];
}

export async function sendMobileNotification(
  payload: FcmNotificationPayload,
  filters: FcmSendFilters = {},
): Promise<FcmSendResult & { totalTargets: number }> {
  const where = {
    isActive: true,
    ...(filters.platform ? { platform: filters.platform } : {}),
    ...(filters.locale ? { locale: filters.locale } : {}),
    ...(filters.tokenIds?.length ? { id: { in: filters.tokenIds } } : {}),
  };

  const records = await db.fcmToken.findMany({
    where,
    select: { id: true, token: true },
  });

  if (records.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [], totalTargets: 0 };
  }

  const result = await sendFcmToTokens(
    records.map((record) => record.token),
    payload,
  );

  if (result.invalidTokens.length > 0) {
    await db.fcmToken.updateMany({
      where: { token: { in: result.invalidTokens } },
      data: { isActive: false },
    });
  }

  return { ...result, totalTargets: records.length };
}

export async function deactivateFcmToken(token: string): Promise<boolean> {
  const existing = await db.fcmToken.findUnique({ where: { token } });
  if (!existing) return false;

  await db.fcmToken.update({
    where: { token },
    data: { isActive: false },
  });

  return true;
}
