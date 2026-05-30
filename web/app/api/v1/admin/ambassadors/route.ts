import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  commissionRate: z.number().min(0).max(100),
  status: z.enum(["active", "inactive", "pending"]).default("pending"),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.ambassadors.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "createdAt");
    const skip = (page - 1) * limit;

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      inactive: "PAUSED",
      pending: "PENDING",
    };

    const where = {
      ...(status && status !== "all" ? { status: statusMap[status] ?? status.toUpperCase() } : {}),
      ...(search
      ? {
          OR: [
            { displayName: { contains: search, mode: "insensitive" as const } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
        : {}),
    };

    const ambassadorSortFields = ["createdAt", "updatedAt"] as const;

    const [rows, total] = await Promise.all([
      db.ambassador.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, ambassadorSortFields, "createdAt"),
        include: {
          user: { select: { email: true } },
          _count: { select: { links: true, commissions: true } },
        },
      }),
      db.ambassador.count({ where }),
    ]);

    const data = rows.map((a) => ({
      id: a.id,
      name: a.displayName,
      email: a.user.email,
      commissionRate: Number(a.commissionRate),
      status: a.status.toLowerCase(),
      totalClicks: 0,
      totalSales: a._count.commissions,
      totalEarnings: 0,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
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
    console.error("[GET /api/v1/admin/ambassadors]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.ambassadors.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { name, email, commissionRate, status } = parsed.data;

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          fullName: name,
          role: "AMBASSADOR",
          passwordHash: "",
        },
      });
    }

    const existingAmbassador = await db.ambassador.findUnique({ where: { userId: user.id } });
    if (existingAmbassador) return ApiErrors.badRequest("User is already an ambassador");

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      inactive: "PAUSED",
      pending: "PENDING",
    };

    const ambassador = await db.ambassador.create({
      data: {
        userId: user.id,
        displayName: name,
        commissionRate,
        status: statusMap[status] ?? "PENDING",
        approvedAt: status === "active" ? new Date() : null,
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_AMBASSADOR", entity: "Ambassador", entityId: ambassador.id },
    });

    return apiCreated({ id: ambassador.id, name, email, commissionRate, status, totalClicks: 0, totalSales: 0, totalEarnings: 0 });
  } catch (error) {
    console.error("[POST /api/v1/admin/ambassadors]", error);
    return ApiErrors.internal();
  }
}
