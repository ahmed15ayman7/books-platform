import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { notDeleted } from "@/lib/admin/audit-fields";
import { MEDIA_CHANNELS } from "@/lib/media/youtube";
import {
  ARTICLE_SEARCH_FIELDS,
  AUTHOR_SEARCH_FIELDS,
  BOOK_SEARCH_FIELDS,
  PUBLISHER_SEARCH_FIELDS,
  buildTextSearchOr,
} from "@/lib/search/text-search-fields";

const TAKE = 6;

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return apiSuccess({
      books: [],
      articles: [],
      media: [],
      publishers: [],
      authors: [],
    });
  }

  try {
    const textSearch = buildTextSearchOr(q, ARTICLE_SEARCH_FIELDS);

    const [books, articles, media, publishers, authors] = await Promise.all([
      db.product.findMany({
        where: {
          ...notDeleted,
          ...buildTextSearchOr(q, BOOK_SEARCH_FIELDS),
        },
        take: TAKE,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          imageUrl: true,
        },
      }),
      db.article.findMany({
        where: {
          ...notDeleted,
          channel: { notIn: [...MEDIA_CHANNELS] },
          ...textSearch,
        },
        take: TAKE,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          channel: true,
          imageUrl: true,
        },
      }),
      db.article.findMany({
        where: {
          ...notDeleted,
          channel: { in: [...MEDIA_CHANNELS] },
          ...textSearch,
        },
        take: TAKE,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          channel: true,
          imageUrl: true,
          videoId: true,
        },
      }),
      db.publisher.findMany({
        where: {
          ...notDeleted,
          ...buildTextSearchOr(q, PUBLISHER_SEARCH_FIELDS),
        },
        take: TAKE,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          name: true,
          nameAr: true,
          imageUrl: true,
        },
      }),
      db.author.findMany({
        where: {
          spamFlag: null,
          ...buildTextSearchOr(q, AUTHOR_SEARCH_FIELDS),
        },
        take: TAKE,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          nameAr: true,
        },
      }),
    ]);

    return apiSuccess({ books, articles, media, publishers, authors });
  } catch (error) {
    console.error("[GET /api/v1/admin/search]", error);
    return ApiErrors.internal();
  }
}
