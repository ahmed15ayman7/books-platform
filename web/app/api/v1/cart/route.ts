import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import crypto from "node:crypto";

function getOrCreateSessionId(request: NextRequest): { sessionId: string; isNew: boolean } {
  const existing = request.cookies.get("cart_session")?.value;
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: crypto.randomBytes(16).toString("hex"), isNew: true };
}

export async function GET(request: NextRequest) {
  try {
    const { sessionId, isNew } = getOrCreateSessionId(request);
    if (isNew) {
      const response = NextResponse.json({ success: true, data: { items: [], total: 0 } });
      response.cookies.set("cart_session", sessionId, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
      return response;
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
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
                price: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    return apiSuccess(cart ?? { items: [], total: 0 });
  } catch (error) {
    console.error("[GET /api/v1/cart]", error);
    return ApiErrors.internal();
  }
}

const addItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10).default(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = addItemSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { productId, quantity } = parsed.data;
    const { sessionId, isNew } = getOrCreateSessionId(request);

    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, purchaseOption: true },
    });

    if (!product) return ApiErrors.notFound("Product");
    if (product.purchaseOption !== "DIRECT") {
      return ApiErrors.badRequest("This product cannot be added to cart");
    }

    let cart = await db.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      cart = await db.cart.create({ data: { sessionId } });
    }

    const existingItem = await db.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          priceSnapshot: product.price ?? 0,
        },
      });
    }

    const response = apiCreated({ message: "Item added to cart" });
    if (isNew) {
      (response as NextResponse).cookies.set("cart_session", sessionId, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    }
    return response;
  } catch (error) {
    console.error("[POST /api/v1/cart]", error);
    return ApiErrors.internal();
  }
}
