import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { nextAuthorTermId } from "@/lib/admin/legacy-ids";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().max(200).optional(),
  slug: z.string().min(1).max(200),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.authors.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip = (page - 1) * limit;
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "name");
    const search = searchParams.get("search")?.trim();
    const authorSortFields = ["name", "updatedAt", "createdAt"] as const;

    const where = {
      spamFlag: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { nameAr: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      db.author.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, authorSortFields, "name"),
        include: { _count: { select: { products: true } } },
      }),
      db.author.count({ where }),
    ]);

    const data = rows.map((a) => ({
      id: a.id,
      name: a.name,
      nameAr: a.nameAr,
      slug: a.slug,
      bio: a.bio,
      bioAr: a.bioAr,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      _count: a._count,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return apiPaginated(data, {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/authors]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.authors.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const existing = await db.author.findFirst({ where: { slug: parsed.data.slug } });
    if (existing) return ApiErrors.badRequest("Slug already exists");

    const author = await db.author.create({
      data: {
        termId: await nextAuthorTermId(),
        name: parsed.data.name,
        nameAr: parsed.data.nameAr ?? null,
        slug: parsed.data.slug,
        bio: parsed.data.bio ?? null,
        bioAr: parsed.data.bioAr ?? null,
      },
    });

    return apiCreated({
      id: author.id,
      name: author.name,
      nameAr: author.nameAr,
      slug: author.slug,
      bio: author.bio,
      bioAr: author.bioAr,
    });
  } catch (error) {
    console.error("[POST /api/v1/admin/authors]", error);
    return ApiErrors.internal();
  }
}
