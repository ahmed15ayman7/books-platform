import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const createSchema = z.object({
  name: z.string().min(1).max(300),
  nameEn: z.string().max(300).optional(),
  country: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["publish", "draft"]).default("publish"),
  sponsored: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.publishers.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const skip = (page - 1) * limit;

    const where = search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {};

    const [rows, total] = await Promise.all([
      db.publisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: "asc" },
        include: {
          _count: { select: { products: true } },
          sponsored: { select: { id: true } },
          countries: { select: { name: true }, take: 1 },
        },
      }),
      db.publisher.count({ where }),
    ]);

    const data = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.title,
      country: p.countries[0]?.name ?? null,
      status: p.status,
      sponsored: p.sponsored !== null,
      _count: p._count,
    }));

    return apiPaginated(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/publishers]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.publishers.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { name, description, websiteUrl, contactEmail, imageUrl, status } = parsed.data;

    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 200) + "-" + Date.now();

    const publisher = await db.publisher.create({
      data: {
        originalId: Date.now(),
        title: name,
        content: description ?? null,
        websiteUrl: websiteUrl || null,
        contactEmail: contactEmail || null,
        imageFeatured: imageUrl || null,
        status,
        slug,
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_PUBLISHER", entity: "Publisher", entityId: publisher.id },
    });

    return apiCreated({ ...publisher, name: publisher.title, sponsored: false });
  } catch (error) {
    console.error("[POST /api/v1/admin/publishers]", error);
    return ApiErrors.internal();
  }
}
