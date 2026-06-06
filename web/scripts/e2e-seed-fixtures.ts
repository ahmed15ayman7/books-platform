#!/usr/bin/env tsx
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { E2E_FIXTURE_PREFIX } from "../tests/e2e/lib/paths";
import { nextArticleOriginalId, nextProductOriginalId } from "../lib/admin/legacy-ids";

async function main() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const bookSlug = `${E2E_FIXTURE_PREFIX}book`;
    const articleSlug = `${E2E_FIXTURE_PREFIX}article`;

    const existingBook = await prisma.product.findFirst({
      where: { slug: bookSlug },
      select: { id: true },
    });

    if (!existingBook) {
      const productOriginalId = await nextProductOriginalId();
      await prisma.product.create({
        data: {
          originalId: productOriginalId,
          nameEn: "E2E Fixture Book",
          nameAr: "كتاب تجريبي E2E",
          slug: bookSlug,
          published: true,
          shortDesc: "Fixture book for E2E smoke tests",
        },
      });
      console.log("✅ Created fixture book:", bookSlug);
    } else {
      console.log("ℹ️  Fixture book already exists:", bookSlug);
    }

    const existingArticle = await prisma.article.findFirst({
      where: { slug: articleSlug },
      select: { id: true },
    });

    if (!existingArticle) {
      const articleOriginalId = await nextArticleOriginalId();
      await prisma.article.create({
        data: {
          originalId: articleOriginalId,
          title: "E2E Fixture Article",
          slug: articleSlug,
          channel: "harvest",
          status: "publish",
          excerpt: "Fixture article for E2E smoke tests",
          content: "E2E fixture content",
          date: new Date(),
        },
      });
      console.log("✅ Created fixture article:", articleSlug);
    } else {
      console.log("ℹ️  Fixture article already exists:", articleSlug);
    }

    const existingMedia = await prisma.article.findFirst({
      where: {
        slug: `${E2E_FIXTURE_PREFIX}media`,
        channel: "books-talk",
      },
      select: { id: true },
    });

    if (!existingMedia) {
      const mediaOriginalId = await nextArticleOriginalId();
      await prisma.article.create({
        data: {
          originalId: mediaOriginalId,
          title: "E2E Fixture Media Video",
          slug: `${E2E_FIXTURE_PREFIX}media`,
          channel: "books-talk",
          status: "publish",
          excerpt: "Fixture media for E2E tests",
          videoId: "dQw4w9WgXcQ",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          date: new Date(),
        },
      });
      console.log("✅ Created fixture media article");
    } else {
      console.log("ℹ️  Fixture media already exists");
    }

    console.log("🎉 E2E fixtures ready");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ E2E seed fixtures failed:", err);
  process.exit(1);
});
