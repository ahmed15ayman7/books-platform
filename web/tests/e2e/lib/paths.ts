import path from "node:path";

export const E2E_DIR = path.resolve(__dirname, "..");
export const ARTIFACTS_DIR = path.join(E2E_DIR, ".artifacts");
export const AUTH_DIR = path.join(E2E_DIR, ".auth");
export const AUTH_FILE = path.join(AUTH_DIR, "admin.json");
export const RUN_ID_FILE = path.join(ARTIFACTS_DIR, "run-id.txt");
export const TRACKER_FILE = path.join(ARTIFACTS_DIR, "created-entities.json");

export const E2E_SLUG_PREFIX = "e2e-";
export const E2E_FIXTURE_PREFIX = "e2e-fixture-";

export const ADMIN_EMAIL =
  process.env["E2E_ADMIN_EMAIL"] ?? "user@example.com";
export const ADMIN_PASSWORD =
  process.env["E2E_ADMIN_PASSWORD"] ?? "@123456";
