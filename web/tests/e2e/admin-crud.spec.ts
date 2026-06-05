import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { attachConsoleNetworkGuard } from "./helpers/console-network-guard";
import {
  e2eTitle,
  getRunId,
  trackArticle,
} from "./helpers/test-data-tracker";
import { RUN_ID_FILE } from "./lib/paths";

function resolveRunId(): string {
  if (process.env["E2E_RUN_ID"]) return process.env["E2E_RUN_ID"];
  if (fs.existsSync(RUN_ID_FILE)) {
    return fs.readFileSync(RUN_ID_FILE, "utf8").trim();
  }
  return getRunId();
}

async function adminAuthHeader(page: import("@playwright/test").Page) {
  const cookies = await page.context().cookies();
  const accessCookie = cookies.find((c) => c.name === "access_token");
  expect(accessCookie?.value).toBeTruthy();
  return {
    Authorization: `Bearer ${accessCookie!.value}`,
    "Content-Type": "application/json",
  };
}

test.describe("Admin media CRUD", () => {
  test.describe.configure({ mode: "serial" });

  test("create via API, verify on public media, edit, delete", async ({
    page,
    baseURL,
    request,
  }) => {
    const runId = resolveRunId();
    const title = e2eTitle(runId, "media-video");
    const updatedTitle = `${title}-updated`;
    let articleId: string | undefined;

    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar/admin/dashboard");
      await expect(page).toHaveURL(/\/ar\/admin\/dashboard/);

      const headers = await adminAuthHeader(page);

      const createRes = await request.post("/api/v1/admin/articles", {
        headers,
        data: {
          title,
          channel: "books-talk",
          status: "publish",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          excerpt: "E2E test media excerpt",
          date: new Date().toISOString(),
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const created = (await createRes.json()) as {
        success: boolean;
        data?: { id: string; slug: string };
      };
      expect(created.success).toBe(true);
      articleId = created.data?.id;
      expect(articleId).toBeTruthy();
      trackArticle(articleId!);

      await page.goto("/ar/media");
      await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });

      const patchRes = await request.patch(
        `/api/v1/admin/articles/${articleId}`,
        {
          headers,
          data: { title: updatedTitle },
        },
      );
      expect(patchRes.ok()).toBeTruthy();

      await page.reload();
      await expect(page.getByText(updatedTitle)).toBeVisible({
        timeout: 15_000,
      });

      const deleteRes = await request.delete(
        `/api/v1/admin/articles/${articleId}`,
        { headers: { Authorization: headers.Authorization } },
      );
      expect(deleteRes.ok()).toBeTruthy();

      await page.reload();
      await expect(page.getByText(updatedTitle)).not.toBeVisible({
        timeout: 10_000,
      });

      articleId = undefined;
    } finally {
      guard.assertClean();
      guard.dispose();

      if (articleId) {
        const headers = await adminAuthHeader(page).catch(() => null);
        if (headers) {
          await request.delete(`/api/v1/admin/articles/${articleId}`, {
            headers: { Authorization: headers.Authorization },
          });
        }
      }
    }
  });

  test("create media via admin UI", async ({ page, baseURL }) => {
    const runId = resolveRunId();
    const title = e2eTitle(runId, "media-ui");
    let articleId: string | undefined;

    const guard = attachConsoleNetworkGuard(page, baseURL!);
    try {
      await page.goto("/ar/admin/media/new");
      await page
        .getByPlaceholder("https://www.youtube.com/watch?v=...")
        .fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      await page.getByRole("textbox", { name: /العنوان \(عربي\)/i }).fill(title);

      await page
        .locator(".space-y-1")
        .filter({ hasText: "القناة" })
        .getByRole("combobox")
        .click();
      await page.getByRole("option", { name: "حديث الكتب" }).click();

      await page
        .locator(".space-y-1")
        .filter({ hasText: "الحالة" })
        .getByRole("combobox")
        .click();
      await page.getByRole("option", { name: "منشور" }).click();

      await page.getByRole("button", { name: "نشر" }).click();
      await expect(page).toHaveURL(/\/ar\/admin\/media\/[^/]+$/, {
        timeout: 30_000,
      });

      articleId = path.basename(page.url());
      trackArticle(articleId);

      await expect(page.getByRole("heading", { name: title })).toBeVisible({
        timeout: 10_000,
      });
    } finally {
      guard.assertClean();
      guard.dispose();
    }
  });
});
