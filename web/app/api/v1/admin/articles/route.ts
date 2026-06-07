import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";
import { notDeleted } from "@/lib/admin/audit-fields";
import {
  adminArticleProductSelect,
  articleCreateSchema,
  resolveArticleWriteData,
} from "@/lib/admin/article-payload";
import { MEDIA_CHANNELS } from "@/lib/media/youtube";
import { nextArticleOriginalId } from "@/lib/admin/legacy-ids";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.articles.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const channel = searchParams.get("channel") ?? undefined;
    const mediaOnly = searchParams.get("mediaOnly") === "true";
    const hasVideo = searchParams.get("hasVideo") === "true";
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "updatedAt");
    const skip = (page - 1) * limit;

    const where = {
      ...notDeleted,
      ...(status && status !== "all" ? { status } : {}),
      ...(channel && channel !== "all" ? { channel } : {}),
      ...(mediaOnly ? { channel: { in: [...MEDIA_CHANNELS] } } : {}),
      ...(hasVideo ? { videoId: { not: null } } : {}),
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
          videoId: true,
          youtubeUrl: true,
          createdAt: true,
          updatedAt: true,
          titleEn: true,
          products: { ...adminArticleProductSelect, take: 1 },
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
    const parsed = articleCreateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { title, body: content, excerpt, titleEn, excerptEn, bodyEn, channel, status, date } =
      parsed.data;

    let resolved;
    try {
      resolved = await resolveArticleWriteData(parsed.data);
    } catch (err) {
      return ApiErrors.badRequest(err instanceof Error ? err.message : "Validation failed");
    }

    const originalId = await nextArticleOriginalId();
    const slug =
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 200) +
      "-" +
      originalId;

    const article = await db.article.create({
      data: {
        originalId,
        title,
        titleEn: resolved.titleEn ?? titleEn ?? null,
        content: content ?? null,
        contentEn: resolved.contentEn ?? bodyEn ?? null,
        excerpt: excerpt ?? null,
        excerptEn: resolved.excerptEn ?? excerptEn ?? null,
        channel: channel ?? null,
        status,
        imageUrl:
          resolved.imageUrl === undefined
            ? null
            : resolved.imageUrl === ""
              ? null
              : resolved.imageUrl,
        youtubeUrl: resolved.youtubeUrl ?? null,
        videoId: resolved.videoId ?? null,
        date: date ?? null,
        slug,
        ...(resolved.productIds !== undefined
          ? { products: { connect: resolved.productIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { products: adminArticleProductSelect },
    });

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "CREATE_ARTICLE",
        entity: "Article",
        entityId: article.id,
      },
    });

    return apiCreated(article);
  } catch (error) {
    console.error("[POST /api/v1/admin/articles]", error);
    return ApiErrors.internal();
  }
}
