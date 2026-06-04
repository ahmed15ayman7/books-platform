import fs from "node:fs";
import { ARTIFACTS_DIR, TRACKER_FILE } from "./paths";

export interface TrackedEntities {
  articles: string[];
  products: string[];
}

const empty: TrackedEntities = { articles: [], products: [] };

export function readTracker(): TrackedEntities {
  if (!fs.existsSync(TRACKER_FILE)) return { ...empty };
  try {
    return JSON.parse(fs.readFileSync(TRACKER_FILE, "utf8")) as TrackedEntities;
  } catch {
    return { ...empty };
  }
}

export function writeTracker(data: TrackedEntities): void {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2));
}

export function trackArticle(id: string): void {
  const current = readTracker();
  if (!current.articles.includes(id)) {
    current.articles.push(id);
    writeTracker(current);
  }
}

export function trackProduct(id: string): void {
  const current = readTracker();
  if (!current.products.includes(id)) {
    current.products.push(id);
    writeTracker(current);
  }
}

export function resetTracker(): void {
  writeTracker({ ...empty });
}
