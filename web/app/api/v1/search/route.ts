import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type") ?? "all";
    const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "10", 10));

    if (!q || q.length < 2) {
      return apiSuccess({ books: [], articles: [], publishers: [], totalResults: 0, query: q ?? "" });
    }

    const searchCondition = {
      contains: q,
      mode: "insensitive" as const,
    };

    const [books, articles, publishers] = await Promise.all([
      type === "all" || type === "book"
        ? db.product.findMany({
            where: {
              published: true,
              OR: [
                { nameEn: searchCondition },
                { nameAr: searchCondition },
                { description: searchCondition },
              ],
            },
            take: limit,
            select: {
              id: true,
              slug: true,
              nameEn: true,
              nameAr: true,
              imageUrl: true,
              translationStatus: true,
            },
          })
        : Promise.resolve([]),

      type === "all" || type === "article"
        ? db.article.findMany({
            where: {
              status: "publish",
              OR: [
                { title: searchCondition },
                { excerpt: searchCondition },
              ],
            },
            take: limit,
            select: {
              id: true,
              slug: true,
              title: true,
              excerpt: true,
              imageUrl: true,
              channel: true,
            },
          })
        : Promise.resolve([]),

      type === "all" || type === "publisher"
        ? db.publisher.findMany({
            where: {
              status: "publish",
              title: searchCondition,
            },
            take: limit,
            select: {
              id: true,
              slug: true,
              title: true,
              imageUrl: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const totalResults = books.length + articles.length + publishers.length;

    return apiSuccess({ books, articles, publishers, totalResults, query: q });
  } catch (error) {
    console.error("[GET /api/v1/search]", error);
    return ApiErrors.internal();
  }
}
