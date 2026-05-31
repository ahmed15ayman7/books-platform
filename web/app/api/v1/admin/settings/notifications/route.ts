import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { withCreate, withUpdate } from "@/lib/admin/audit-fields";
import {
  parseSiteNotifications,
  SITE_NOTIFICATIONS_KEY,
  type SiteNotificationSettings,
} from "@/lib/settings/site-notifications";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.settings.view);
  if (isAdminAuthError(auth)) return auth;

  const record = await db.setting.findUnique({
    where: { key: SITE_NOTIFICATIONS_KEY },
  });
  const settings = parseSiteNotifications(record?.value);

  const recentLogs = await db.notificationLog.findMany({
    orderBy: { sentAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      recipient: true,
      subject: true,
      status: true,
      sentAt: true,
    },
  });

  return apiSuccess({ settings, recentLogs });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.settings.update);
  if (isAdminAuthError(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.userId);
  if (passkeyErr) return passkeyErr;

  try {
    const body = (await request.json()) as SiteNotificationSettings;
    const value = parseSiteNotifications(body);

    const existing = await db.setting.findUnique({
      where: { key: SITE_NOTIFICATIONS_KEY },
    });

    await db.setting.upsert({
      where: { key: SITE_NOTIFICATIONS_KEY },
      create: {
        key: SITE_NOTIFICATIONS_KEY,
        value: value as object,
        ...withCreate(auth.userId),
      },
      update: {
        value: value as object,
        ...withUpdate(auth.userId),
      },
    });

    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: existing ? "UPDATE_NOTIFICATION_SETTINGS" : "CREATE_NOTIFICATION_SETTINGS",
        entity: "Setting",
        entityId: SITE_NOTIFICATIONS_KEY,
        changes: value as object,
      },
    });

    return apiSuccess(value);
  } catch (error) {
    console.error("[PATCH settings/notifications]", error);
    return ApiErrors.internal();
  }
}
