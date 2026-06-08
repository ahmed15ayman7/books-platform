import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { notDeleted } from "@/lib/admin/audit-fields";
import {
  ARTICLE_SEARCH_FIELDS,
  BOOK_SEARCH_FIELDS,
  PUBLISHER_SEARCH_FIELDS,
  buildTextSearchOr,
} from "@/lib/search/text-search-fields";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const limit = Math.min(8, parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10));

    if (!q || q.length < 2) {
      return apiSuccess([]);
    }

    const [books, articles, publishers] = await Promise.all([
      db.product.findMany({
        where: { published: true, ...notDeleted, ...buildTextSearchOr(q, BOOK_SEARCH_FIELDS) },
        take: limit,
        select: { slug: true, nameEn: true, nameAr: true },
      }),
      db.article.findMany({
        where: { status: "publish", ...notDeleted, ...buildTextSearchOr(q, ARTICLE_SEARCH_FIELDS) },
        take: Math.min(3, limit),
        orderBy: { date: "desc" },
        select: { slug: true, title: true, titleEn: true, channel: true },
      }),
      db.publisher.findMany({
        where: {
          status: "publish",
          ...notDeleted,
          ...buildTextSearchOr(q, PUBLISHER_SEARCH_FIELDS),
        },
        take: 3,
        select: { slug: true, title: true, name: true, nameAr: true },
      }),
    ]);

    const suggestions = [
      ...books.map((b) => ({
        type: "book",
        label: b.nameAr ?? b.nameEn,
        labelEn: b.nameEn,
        slug: b.slug,
      })),
      ...articles.map((a) => ({
        type: "article",
        label: a.title,
        labelEn: a.titleEn ?? a.title,
        slug: a.slug,
        channel: a.channel,
      })),
      ...publishers.map((p) => ({
        type: "publisher",
        label: p.nameAr ?? p.name ?? p.title,
        labelEn: p.name || p.title,
        slug: p.slug,
      })),
    ].slice(0, limit);

    return apiSuccess(suggestions);
  } catch (error) {
    console.error("[GET /api/v1/search/suggestions]", error);
    return ApiErrors.internal();
  }
}
