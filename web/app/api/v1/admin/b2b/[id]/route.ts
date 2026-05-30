import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const updateSchema = z.object({
  clientName: z.string().min(1).max(300).optional(),
  packageType: z.enum(["BIBLIOGRAPHIC", "RESEARCH", "NEWS", "MEDIA", "FULL"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.b2b.update);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const subscription = await db.b2BSubscription.update({
      where: { id },
      data: {
        ...(parsed.data.startDate && { startsAt: new Date(parsed.data.startDate) }),
        ...(parsed.data.endDate && { endsAt: new Date(parsed.data.endDate) }),
        ...(parsed.data.status !== undefined && { isActive: parsed.data.status === "active" }),
      },
      include: { client: true, plan: true },
    });

    return apiSuccess({
      id: subscription.id,
      clientName: subscription.client.organizationName,
      clientEmail: subscription.client.contactEmail,
      packageType: subscription.plan.nameEn,
      status: subscription.isActive ? "active" : "inactive",
      startDate: subscription.startsAt.toISOString(),
      endDate: subscription.endsAt.toISOString(),
    });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/b2b/:id]", error);
    return ApiErrors.internal();
  }
}
