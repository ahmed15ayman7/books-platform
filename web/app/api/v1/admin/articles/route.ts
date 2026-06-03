import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";
import { notDeleted } from "@/lib/admin/audit-fields";

const createSchema = z.object({
  title: z.string().min(1).max(500),
  titleEn: z.string().max(500).optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  body: z.string().optional(),
  bodyEn: z.string().optional(),
  channel: z.string().max(50).optional(),
  status: z.enum(["draft", "publish", "scheduled"]).default("draft"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  date: z.coerce.date().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const channel = searchParams.get("channel") ?? undefined;
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "updatedAt");
    const skip = (page - 1) * limit;

    const where = {
      ...notDeleted,
      ...(status && status !== "all" ? { status } : {}),
      ...(channel && channel !== "all" ? { channel } : {}),
      ...(search
        ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }] }
        : {}),
    };

    const articleSortFields = ["updatedAt", "createdAt", "title", "date"] as const;

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, articleSortFields, "updatedAt"),
        select: {
          id: true,
          title: true,
          channel: true,
          status: true,
          date: true,
          slug: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.article.count({ where }),
    ]);

    return apiPaginated(articles, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/articles]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { title, body: content, excerpt, channel, status, imageUrl, date } = parsed.data;

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 200) + "-" + Date.now();

    const article = await db.article.create({
      data: {
        originalId: Date.now(),
        title,
        content: content ?? null,
        excerpt: excerpt ?? null,
        channel: channel ?? null,
        status,
        imageUrl: imageUrl || null,
        date: date ?? null,
        slug,
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_ARTICLE", entity: "Article", entityId: article.id },
    });

    return apiCreated(article);
  } catch (error) {
    console.error("[POST /api/v1/admin/articles]", error);
    return ApiErrors.internal();
  }
}
