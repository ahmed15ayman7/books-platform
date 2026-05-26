import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

const schema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  email: z.string().email().optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
  topics: z.array(z.string()).default(["new-books"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { subscription, email, locale, topics } = parsed.data;

    await db.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        email,
        locale,
        topics,
      },
      update: { email, locale, topics, lastUsedAt: new Date() },
    });

    return apiSuccess({ message: "Subscribed to push notifications" });
  } catch (error) {
    console.error("[POST /api/v1/notifications/push/subscribe]", error);
    return ApiErrors.internal();
  }
}
