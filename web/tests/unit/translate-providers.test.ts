import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getTranslationProviders,
  translateWithProviders,
  type TranslateProvider,
} from "@/lib/translation/translate-providers";

describe("translateWithProviders", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("falls back to the next provider when the first one fails", async () => {
    const providers: TranslateProvider[] = [
      {
        id: "mymemory",
        maxChars: 450,
        translate: vi.fn().mockResolvedValue(null),
      },
      {
        id: "google",
        maxChars: 4500,
        translate: vi.fn().mockResolvedValue("مرحبًا"),
      },
    ];

    await expect(translateWithProviders("hello", "en", "ar", providers)).resolves.toBe("مرحبًا");
    expect(providers[1]?.translate).toHaveBeenCalledOnce();
  });

  it("rejects MyMemory quota warning payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          quotaFinished: false,
          responseData: {
            translatedText: "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY.",
          },
        }),
      }),
    );

    const providers = getTranslationProviders().filter((provider) => provider.id === "mymemory");
    await expect(translateWithProviders("hello", "en", "ar", providers)).rejects.toThrow(
      /All translation providers failed/,
    );
  });

  it("parses Google gtx responses as a fallback provider", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [[["مرحبًا", "hello", null, null, 10]], null, "en"],
      }),
    );

    const providers = getTranslationProviders().filter((provider) => provider.id === "google");
    await expect(translateWithProviders("hello", "en", "ar", providers)).resolves.toBe("مرحبًا");
  });
});

describe("getTranslationProviders", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("skips LibreTranslate when no base URL is configured", () => {
    vi.stubEnv("LIBRETRANSLATE_URL", "");
    const ids = getTranslationProviders().map((provider) => provider.id);
    expect(ids).not.toContain("libretranslate");
    expect(ids).toContain("google");
  });
});
