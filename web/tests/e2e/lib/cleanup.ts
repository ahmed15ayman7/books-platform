import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "node:fs";
import { readTracker } from "./tracker";
import { E2E_FIXTURE_PREFIX, E2E_SLUG_PREFIX, TRACKER_FILE } from "./paths";

function createPrisma() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

export interface CleanupResult {
  articlesDeleted: number;
  productsDeleted: number;
  commentsDeleted: number;
}

export async function cleanupE2eData(options?: {
  includeFixtures?: boolean;
}): Promise<CleanupResult> {
  const { prisma, pool } = createPrisma();
  const includeFixtures = options?.includeFixtures ?? false;
  const slugPrefix = includeFixtures ? E2E_SLUG_PREFIX : E2E_SLUG_PREFIX;
  const fixturePrefix = E2E_FIXTURE_PREFIX;

  let articlesDeleted = 0;
  let productsDeleted = 0;
  let commentsDeleted = 0;

  try {
    const tracker = readTracker();
    const trackedArticleIds = [...tracker.articles];
    const trackedProductIds = [...tracker.products];

    const slugArticles = await prisma.article.findMany({
      where: {
        slug: { startsWith: slugPrefix },
        ...(includeFixtures
          ? {}
          : { NOT: { slug: { startsWith: fixturePrefix } } }),
      },
      select: { id: true },
    });

    const articleIds = [
      ...new Set([
        ...trackedArticleIds,
        ...slugArticles.map((a) => a.id),
      ]),
    ];

    if (articleIds.length > 0) {
      const deletedComments = await prisma.comment.deleteMany({
        where: { articleId: { in: articleIds } },
      });
      commentsDeleted += deletedComments.count;

      for (const id of articleIds) {
        try {
          await prisma.article.delete({ where: { id } });
          articlesDeleted += 1;
        } catch {
          // May already be removed or constrained
        }
      }
    }

    const slugProducts = await prisma.product.findMany({
      where: {
        slug: { startsWith: slugPrefix },
        ...(includeFixtures
          ? {}
          : { NOT: { slug: { startsWith: fixturePrefix } } }),
      },
      select: { id: true },
    });

    const productIds = [
      ...new Set([
        ...trackedProductIds,
        ...slugProducts.map((p) => p.id),
      ]),
    ];

    for (const id of productIds) {
      try {
        await prisma.product.delete({ where: { id } });
        productsDeleted += 1;
      } catch {
        // May have blocking relations outside e2e scope
      }
    }

    if (fs.existsSync(TRACKER_FILE)) {
      fs.writeFileSync(
        TRACKER_FILE,
        JSON.stringify({ articles: [], products: [] }, null, 2),
      );
    }

    return { articlesDeleted, productsDeleted, commentsDeleted };
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
