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
    return apiSuccess({
      ...author,
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
    });
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
    const existing = await db.author.findUnique({ where: { id } });
    if (!existing) return ApiErrors.notFound("Author not found");

    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { name, nameAr, slug, bio, bioAr } = parsed.data;

    if (slug && slug !== existing.slug) {
      const slugTaken = await db.author.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugTaken) return ApiErrors.badRequest("Slug already exists");
    }

    const author = await db.author.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameAr !== undefined && { nameAr: nameAr.trim() || null }),
        ...(slug !== undefined && { slug }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
        ...(bioAr !== undefined && { bioAr: bioAr.trim() || null }),
      },
      include: { _count: { select: { products: true } } },
    });

    return apiSuccess({
      id: author.id,
      name: author.name,
      nameAr: author.nameAr,
      slug: author.slug,
      bio: author.bio,
      bioAr: author.bioAr,
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
      _count: author._count,
    });
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
    const author = await db.author.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!author) return ApiErrors.notFound("Author not found");

    await db.author.update({
      where: { id },
      data: { products: { set: [] } },
    });
    await db.author.delete({ where: { id } });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/authors/:id]", error);
    return ApiErrors.internal();
  }
}
