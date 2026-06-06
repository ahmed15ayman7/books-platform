import { test, expect } from "@playwright/test";
import { attachConsoleNetworkGuard } from "./helpers/console-network-guard";
import {
  LEGACY_REDIRECTS,
  PUBLIC_ROUTES_AR,
  PUBLIC_ROUTES_EN,
} from "./helpers/routes";

test.describe("Public routes — Arabic", () => {
  for (const route of PUBLIC_ROUTES_AR) {
    test(`loads ${route}`, async ({ page, baseURL }) => {
      const guard = attachConsoleNetworkGuard(page, baseURL!);
      try {
        const response = await page.goto(route);
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator("body")).toBeVisible();
      } finally {
        guard.assertClean();
        guard.dispose();
      }
    });
  }
});

test.describe("Public routes — English sample", () => {
  for (const route of PUBLIC_ROUTES_EN) {
    test(`loads ${route}`, async ({ page, baseURL }) => {
      const guard = attachConsoleNetworkGuard(page, baseURL!);
      try {
        const response = await page.goto(route);
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator("body")).toBeVisible();
      } finally {
        guard.assertClean();
        guard.dispose();
      }
    });
  }
});

test.describe("Legacy media redirects", () => {
  for (const { from, to } of LEGACY_REDIRECTS) {
    test(`${from} redirects to media channel`, async ({ page }) => {
      await page.goto(from, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(to, { timeout: 30_000 });
    });
  }
});
