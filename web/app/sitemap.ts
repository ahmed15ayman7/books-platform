import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo/site";
import { AuthorService } from "@/server/services/author.service";
import { PublisherService } from "@/server/services/publisher.service";

// Arabic: clean URL (no prefix). English: /en prefix.
const STATIC_PATHS = [
  "",
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

function sitemapEntry(
  base: string,
  arPath: string,
  lastModified: Date = new Date(),
  options: { changeFrequency?: "daily" | "weekly" | "monthly"; priority?: number } = {}
): MetadataRoute.Sitemap[number] {
  const arUrl = `${base}${arPath}`;
  const enUrl = `${base}/en${arPath === "" ? "" : arPath}`;

  return {
    url: arUrl,
    lastModified,
    changeFrequency: options.changeFrequency ?? "weekly",
    priority: options.priority ?? 0.7,
    alternates: {
      languages: {
        ar: arUrl,
        en: enUrl,
        "x-default": arUrl,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) =>
    sitemapEntry(base, path, now, {
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/books" ? 0.9 : 0.7,
    })
  );

  // DB may be unreachable during Docker image build; dynamic URLs are added at runtime.
  if (process.env["NEXT_PHASE"] === "phase-production-build") {
    return staticEntries;
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
          select: { slug: true, updatedAt: true },
          take: 100,
        })
        .catch(() => [] as { slug: string; updatedAt: Date }[]),
      db.articleCategory
        .findMany({
          select: { slug: true, updatedAt: true },
          take: 100,
        })
        .catch(() => [] as { slug: string; updatedAt: Date }[]),
      db.article
        .findMany({
          where: { status: "publish" },
          select: { slug: true, date: true, updatedAt: true },
          take: 500,
          orderBy: { date: "desc" },
        })
        .catch(() => [] as { slug: string; date: Date | null; updatedAt: Date }[]),
      AuthorService.listSlugsForSitemap().catch(
        () => [] as { slug: string; updatedAt: Date }[]
      ),
      PublisherService.listSlugsForSitemap().catch(
        () => [] as { slug: string; updatedAt: Date }[]
      ),
    ]);

  const bookEntries: MetadataRoute.Sitemap = books.map((book) =>
    sitemapEntry(base, `/books/${book.slug}`, book.updatedAt ?? now, { priority: 0.8 })
  );

  const bookCategoryEntries: MetadataRoute.Sitemap = bookCategories.map((cat) =>
    sitemapEntry(base, `/books/category/${cat.slug}`, cat.updatedAt ?? now, { priority: 0.75 })
  );

  const articleCategoryEntries: MetadataRoute.Sitemap = articleCategories.map((cat) =>
    sitemapEntry(base, `/articles/category/${cat.slug}`, cat.updatedAt ?? now, { priority: 0.65 })
  );

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) =>
    sitemapEntry(
      base,
      `/articles/${article.slug}`,
      article.updatedAt ?? article.date ?? now,
      { priority: 0.7 }
    )
  );

  const authorEntries: MetadataRoute.Sitemap = authors.map((author) =>
    sitemapEntry(base, `/authors/${author.slug}`, author.updatedAt ?? now, { priority: 0.7 })
  );

  const publisherEntries: MetadataRoute.Sitemap = publishers.map((publisher) =>
    sitemapEntry(
      base,
      `/publishers/${publisher.slug}`,
      publisher.updatedAt ?? now,
      { priority: 0.7 }
    )
  );

  return [
    ...staticEntries,
    ...bookEntries,
    ...bookCategoryEntries,
    ...articleCategoryEntries,
    ...articleEntries,
    ...authorEntries,
    ...publisherEntries,
  ];
}
