import { db } from "@/lib/db";
import { onlyDeleted } from "@/lib/admin/audit-fields";
import { expiredDeletedWhere } from "@/lib/admin/trash-config";
import { TRASH_TYPES, type TrashType } from "@/lib/admin/content-hub-permissions";

export class TrashPurgeError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "TrashPurgeError";
  }
}

async function purgeBook(id: string): Promise<void> {
  const product = await db.product.findFirst({ where: { id, ...onlyDeleted } });
  if (!product) throw new TrashPurgeError("الكتاب غير موجود في سلة المحذوفات", "NOT_FOUND");

  const orderCount = await db.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    throw new TrashPurgeError(
      "لا يمكن الحذف النهائي — الكتاب مرتبط بطلبات شراء",
      "HAS_ORDERS",
    );
  }

  await db.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { productId: id } });
    await tx.wishlistItem.deleteMany({ where: { productId: id } });
    await tx.rating.deleteMany({ where: { productId: id } });
    await tx.bookView.deleteMany({ where: { productId: id } });

    const links = await tx.referralLink.findMany({
      where: { productId: id },
      select: { id: true },
    });
    if (links.length > 0) {
      const linkIds = links.map((l) => l.id);
      await tx.referralClick.deleteMany({ where: { linkId: { in: linkIds } } });
      await tx.referralLink.deleteMany({ where: { id: { in: linkIds } } });
    }

    await tx.sponsoredPublisher.updateMany({
      where: { featuredProductId: id },
      data: { featuredProductId: null },
    });

    await tx.comment.updateMany({
      where: { productId: id },
      data: { productId: null },
    });

    await tx.product.delete({ where: { id } });
  });
}

async function purgeArticle(id: string): Promise<void> {
  const article = await db.article.findFirst({ where: { id, ...onlyDeleted } });
  if (!article) throw new TrashPurgeError("المقال غير موجود في سلة المحذوفات", "NOT_FOUND");

  await db.$transaction(async (tx) => {
    await tx.comment.deleteMany({ where: { articleId: id } });
    await tx.article.delete({ where: { id } });
  });
}

async function purgePublisher(id: string): Promise<void> {
  const publisher = await db.publisher.findFirst({ where: { id, ...onlyDeleted } });
  if (!publisher) throw new TrashPurgeError("الناشر غير موجود في سلة المحذوفات", "NOT_FOUND");

  const productCount = await db.product.count({ where: { publisherId: id } });
  if (productCount > 0) {
    throw new TrashPurgeError(
      "لا يمكن الحذف النهائي — الناشر مرتبط بكتب",
      "HAS_PRODUCTS",
    );
  }

  await db.$transaction(async (tx) => {
    await tx.sponsoredPublisher.deleteMany({ where: { publisherId: id } });
    await tx.publisher.delete({ where: { id } });
  });
}

async function purgeHeroSlide(id: string): Promise<void> {
  const slide = await db.homeHeroSlide.findFirst({ where: { id, ...onlyDeleted } });
  if (!slide) throw new TrashPurgeError("الشريحة غير موجودة في سلة المحذوفات", "NOT_FOUND");
  await db.homeHeroSlide.delete({ where: { id } });
}

async function purgeAdminUser(id: string): Promise<void> {
  const user = await db.user.findFirst({
    where: { id, role: "ADMIN", ...onlyDeleted },
  });
  if (!user) throw new TrashPurgeError("المستخدم غير موجود في سلة المحذوفات", "NOT_FOUND");

  if (user.isSuperAdmin) {
    const superCount = await db.user.count({
      where: { role: "ADMIN", isSuperAdmin: true, deletedAt: null, isActive: true },
    });
    if (superCount <= 1) {
      throw new TrashPurgeError("لا يمكن حذف آخر مدير رئيسي", "LAST_SUPER_ADMIN");
    }
  }

  await db.$transaction(async (tx) => {
    await tx.auditLog.updateMany({ where: { userId: id }, data: { userId: null } });
    await tx.refreshToken.deleteMany({ where: { userId: id } });
    await tx.userPasskey.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });
}

export async function purgeTrashItem(type: TrashType, id: string): Promise<void> {
  switch (type) {
    case "books":
      return purgeBook(id);
    case "articles":
      return purgeArticle(id);
    case "publishers":
      return purgePublisher(id);
    case "hero":
      return purgeHeroSlide(id);
    case "users":
      return purgeAdminUser(id);
  }
}

async function findExpiredIds(type: TrashType): Promise<string[]> {
  const where = expiredDeletedWhere();

  switch (type) {
    case "books": {
      const rows = await db.product.findMany({ where, select: { id: true } });
      return rows.map((r) => r.id);
    }
    case "articles": {
      const rows = await db.article.findMany({ where, select: { id: true } });
      return rows.map((r) => r.id);
    }
    case "publishers": {
      const rows = await db.publisher.findMany({ where, select: { id: true } });
      return rows.map((r) => r.id);
    }
    case "hero": {
      const rows = await db.homeHeroSlide.findMany({ where, select: { id: true } });
      return rows.map((r) => r.id);
    }
    case "users": {
      const rows = await db.user.findMany({
        where: { role: "ADMIN", ...where },
        select: { id: true },
      });
      return rows.map((r) => r.id);
    }
  }
}

export async function purgeExpiredTrash(): Promise<{ purged: number; failed: number }> {
  let purged = 0;
  let failed = 0;

  for (const type of TRASH_TYPES) {
    const ids = await findExpiredIds(type);
    for (const id of ids) {
      try {
        await purgeTrashItem(type, id);
        purged += 1;
      } catch (error) {
        failed += 1;
        console.error(`[purgeExpiredTrash] ${type}/${id}`, error);
      }
    }
  }

  return { purged, failed };
}
