import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().max(200).optional(),
  slug: z.string().min(1).max(200),
  active: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.categories.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const categories = await db.productCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });

    const data = categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      active: true,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: c._count,
    }));

    return apiSuccess(data);
  } catch (error) {
    console.error("[GET /api/v1/admin/categories]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.categories.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const existing = await db.productCategory.findFirst({ where: { slug: parsed.data.slug } });
    if (existing) return ApiErrors.badRequest("Slug already exists");

    const category = await db.productCategory.create({
      data: {
        termId: Date.now(),
        name: parsed.data.name,
        nameAr: parsed.data.nameAr ?? null,
        slug: parsed.data.slug,
      },
    });

    return apiCreated({ ...category, active: true });
  } catch (error) {
    console.error("[POST /api/v1/admin/categories]", error);
    return ApiErrors.internal();
  }
}
