import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const PAGE_SLUGS = ["about", "team", "services", "privacy", "terms", "contact"];
const KEY_PREFIX = "static_page:";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.pages.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const records = await db.setting.findMany({
      where: { key: { in: PAGE_SLUGS.map((s) => `${KEY_PREFIX}${s}`) } },
    });

    const pageMap = new Map(records.map((r) => [r.key, r.value as Record<string, unknown>]));

    const data = PAGE_SLUGS.map((slug) => {
      const stored = pageMap.get(`${KEY_PREFIX}${slug}`) ?? {};
      return {
        id: slug,
        slug,
        titleAr: stored.titleAr ?? "",
        titleEn: stored.titleEn ?? "",
        bodyAr: stored.bodyAr ?? "",
        bodyEn: stored.bodyEn ?? "",
      };
    });

    return apiSuccess(data);
  } catch (error) {
    console.error("[GET /api/v1/admin/static-pages]", error);
    return ApiErrors.internal();
  }
}
