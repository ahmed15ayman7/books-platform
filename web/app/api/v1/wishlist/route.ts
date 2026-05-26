import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { addToWishlistSchema } from "@/lib/validation/wishlist.schema";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = addToWishlistSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { email, productId } = parsed.data;

    // Find or create wishlist
    let wishlist = await db.wishlist.findUnique({ where: { email } });
    if (!wishlist) {
      const accessToken = crypto.randomBytes(32).toString("hex");
      wishlist = await db.wishlist.create({
        data: { email, accessToken },
      });
    }

    // Add item (ignore if already exists)
    await db.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      create: { wishlistId: wishlist.id, productId },
      update: {},
    });

    // TODO: Send magic link email via Resend when email integration is active

    return apiCreated({
      accessToken: wishlist.accessToken,
      message: "Saved! Check your email for access link",
    });
  } catch (error) {
    console.error("[POST /api/v1/wishlist]", error);
    return ApiErrors.internal();
  }
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.nextUrl.searchParams.get("token");
    if (!accessToken) return ApiErrors.badRequest("Access token required");

    const wishlist = await db.wishlist.findUnique({
      where: { accessToken },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                nameEn: true,
                nameAr: true,
                imageUrl: true,
                translationStatus: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) return ApiErrors.notFound("Wishlist");
    return apiSuccess(wishlist);
  } catch (error) {
    console.error("[GET /api/v1/wishlist]", error);
    return ApiErrors.internal();
  }
}
