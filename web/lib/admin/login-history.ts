import { db } from "@/lib/db";

const AUTH_ACTIONS = ["LOGIN", "LOGOUT", "LOGIN_FAILED"] as const;

export async function fetchLoginHistory(userId: string, limit = 50) {
  return db.auditLog.findMany({
    where: {
      userId,
      action: { in: [...AUTH_ACTIONS] },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
    },
  });
}
