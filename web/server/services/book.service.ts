import { db } from "@/lib/db";
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
    return db.product.findUnique({
      where: { slug },
      include: {
        publisher: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
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

  async getSimilar(slug: string, limit = 6) {
    const book = await db.product.findUnique({
      where: { slug },
      select: { primaryCategoryId: true, id: true },
    });

    if (!book) return [];

    return db.product.findMany({
      where: {
        published: true,
        primaryCategoryId: book.primaryCategoryId,
        id: { not: book.id },
      },
      take: limit,
      orderBy: { position: "desc" },
      select: {
        id: true,
        slug: true,
        nameEn: true,
        nameAr: true,
        imageUrl: true,
        translationStatus: true,
        primaryCategory: {
          select: { nameAr: true, name: true, slug: true },
        },
      },
    });
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
              slug: true,
              imageUrl: true,
            },
          },
        },
      }),
    ]);

    return { newlyReleased, sponsoredPublishers };
  },

  async getHomeData() {
    const TARGET_CATEGORIES = [
      "تقنيات وعلوم",
      "دراسات اجتماعية",
      "لغات وآداب",
      "فلسفات وثقافات",
      "أديان وعقائد",
      "اقتصاد وتنمية",
      "أفكار وسياسات",
    ];

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

    const [categories, newlyReleased, translated, nominated, sponsoredPublishers, topPublishers] = await Promise.all([
      db.productCategory.findMany({
        where: { nameAr: { in: TARGET_CATEGORIES } },
        select: { id: true, name: true, nameAr: true, slug: true },
      }),
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
        const ai = TARGET_CATEGORIES.indexOf(a.category.nameAr ?? "");
        const bi = TARGET_CATEGORIES.indexOf(b.category.nameAr ?? "");
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
