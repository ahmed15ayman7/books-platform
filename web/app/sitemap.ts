import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo/site";
import { AuthorService } from "@/server/services/author.service";
import { PublisherService } from "@/server/services/publisher.service";

// Canonical URL helpers for sitemap: home is "/", all other Arabic is "/ar/...", English is "/en/..."
function arUrl(base: string, path: string): string {
  return path === "" ? `${base}/` : `${base}/ar${path}`;
}
function enUrl(base: string, path: string): string {
  return path === "" ? `${base}/en` : `${base}/en${path}`;
}

const STATIC_PATHS = [
  "/books",
  "/books/nominated-for-translation",
  "/books/translated",
  "/articles/harvest",
  "/articles/ideas",
  "/articles/world-reads",
  "/media",
  "/media/books-talk",
  "/media/novel-story",
  "/publishers",
  "/publish",
  "/about",
  "/services",
  "/team",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  // Home — Arabic canonical is /, English is /en
  const homeEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: enUrl(base, ""),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) => [
    {
      url: arUrl(base, path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/books" ? 0.9 : 0.7,
    },
    {
      url: enUrl(base, path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/books" ? 0.8 : 0.6,
    },
  ]);

  // DB may be unreachable during Docker image build; dynamic URLs are added at runtime.
  if (process.env["NEXT_PHASE"] === "phase-production-build") {
    return [...homeEntries, ...staticEntries];
  }

  const [books, bookCategories, articleCategories, articles, authors, publishers] =
    await Promise.all([
      db.product
        .findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
          take: 2000,
          orderBy: { position: "desc" },
        })
        .catch(() => [] as { slug: string; updatedAt: Date }[]),
      db.productCategory
        .findMany({
          select: { slug: true },
          take: 100,
        })
        .catch(() => [] as { slug: string }[]),
      db.articleCategory
        .findMany({
          select: { slug: true },
          take: 100,
        })
        .catch(() => [] as { slug: string }[]),
      db.article
        .findMany({
          where: { status: "publish" },
          select: { slug: true, date: true, updatedAt: true },
          take: 500,
          orderBy: { date: "desc" },
        })
        .catch(() => [] as { slug: string; date: Date | null; updatedAt: Date }[]),
      AuthorService.listSlugsForSitemap().catch(() => [] as { slug: string; updatedAt: Date }[]),
      PublisherService.listSlugsForSitemap().catch(
        () => [] as { slug: string; updatedAt: Date }[],
      ),
    ]);

  const bookEntries: MetadataRoute.Sitemap = books.flatMap((book) => [
    {
      url: arUrl(base, `/books/${book.slug}`),
      lastModified: book.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: enUrl(base, `/books/${book.slug}`),
      lastModified: book.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  const bookCategoryEntries: MetadataRoute.Sitemap = bookCategories.flatMap((cat) => [
    {
      url: arUrl(base, `/books/category/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    },
    {
      url: enUrl(base, `/books/category/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    },
  ]);

  const articleCategoryEntries: MetadataRoute.Sitemap = articleCategories.flatMap((cat) => [
    {
      url: arUrl(base, `/articles/category/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    },
    {
      url: enUrl(base, `/articles/category/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    },
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) => [
    {
      url: arUrl(base, `/articles/${article.slug}`),
      lastModified: article.updatedAt ?? article.date ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: enUrl(base, `/articles/${article.slug}`),
      lastModified: article.updatedAt ?? article.date ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  const authorEntries: MetadataRoute.Sitemap = authors.flatMap((author) => [
    {
      url: arUrl(base, `/authors/${author.slug}`),
      lastModified: author.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: enUrl(base, `/authors/${author.slug}`),
      lastModified: author.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  const publisherEntries: MetadataRoute.Sitemap = publishers.flatMap((publisher) => [
    {
      url: arUrl(base, `/publishers/${publisher.slug}`),
      lastModified: publisher.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: enUrl(base, `/publishers/${publisher.slug}`),
      lastModified: publisher.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  return [
    ...homeEntries,
    ...staticEntries,
    ...bookEntries,
    ...bookCategoryEntries,
    ...articleCategoryEntries,
    ...articleEntries,
    ...authorEntries,
    ...publisherEntries,
  ];
}
