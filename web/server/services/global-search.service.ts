import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { MEDIA_CHANNELS as MEDIA_CHANNEL_SLUGS } from "@/lib/media/youtube";
import { PAGINATION } from "@/lib/utils/constants";
import { BookService } from "@/server/services/book.service";
import { PublisherService } from "@/server/services/publisher.service";
import type {
  GlobalSearchInput,
  GlobalSearchPreviewResult,
  GlobalSearchResult,
  GlobalSearchSectionResult,
  SearchSectionType,
} from "@/lib/search/search-types";
import readingTime from "reading-time";

const PREVIEW_TAKE = 6;

function buildTextSearch(q: string, fields: string[]) {
  return {
    OR: fields.map((field) => ({
      [field]: { contains: q, mode: "insensitive" as const },
    })),
  };
}

function paginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit) || 0;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

async function searchAuthors(q: string, page: number, limit: number) {
  const where = {
    spamFlag: null,
    ...buildTextSearch(q, ["name", "nameAr", "slug"]),
  };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    db.author.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        nameAr: true,
      },
    }),
    db.author.count({ where }),
  ]);

  return { items, pagination: paginationMeta(page, limit, total) };
}

async function searchArticles(
  q: string,
  page: number,
  limit: number,
  options: {
    mediaOnly: boolean;
    channel?: string;
    categorySlug?: string;
    sort?: "newest" | "oldest" | "title";
  },
) {
  const { mediaOnly, channel, categorySlug, sort = "newest" } = options;

  const where = {
    status: "publish" as const,
    ...notDeleted,
    ...(mediaOnly
      ? {
          channel: channel ? channel : { in: [...MEDIA_CHANNEL_SLUGS] },
          videoId: { not: null },
        }
      : {
          channel: channel ? channel : { notIn: [...MEDIA_CHANNEL_SLUGS] },
        }),
    ...(categorySlug && { articleCategory: { slug: categorySlug } }),
    ...buildTextSearch(q, ["title", "titleEn", "slug", "excerpt"]),
  };

  const orderBy =
    sort === "oldest"
      ? ({ date: "asc" } as const)
      : sort === "title"
        ? ({ title: "asc" } as const)
        : ({ date: "desc" } as const);

  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    db.article.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        slug: true,
        title: true,
        titleEn: true,
        channel: true,
        imageUrl: true,
        excerpt: true,
        date: true,
        videoId: true,
        content: true,
      },
    }),
    db.article.count({ where }),
  ]);

  const items = rows.map(({ content, ...rest }) => ({
    ...rest,
    readingTimeMinutes: content ? Math.ceil(readingTime(content).minutes) : null,
  }));

  return { items, pagination: paginationMeta(page, limit, total) };
}

async function previewSearch(q: string): Promise<GlobalSearchPreviewResult> {
  const [
    bookResult,
    articleResult,
    mediaResult,
    publisherResult,
    authorResult,
  ] = await Promise.all([
    BookService.list({ search: q, page: 1, limit: PREVIEW_TAKE, sort: "newest" }),
    searchArticles(q, 1, PREVIEW_TAKE, { mediaOnly: false, sort: "newest" }),
    searchArticles(q, 1, PREVIEW_TAKE, { mediaOnly: true, sort: "newest" }),
    PublisherService.list({ search: q, page: 1, limit: PREVIEW_TAKE }),
    searchAuthors(q, 1, PREVIEW_TAKE),
  ]);

  return {
    mode: "preview",
    query: q,
    books: {
      items: bookResult.books.map((b) => ({
        id: b.id,
        slug: b.slug,
        nameEn: b.nameEn,
        nameAr: b.nameAr,
        imageUrl: b.imageUrl,
        translationStatus: b.translationStatus,
      })),
      total: bookResult.pagination.total,
    },
    articles: {
      items: articleResult.items,
      total: articleResult.pagination.total,
    },
    media: {
      items: mediaResult.items,
      total: mediaResult.pagination.total,
    },
    publishers: {
      items: publisherResult.publishers.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        name: p.name,
        nameAr: p.nameAr,
        imageUrl: p.imageUrl,
      })),
      total: publisherResult.pagination.total,
    },
    authors: {
      items: authorResult.items,
      total: authorResult.pagination.total,
    },
  };
}

async function sectionSearch(
  type: Exclude<SearchSectionType, "all">,
  input: GlobalSearchInput,
): Promise<GlobalSearchSectionResult> {
  const {
    q,
    page = 1,
    limit = PAGINATION.DEFAULT_PAGE_SIZE,
    category,
    status,
    sort = "newest",
    channel,
    country,
  } = input;

  const base = {
    mode: "section" as const,
    query: q,
    type,
    pagination: paginationMeta(page, limit, 0),
  };

  switch (type) {
    case "books": {
      const result = await BookService.list({
        search: q,
        page,
        limit,
        category,
        status,
        sort: sort === "title" ? "title" : sort,
      });
      return {
        ...base,
        books: result.books.map((b) => ({
          id: b.id,
          slug: b.slug,
          nameEn: b.nameEn,
          nameAr: b.nameAr,
          imageUrl: b.imageUrl,
          translationStatus: b.translationStatus,
        })),
        pagination: result.pagination,
      };
    }
    case "articles": {
      const result = await searchArticles(q, page, limit, {
        mediaOnly: false,
        channel,
        categorySlug: category,
        sort: sort === "title" ? "title" : sort === "oldest" ? "oldest" : "newest",
      });
      return { ...base, articles: result.items, pagination: result.pagination };
    }
    case "media": {
      const result = await searchArticles(q, page, limit, {
        mediaOnly: true,
        channel,
        sort: sort === "oldest" ? "oldest" : "newest",
      });
      return { ...base, media: result.items, pagination: result.pagination };
    }
    case "publishers": {
      const result = await PublisherService.list({
        search: q,
        page,
        limit,
        country,
      });
      return {
        ...base,
        publishers: result.publishers.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          name: p.name,
          nameAr: p.nameAr,
          imageUrl: p.imageUrl,
        })),
        pagination: result.pagination,
      };
    }
    case "authors": {
      const result = await searchAuthors(q, page, limit);
      return { ...base, authors: result.items, pagination: result.pagination };
    }
  }
}

export const GlobalSearchService = {
  async search(input: GlobalSearchInput): Promise<GlobalSearchResult | null> {
    const q = input.q.trim();
    if (q.length < 2) return null;

    const type = input.type ?? "all";
    if (type === "all") {
      return previewSearch(q);
    }
    return sectionSearch(type, input);
  },
};
