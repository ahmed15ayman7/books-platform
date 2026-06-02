import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { notDeleted, withCreate } from "@/lib/admin/audit-fields";
import {
  parseOptionalBool,
  parseSortParam,
  productListOrderBy,
} from "@/lib/admin/list-query";
import {
  mergeAuthorCountIntoWhere,
  parseAuthorCountFilter,
} from "@/lib/admin/book-author-count-filter";

const createBookSchema = z.object({
  nameEn: z.string().min(1).max(300),
  nameAr: z.string().max(300).optional(),
  isbn: z.string().max(20).optional(),
  language: z.string().max(10).optional(),
  publicationYear: z.number().int().optional(),
  shortDesc: z.string().optional(),
  shortDescAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.string().default("USD"),
  imageUrl: z.string().url().optional(),
  translationStatus: z.enum(["NOT_TRANSLATED", "NOMINATED", "TRANSLATED", "PARTIAL"]).default("NOT_TRANSLATED"),
  purchaseOption: z.enum(["DIRECT", "REFERRAL", "NOT_AVAILABLE"]).default("NOT_AVAILABLE"),
  referralLink: z.string().url().optional(),
  publisherId: z.string().cuid().optional(),
  primaryCategoryId: z.string().cuid().optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  slug: z.string().min(1).max(200),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.books.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const sortParam = searchParams.get("sort");
    const { sortBy, sortOrder } = parseSortParam(sortParam, "updatedAt");
    const published = parseOptionalBool(searchParams.get("published"));
    const featured = parseOptionalBool(searchParams.get("featured"));
    const translationStatus = searchParams.get("translationStatus") ?? undefined;
    const authorCount = parseAuthorCountFilter(searchParams.get("authorCount"));
    const skip = (page - 1) * limit;

    const baseWhere = {
      ...notDeleted,
      ...(published !== undefined ? { published } : {}),
      ...(featured !== undefined ? { featured } : {}),
      ...(translationStatus && translationStatus !== "all"
        ? { translationStatus }
        : {}),
      ...(search
        ? {
            OR: [
              { nameEn: { contains: search, mode: "insensitive" as const } },
              { nameAr: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const where = await mergeAuthorCountIntoWhere(baseWhere, authorCount);

    const [books, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: productListOrderBy(sortBy, sortOrder),
        include: {
          publisher: { select: { title: true, slug: true } },
          primaryCategory: { select: { name: true, nameAr: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    return apiPaginated(books, { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 });
  } catch (error) {
    console.error("[GET /api/v1/admin/books]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.books.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createBookSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { nextProductOriginalId } = await import("@/lib/admin/legacy-ids");
    const originalId = await nextProductOriginalId();

    const book = await db.product.create({
      data: {
        ...parsed.data,
        originalId,
        slug: parsed.data.slug,
        ...withCreate(auth.payload.userId),
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_BOOK", entity: "Product", entityId: book.id },
    });

    return apiCreated(book);
  } catch (error) {
    console.error("[POST /api/v1/admin/books]", error);
    return ApiErrors.internal();
  }
}
