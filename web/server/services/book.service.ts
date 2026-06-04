import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { normalizeArabic } from "@/lib/i18n/normalize-arabic";
import { BOOK_CATEGORY_LABELS_AR } from "@/lib/nav/book-categories";
import { PAGINATION } from "@/lib/utils/constants";

export interface BookFilters {
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
  publisher?: string;
  status?: string;
  sort?: "newest" | "oldest" | "title";
  search?: string;
  featured?: boolean;
}

export const BookService = {
  async list(filters: BookFilters = {}) {
    const {
      page = 1,
      limit = PAGINATION.DEFAULT_PAGE_SIZE,
      category,
      language,
      publisher,
      status,
      sort = "newest",
      search,
      featured,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
      ...notDeleted,
      published: true,
      ...(category && {
        OR: [
          { primaryCategory: { slug: category } },
          { categories: { some: { slug: category } } },
        ],
      }),
      ...(language && { language }),
      ...(publisher && { publisher: { slug: publisher } }),
      ...(status && { translationStatus: status }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { nameEn: { contains: search, mode: "insensitive" as const } },
          { nameAr: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { descriptionAr: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const orderBy =
      sort === "newest"
        ? ({ position: "desc" } as const)
        : sort === "oldest"
          ? ({ position: "asc" } as const)
          : ({ nameEn: "asc" } as const);

    const [books, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          shortDesc: true,
          shortDescAr: true,
          imageUrl: true,
          translationStatus: true,
          purchaseOption: true,
          price: true,
          currency: true,
          language: true,
          publicationYear: true,
          featured: true,
          publisher: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          primaryCategory: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              slug: true,
            },
          },
          ratings: {
            select: { stars: true },
          },
        },
      }),
      db.product.count({ where }),
    ]);

    const booksWithRating = books.map((book) => {
      const ratings = book.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
          : null;
      const { ratings: _ratings, ...rest } = book;
      return {
        ...rest,
        averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
        ratingsCount: ratings.length,
      };
    });

    return {
      books: booksWithRating,
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
    return db.product.findFirst({
      where: { slug, ...notDeleted },
      include: {
        publisher: {
          select: {
            id: true,
            title: true,
            name: true,
            nameAr: true,
            slug: true,
            imageUrl: true,
            imageFeatured: true,
            websiteUrl: true,
            address: true,
            countries: { select: { name: true, nameAr: true }, take: 1 },
          },
        },
        primaryCategory: true,
        categories: true,
        tags: true,
        authors: {
          select: { id: true, name: true, nameAr: true, slug: true, bio: true, bioAr: true },
        },
        ratings: {
          select: { stars: true },
        },
      },
    });
  },

  async getSimilar(slug: string, limit = 12) {
    const similarSelect = {
      id: true,
      slug: true,
      nameEn: true,
      nameAr: true,
      imageUrl: true,
      translationStatus: true,
      primaryCategory: {
        select: { nameAr: true, name: true, slug: true },
      },
    } as const;

    type SimilarBook = {
      id: string;
      slug: string;
      nameEn: string;
      nameAr: string | null;
      imageUrl: string | null;
      translationStatus: string;
      primaryCategory: { nameAr: string | null; name: string; slug: string } | null;
    };

    const source = await db.product.findFirst({
      where: { slug, ...notDeleted },
      select: {
        id: true,
        primaryCategoryId: true,
        publisherId: true,
        categories: { select: { id: true } },
        authors: { select: { id: true } },
        tags: { select: { id: true } },
      },
    });

    if (!source) return { books: [], isGeneralFallback: false };

    const collected = new Map<string, SimilarBook>();
    let isGeneralFallback = false;

    const baseWhere = {
      ...notDeleted,
      published: true,
      id: { not: source.id },
    };

    const fetchMore = async (extraWhere: Record<string, unknown>) => {
      if (collected.size >= limit) return;
      const excludeIds = [source.id, ...collected.keys()];
      const rows = await db.product.findMany({
        where: {
          ...baseWhere,
          id: { notIn: excludeIds },
          ...extraWhere,
        },
        take: limit - collected.size,
        orderBy: { position: "desc" },
        select: similarSelect,
      });
      for (const row of rows) collected.set(row.id, row);
    };

    if (source.primaryCategoryId) {
      await fetchMore({ primaryCategoryId: source.primaryCategoryId });
    }

    const categoryIds = source.categories.map((c) => c.id);
    if (categoryIds.length > 0 && collected.size < limit) {
      await fetchMore({ categories: { some: { id: { in: categoryIds } } } });
    }

    if (source.publisherId && collected.size < limit) {
      await fetchMore({ publisherId: source.publisherId });
    }

    const authorIds = source.authors.map((a) => a.id);
    if (authorIds.length > 0 && collected.size < limit) {
      await fetchMore({ authors: { some: { id: { in: authorIds } } } });
    }

    const tagIds = source.tags.map((t) => t.id);
    if (tagIds.length > 0 && collected.size < limit) {
      await fetchMore({ tags: { some: { id: { in: tagIds } } } });
    }

    const sizeAfterSemantic = collected.size;

    if (collected.size < limit) {
      await fetchMore({ featured: true });
    }
    if (collected.size < limit) {
      await fetchMore({});
    }

    isGeneralFallback = sizeAfterSemantic === 0 && collected.size > 0;

    return { books: [...collected.values()], isGeneralFallback };
  },

  async getCategories() {
    return db.productCategory.findMany({
      orderBy: { linkedCount: "desc" },
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        linkedCount: true,
      },
    });
  },

  async getNavCategories() {
    const all = await db.productCategory.findMany({
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        linkedCount: true,
      },
    });

    const byNorm = new Map(all.map((c) => [normalizeArabic(c.nameAr ?? c.name), c]));

    return BOOK_CATEGORY_LABELS_AR.map((label) => byNorm.get(normalizeArabic(label))).filter(
      (c): c is NonNullable<typeof c> => c != null,
    );
  },

  async getStats() {
    const [totalBooks, totalPublishers, totalTranslated, totalCountries] =
      await Promise.all([
        db.product.count({ where: { published: true } }),
        db.publisher.count({ where: { status: "publish" } }),
        db.product.count({ where: { published: true, translationStatus: "TRANSLATED" } }),
        db.country.count(),
      ]);

    return { totalBooks, totalPublishers, totalTranslatedBooks: totalTranslated, totalCountries };
  },

  async getFeaturedForHome() {
    const [newlyReleased, sponsoredPublishers] = await Promise.all([
      db.product.findMany({
        where: { published: true },
        orderBy: { position: "desc" },
        take: 12,
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          imageUrl: true,
          translationStatus: true,
          featured: true,
          primaryCategory: {
            select: { nameAr: true, name: true, slug: true },
          } as { select: { nameAr: true; name: true; slug: true } },
        },
      }),
      db.sponsoredPublisher.findMany({
        where: {
          isActive: true,
          endsAt: { gte: new Date() },
        },
        orderBy: { priority: "desc" },
        take: 12,
        include: {
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
      }),
    ]);

    return { newlyReleased, sponsoredPublishers };
  },

  async getHomeData() {
    const bookSelect = {
      id: true,
      slug: true,
      nameEn: true,
      nameAr: true,
      imageUrl: true,
      translationStatus: true,
      primaryCategory: {
        select: { nameAr: true, name: true, slug: true },
      },
    } as const;

    const [categories, newlyReleased, translated, nominated, sponsoredPublishers, topPublishers] =
      await Promise.all([
        this.getNavCategories(),
      db.product.findMany({
        where: { published: true },
        orderBy: { position: "desc" },
        take: 12,
        select: bookSelect,
      }),
      db.product.findMany({
        where: { published: true, translationStatus: "TRANSLATED" },
        orderBy: { position: "desc" },
        take: 12,
        select: bookSelect,
      }),
      db.product.findMany({
        where: { published: true, translationStatus: "NOMINATED" },
        orderBy: { position: "desc" },
        take: 12,
        select: bookSelect,
      }),
      db.sponsoredPublisher.findMany({
        where: { isActive: true, endsAt: { gte: new Date() } },
        orderBy: { priority: "desc" },
        take: 16,
        include: {
          publisher: {
            select: { id: true, title: true, slug: true, imageUrl: true },
          },
        },
      }),
      db.publisher.findMany({
        where: { status: "publish" },
        orderBy: { order: "desc" },
        take: 12,
        select: {
          id: true,
          title: true,
          name: true,
          nameAr: true,
          slug: true,
          imageFeatured: true,
          imageUrl: true,
          websiteUrl: true,
          countries: { select: { name: true }, take: 1 },
          _count: { select: { products: true } },
        },
      }),
    ]);

    const categoryBooks = await Promise.all(
      categories.map((cat) =>
        db.product.findMany({
          where: { published: true, primaryCategoryId: cat.id },
          orderBy: { position: "desc" },
          take: 10,
          select: bookSelect,
        })
      )
    );

    const categorySections = categories
      .map((cat, i) => ({ category: cat, books: categoryBooks[i] ?? [] }))
      .filter((s) => s.books.length > 0)
      .sort((a, b) => {
        const ai = BOOK_CATEGORY_LABELS_AR.findIndex(
          (label) => normalizeArabic(label) === normalizeArabic(a.category.nameAr ?? ""),
        );
        const bi = BOOK_CATEGORY_LABELS_AR.findIndex(
          (label) => normalizeArabic(label) === normalizeArabic(b.category.nameAr ?? ""),
        );
        return ai - bi;
      });

    return {
      newlyReleased,
      translated,
      nominated,
      publishers: sponsoredPublishers.map((sp) => sp.publisher),
      publisherGrid: topPublishers.map((p) => ({
        id: p.id,
        title: p.title,
        name: p.name,
        nameAr: p.nameAr,
        slug: p.slug,
        imageUrl: p.imageFeatured ?? p.imageUrl,
        websiteUrl: p.websiteUrl,
        country: p.countries[0]?.name ?? null,
        bookCount: p._count.products,
      })),
      categorySections,
    };
  },
};
