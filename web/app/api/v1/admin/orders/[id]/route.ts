import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const updateSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "REFUNDED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.orders.view);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const order = await db.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "UPDATE_ORDER_STATUS", entity: "Order", entityId: id },
    });

    return apiSuccess(order);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/orders/:id]", error);
    return ApiErrors.internal();
  }
}
