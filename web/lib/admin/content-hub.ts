import { db } from "@/lib/db";
import { onlyDeleted, notDeleted, withRestore } from "@/lib/admin/audit-fields";
import type { AdminAuthContext } from "@/lib/auth/rbac";
import {
  type TrashType,
  type DraftType,
  canAccessTrashType as canAccessTrashTypePerm,
  canAccessDraftType as canAccessDraftTypePerm,
  canPublishDraftType as canPublishDraftTypePerm,
  getAccessibleTrashTypes as getAccessibleTrashTypesPerm,
  getAccessibleDraftTypes as getAccessibleDraftTypesPerm,
} from "@/lib/admin/content-hub-permissions";

export {
  TRASH_TYPES,
  DRAFT_TYPES,
  TRASH_TYPE_LABELS,
  DRAFT_TYPE_LABELS,
  type TrashType,
  type DraftType,
  canAccessTrashHub,
  canAccessDraftsHub,
} from "@/lib/admin/content-hub-permissions";

function authUser(auth: AdminAuthContext) {
  return { isSuperAdmin: auth.isSuperAdmin, permissions: auth.permissions };
}

export function canAccessTrashType(auth: AdminAuthContext, type: TrashType): boolean {
  return canAccessTrashTypePerm(authUser(auth), type);
}

export function canAccessDraftType(auth: AdminAuthContext, type: DraftType): boolean {
  return canAccessDraftTypePerm(authUser(auth), type);
}

export function canPublishDraftType(auth: AdminAuthContext, type: DraftType): boolean {
  return canPublishDraftTypePerm(authUser(auth), type);
}

export function getAccessibleTrashTypes(auth: AdminAuthContext): TrashType[] {
  return getAccessibleTrashTypesPerm(authUser(auth));
}

export function getAccessibleDraftTypes(auth: AdminAuthContext): DraftType[] {
  return getAccessibleDraftTypesPerm(authUser(auth));
}

export interface HubListItem {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  status?: string;
  deletedAt?: Date;
  updatedAt: Date;
}

export async function listTrashItems(
  type: TrashType,
  page: number,
  limit: number,
): Promise<{ items: HubListItem[]; total: number }> {
  const skip = (page - 1) * limit;

  switch (type) {
    case "books": {
      const where = onlyDeleted;
      const [rows, total] = await Promise.all([
        db.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { deletedAt: "desc" },
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            slug: true,
            deletedAt: true,
            updatedAt: true,
          },
        }),
        db.product.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.nameAr ?? r.nameEn,
          subtitle: r.nameEn,
          slug: r.slug,
          deletedAt: r.deletedAt ?? undefined,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "articles": {
      const where = onlyDeleted;
      const [rows, total] = await Promise.all([
        db.article.findMany({
          where,
          skip,
          take: limit,
          orderBy: { deletedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            channel: true,
            deletedAt: true,
            updatedAt: true,
          },
        }),
        db.article.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.channel ?? undefined,
          slug: r.slug,
          deletedAt: r.deletedAt ?? undefined,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "publishers": {
      const where = onlyDeleted;
      const [rows, total] = await Promise.all([
        db.publisher.findMany({
          where,
          skip,
          take: limit,
          orderBy: { deletedAt: "desc" },
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            deletedAt: true,
            updatedAt: true,
          },
        }),
        db.publisher.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.nameAr ?? r.name,
          subtitle: r.slug,
          slug: r.slug,
          deletedAt: r.deletedAt ?? undefined,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "hero": {
      const where = onlyDeleted;
      const [rows, total] = await Promise.all([
        db.homeHeroSlide.findMany({
          where,
          skip,
          take: limit,
          orderBy: { deletedAt: "desc" },
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
            deletedAt: true,
            updatedAt: true,
          },
        }),
        db.homeHeroSlide.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.titleAr,
          subtitle: r.titleEn ?? undefined,
          deletedAt: r.deletedAt ?? undefined,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "users": {
      const where = { role: "ADMIN", ...onlyDeleted };
      const [rows, total] = await Promise.all([
        db.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { deletedAt: "desc" },
          select: {
            id: true,
            fullName: true,
            email: true,
            deletedAt: true,
            updatedAt: true,
          },
        }),
        db.user.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.fullName,
          subtitle: r.email,
          deletedAt: r.deletedAt ?? undefined,
          updatedAt: r.updatedAt,
        })),
      };
    }
  }
}

export async function listDraftItems(
  type: DraftType,
  page: number,
  limit: number,
): Promise<{ items: HubListItem[]; total: number }> {
  const skip = (page - 1) * limit;

  switch (type) {
    case "books": {
      const where = { published: false, ...notDeleted };
      const [rows, total] = await Promise.all([
        db.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            slug: true,
            updatedAt: true,
          },
        }),
        db.product.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.nameAr ?? r.nameEn,
          subtitle: r.nameEn,
          slug: r.slug,
          status: "draft",
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "articles": {
      const where = {
        status: { in: ["draft", "scheduled"] },
        ...notDeleted,
      };
      const [rows, total] = await Promise.all([
        db.article.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            channel: true,
            updatedAt: true,
          },
        }),
        db.article.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.channel ?? undefined,
          slug: r.slug,
          status: r.status,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "publishers": {
      const where = { status: "draft", ...notDeleted };
      const [rows, total] = await Promise.all([
        db.publisher.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            status: true,
            updatedAt: true,
          },
        }),
        db.publisher.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.nameAr ?? r.name,
          subtitle: r.slug,
          slug: r.slug,
          status: r.status,
          updatedAt: r.updatedAt,
        })),
      };
    }
    case "submissions": {
      const where = { status: "draft" };
      const [rows, total] = await Promise.all([
        db.publishBookSubmission.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            titleAr: true,
            authorEmail: true,
            status: true,
            updatedAt: true,
          },
        }),
        db.publishBookSubmission.count({ where }),
      ]);
      return {
        total,
        items: rows.map((r) => ({
          id: r.id,
          title: r.titleAr ?? r.title,
          subtitle: r.authorEmail ?? undefined,
          status: r.status,
          updatedAt: r.updatedAt,
        })),
      };
    }
  }
}

