import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createCommentSchema } from "@/lib/validation/comment.schema";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId") ?? undefined;
    const articleId = searchParams.get("articleId") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      PAGINATION.MAX_PAGE_SIZE,
      parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10),
    );

    if (!productId && !articleId) {
      return ApiErrors.badRequest("productId or articleId required");
    }

    const skip = (page - 1) * limit;
    const where = {
      status: "approved",
      ...(productId && { productId }),
      ...(articleId && { articleId }),
      parentId: null,
    };

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { commentDate: "desc" },
        select: {
          id: true,
          authorName: true,
          content: true,
          commentDate: true,
          parentId: true,
        },
      }),
      db.comment.count({ where }),
    ]);

    return apiSuccess({
      comments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/v1/comments]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    }

    const { website, email, ...data } = parsed.data;

    // Honeypot check
    if (website) {
      return apiCreated({ message: "Comment submitted" });
    }

    const auto_approve = await db.setting.findUnique({ where: { key: "comment_auto_approve" } });
    const status = auto_approve?.value === true ? "approved" : "pending";

    const comment = await db.comment.create({
      data: {
        ...data,
        ...(email ? { email } : {}),
        commentDate: new Date(),
        status,
      },
      select: {
        id: true,
        authorName: true,
        content: true,
        commentDate: true,
        status: true,
      },
    });

    return apiCreated({
      comment,
      message: status === "approved"
        ? "Comment posted"
        : "Comment submitted for review",
    });
  } catch (error) {
    console.error("[POST /api/v1/comments]", error);
    return ApiErrors.internal();
  }
}
