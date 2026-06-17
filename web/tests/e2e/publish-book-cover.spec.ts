import { test, expect } from "@playwright/test";

/** 1×1 PNG */
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const E2E_DRAFT_ID = "e2e-publish-draft-id";
const E2E_DRAFT_TOKEN = "e2e-publish-draft-token-12345678";

test.describe("Publish book cover upload", () => {
  test("creates draft on step change and uploads cover with multipart headers", async ({
    page,
  }) => {
    let uploadContentType: string | null = null;
    let uploadDraftId: string | null = null;

    await page.route("**/api/v1/submissions/check-eligibility**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { isEligibleForFree: true },
        }),
      });
    });

    await page.route("**/api/v1/submissions/drafts**", async (route) => {
      const method = route.request().method();
      if (method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              draft: { id: E2E_DRAFT_ID, currentStep: 1 },
              draftToken: E2E_DRAFT_TOKEN,
            },
          }),
        });
        return;
      }
      if (method === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { draft: { id: E2E_DRAFT_ID, currentStep: 1 } },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route("**/api/v1/submissions/uploads/cover", async (route) => {
      const request = route.request();
      uploadContentType = request.headers()["content-type"] ?? null;
      const body = request.postDataBuffer();
      const bodyText = body?.toString("utf8") ?? "";
      const draftMatch = bodyText.match(/name="draftId"\r\n\r\n([^\r]+)/);
      uploadDraftId = draftMatch?.[1] ?? null;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            url: "https://cdn.example.com/e2e-cover.png",
            key: "submissions/e2e/cover.png",
            sha256: "abc",
            deduplicated: false,
          },
        }),
      });
    });

    await page.goto("/ar/publish");

    const cookieAccept = page.getByRole("button", { name: /^موافق$|^Accept$/i });
    if (await cookieAccept.isVisible().catch(() => false)) {
      await cookieAccept.click();
    }

    await expect(page.getByRole("button", { name: /التالي|Next/i })).toBeVisible();

    await page.locator('input[name="authorName"]').fill("مؤلف تجريبي");
    await page
      .locator('input[name="authorEmail"]')
      .fill(`e2e-publish-${Date.now()}@example.com`);

    const draftCreate = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/submissions/drafts") &&
        res.request().method() === "POST" &&
        res.ok(),
    );

    await page.getByRole("button", { name: /التالي|Next/i }).click();
    await draftCreate;

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeEnabled({ timeout: 10_000 });

    await fileInput.setInputFiles({
      name: "cover.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });

    await expect(page.locator('input[type="url"]')).toHaveValue(
      "https://cdn.example.com/e2e-cover.png",
      { timeout: 10_000 },
    );

    expect(uploadContentType).toBeTruthy();
    expect(uploadContentType).toContain("multipart/form-data");
    expect(uploadContentType).not.toBe("application/json");
    expect(uploadDraftId).toBe(E2E_DRAFT_ID);
  });
});
