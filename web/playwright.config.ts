import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const authFile = path.join(__dirname, "tests/e2e/.auth/admin.json");

const testEnv = {
  DATABASE_URL:
    process.env["DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5432/booksplatform?schema=public",
  JWT_SECRET:
    process.env["JWT_SECRET"] ?? "test-jwt-secret-32-chars-minimum-here",
  JWT_REFRESH_SECRET:
    process.env["JWT_REFRESH_SECRET"] ??
    "test-refresh-secret-32-chars-min-here",
  NEXT_PUBLIC_APP_URL: process.env["BASE_URL"] ?? "http://localhost:3000",
  NODE_ENV: "development",
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
  ],
  use: {
    baseURL: process.env["BASE_URL"] ?? "http://localhost:3000",
    locale: "ar-EG",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: authFile },
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: authFile },
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], storageState: authFile },
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"], storageState: authFile },
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 120 * 1000,
    env: testEnv,
  },
});
