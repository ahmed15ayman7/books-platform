import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.submissions.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { authorEmail: { contains: search, mode: "insensitive" as const } },
            { authorFirstName: { contains: search, mode: "insensitive" as const } },
            { authorLastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      db.publishBookSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        select: {
          id: true,
          title: true,
          authorEmail: true,
          authorFirstName: true,
          authorLastName: true,
          authorPhone: true,
          bookCategory: true,
          bookLanguage: true,
          status: true,
          date: true,
          isFirstFree: true,
        },
      }),
      db.publishBookSubmission.count({ where }),
    ]);

    const data = rows.map((s) => ({
      ...s,
      workTitle: s.title,
      workType: s.bookCategory ?? "OTHER",
      authorName: [s.authorFirstName, s.authorLastName].filter(Boolean).join(" ") || "—",
      createdAt: s.date ?? new Date(0),
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
    console.error("[GET /api/v1/admin/submissions]", error);
    return ApiErrors.internal();
  }
}
