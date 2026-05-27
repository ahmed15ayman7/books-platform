import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      inactive: "PAUSED",
      pending: "PENDING",
    };

    const ambassador = await db.ambassador.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { displayName: parsed.data.name }),
        ...(parsed.data.commissionRate !== undefined && { commissionRate: parsed.data.commissionRate }),
        ...(parsed.data.status !== undefined && {
          status: statusMap[parsed.data.status] ?? "PENDING",
          approvedAt: parsed.data.status === "active" ? new Date() : undefined,
        }),
      },
      include: { user: { select: { email: true } } },
    });

    return apiSuccess({
      id: ambassador.id,
      name: ambassador.displayName,
      email: ambassador.user.email,
      commissionRate: Number(ambassador.commissionRate),
      status: ambassador.status.toLowerCase(),
    });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/ambassadors/:id]", error);
    return ApiErrors.internal();
  }
}
