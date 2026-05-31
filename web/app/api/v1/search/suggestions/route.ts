import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const limit = Math.min(8, parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10));

    if (!q || q.length < 2) {
      return apiSuccess([]);
    }

    const condition = { contains: q, mode: "insensitive" as const };

    const [books, publishers] = await Promise.all([
      db.product.findMany({
        where: { published: true, OR: [{ nameEn: condition }, { nameAr: condition }] },
        take: limit,
        select: { slug: true, nameEn: true, nameAr: true },
      }),
      db.publisher.findMany({
        where: {
          status: "publish",
          OR: [
            { title: condition },
            { name: condition },
            { nameAr: condition },
          ],
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
