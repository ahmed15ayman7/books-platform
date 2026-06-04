import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const patchSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.settings.view);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const msg = await db.contactMessage.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return apiSuccess(msg);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/contact-messages/:id]", error);
    return ApiErrors.internal();
  }
}
