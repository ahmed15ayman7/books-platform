import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.settings.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const status = searchParams.get("status") ?? undefined;
    const skip = (page - 1) * limit;

    const where = status && status !== "all" ? { status } : {};

    const [messages, total] = await Promise.all([
      db.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.contactMessage.count({ where }),
    ]);

    return apiPaginated(messages, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/contact-messages]", error);
    return ApiErrors.internal();
  }
}
