import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  AUTH_DIR,
  AUTH_FILE,
} from "./lib/paths";

setup("authenticate admin", async ({ page }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  await page.goto("/ar/admin/login");
  await page.getByRole("textbox", { name: /البريد الإلكتروني|Email/i }).fill(ADMIN_EMAIL);
  await page.getByRole("textbox", { name: /كلمة المرور|Password/i }).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /دخول|Sign In/i }).click();

  await expect(page).toHaveURL(/\/ar\/admin\/dashboard/, { timeout: 30_000 });
  await page.context().storageState({ path: AUTH_FILE });
});
