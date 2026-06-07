import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiPaginated, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseOptionalBool, parseSortParam } from "@/lib/admin/list-query";

const PACKAGE_NAMES: Record<string, string> = {
  BIBLIOGRAPHIC: "الببليوغرافيا",
  RESEARCH: "التقارير البحثية",
  NEWS: "الخدمة الإخبارية",
  MEDIA: "الحزمة الإعلامية",
  FULL: "الحزمة الكاملة",
};

const createSchema = z.object({
  clientName: z.string().min(1).max(300),
  clientEmail: z.string().email(),
  packageType: z.enum(["BIBLIOGRAPHIC", "RESEARCH", "NEWS", "MEDIA", "FULL"]),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
});

async function getOrCreatePlan(packageType: string) {
  const nameAr = PACKAGE_NAMES[packageType] ?? packageType;
  const existing = await db.b2BPlan.findFirst({ where: { nameEn: packageType } });
  if (existing) return existing;

  return db.b2BPlan.create({
    data: {
      nameAr,
      nameEn: packageType,
      description: nameAr,
      features: [],
      priceMonthly: 0,
      priceYearly: 0,
    },
  });
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.b2b.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const isActive = parseOptionalBool(searchParams.get("isActive"));
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "createdAt");
    const skip = (page - 1) * limit;

    const where = isActive !== undefined ? { isActive } : {};

    const b2bSortFields = ["createdAt", "updatedAt", "endsAt"] as const;

    const [rows, total] = await Promise.all([
      db.b2BSubscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, b2bSortFields, "createdAt"),
        include: {
          client: true,
          plan: true,
        },
      }),
      db.b2BSubscription.count({ where }),
    ]);

    const data = rows.map((s) => ({
      id: s.id,
      clientName: s.client.organizationName,
      clientEmail: s.client.contactEmail,
      packageType: s.plan.nameEn,
      status: s.isActive ? "active" : "inactive",
      startDate: s.startsAt.toISOString(),
      endDate: s.endsAt.toISOString(),
      renewalDate: null,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
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
    console.error("[GET /api/v1/admin/b2b]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.b2b.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { clientName, clientEmail, packageType, startDate, endDate, notes } = parsed.data;

    const plan = await getOrCreatePlan(packageType);

    let client = await db.b2BClient.findUnique({ where: { contactEmail: clientEmail } });
    if (!client) {
      client = await db.b2BClient.create({
        data: {
          organizationName: clientName,
          contactName: clientName,
          contactEmail: clientEmail,
          notes: notes ?? null,
        },
      });
    }

    const subscription = await db.b2BSubscription.create({
      data: {
        clientId: client.id,
        planId: plan.id,
        startsAt: new Date(startDate),
        endsAt: new Date(endDate),
        billingCycle: "yearly",
        amount: 0,
        isActive: true,
      },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "CREATE_B2B_SUBSCRIPTION", entity: "B2BSubscription", entityId: subscription.id },
    });

    return apiCreated({
      id: subscription.id,
      clientName,
      clientEmail,
      packageType,
      status: "active",
      startDate,
      endDate,
      renewalDate: null,
    });
  } catch (error) {
    console.error("[POST /api/v1/admin/b2b]", error);
    return ApiErrors.internal();
  }
}
