import { describe, it, expect } from "vitest";

/** Inline pure helper extracted from newsletter-digest logic for unit testing */

interface MinimalBook {
  id: string;
  createdAt: Date;
  primaryCategoryId: string | null;
  publisherId: string | null;
  authors: { id: string }[];
  nameEn: string;
}

interface MinimalArticle {
  id: string;
  createdAt: Date;
  articleCategoryId: string | null;
  title: string;
}

interface SubPrefs {
  prefProductCategoryIds: string[];
  prefArticleCategoryIds: string[];
  prefPublisherIds: string[];
  prefAuthorIds: string[];
}

function matchBooks(books: MinimalBook[], sub: SubPrefs): MinimalBook[] {
  const hasPrefs =
    sub.prefProductCategoryIds.length > 0 ||
    sub.prefPublisherIds.length > 0 ||
    sub.prefAuthorIds.length > 0;

  if (!hasPrefs) return [];

  return books.filter((b) => {
    if (sub.prefProductCategoryIds.length > 0 && b.primaryCategoryId) {
      if (sub.prefProductCategoryIds.includes(b.primaryCategoryId)) return true;
    }
    if (sub.prefPublisherIds.length > 0 && b.publisherId) {
      if (sub.prefPublisherIds.includes(b.publisherId)) return true;
    }
    if (sub.prefAuthorIds.length > 0) {
      if (b.authors.some((a) => sub.prefAuthorIds.includes(a.id))) return true;
    }
    return false;
  });
}

function matchArticles(articles: MinimalArticle[], sub: SubPrefs): MinimalArticle[] {
  const hasPrefs = sub.prefArticleCategoryIds.length > 0;
  if (!hasPrefs) return [];
  return articles.filter((a) => a.articleCategoryId && sub.prefArticleCategoryIds.includes(a.articleCategoryId));
}

// -------------------------------------------------------

const now = new Date("2024-12-01T12:00:00Z");

function makeBook(overrides: Partial<MinimalBook> = {}): MinimalBook {
  return {
    id: "book1",
    createdAt: now,
    primaryCategoryId: "cat1",
    publisherId: "pub1",
    authors: [{ id: "auth1" }],
    nameEn: "Test Book",
    ...overrides,
  };
}

function makeArticle(overrides: Partial<MinimalArticle> = {}): MinimalArticle {
  return {
    id: "art1",
    createdAt: now,
    articleCategoryId: "acat1",
    title: "Test Article",
    ...overrides,
  };
}

describe("digest preference matching — books", () => {
  const book = makeBook();

  it("matches book by primaryCategoryId", () => {
    const sub: SubPrefs = { prefProductCategoryIds: ["cat1"], prefPublisherIds: [], prefAuthorIds: [], prefArticleCategoryIds: [] };
    expect(matchBooks([book], sub)).toHaveLength(1);
  });

  it("matches book by publisherId", () => {
    const sub: SubPrefs = { prefProductCategoryIds: [], prefPublisherIds: ["pub1"], prefAuthorIds: [], prefArticleCategoryIds: [] };
    expect(matchBooks([book], sub)).toHaveLength(1);
  });

  it("matches book by author id", () => {
    const sub: SubPrefs = { prefProductCategoryIds: [], prefPublisherIds: [], prefAuthorIds: ["auth1"], prefArticleCategoryIds: [] };
    expect(matchBooks([book], sub)).toHaveLength(1);
  });

  it("does not match when category differs", () => {
    const sub: SubPrefs = { prefProductCategoryIds: ["cat-other"], prefPublisherIds: [], prefAuthorIds: [], prefArticleCategoryIds: [] };
    expect(matchBooks([book], sub)).toHaveLength(0);
  });

  it("returns empty when no prefs set", () => {
    const sub: SubPrefs = { prefProductCategoryIds: [], prefPublisherIds: [], prefAuthorIds: [], prefArticleCategoryIds: [] };
    expect(matchBooks([book], sub)).toHaveLength(0);
  });
});

describe("digest preference matching — articles", () => {
  const article = makeArticle();

  it("matches article by category id", () => {
    const sub: SubPrefs = { prefArticleCategoryIds: ["acat1"], prefProductCategoryIds: [], prefPublisherIds: [], prefAuthorIds: [] };
    expect(matchArticles([article], sub)).toHaveLength(1);
  });

  it("returns empty for wrong category", () => {
    const sub: SubPrefs = { prefArticleCategoryIds: ["acat-other"], prefProductCategoryIds: [], prefPublisherIds: [], prefAuthorIds: [] };
    expect(matchArticles([article], sub)).toHaveLength(0);
  });

  it("returns empty when no article prefs", () => {
    const sub: SubPrefs = { prefArticleCategoryIds: [], prefProductCategoryIds: [], prefPublisherIds: [], prefAuthorIds: [] };
    expect(matchArticles([article], sub)).toHaveLength(0);
  });
});

describe("since filtering", () => {
  it("filters out items older than subscriber lastDigestAt", () => {
    const oldDate = new Date("2024-11-01T00:00:00Z");
    const newDate = new Date("2024-12-01T12:00:00Z");
    const since = new Date("2024-11-15T00:00:00Z");

    const books = [makeBook({ id: "old", createdAt: oldDate }), makeBook({ id: "new", createdAt: newDate })];
    const fresh = books.filter((b) => b.createdAt > since);
    expect(fresh).toHaveLength(1);
    expect(fresh[0]!.id).toBe("new");
  });
});
