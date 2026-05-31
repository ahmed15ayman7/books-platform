import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  nameAr: z.string().max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.authors.view);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const author = await db.author.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!author) return ApiErrors.notFound("Author not found");
    return apiSuccess(author);
  } catch (error) {
    console.error("[GET /api/v1/admin/authors/:id]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.authors.update);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const author = await db.author.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(author);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/authors/:id]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.authors.delete);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    await db.author.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/authors/:id]", error);
    return ApiErrors.internal();
  }
}
