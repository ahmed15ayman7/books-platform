import { db } from "@/lib/db";
import { notDeleted, withCreate, withSoftDelete, withUpdate } from "@/lib/admin/audit-fields";

export type HeroSlideInput = {
  titleAr: string;
  titleEn?: string | null;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  imageUrl: string;
  foregroundImageUrl?: string | null;
  linkUrl?: string | null;
  position?: number;
  isActive?: boolean;
};

export const HeroSlideService = {
  async listActive() {
    return db.homeHeroSlide.findMany({
      where: { isActive: true, ...notDeleted },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });
  },

  async listAll() {
    return db.homeHeroSlide.findMany({
      where: notDeleted,
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });
  },

  async getById(id: string) {
    return db.homeHeroSlide.findFirst({ where: { id, ...notDeleted } });
  },

  async create(data: HeroSlideInput, userId?: string) {
    const maxPos = await db.homeHeroSlide.aggregate({ _max: { position: true } });
    return db.homeHeroSlide.create({
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn ?? null,
        subtitleAr: data.subtitleAr ?? null,
        subtitleEn: data.subtitleEn ?? null,
        imageUrl: data.imageUrl,
        foregroundImageUrl: data.foregroundImageUrl ?? null,
        linkUrl: data.linkUrl ?? null,
        position: data.position ?? (maxPos._max.position ?? 0) + 1,
        isActive: data.isActive ?? true,
        ...(userId ? withCreate(userId) : {}),
      },
    });
  },

  async update(id: string, data: Partial<HeroSlideInput>, userId?: string) {
    return db.homeHeroSlide.update({
      where: { id },
      data: {
        ...(data.titleAr !== undefined && { titleAr: data.titleAr }),
        ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
        ...(data.subtitleAr !== undefined && { subtitleAr: data.subtitleAr }),
        ...(data.subtitleEn !== undefined && { subtitleEn: data.subtitleEn }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.foregroundImageUrl !== undefined && {
          foregroundImageUrl: data.foregroundImageUrl,
        }),
        ...(data.linkUrl !== undefined && { linkUrl: data.linkUrl }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(userId ? withUpdate(userId) : {}),
      },
    });
  },

  async delete(id: string, userId?: string) {
    if (userId) {
      return db.homeHeroSlide.update({
        where: { id },
        data: withSoftDelete(userId),
      });
    }
    return db.homeHeroSlide.delete({ where: { id } });
  },
};
