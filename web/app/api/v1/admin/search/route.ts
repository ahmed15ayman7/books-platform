import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { notDeleted } from "@/lib/admin/audit-fields";
import { MEDIA_CHANNELS } from "@/lib/media/youtube";

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
    const [books, articles, media, publishers, authors] = await Promise.all([
      db.product.findMany({
        where: {
          ...notDeleted,
          OR: [
            { nameEn: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
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
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { titleEn: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
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
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { titleEn: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
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
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
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
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
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
