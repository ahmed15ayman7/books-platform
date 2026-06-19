import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { sendBulk } from "@/lib/email/mailer";

const sendSchema = z.object({
  subject: z.string().min(1).max(300),
  body: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.newsletter.send);
  if (isErrorResponse(auth)) return auth;

  try {
    const rawBody = await request.json() as unknown;
    const parsed = sendSchema.safeParse(rawBody);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { subject, body } = parsed.data;

    const subscribers = await db.newsletterSubscriber.findMany({
      where: { status: "CONFIRMED" },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return apiSuccess({ sent: 0, message: "No confirmed subscribers" });
    }

    const html = body.replace(/\n/g, "<br>");
    const recipients = subscribers.map((s) => s.email);

    const { sent, failed } = await sendBulk(
      recipients,
      { subject, html, text: body },
      { type: "newsletter_broadcast" },
    );

    if (sent === 0 && failed === 0) {
      return apiSuccess({ sent: 0, message: "Email service not configured" });
    }

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "SEND_NEWSLETTER",
        entity: "NewsletterSubscriber",
        entityId: "broadcast",
      },
    });

    return apiSuccess({ sent, failed, total: subscribers.length });
  } catch (error) {
    console.error("[POST /api/v1/admin/newsletter/send]", error);
    return ApiErrors.internal();
  }
}
