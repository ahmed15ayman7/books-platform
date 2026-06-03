import { type NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function userHasPasskeys(userId: string): Promise<boolean> {
  const count = await db.userPasskey.count({ where: { userId } });
  return count > 0;
}

/** Passkey اختياري — لا يُفرض على أي عملية */
export async function requirePasskeyVerification(
  _request: NextRequest,
  _userId: string,
): Promise<null> {
  return null;
}
