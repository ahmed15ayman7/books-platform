import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

interface RouteParams { params: Promise<{ id: string }> }

const updateSchema = z.object({
  nameEn: z.string().min(1).max(300).optional(),
  nameAr: z.string().max(300).optional(),
  shortDesc: z.string().optional().nullable(),
  shortDescAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  language: z.string().max(10).optional().nullable(),
  price: z.number().positive().optional().nullable(),
  imageUrl: z.string().max(2000).optional().nullable(),
  translationStatus: z.enum(["NOT_TRANSLATED", "NOMINATED", "TRANSLATED"]).optional(),
  purchaseOption: z.enum(["DIRECT", "REFERRAL", "NOT_AVAILABLE"]).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
}).passthrough();

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await params;
    const book = await db.product.findUnique({
      where: { id },
      include: {
        publisher: { select: { title: true, slug: true } },
        primaryCategory: { select: { name: true, nameAr: true } },
      },
    });
    if (!book) return ApiErrors.notFound("Book");
    return apiSuccess(book);
  } catch (error) {
    console.error("[GET /api/v1/admin/books/:id]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await params;
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return ApiErrors.notFound("Book");

    const updated = await db.product.update({ where: { id }, data: parsed.data });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "UPDATE_BOOK", entity: "Product", entityId: id, changes: JSON.parse(JSON.stringify(parsed.data)) as object },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/books/:id]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return ApiErrors.notFound("Book");

    await db.product.delete({ where: { id } });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "DELETE_BOOK", entity: "Product", entityId: id },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/books/:id]", error);
    return ApiErrors.internal();
  }
}
