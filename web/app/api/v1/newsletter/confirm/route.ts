import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return ApiErrors.badRequest("Token required");

    const subscriber = await db.newsletterSubscriber.findFirst({
      where: { confirmToken: token, status: "PENDING" },
    });

    if (!subscriber) return ApiErrors.notFound("Subscription token");

    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        confirmToken: null,
      },
    });

    return apiSuccess({ message: "Subscription confirmed!", email: subscriber.email });
  } catch (error) {
    console.error("[GET /api/v1/newsletter/confirm]", error);
    return ApiErrors.internal();
  }
}
