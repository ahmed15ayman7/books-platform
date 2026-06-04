import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { PAGINATION } from "@/lib/utils/constants";
import { MEDIA_CHANNELS } from "@/lib/media/youtube";
import readingTime from "reading-time";

const linkedProductSelect = {
  where: { ...notDeleted, published: true },
  take: 12,
  orderBy: { position: "desc" as const },
  select: {
    id: true,
    slug: true,
    nameEn: true,
    nameAr: true,
    imageUrl: true,
  },
};

const articleListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  imageUrl: true,
  channel: true,
  date: true,
  content: true,
  videoId: true,
  youtubeUrl: true,
  authorFirstName: true,
  authorLastName: true,
  isFeatured: true,
  articleCategory: {
    select: { name: true, nameAr: true, slug: true },
  },
  products: linkedProductSelect,
} as const;

export interface ArticleFilters {
  channel?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  featured?: boolean;
}

export const ArticleService = {
  async list(filters: ArticleFilters = {}) {
    const {
      channel,
      categorySlug,
      page = 1,
      limit = PAGINATION.DEFAULT_PAGE_SIZE,
      sort = "newest",
      featured,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
      status: "publish",
      ...notDeleted,
      ...(channel && { channel }),
      ...(categorySlug && { articleCategory: { slug: categorySlug } }),
      ...(featured !== undefined && { isFeatured: featured }),
    };

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: sort === "newest" ? { date: "desc" } : { date: "asc" },
        select: articleListSelect,
      }),
      db.article.count({ where }),
    ]);

    const articlesWithReadingTime = articles.map((article) => {
      const { content, ...rest } = article;
      const rt = content ? readingTime(content) : null;
      return {
        ...rest,
        readingTimeMinutes: rt ? Math.ceil(rt.minutes) : null,
      };
    });

    return {
      articles: articlesWithReadingTime,
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
    return db.article.findFirst({
      where: { slug, status: "publish", ...notDeleted },
      include: {
        articleCategory: true,
        postTags: true,
        products: linkedProductSelect,
        comments: {
          where: { status: "approved" },
          orderBy: { commentDate: "asc" },
          select: {
            id: true,
            authorName: true,
            content: true,
            commentDate: true,
            parentId: true,
          },
        },
      },
    });
  },

  async getRelated(slug: string, limit = 3) {
    const article = await db.article.findFirst({
      where: { slug },
      select: { articleCategoryId: true, id: true, channel: true },
    });

    if (!article) return [];

    return db.article.findMany({
      where: {
        status: "publish",
        channel: article.channel,
        id: { not: article.id },
      },
      take: limit,
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        date: true,
        channel: true,
        videoId: true,
        products: linkedProductSelect,
      },
    });
  },

  async getByProductSlug(productSlug: string, limit = 12) {
    const product = await db.product.findFirst({
      where: { slug: productSlug, ...notDeleted, published: true },
      select: { id: true },
    });
    if (!product) return [];

    const articles = await db.article.findMany({
      where: {
        status: "publish",
        ...notDeleted,
        products: { some: { id: product.id } },
      },
      take: limit,
      orderBy: { date: "desc" },
      select: articleListSelect,
    });

    return articles.map(({ content, ...rest }) => ({
      ...rest,
      readingTimeMinutes: content ? Math.ceil(readingTime(content).minutes) : null,
    }));
  },

  async getMediaByProductSlug(productSlug: string, limit = 6) {
    const product = await db.product.findFirst({
      where: { slug: productSlug, ...notDeleted, published: true },
      select: { id: true },
    });
    if (!product) return [];

    const articles = await db.article.findMany({
      where: {
        status: "publish",
        ...notDeleted,
        videoId: { not: null },
        channel: { in: [...MEDIA_CHANNELS] },
        products: { some: { id: product.id } },
      },
      take: limit,
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        date: true,
        channel: true,
        videoId: true,
        youtubeUrl: true,
        products: linkedProductSelect,
      },
    });

    return articles;
  },

  async getLatestMedia(limit = 4) {
    return db.article.findMany({
      where: {
        status: "publish",
        ...notDeleted,
        videoId: { not: null },
        channel: { in: [...MEDIA_CHANNELS] },
      },
      take: limit,
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        date: true,
        channel: true,
        videoId: true,
        youtubeUrl: true,
        products: linkedProductSelect,
      },
    });
  },

  async getCategories() {
    return db.articleCategory.findMany({
      where: { spamFlag: null },
      orderBy: { linkedCount: "desc" },
      select: { id: true, name: true, nameAr: true, slug: true, linkedCount: true },
    });
  },

  async listByCategory(slug: string, page = 1, limit = 10) {
    const category = await db.articleCategory.findFirst({
      where: { slug },
      select: { id: true, name: true, nameAr: true, slug: true },
    });
    if (!category) return null;

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where: { status: "publish", articleCategoryId: category.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        select: articleListSelect,
      }),
      db.article.count({ where: { status: "publish", articleCategoryId: category.id } }),
    ]);

    const articlesWithRT = articles.map(({ content, ...rest }) => ({
      ...rest,
      readingTimeMinutes: content ? Math.ceil(readingTime(content).minutes) : null,
    }));

    return {
      category,
      articles: articlesWithRT,
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

  async getFeaturedForHome() {
    const channels = [
      "harvest",
      "ideas",
      "world-reads",
      "books-talk",
      "watch-your-book",
      "novel-story",
    ];

    const results = await Promise.all(
      channels.map((channel) =>
        db.article.findMany({
          where: { status: "publish", channel, ...notDeleted },
          orderBy: { date: "desc" },
          take: 3,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            imageUrl: true,
            date: true,
            channel: true,
            videoId: true,
            products: linkedProductSelect,
          },
        }),
      ),
    );

    return channels.reduce(
      (acc, channel, index) => {
        acc[channel] = results[index] ?? [];
        return acc;
      },
      {} as Record<string, typeof results[number]>,
    );
  },
};
