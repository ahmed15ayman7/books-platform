import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const skip = (page - 1) * limit;

    const where = search
      ? { email: { contains: search, mode: "insensitive" as const } }
      : {};

    const [rows, total] = await Promise.all([
      db.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, status: true, createdAt: true },
      }),
      db.newsletterSubscriber.count({ where }),
    ]);

    return apiPaginated(rows, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/newsletter/subscribers]", error);
    return ApiErrors.internal();
  }
}
