import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo/site";

const LOCALES = ["ar", "en"] as const;

const STATIC_PATHS = [
  "",
  "/books",
  "/books/nominated-for-translation",
  "/books/translated",
  "/articles/harvest",
  "/articles/ideas",
  "/articles/books-talk",
  "/articles/world-reads",
  "/articles/watch-your-book",
  "/articles/novel-story",
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

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/books" ? 0.9 : 0.7,
    }))
  );

  // DB may be unreachable during Docker image build; dynamic URLs are added at runtime.
  if (process.env["NEXT_PHASE"] === "phase-production-build") {
    return staticEntries;
  }

  const [books, categories, articles] = await Promise.all([
    db.product
      .findMany({
        where: { published: true },
        select: { slug: true },
        take: 2000,
        orderBy: { position: "desc" },
      })
      .catch(() => [] as { slug: string }[]),
    db.productCategory
      .findMany({
        select: { slug: true },
        take: 100,
      })
      .catch(() => [] as { slug: string }[]),
    db.article
      .findMany({
        where: { status: "publish" },
        select: { slug: true, date: true },
        take: 500,
        orderBy: { date: "desc" },
      })
      .catch(() => [] as { slug: string; date: Date | null }[]),
  ]);

  const bookEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    books.map((book) => ({
      url: `${base}/${locale}/books/${book.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const categoryEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${base}/${locale}/books/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))
  );

  const articleEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    articles.map((article) => ({
      url: `${base}/${locale}/articles/${article.slug}`,
      lastModified: article.date ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...bookEntries, ...categoryEntries, ...articleEntries];
}
