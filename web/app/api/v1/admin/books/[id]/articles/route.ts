import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { notDeleted } from "@/lib/admin/audit-fields";
import { isMediaChannel } from "@/lib/media/youtube";
import { PAGINATION } from "@/lib/utils/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;

  const book = await db.product.findFirst({
    where: { id, ...notDeleted },
    select: { id: true },
  });
  if (!book) return ApiErrors.notFound("Book");

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      PAGINATION.MAX_PAGE_SIZE,
      parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10),
    );
    const skip = (page - 1) * limit;

    const where = {
      ...notDeleted,
      products: { some: { id } },
    };

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          channel: true,
          status: true,
          videoId: true,
          youtubeUrl: true,
          date: true,
          imageUrl: true,
        },
      }),
      db.article.count({ where }),
    ]);

    const data = articles.map((a) => ({
      ...a,
      isMedia: isMediaChannel(a.channel),
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
    console.error("[GET /api/v1/admin/books/:id/articles]", error);
    return ApiErrors.internal();
  }
}
