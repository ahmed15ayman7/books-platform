import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { Resend } from "resend";

const sendSchema = z.object({
  subject: z.string().min(1).max(300),
  body: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
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

    const apiKey = process.env["RESEND_API_KEY"];
    const fromEmail = process.env["RESEND_FROM_EMAIL"] ?? "newsletter@books-platform.com";
    const fromName = process.env["RESEND_FROM_NAME"] ?? "Books Platform";

    if (!apiKey) {
      console.warn("[newsletter/send] RESEND_API_KEY not set — email skipped");
      return apiSuccess({ sent: 0, message: "Email service not configured" });
    }

    const resend = new Resend(apiKey);
    const emails = subscribers.map((s) => s.email);
    const batchSize = 50;
    let sent = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: batch,
        subject,
        html: body.replace(/\n/g, "<br>"),
      });
      sent += batch.length;
    }

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "SEND_NEWSLETTER", entity: "NewsletterSubscriber", entityId: "broadcast" },
    });

    return apiSuccess({ sent, total: subscribers.length });
  } catch (error) {
    console.error("[POST /api/v1/admin/newsletter/send]", error);
    return ApiErrors.internal();
  }
}
