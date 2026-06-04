import { execSync } from "node:child_process";
import path from "node:path";

export default async function globalTeardown() {
  const webRoot = path.resolve(__dirname, "../..");
  try {
    execSync("npx tsx scripts/e2e-cleanup.ts", {
      cwd: webRoot,
      stdio: "inherit",
      env: process.env,
    });
  } catch (error) {
    console.warn("[E2E globalTeardown] Cleanup failed:", error);
  }
}
