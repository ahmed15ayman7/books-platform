import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "AMBASSADOR");
  if (isErrorResponse(auth)) return auth;

  try {
    const ambassador = await db.ambassador.findUnique({
      where: { userId: auth.payload.userId },
    });

    if (!ambassador) return ApiErrors.notFound("Ambassador");

    const [totalClicks, totalConversions, pendingEarnings, paidEarnings] = await Promise.all([
      db.referralClick.count({
        where: { link: { ambassadorId: ambassador.id } },
      }),
      db.commission.count({
        where: { ambassadorId: ambassador.id },
      }),
      db.commission.aggregate({
        where: { ambassadorId: ambassador.id, status: "PENDING" },
        _sum: { amount: true },
      }),
      db.commission.aggregate({
        where: { ambassadorId: ambassador.id, status: "PAID" },
        _sum: { amount: true },
      }),
    ]);

    const totalLinksCount = await db.referralLink.count({ where: { ambassadorId: ambassador.id } });

    return apiSuccess({
      totalClicks,
      totalConversions,
      conversionRate: totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 10000) / 100 : 0,
      pendingEarnings: pendingEarnings._sum.amount ?? 0,
      paidEarnings: paidEarnings._sum.amount ?? 0,
      totalLinks: totalLinksCount,
      commissionRate: ambassador.commissionRate,
    });
  } catch (error) {
    console.error("[GET /api/v1/ambassador/dashboard]", error);
    return ApiErrors.internal();
  }
}
