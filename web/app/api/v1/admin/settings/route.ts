import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

const SETTINGS_KEY = "platform_settings";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const record = await db.setting.findUnique({ where: { key: SETTINGS_KEY } });
    const data = (record?.value as Record<string, unknown>) ?? {};
    return apiSuccess(data);
  } catch (error) {
    console.error("[GET /api/v1/admin/settings]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as Record<string, unknown>;
    const value = body as Parameters<typeof db.setting.upsert>[0]["create"]["value"];

    await db.setting.upsert({
      where: { key: SETTINGS_KEY },
      create: { key: SETTINGS_KEY, value, updatedBy: auth.payload.userId },
      update: { value, updatedBy: auth.payload.userId },
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "UPDATE_SETTINGS", entity: "Setting", entityId: SETTINGS_KEY },
    });

    return apiSuccess(body);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/settings]", error);
    return ApiErrors.internal();
  }
}
