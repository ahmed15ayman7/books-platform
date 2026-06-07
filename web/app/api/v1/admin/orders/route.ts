import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.orders.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "createdAt");
    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== "all" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { customerEmail: { contains: search, mode: "insensitive" as const } },
              { orderNumber: { contains: search, mode: "insensitive" as const } },
              { customerName: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const orderSortFields = ["createdAt", "updatedAt", "total"] as const;

    const [rows, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, orderSortFields, "createdAt"),
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerEmail: true,
          total: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.order.count({ where }),
    ]);

    const data = rows.map((o) => ({
      ...o,
      buyerName: o.customerName,
      buyerEmail: o.customerEmail,
      totalAmount: Number(o.total),
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
    console.error("[GET /api/v1/admin/orders]", error);
    return ApiErrors.internal();
  }
}