export async function restoreTrashItem(
  type: TrashType,
  id: string,
  userId: string,
): Promise<boolean> {
  const restoreData = withRestore(userId);

  switch (type) {
    case "books": {
      const row = await db.product.findFirst({ where: { id, ...onlyDeleted } });
      if (!row) return false;
      await db.product.update({ where: { id }, data: restoreData });
      return true;
    }
    case "articles": {
      const row = await db.article.findFirst({ where: { id, ...onlyDeleted } });
      if (!row) return false;
      await db.article.update({ where: { id }, data: restoreData });
      return true;
    }
    case "publishers": {
      const row = await db.publisher.findFirst({ where: { id, ...onlyDeleted } });
      if (!row) return false;
      await db.publisher.update({ where: { id }, data: restoreData });
      return true;
    }
    case "hero": {
      const row = await db.homeHeroSlide.findFirst({ where: { id, ...onlyDeleted } });
      if (!row) return false;
      await db.homeHeroSlide.update({ where: { id }, data: restoreData });
      return true;
    }
    case "users": {
      const row = await db.user.findFirst({
        where: { id, role: "ADMIN", ...onlyDeleted },
      });
      if (!row) return false;
      await db.user.update({
        where: { id },
        data: { ...restoreData, isActive: true },
      });
      return true;
    }
  }
}

export async function publishDraftItem(
  type: Exclude<DraftType, "submissions">,
  id: string,
  userId: string,
): Promise<boolean> {
  const touch = { updatedById: userId };

  switch (type) {
    case "books": {
      const row = await db.product.findFirst({
        where: { id, published: false, ...notDeleted },
      });
      if (!row) return false;
      await db.product.update({
        where: { id },
        data: { published: true, ...touch },
      });
      return true;
    }
    case "articles": {
      const row = await db.article.findFirst({
        where: {
          id,
          status: { in: ["draft", "scheduled"] },
          ...notDeleted,
        },
      });
      if (!row) return false;
      await db.article.update({
        where: { id },
        data: { status: "publish", postModifiedDate: new Date() },
      });
      return true;
    }
    case "publishers": {
      const row = await db.publisher.findFirst({
        where: { id, status: "draft", ...notDeleted },
      });
      if (!row) return false;
      await db.publisher.update({
        where: { id },
        data: { status: "publish", postModifiedDate: new Date() },
      });
      return true;
    }
  }
}

export async function countTrashAndDrafts(auth: AdminAuthContext): Promise<{
  trash: number;
  drafts: number;
}> {
  const trashTypes = getAccessibleTrashTypes(auth);
  const draftTypes = getAccessibleDraftTypes(auth);

  const trashCounts = await Promise.all(
    trashTypes.map(async (type) => {
      const { total } = await listTrashItems(type, 1, 1);
      return total;
    }),
  );

  const draftCounts = await Promise.all(
    draftTypes.map(async (type) => {
      const { total } = await listDraftItems(type, 1, 1);
      return total;
    }),
  );

  return {
    trash: trashCounts.reduce((a, b) => a + b, 0),
    drafts: draftCounts.reduce((a, b) => a + b, 0),
  };
}
