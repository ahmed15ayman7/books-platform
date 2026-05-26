import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiCreated, ApiErrors } from "@/lib/api-client/response";

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(20).optional(),
  shippingAddress: z
    .object({
      line1: z.string(),
      city: z.string(),
      country: z.string(),
    })
    .optional(),
  couponCode: z.string().optional(),
  paymentProvider: z.enum(["stripe", "paymob", "cash"]).default("stripe"),
  cartItems: z.array(
    z.object({ productId: z.string().cuid(), quantity: z.number().int().min(1) })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { customerName, customerEmail, customerPhone, shippingAddress, couponCode, paymentProvider, cartItems } = parsed.data;

    if (!cartItems.length) return ApiErrors.badRequest("Cart is empty");

    // Fetch products
    const products = await db.product.findMany({
      where: { id: { in: cartItems.map((i) => i.productId) }, published: true },
      select: { id: true, price: true, currency: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = cartItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || !product.price) throw new Error(`Product ${item.productId} not found or no price`);
      const unitPrice = Number(product.price);
      const total = unitPrice * item.quantity;
      subtotal += total;
      return { productId: item.productId, quantity: item.quantity, unitPrice, total };
    });

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });
      if (coupon) {
        discount = coupon.type === "PERCENTAGE"
          ? subtotal * (Number(coupon.value) / 100)
          : Math.min(Number(coupon.value), subtotal);
        // Increment coupon usage
        await db.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const total = Math.max(0, subtotal - discount);
    const orderNumber = `BP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const currency = products[0]?.currency ?? "USD";

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: shippingAddress ?? undefined,
        subtotal,
        discount,
        total,
        currency,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentProvider,
        couponCode,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      select: { id: true, orderNumber: true, total: true, currency: true, status: true },
    });

    return apiCreated({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      status: order.status,
      // In production: paymentUrl would be the Stripe/Paymob checkout URL
      paymentUrl: null,
    });
  } catch (error) {
    console.error("[POST /api/v1/orders/checkout]", error);
    return ApiErrors.internal();
  }
}
