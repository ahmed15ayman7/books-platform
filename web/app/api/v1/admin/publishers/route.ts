import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseOptionalBool, parseSortParam } from "@/lib/admin/list-query";
import { notDeleted } from "@/lib/admin/audit-fields";
import { publisherBilingualDbData } from "@/lib/admin/publisher-fields";
import { slugify } from "@/lib/admin/slugify";
import { PUBLISHER_SEARCH_FIELDS, buildTextSearchOr } from "@/lib/search/text-search-fields";

const createSchema = z.object({
  name: z.string().max(300).optional(),
  nameAr: z.string().min(1).max(300),
  country: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().optional(),
  contentAr: z.string().optional(),
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
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const sponsoredFilter = parseOptionalBool(searchParams.get("sponsored"));
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "updatedAt");
    const skip = (page - 1) * limit;

    const where = {
      ...notDeleted,
      ...(status && status !== "all" ? { status } : {}),
      ...(sponsoredFilter === true ? { sponsored: { isNot: null } } : {}),
      ...(sponsoredFilter === false ? { sponsored: null } : {}),
      ...(search && buildTextSearchOr(search, PUBLISHER_SEARCH_FIELDS)),
    };

    const publisherSortFields = ["updatedAt", "createdAt", "title", "name", "nameAr"] as const;

    const [rows, total] = await Promise.all([
      db.publisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, publisherSortFields, "updatedAt"),
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
      name: p.nameAr ?? p.name ?? p.title,
      nameAr: p.nameAr,
      nameEn: p.name,
      imageUrl: p.imageFeatured ?? p.imageUrl ?? null,
      country: p.countries[0]?.name ?? null,
      status: p.status,
      sponsored: p.sponsored !== null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
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

    const {
      name = "",
      nameAr,
      content,
      contentAr,
      websiteUrl,
      contactEmail,
      imageUrl,
      status,
      sponsored,
    } = parsed.data;

    const bilingual = publisherBilingualDbData({
      name,
      nameAr,
      content,
      contentAr,
    });

    const { nextPublisherOriginalId } = await import("@/lib/admin/legacy-ids");
    const originalId = await nextPublisherOriginalId();
    const slugBase = slugify(name) || slugify(nameAr) || `publisher-${originalId}`;
    const slug = `${slugBase}-${originalId}`;

    const publisher = await db.publisher.create({
      data: {
        originalId,
        ...bilingual,
        websiteUrl: websiteUrl || null,
        contactEmail: contactEmail || null,
        imageFeatured: imageUrl || null,
        status,
        slug,
      },
    });

    if (sponsored) {
      await db.sponsoredPublisher.create({
        data: {
          publisherId: publisher.id,
          priority: 0,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          amountPaid: 0,
        },
      });
    }

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_PUBLISHER", entity: "Publisher", entityId: publisher.id },
    });

    return apiCreated({
      ...publisher,
      title: publisher.title,
      sponsored: sponsored ?? false,
    });
  } catch (error) {
    console.error("[POST /api/v1/admin/publishers]", error);
    return ApiErrors.internal();
  }
}
