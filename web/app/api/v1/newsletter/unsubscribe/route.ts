import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { absoluteUrl } from "@/lib/seo/site";

const bodySchema = z.object({ token: z.string().min(1) });

/**
 * POST /api/v1/newsletter/unsubscribe  — JSON body { token }
 * GET  /api/v1/newsletter/unsubscribe?token=...  — magic-link from email footer
 *
 * Accepts both confirmToken (legacy) and manageToken (permanent).
 */
async function unsubscribeByToken(token: string) {
  // Try manageToken first (permanent, works for confirmed subscribers)
  const byManage = await db.newsletterSubscriber.findFirst({
    where: { manageToken: token },
  });

  if (byManage) {
    await db.newsletterSubscriber.update({
      where: { id: byManage.id },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
    return byManage;
  }

  // Fallback: confirmToken (legacy, only for PENDING subscribers)
  const byConfirm = await db.newsletterSubscriber.findFirst({
    where: { confirmToken: token },
  });

  if (byConfirm) {
    await db.newsletterSubscriber.update({
      where: { id: byConfirm.id },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date(), confirmToken: null },
    });
    return byConfirm;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Token required");

    const subscriber = await unsubscribeByToken(parsed.data.token);
    if (!subscriber) return ApiErrors.notFound("Subscription");

    return apiSuccess({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("[POST /api/v1/newsletter/unsubscribe]", error);
    return ApiErrors.internal();
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return ApiErrors.badRequest("Token required");

    const subscriber = await unsubscribeByToken(token);
    if (!subscriber) {
      // Redirect to a friendly error page
      return NextResponse.redirect(absoluteUrl("/ar/newsletter/unsubscribed?error=not_found"), { status: 302 });
    }

    const locale = subscriber.locale || "ar";
    const redirectPath = locale === "en"
      ? "/en/newsletter/unsubscribed"
      : "/ar/newsletter/unsubscribed";

    return NextResponse.redirect(absoluteUrl(redirectPath), { status: 302 });
  } catch (error) {
    console.error("[GET /api/v1/newsletter/unsubscribe]", error);
    return ApiErrors.internal();
  }
}
