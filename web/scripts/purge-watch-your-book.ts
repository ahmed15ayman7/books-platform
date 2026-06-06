#!/usr/bin/env tsx
/**
 * Permanently removes all articles in the deprecated "watch-your-book" media channel.
 *
 * Usage: tsx --env-file=.env scripts/purge-watch-your-book.ts
 *        tsx --env-file=.env scripts/purge-watch-your-book.ts --dry-run
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { LEGACY_MEDIA_CHANNEL } from "../lib/media/youtube";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const rows = await prisma.article.findMany({
      where: { channel: LEGACY_MEDIA_CHANNEL },
      select: { id: true, slug: true, title: true },
    });

    if (rows.length === 0) {
      console.log("No watch-your-book articles found.");
      return;
    }

    console.log(`Found ${rows.length} article(s) in channel "${LEGACY_MEDIA_CHANNEL}":`);
    for (const row of rows) {
      console.log(`  - ${row.slug} (${row.title})`);
    }

    if (dryRun) {
      console.log("Dry run — no rows deleted.");
      return;
    }

    for (const { id } of rows) {
      await prisma.$transaction(async (tx) => {
        await tx.comment.deleteMany({ where: { articleId: id } });
        await tx.article.delete({ where: { id } });
      });
    }

    console.log(`Deleted ${rows.length} article(s).`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
