import { test, expect } from "@playwright/test";
import { attachConsoleNetworkGuard } from "./helpers/console-network-guard";

test.describe("Navigation — desktop", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("media hub link navigates to /ar/media", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar");
      const banner = page.getByRole("banner");
      await banner.getByRole("link", { name: "إبداعات الميديا" }).first().click();
      await expect(page).toHaveURL(/\/ar\/media\/?$/);
      await expect(page.getByLabel("إبداعات الميديا")).toBeVisible();
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });

  test("reading channel stays under /ar/articles", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar");
      const banner = page.getByRole("banner");
      await banner.getByRole("link", { name: "قراءات وعروض" }).first().hover();
      await page.getByRole("menuitem", { name: "حصاد الكتب" }).click();
      await expect(page).toHaveURL(/\/ar\/articles\/harvest/);
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });

  test("media channel dropdown links to /ar/media/*", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar");
      const banner = page.getByRole("banner");
      await banner.getByRole("link", { name: "إبداعات الميديا" }).first().hover();
      await page.getByRole("menuitem", { name: "حديث الكتب" }).click();
      await expect(page).toHaveURL(/\/ar\/media\/books-talk/);
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });
});

test.describe("Navigation — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens and media link works", async ({ page, baseURL }) => {
    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar");
      await page.getByRole("button", { name: /فتح القائمة|Open menu/i }).click();
      const dialog = page.getByRole("dialog", { name: /القائمة الرئيسية|Main menu/i });
      await dialog.getByRole("button", { name: "إبداعات الميديا" }).click();
      await dialog.getByRole("link", { name: "كل الفيديوهات" }).click();
      await expect(page).toHaveURL(/\/ar\/media/);
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });
});
