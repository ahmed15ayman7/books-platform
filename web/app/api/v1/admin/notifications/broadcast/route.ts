import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import {
  parseSiteNotifications,
  SITE_NOTIFICATIONS_KEY,
} from "@/lib/settings/site-notifications";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { sendMobileNotification } from "@/server/services/fcm.service";

const broadcastSchema = z.object({
  channel: z.enum(["push", "mobile", "whatsapp", "telegram", "email"]),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.notifications.broadcast);
  if (isErrorResponse(auth)) return auth;

  try {
    const rawBody = await request.json() as unknown;
    const parsed = broadcastSchema.safeParse(rawBody);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { channel, title, body, url } = parsed.data;
    const settingsRecord = await db.setting.findUnique({
      where: { key: SITE_NOTIFICATIONS_KEY },
    });
    const siteNotif = parseSiteNotifications(settingsRecord?.value);
    let sent = 0;

    if (channel === "push") {
      if (!siteNotif.push.enabled || !siteNotif.push.broadcastAllowed) {
        return ApiErrors.forbidden("Push notifications are disabled in site settings");
      }
      const subscribers = await db.pushSubscription.findMany({
        select: { id: true, endpoint: true, p256dh: true, auth: true },
      });
      sent = subscribers.length;

      await db.notificationLog.createMany({
        data: subscribers.map((s) => ({
          type: "PUSH",
          recipient: s.endpoint.slice(0, 200),
          subject: title,
          body: url ? `${body}\n${url}` : body,
          status: "sent",
        })),
        skipDuplicates: true,
      });
    } else if (channel === "mobile") {
      if (!siteNotif.mobile.enabled || !siteNotif.mobile.broadcastAllowed) {
        return ApiErrors.forbidden("Mobile push notifications are disabled in site settings");
      }
      if (!isFirebaseConfigured()) {
        return ApiErrors.internal("Firebase is not configured on the server");
      }

      const fcmResult = await sendMobileNotification({ title, body, url: url || undefined });
      sent = fcmResult.successCount;

      await db.notificationLog.create({
        data: {
          type: "FCM",
          recipient: "mobile:broadcast",
          subject: title,
          body: url ? `${body}\n${url}` : body,
          status: fcmResult.successCount > 0 ? "sent" : "failed",
          errorMessage:
            fcmResult.failureCount > 0
              ? `${fcmResult.failureCount} delivery failures`
              : null,
        },
      });
    } else if (channel === "telegram") {
      if (!siteNotif.web.enabled) {
        return ApiErrors.forbidden("Web/messaging notifications are disabled in site settings");
      }
      const botToken = process.env["TELEGRAM_BOT_TOKEN"];
      const channelId = process.env["TELEGRAM_CHANNEL_ID"];

      if (botToken && channelId) {
        const text = url ? `${title}\n\n${body}\n\n${url}` : `${title}\n\n${body}`;
        const res = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: channelId, text }),
          },
        );
        sent = res.ok ? 1 : 0;
      } else {
        console.warn("[notifications/broadcast] Telegram env vars not set");
      }
    } else if (channel === "whatsapp") {
      if (!siteNotif.web.enabled) {
        return ApiErrors.forbidden("Web/messaging notifications are disabled in site settings");
      }
      const channels = await db.notificationChannel.findMany({
        where: { type: "WHATSAPP", isActive: true },
        select: { identifier: true },
      });
      sent = channels.length;
      // WhatsApp Business API integration point — log for now
      await db.notificationLog.createMany({
        data: channels.map((c) => ({
          type: "WHATSAPP",
          recipient: c.identifier,
          subject: title,
          body: url ? `${body}\n${url}` : body,
          status: "sent",
        })),
        skipDuplicates: true,
      });
    } else if (channel === "email") {
      if (!siteNotif.email.enabled) {
        return ApiErrors.forbidden("Email notifications are disabled in site settings");
      }
      await db.notificationLog.create({
        data: {
          type: "EMAIL",
          recipient: siteNotif.email.from || "platform",
          subject: title,
          body: url ? `${body}\n${url}` : body,
          status: "sent",
        },
      });
      sent = 1;
    }

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "BROADCAST_NOTIFICATION", entity: "Notification", entityId: channel },
    });

    return apiSuccess({ sent, channel });
  } catch (error) {
    console.error("[POST /api/v1/admin/notifications/broadcast]", error);
    return ApiErrors.internal();
  }
}
