import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const rejectSchema = z.object({
  reason: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.submissions.reject);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Reason is required");

    const submission = await db.publishBookSubmission.findUnique({ where: { id } });
    if (!submission) return ApiErrors.notFound("Submission");

    const updated = await db.publishBookSubmission.update({
      where: { id },
      data: {
        status: "rejected",
        reviewNotes: parsed.data.reason,
        reviewedBy: auth.payload.userId,
        reviewedAt: new Date(),
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "REJECT_SUBMISSION", entity: "PublishBookSubmission", entityId: id },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("[POST /api/v1/admin/submissions/:id/reject]", error);
    return ApiErrors.internal();
  }
}
