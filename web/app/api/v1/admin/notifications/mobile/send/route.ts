import { type NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import {
  parseSiteNotifications,
  SITE_NOTIFICATIONS_KEY,
} from "@/lib/settings/site-notifications";
import { sendMobileNotification } from "@/server/services/fcm.service";

const sendSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  type: z.enum(["book", "article", "general"]).optional(),
  slug: z.string().min(1).max(200).optional(),
  url: z.string().url().optional().or(z.literal("")),
  platform: z.enum(["ios", "android"]).optional(),
  locale: z.enum(["ar", "en"]).optional(),
  tokenIds: z.array(z.string().min(1)).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.notifications.broadcast);
  if (isErrorResponse(auth)) return auth;

  if (!isFirebaseConfigured()) {
    return ApiErrors.internal("Firebase is not configured on the server");
  }

  try {
    const rawBody = (await request.json()) as unknown;
    const parsed = sendSchema.safeParse(rawBody);
    if (!parsed.success) {
      return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    }

    const settingsRecord = await db.setting.findUnique({
      where: { key: SITE_NOTIFICATIONS_KEY },
    });
    const siteNotif = parseSiteNotifications(settingsRecord?.value);

    if (!siteNotif.mobile.enabled || !siteNotif.mobile.broadcastAllowed) {
      return ApiErrors.forbidden("Mobile push notifications are disabled in site settings");
    }

    const { title, body, type, slug, url, platform, locale, tokenIds } = parsed.data;

    const result = await sendMobileNotification(
      {
        title,
        body,
        type: type ?? "general",
        slug,
        url: url || undefined,
      },
      { platform, locale, tokenIds },
    );

    const logStatus = result.successCount > 0 ? "sent" : "failed";
    await db.notificationLog.createMany({
      data: [
        {
          type: "FCM",
          recipient: `mobile:${platform ?? "all"}:${locale ?? "all"}`,
          subject: title,
          body: url ? `${body}\n${url}` : body,
          status: logStatus,
          errorMessage:
            result.failureCount > 0
              ? `${result.failureCount} delivery failures`
              : null,
        },
      ],
    });

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "SEND_MOBILE_NOTIFICATION",
        entity: "Notification",
        entityId: "FCM",
      },
    });

    return apiSuccess({
      sent: result.successCount,
      failed: result.failureCount,
      totalTargets: result.totalTargets,
      invalidTokensDeactivated: result.invalidTokens.length,
    });
  } catch (error) {
    console.error("[POST /api/v1/admin/notifications/mobile/send]", error);
    return ApiErrors.internal();
  }
}
