import { type NextRequest } from "next/server";
import { verifyAccessToken, type AuthPayload } from "./jwt";
import { ApiErrors } from "@/lib/api-client/response";

export async function requireAuth(
  request: NextRequest,
  requiredRole?: string
): Promise<{ payload: AuthPayload } | ReturnType<typeof ApiErrors.unauthorized>> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return ApiErrors.unauthorized();
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return ApiErrors.unauthorized();
  }

  if (requiredRole && payload.role !== requiredRole && payload.role !== "ADMIN") {
    return ApiErrors.forbidden();
  }

  return { payload };
}

export function isErrorResponse(
  result: { payload: AuthPayload } | ReturnType<typeof ApiErrors.unauthorized>
): result is ReturnType<typeof ApiErrors.unauthorized> {
  return !("payload" in result);
}
