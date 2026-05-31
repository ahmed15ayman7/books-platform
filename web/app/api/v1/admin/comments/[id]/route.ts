import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const updateSchema = z.object({
  status: z.enum(["approved", "hidden", "pending", "spam", "trash"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.comments.moderate);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const statusMap: Record<string, string> = { hidden: "trash" };
    const dbStatus = statusMap[parsed.data.status] ?? parsed.data.status;

    const comment = await db.comment.update({
      where: { id },
      data: { status: dbStatus },
    });

    return apiSuccess(comment);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/comments/:id]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.comments.delete);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    await db.comment.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/comments/:id]", error);
    return ApiErrors.internal();
  }
}
