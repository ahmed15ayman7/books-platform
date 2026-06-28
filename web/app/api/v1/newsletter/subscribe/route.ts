import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { subscribeNewsletterSchema } from "@/lib/validation/wishlist.schema";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { sendMail } from "@/lib/email/mailer";
import { renderWelcomeEmail } from "@/lib/email/templates/welcome";
import crypto from "node:crypto";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function sendWelcome(
  email: string,
  confirmToken: string,
  manageToken: string,
  locale: string,
): Promise<void> {
  const { html, text, subject } = renderWelcomeEmail({ email, confirmToken, manageToken, locale });
  await sendMail({ to: email, subject, html, text });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = subscribeNewsletterSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { email, locale = "ar", source } = parsed.data;

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === "CONFIRMED") {
        return apiSuccess({ message: "Already subscribed", alreadySubscribed: true });
      }

      if (existing.status === "PENDING") {
        // Re-send confirmation email
        const confirmToken = existing.confirmToken ?? generateToken();
        const manageToken = existing.manageToken ?? generateToken();
        await db.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            confirmToken: existing.confirmToken ?? confirmToken,
            manageToken: existing.manageToken ?? manageToken,
          },
        });
        await sendWelcome(email, confirmToken, manageToken, existing.locale);
        return apiSuccess({ message: "Confirmation email resent" });
      }

      // Was unsubscribed — re-subscribe
      const confirmToken = generateToken();
      const manageToken = existing.manageToken ?? generateToken();
      await db.newsletterSubscriber.update({
        where: { email },
        data: { status: "PENDING", confirmToken, manageToken, unsubscribedAt: null },
      });
      await sendWelcome(email, confirmToken, manageToken, existing.locale);
      return apiSuccess({ message: "Resubscription initiated. Check your email." });
    }

    const confirmToken = generateToken();
    const manageToken = generateToken();

    await db.newsletterSubscriber.create({
      data: { email, locale, source, status: "PENDING", confirmToken, manageToken },
    });

    await sendWelcome(email, confirmToken, manageToken, locale);

    return apiSuccess({ message: "Check your email to confirm subscription" });
  } catch (error) {
    console.error("[POST /api/v1/newsletter/subscribe]", error);
    return ApiErrors.internal();
  }
}
