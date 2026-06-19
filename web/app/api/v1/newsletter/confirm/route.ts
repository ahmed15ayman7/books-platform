import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiErrors } from "@/lib/api-client/response";
import { absoluteUrl } from "@/lib/seo/site";
import crypto from "node:crypto";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return ApiErrors.badRequest("Token required");

    const subscriber = await db.newsletterSubscriber.findFirst({
      where: { confirmToken: token, status: "PENDING" },
    });

    if (!subscriber) return ApiErrors.notFound("Subscription token");

    const manageToken = subscriber.manageToken ?? crypto.randomBytes(32).toString("hex");

    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        confirmToken: null,
        manageToken,
      },
    });

    // Redirect to the preferences page so the user can set their interests
    const locale = subscriber.locale || "ar";
    const prefsPath = locale === "en"
      ? `/en/newsletter/preferences?token=${manageToken}`
      : `/ar/newsletter/preferences?token=${manageToken}`;

    return NextResponse.redirect(absoluteUrl(prefsPath), { status: 302 });
  } catch (error) {
    console.error("[GET /api/v1/newsletter/confirm]", error);
    return ApiErrors.internal();
  }
}
