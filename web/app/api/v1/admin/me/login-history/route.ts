import { type NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchLoginHistory } from "@/lib/admin/login-history";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, PERMISSIONS.account.view);
  if (isAdminAuthError(auth)) return auth;

  const logs = await fetchLoginHistory(auth.userId);
  return apiSuccess(logs);
}
