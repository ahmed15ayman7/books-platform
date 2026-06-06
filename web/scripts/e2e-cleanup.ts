#!/usr/bin/env tsx
import "dotenv/config";
import { cleanupE2eData } from "../tests/e2e/lib/cleanup";

const includeFixtures = process.argv.includes("--include-fixtures");

async function main() {
  console.log("🧹 E2E cleanup starting...");
  const result = await cleanupE2eData({ includeFixtures });
  console.log(
    `✅ Removed ${result.articlesDeleted} articles, ${result.productsDeleted} products, ${result.commentsDeleted} comments`,
  );
}

main().catch((err) => {
  console.error("❌ E2E cleanup failed:", err);
  process.exit(1);
});
