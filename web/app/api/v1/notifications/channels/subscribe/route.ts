import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

const schema = z.object({
  type: z.enum(["WHATSAPP", "TELEGRAM"]),
  identifier: z.string().min(1),
  email: z.string().email().optional(),
  topics: z.array(z.string()).default(["new-books"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    await db.notificationChannel.upsert({
      where: { type_identifier: { type: parsed.data.type, identifier: parsed.data.identifier } },
      create: parsed.data,
      update: { email: parsed.data.email, topics: parsed.data.topics, isActive: true },
    });

    return apiSuccess({ message: "Subscribed to channel notifications" });
  } catch (error) {
    console.error("[POST /api/v1/notifications/channels/subscribe]", error);
    return ApiErrors.internal();
  }
}
