import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import {
  ARTIFACTS_DIR,
  AUTH_DIR,
  RUN_ID_FILE,
} from "./lib/paths";
import { resetTracker } from "./lib/tracker";

export default async function globalSetup() {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const runId =
    process.env["E2E_RUN_ID"] ??
    `run-${Date.now().toString(36)}`;
  process.env["E2E_RUN_ID"] = runId;
  fs.writeFileSync(RUN_ID_FILE, runId);

  resetTracker();

  const webRoot = path.resolve(__dirname, "../..");
  try {
    execSync("npx tsx scripts/e2e-seed-fixtures.ts", {
      cwd: webRoot,
      stdio: "inherit",
      env: { ...process.env, E2E_RUN_ID: runId },
    });
  } catch (error) {
    console.warn(
      "[E2E globalSetup] Fixture seed skipped or failed — ensure DATABASE_URL is set and migrations are applied.",
      error,
    );
  }
}
