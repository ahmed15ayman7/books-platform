import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

const schema = z.object({ token: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Token required");

    const subscriber = await db.newsletterSubscriber.findFirst({
      where: { confirmToken: parsed.data.token },
    });
    if (!subscriber) return ApiErrors.notFound("Subscription");

    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date(), confirmToken: null },
    });

    return apiSuccess({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("[POST /api/v1/newsletter/unsubscribe]", error);
    return ApiErrors.internal();
  }
}
