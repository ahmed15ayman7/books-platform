import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createSubmissionSchema } from "@/lib/validation/submission.schema";
import { apiCreated, ApiErrors } from "@/lib/api-client/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = createSubmissionSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { website, ...data } = parsed.data;
    if (website) return apiCreated({ message: "Submission received" });

    // Check first-free eligibility
    const previousCount = await db.publishBookSubmission.count({
      where: { authorEmail: data.authorEmail },
    });
    const isFirstFree = previousCount === 0;

    const slugBase = data.bookTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const slug = `${slugBase}-${Date.now()}`;

    const submission = await db.publishBookSubmission.create({
      data: {
        title: data.bookTitle,
        content: data.bookSummary,
        authorEmail: data.authorEmail,
        authorFirstName: data.authorName.split(" ")[0] ?? data.authorName,
        authorLastName: data.authorName.split(" ").slice(1).join(" ") || undefined,
        authorPhone: data.authorPhone,
        authorBio: data.authorBio,
        bookLanguage: data.bookLanguage,
        bookCategory: data.bookCategory,
        fileUrl: data.fileUrl,
        imageUrl: data.coverUrl,
        allowFreeDownload: data.allowFreeDownload,
        isFirstFree,
        paymentStatus: isFirstFree ? "PAID" : "PENDING",
        status: "pending",
        slug,
      },
      select: {
        id: true,
        status: true,
        isFirstFree: true,
        paymentStatus: true,
      },
    });

    return apiCreated({
      submission,
      message: "Submission received successfully",
      requiresPayment: !isFirstFree,
    });
  } catch (error) {
    console.error("[POST /api/v1/submissions]", error);
    return ApiErrors.internal();
  }
}
