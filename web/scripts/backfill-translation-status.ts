/**
 * Backfill product.translation_status from legacy booksplatform.net WooCommerce categories.
 *
 * Usage:
 *   tsx --env-file=.env scripts/backfill-translation-status.ts          # dry-run
 *   tsx --env-file=.env scripts/backfill-translation-status.ts --apply   # write to DB
 */
import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const LEGACY_BASE = "https://booksplatform.net";
const MANIFEST_PATH = resolve(__dirname, "data/translation-slugs.json");

const WC_CATEGORY_SLUGS: Record<"NOMINATED" | "TRANSLATED", string[]> = {
  NOMINATED: ["books-nominated-for-translation"],
  TRANSLATED: ["translated-books"],
};

interface Manifest {
  NOMINATED?: string[];
  TRANSLATED?: string[];
}

async function fetchCategoryId(slug: string): Promise<number | null> {
  const url = `${LEGACY_BASE}/wp-json/wc/store/v1/products/categories?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ id: number; slug: string }>;
  const match = data.find((c) => c.slug === slug);
  return match?.id ?? null;
}

async function fetchSlugsForCategory(categoryId: number): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${LEGACY_BASE}/wp-json/wc/store/v1/products?category=${categoryId}&per_page=${perPage}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const products = (await res.json()) as Array<{ slug: string }>;
    if (!products.length) break;
    slugs.push(...products.map((p) => p.slug));
    if (products.length < perPage) break;
    page += 1;
  }

  return [...new Set(slugs)];
}

async function resolveSlugsFromLegacy(
  status: "NOMINATED" | "TRANSLATED",
): Promise<string[]> {
  const collected: string[] = [];

  for (const slug of WC_CATEGORY_SLUGS[status]) {
    const categoryId = await fetchCategoryId(slug);
    if (!categoryId) {
      console.warn(`[warn] WC category not found: ${slug}`);
      continue;
    }
    const productSlugs = await fetchSlugsForCategory(categoryId);
    console.log(`[fetch] ${status} via ${slug} (id=${categoryId}): ${productSlugs.length} slugs`);
    collected.push(...productSlugs);
  }

  return [...new Set(collected)];
}

function loadManifest(): Manifest {
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
  } catch {
    return {};
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const manifest = loadManifest();

  const nominatedSlugs = [
    ...new Set([
      ...(manifest.NOMINATED ?? []),
      ...(await resolveSlugsFromLegacy("NOMINATED")),
    ]),
  ];

  const translatedSlugs = [
    ...new Set([
      ...(manifest.TRANSLATED ?? []),
      ...(await resolveSlugsFromLegacy("TRANSLATED")),
    ]),
  ];

  // TRANSLATED wins if a slug appears in both lists
  const translatedSet = new Set(translatedSlugs);
  const nominatedOnly = nominatedSlugs.filter((s) => !translatedSet.has(s));

  console.log(`\nSummary:`);
  console.log(`  NOMINATED: ${nominatedOnly.length} slugs`);
  console.log(`  TRANSLATED: ${translatedSlugs.length} slugs`);

  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Run from web/ with .env present.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const report: Record<string, unknown> = {
    at: new Date().toISOString(),
    apply,
    nominated: { total: nominatedOnly.length, updated: 0, missing: [] as string[] },
    translated: { total: translatedSlugs.length, updated: 0, missing: [] as string[] },
  };

  async function updateStatus(slugs: string[], status: "NOMINATED" | "TRANSLATED") {
    const key = status === "NOMINATED" ? "nominated" : "translated";
    const bucket = report[key] as { total: number; updated: number; missing: string[] };

    for (const slug of slugs) {
      const existing = await prisma.product.findFirst({
        where: { slug, deletedAt: null },
        select: { id: true, translationStatus: true },
      });

      if (!existing) {
        bucket.missing.push(slug);
        continue;
      }

      if (apply) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { translationStatus: status },
        });
      }
      bucket.updated += 1;
      console.log(
        `${apply ? "✓" : "○"} ${status} ${slug}${existing.translationStatus !== status ? ` (was ${existing.translationStatus})` : ""}`,
      );
    }
  }

  await updateStatus(translatedSlugs, "TRANSLATED");
  await updateStatus(nominatedOnly, "NOMINATED");

  const reportPath = resolve(__dirname, `backfill-report-${Date.now()}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);
  console.log(apply ? "Applied to database." : "Dry-run only — pass --apply to write.");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
