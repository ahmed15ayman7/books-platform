import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
      await db.refreshToken.updateMany({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      }).catch(() => {});
    }

    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const payload = await verifyAccessToken(auth.slice(7));
      if (payload) {
        await db.auditLog.create({
          data: { userId: payload.userId, action: "LOGOUT", entity: "User", entityId: payload.userId },
        }).catch(() => {});
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("refresh_token");
    return response;
  } catch {
    return NextResponse.json({ success: true });
  }
}
