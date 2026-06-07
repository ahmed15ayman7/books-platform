import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { buildOrderBy, parseSortParam } from "@/lib/admin/list-query";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.submissions.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const { sortBy, sortOrder } = parseSortParam(searchParams.get("sort"), "updatedAt");
    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== "all" ? { status } : {}),
      ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { authorEmail: { contains: search, mode: "insensitive" as const } },
            { authorFirstName: { contains: search, mode: "insensitive" as const } },
            { authorLastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
        : {}),
    };

    const submissionSortFields = ["updatedAt", "createdAt", "date"] as const;

    const [rows, total] = await Promise.all([
      db.publishBookSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(sortBy, sortOrder, submissionSortFields, "updatedAt"),
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
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.publishBookSubmission.count({ where }),
    ]);

    const data = rows.map((s) => ({
      ...s,
      workTitle: s.title,
      workType: s.bookCategory ?? "OTHER",
      authorName: [s.authorFirstName, s.authorLastName].filter(Boolean).join(" ") || "—",
      createdAt: s.createdAt ?? s.date ?? new Date(0),
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
    console.error("[GET /api/v1/admin/submissions]", error);
    return ApiErrors.internal();
  }
}
