import { type NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { getOptionalAuth } from "@/lib/auth/optional-auth";
import { db } from "@/lib/db";

const subscribeSchema = z.object({
  token: z.string().min(1).max(4096),
  locale: z.enum(["ar", "en"]).default("ar"),
  platform: z.enum(["ios", "android"]),
  topics: z.array(z.string().min(1).max(100)).default(["new-books"]),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as unknown;
    const parsed = subscribeSchema.safeParse(rawBody);
    if (!parsed.success) {
      return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    }

    const { token, locale, platform, topics } = parsed.data;
    const auth = await getOptionalAuth(request);

    const record = await db.fcmToken.upsert({
      where: { token },
      create: {
        token,
        locale,
        platform,
        topics,
        userId: auth?.userId ?? null,
        isActive: true,
        lastUsedAt: new Date(),
      },
      update: {
        locale,
        platform,
        topics,
        userId: auth?.userId ?? undefined,
        isActive: true,
        lastUsedAt: new Date(),
      },
    });

    return apiSuccess({
      id: record.id,
      message: "Subscribed to mobile push notifications",
    });
  } catch (error) {
    console.error("[POST /api/v1/notifications/mobile/subscribe]", error);
    return ApiErrors.internal();
  }
}

const unsubscribeSchema = z.object({
  token: z.string().min(1).max(4096),
});

export async function DELETE(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as unknown;
    const parsed = unsubscribeSchema.safeParse(rawBody);
    if (!parsed.success) {
      return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    }

    const { token } = parsed.data;
    const existing = await db.fcmToken.findUnique({ where: { token } });

    if (!existing) {
      return ApiErrors.notFound("FCM token");
    }

    await db.fcmToken.update({
      where: { token },
      data: { isActive: false },
    });

    return apiSuccess({ message: "Unsubscribed from mobile push notifications" });
  } catch (error) {
    console.error("[DELETE /api/v1/notifications/mobile/subscribe]", error);
    return ApiErrors.internal();
  }
}
