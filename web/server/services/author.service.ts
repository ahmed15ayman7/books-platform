import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { PAGINATION } from "@/lib/utils/constants";
const publishedBookByAuthor = {
  some: {
    published: true,
    ...notDeleted,
  },
} as const;

export const AuthorService = {
  async getBySlug(slug: string) {
    return db.author.findFirst({
      where: {
        slug,
        spamFlag: null,
        products: publishedBookByAuthor,
      },
      include: {
        _count: {
          select: {
            products: {
              where: { published: true, ...notDeleted },
            },
          },
        },
      },
    });
  },

  async getAuthorBooks(slug: string, page = 1, limit: number = PAGINATION.DEFAULT_PAGE_SIZE) {
    const author = await db.author.findFirst({
      where: { slug, spamFlag: null },
      select: { id: true },
    });

    if (!author) {
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
      published: true,
      ...notDeleted,
      authors: { some: { id: author.id } },
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

  async listSlugsForSitemap(limit = 2000) {
    return db.author.findMany({
      where: {
        spamFlag: null,
        products: publishedBookByAuthor,
      },
      select: { slug: true, updatedAt: true },
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
  },
};
