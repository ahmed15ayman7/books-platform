import { test, expect } from "@playwright/test";
import { attachConsoleNetworkGuard } from "./helpers/console-network-guard";

test.describe("Core health", () => {
  test("home page loads with header and footer", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      const response = await page.goto("/ar");
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.locator("body")).not.toBeEmpty();
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });

  test("fixture book detail page loads", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      const response = await page.goto("/ar/books/e2e-fixture-book");
      expect(response?.status()).toBeLessThan(400);
      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toBeVisible({ timeout: 15_000 });
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });

  test("fixture article detail page loads", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      const response = await page.goto("/ar/articles/e2e-fixture-article");
      expect(response?.status()).toBeLessThan(400);
      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toBeVisible({ timeout: 15_000 });
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });
});
