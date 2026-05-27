import { db } from "@/lib/db";
import { PAGINATION } from "@/lib/utils/constants";
import readingTime from "reading-time";

export interface ArticleFilters {
  channel?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  featured?: boolean;
}

export const ArticleService = {
  async list(filters: ArticleFilters = {}) {
    const {
      channel,
      page = 1,
      limit = PAGINATION.DEFAULT_PAGE_SIZE,
      sort = "newest",
      featured,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
      status: "publish",
      ...(channel && { channel }),
      ...(featured !== undefined && { isFeatured: featured }),
    };

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: sort === "newest" ? { date: "desc" } : { date: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          imageUrl: true,
          channel: true,
          date: true,
          content: true,
          authorFirstName: true,
          authorLastName: true,
          isFeatured: true,
          articleCategory: {
            select: { name: true, nameAr: true, slug: true },
          },
        },
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
      where: { slug, status: "publish" },
      include: {
        articleCategory: true,
        postTags: true,
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
      },
    });
  },

  async getFeaturedForHome() {
    const channels = ["harvest", "ideas", "world-reads", "books-talk", "watch-your-book", "novel-story"];

    type ArticleSnippet = {
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      imageUrl: string | null;
      date: Date | null;
      channel: string | null;
    };

    const results = await Promise.all(
      channels.map((channel) =>
        db.article.findMany({
          where: { status: "publish", channel },
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
          },
        })
      )
    );

    return channels.reduce(
      (acc, channel, index) => {
        acc[channel] = results[index] ?? [];
        return acc;
      },
      {} as Record<string, ArticleSnippet[]>
    );
  },
};
