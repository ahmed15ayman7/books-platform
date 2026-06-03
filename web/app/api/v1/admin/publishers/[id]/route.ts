import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { notDeleted, withSoftDelete } from "@/lib/admin/audit-fields";
import { requirePasskeyVerification } from "@/lib/auth/require-passkey";
import { publisherBilingualDbData } from "@/lib/admin/publisher-fields";

const updateSchema = z.object({
  name: z.string().max(300).optional(),
  nameAr: z.string().max(300).optional(),
  country: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().optional(),
  contentAr: z.string().optional(),
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
    const publisher = await db.publisher.findFirst({
      where: { id, ...notDeleted },
      include: {
        sponsored: { select: { id: true } },
        countries: { select: { name: true }, take: 1 },
      },
    });
    if (!publisher) return ApiErrors.notFound("Publisher");

    return apiSuccess({
      id: publisher.id,
      slug: publisher.slug,
      name: publisher.name,
      nameAr: publisher.nameAr ?? "",
      country: publisher.countries[0]?.name ?? "",
      websiteUrl: publisher.websiteUrl ?? "",
      contactEmail: publisher.contactEmail ?? "",
      content: publisher.content ?? "",
      contentAr: publisher.contentAr ?? "",
      imageUrl: publisher.imageFeatured ?? publisher.imageUrl ?? "",
      status: publisher.status,
      sponsored: publisher.sponsored !== null,
      createdAt: publisher.createdAt,
      updatedAt: publisher.updatedAt,
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

    const existing = await db.publisher.findFirst({ where: { id, ...notDeleted } });
    if (!existing) return ApiErrors.notFound("Publisher");

    const {
      name,
      nameAr,
      content,
      contentAr,
      websiteUrl,
      contactEmail,
      imageUrl,
      status,
      sponsored,
    } = parsed.data;

    const bilingual =
      name !== undefined ||
      nameAr !== undefined ||
      content !== undefined ||
      contentAr !== undefined
        ? publisherBilingualDbData({
            name: name ?? existing.name,
            nameAr: nameAr ?? existing.nameAr ?? "",
            content: content !== undefined ? content : (existing.content ?? ""),
            contentAr: contentAr !== undefined ? contentAr : (existing.contentAr ?? ""),
          })
        : null;

    const publisher = await db.publisher.update({
      where: { id },
      data: {
        ...(bilingual ?? {}),
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

    return apiSuccess(publisher);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/publishers/:id]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.publishers.delete);
  if (isErrorResponse(auth)) return auth;

  const passkeyErr = await requirePasskeyVerification(request, auth.payload.userId);
  if (passkeyErr) return passkeyErr;

  const { id } = await params;
  try {
    const existing = await db.publisher.findFirst({ where: { id, ...notDeleted } });
    if (!existing) return ApiErrors.notFound("Publisher");

    await db.publisher.update({
      where: { id },
      data: withSoftDelete(auth.payload.userId),
    });

    await db.auditLog.create({
      data: { userId: auth.payload.userId, action: "DELETE_PUBLISHER", entity: "Publisher", entityId: id },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/publishers/:id]", error);
    return ApiErrors.internal();
  }
}
