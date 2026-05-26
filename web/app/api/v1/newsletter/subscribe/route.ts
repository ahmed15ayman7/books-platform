import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { subscribeNewsletterSchema } from "@/lib/validation/wishlist.schema";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = subscribeNewsletterSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { email, locale, source } = parsed.data;

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === "CONFIRMED") {
        return apiSuccess({ message: "Already subscribed", alreadySubscribed: true });
      }
      if (existing.status === "PENDING") {
        // Resend confirmation
        return apiSuccess({ message: "Confirmation email resent" });
      }
      // Was unsubscribed — re-subscribe
      const confirmToken = crypto.randomBytes(32).toString("hex");
      await db.newsletterSubscriber.update({
        where: { email },
        data: { status: "PENDING", confirmToken, unsubscribedAt: null },
      });
      return apiSuccess({ message: "Resubscription initiated. Check your email." });
    }

    const confirmToken = crypto.randomBytes(32).toString("hex");
    await db.newsletterSubscriber.create({
      data: { email, locale, source, status: "PENDING", confirmToken },
    });

    // TODO: Send confirmation email via Resend when integration is active

    return apiSuccess({ message: "Check your email to confirm subscription" });
  } catch (error) {
    console.error("[POST /api/v1/newsletter/subscribe]", error);
    return ApiErrors.internal();
  }
}
