import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const submission = await db.publishBookSubmission.findUnique({ where: { id } });
    if (!submission) return ApiErrors.notFound("Submission");

    const updated = await db.publishBookSubmission.update({
      where: { id },
      data: {
        status: "approved",
        reviewedBy: auth.payload.userId,
        reviewedAt: new Date(),
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "APPROVE_SUBMISSION", entity: "PublishBookSubmission", entityId: id },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("[POST /api/v1/admin/submissions/:id/approve]", error);
    return ApiErrors.internal();
  }
}
