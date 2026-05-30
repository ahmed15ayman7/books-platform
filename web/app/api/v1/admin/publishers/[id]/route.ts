import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";

const updateSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  nameEn: z.string().max(300).optional(),
  country: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["publish", "draft"]).optional(),
  sponsored: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.publishers.view);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const publisher = await db.publisher.findUnique({
      where: { id },
      include: {
        sponsored: { select: { id: true } },
        countries: { select: { name: true }, take: 1 },
      },
    });
    if (!publisher) return ApiErrors.notFound("Publisher");

    return apiSuccess({
      id: publisher.id,
      slug: publisher.slug,
      name: publisher.title,
      nameEn: "",
      country: publisher.countries[0]?.name ?? "",
      websiteUrl: publisher.websiteUrl ?? "",
      contactEmail: publisher.contactEmail ?? "",
      description: publisher.content ?? "",
      descriptionEn: "",
      imageUrl: publisher.imageFeatured ?? "",
      status: publisher.status,
      sponsored: publisher.sponsored !== null,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/publishers/:id]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.publishers.update);
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { name, description, websiteUrl, contactEmail, imageUrl, status, sponsored } = parsed.data;

    const publisher = await db.publisher.update({
      where: { id },
      data: {
        ...(name !== undefined && { title: name }),
        ...(description !== undefined && { content: description }),
        ...(websiteUrl !== undefined && { websiteUrl: websiteUrl || null }),
        ...(contactEmail !== undefined && { contactEmail: contactEmail || null }),
        ...(imageUrl !== undefined && { imageFeatured: imageUrl || null }),
        ...(status !== undefined && { status }),
        postModifiedDate: new Date(),
      },
    });

    if (sponsored !== undefined) {
      if (sponsored) {
        await db.sponsoredPublisher.upsert({
          where: { publisherId: id },
          create: {
            publisherId: id,
            priority: 0,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            amountPaid: 0,
          },
          update: { isActive: true },
        });
      } else {
        await db.sponsoredPublisher.updateMany({ where: { publisherId: id }, data: { isActive: false } });
      }
    }

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "UPDATE_PUBLISHER", entity: "Publisher", entityId: id },
    });

    return apiSuccess({ ...publisher, name: publisher.title });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/publishers/:id]", error);
    return ApiErrors.internal();
  }
}
