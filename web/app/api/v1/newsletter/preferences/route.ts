import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { BookService } from "@/server/services/book.service";
import { ArticleService } from "@/server/services/article.service";

const prefsSchema = z.object({
  prefProductCategoryIds: z.array(z.string()).default([]),
  prefArticleCategoryIds: z.array(z.string()).default([]),
  prefPublisherIds: z.array(z.string()).default([]),
  prefAuthorIds: z.array(z.string()).default([]),
});

async function findByToken(token: string) {
  return db.newsletterSubscriber.findFirst({
    where: { manageToken: token, status: "CONFIRMED" },
  });
}

/** GET /api/v1/newsletter/preferences?token=... — load preferences + available options */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return ApiErrors.badRequest("Token required");

    const subscriber = await findByToken(token);
    if (!subscriber) return ApiErrors.notFound("Subscriber");

    const [bookCategories, articleCategories, publishers, authors] = await Promise.all([
      BookService.getCategories(),
      ArticleService.getCategories(),
      db.publisher.findMany({
        where: { status: "publish", deletedAt: null },
        select: { id: true, name: true, nameAr: true, title: true },
        orderBy: { name: "asc" },
        take: 200,
      }),
      db.author.findMany({
        select: { id: true, name: true, nameAr: true },
        orderBy: { linkedCount: "desc" },
        take: 200,
      }),
    ]);

    return apiSuccess({
      subscriber: {
        email: subscriber.email,
        locale: subscriber.locale,
        prefProductCategoryIds: subscriber.prefProductCategoryIds,
        prefArticleCategoryIds: subscriber.prefArticleCategoryIds,
        prefPublisherIds: subscriber.prefPublisherIds,
        prefAuthorIds: subscriber.prefAuthorIds,
      },
      options: { bookCategories, articleCategories, publishers, authors },
    });
  } catch (error) {
    console.error("[GET /api/v1/newsletter/preferences]", error);
    return ApiErrors.internal();
  }
}

/** PATCH /api/v1/newsletter/preferences?token=... — save preferences */
export async function PATCH(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return ApiErrors.badRequest("Token required");

    const subscriber = await findByToken(token);
    if (!subscriber) return ApiErrors.notFound("Subscriber");

    const body = await request.json() as unknown;
    const parsed = prefsSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        prefProductCategoryIds: parsed.data.prefProductCategoryIds,
        prefArticleCategoryIds: parsed.data.prefArticleCategoryIds,
        prefPublisherIds: parsed.data.prefPublisherIds,
        prefAuthorIds: parsed.data.prefAuthorIds,
      },
    });

    return apiSuccess({ message: "Preferences saved" });
  } catch (error) {
    console.error("[PATCH /api/v1/newsletter/preferences]", error);
    return ApiErrors.internal();
  }
}
