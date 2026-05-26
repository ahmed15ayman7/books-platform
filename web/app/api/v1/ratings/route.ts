import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createRatingSchema } from "@/lib/validation/comment.schema";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) return ApiErrors.badRequest("productId required");

    const ratings = await db.rating.findMany({
      where: { productId },
      select: { stars: true },
    });

    const count = ratings.length;
    const average = count > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / count
      : null;

    const distribution: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    for (const r of ratings) {
      const key = String(r.stars);
      if (key in distribution) {
        distribution[key] = (distribution[key] ?? 0) + 1;
      }
    }

    return apiSuccess({
      average: average ? Math.round(average * 10) / 10 : null,
      count,
      distribution,
    });
  } catch (error) {
    console.error("[GET /api/v1/ratings]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = createRatingSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    }

    const { productId, email, stars } = parsed.data;

    // Upsert — one rating per email per product
    const rating = await db.rating.upsert({
      where: { productId_email: { productId, email } },
      create: { productId, email, stars },
      update: { stars },
      select: { id: true, stars: true },
    });

    return apiCreated(rating);
  } catch (error) {
    console.error("[POST /api/v1/ratings]", error);
    return ApiErrors.internal();
  }
}
