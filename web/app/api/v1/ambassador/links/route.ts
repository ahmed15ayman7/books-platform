import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "AMBASSADOR");
  if (isErrorResponse(auth)) return auth;

  try {
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10));
    const limit = 20;
    const skip = (page - 1) * limit;

    const ambassador = await db.ambassador.findUnique({ where: { userId: auth.payload.userId } });
    if (!ambassador) return ApiErrors.notFound("Ambassador");

    const [links, total] = await Promise.all([
      db.referralLink.findMany({
        where: { ambassadorId: ambassador.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { nameEn: true, nameAr: true, slug: true, imageUrl: true } },
        },
      }),
      db.referralLink.count({ where: { ambassadorId: ambassador.id } }),
    ]);

    return apiPaginated(links, { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 });
  } catch (error) {
    console.error("[GET /api/v1/ambassador/links]", error);
    return ApiErrors.internal();
  }
}
