import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { PUBLISHER_SEARCH_FIELDS, buildTextSearchOr } from "@/lib/search/text-search-fields";
import { PAGINATION } from "@/lib/utils/constants";

export interface PublisherFilters {
  page?: number;
  limit?: number;
  country?: string;
  search?: string;
}

const publishedBookOnPlatform = {
  some: {
    published: true,
    ...notDeleted,
  },
} as const;

function mapPublisherImage<T extends { imageUrl: string | null; imageFeatured: string | null }>(
  pub: T,
) {
  return {
    ...pub,
    imageUrl: pub.imageUrl ?? pub.imageFeatured ?? null,
  };
}

export const PublisherService = {
  async list(filters: PublisherFilters = {}) {
    const {
      page = 1,
      limit = PAGINATION.DEFAULT_PAGE_SIZE,
      country,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
      status: "publish",
      ...(country && {
        countries: { some: { slug: country } },
      }),
      ...(search && buildTextSearchOr(search, PUBLISHER_SEARCH_FIELDS)),
    };

    const [publishers, total] = await Promise.all([
      db.publisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { sponsored: { priority: "desc" } },
          { title: "asc" },
        ],
        select: {
          id: true,
          title: true,
          name: true,
          nameAr: true,
          slug: true,
          imageUrl: true,
          imageFeatured: true,
          content: true,
          contentAr: true,
          excerpt: true,
          countries: {
            select: { id: true, name: true, nameAr: true, slug: true },
          },
          _count: { select: { products: true } },
          sponsored: {
            select: { isActive: true, priority: true, endsAt: true },
          },
        },
      }),
      db.publisher.count({ where }),
    ]);

    const publishersWithMeta = publishers.map((pub) => {
      const mapped = mapPublisherImage(pub);
      return {
        ...mapped,
        booksCount: pub._count.products,
        isSponsored:
          pub.sponsored?.isActive === true && pub.sponsored.endsAt > new Date(),
      };
    });

    return {
      publishers: publishersWithMeta,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  },

  async getBySlug(slug: string) {
    const row = await db.publisher.findFirst({
      where: {
        slug,
        OR: [{ status: "publish" }, { products: publishedBookOnPlatform }],
      },
      include: {
        countries: true,
        sponsored: true,
        products: {
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            imageUrl: true,
            translationStatus: true,
            primaryCategory: { select: { name: true, nameAr: true } },
          },
        },
      },
    });
    if (!row) return null;
    return mapPublisherImage(row);
  },

  async getPublisherBooks(slug: string, page = 1, limit: number = PAGINATION.DEFAULT_PAGE_SIZE) {
    const publisher = await db.publisher.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!publisher) {
      return {
        books: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const bookWhere = {
      publisherId: publisher.id,
      published: true,
      ...notDeleted,
    };

    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      db.product.findMany({
        where: bookWhere,
        skip,
        take: limit,
        orderBy: { position: "desc" },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          imageUrl: true,
          translationStatus: true,
          primaryCategory: { select: { name: true, nameAr: true } },
        },
      }),
      db.product.count({ where: bookWhere }),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  },

  async getAllCountries() {
    return db.country.findMany({
      orderBy: { linkedCount: "desc" },
      select: { id: true, name: true, nameAr: true, slug: true },
    });
  },

  async getSponsored(limit = 8) {
    const rows = await db.sponsoredPublisher.findMany({
      where: {
        isActive: true,
        endsAt: { gt: new Date() },
        publisher: { status: "publish" },
      },
      orderBy: { priority: "desc" },
      take: limit,
      select: {
        publisher: {
          select: {
            id: true,
            title: true,
            name: true,
            nameAr: true,
            slug: true,
            imageUrl: true,
            imageFeatured: true,
          },
        },
      },
    });
    return rows.map((r) => mapPublisherImage(r.publisher));
  },

  async listSlugsForSitemap(limit = 2000) {
    return db.publisher.findMany({
      where: {
        products: publishedBookOnPlatform,
      },
      select: { slug: true, updatedAt: true },
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
  },
};
