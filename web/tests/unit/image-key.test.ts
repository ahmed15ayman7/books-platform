import { describe, expect, it } from "vitest";
import { buildObjectKey, isValidFolder, isValidField } from "@/lib/storage/image-key";

describe("buildObjectKey", () => {
  it("builds product key with originalId", () => {
    expect(buildObjectKey({ folder: "products", field: "image_url", mime: "image/jpeg", originalId: 46382 }))
      .toBe("products/46382__image_url.jpg");
  });

  it("builds article key with originalId and webp", () => {
    expect(buildObjectKey({ folder: "articles", field: "image_url", mime: "image/webp", originalId: 12 }))
      .toBe("articles/12__image_url.webp");
  });

  it("builds publisher key with originalId using image_featured", () => {
    expect(buildObjectKey({ folder: "publishers", field: "image_featured", mime: "image/png", originalId: 99 }))
      .toBe("publishers/99__image_featured.png");
  });

  it("builds hero key with entityId (cuid string)", () => {
    const key = buildObjectKey({ folder: "hero", field: "foreground_image_url", mime: "image/jpeg", entityId: "clxabc123" });
    expect(key).toBe("hero/clxabc123__foreground_image_url.jpg");
  });

  it("builds submission key with entityId", () => {
    const key = buildObjectKey({ folder: "submissions", field: "image_url", mime: "image/png", entityId: "draft-abc-xyz" });
    expect(key).toBe("submissions/draft-abc-xyz__image_url.png");
  });

  it("falls back to jpg for unknown mime", () => {
    const key = buildObjectKey({ folder: "products", field: "image_url", mime: "image/tiff", originalId: 1 });
    expect(key).toBe("products/1__image_url.jpg");
  });

  it("uses 'unknown' when neither originalId nor entityId is provided", () => {
    const key = buildObjectKey({ folder: "products", field: "image_url", mime: "image/jpeg" });
    expect(key).toBe("products/unknown__image_url.jpg");
  });
});

describe("isValidFolder / isValidField", () => {
  it("accepts valid folder names", () => {
    expect(isValidFolder("articles")).toBe(true);
    expect(isValidFolder("products")).toBe(true);
    expect(isValidFolder("publishers")).toBe(true);
    expect(isValidFolder("hero")).toBe(true);
    expect(isValidFolder("submissions")).toBe(true);
  });

  it("rejects unknown folders", () => {
    expect(isValidFolder("unknown")).toBe(false);
    expect(isValidFolder("")).toBe(false);
  });

  it("accepts valid field names", () => {
    expect(isValidField("image_url")).toBe(true);
    expect(isValidField("image_featured")).toBe(true);
    expect(isValidField("foreground_image_url")).toBe(true);
  });

  it("rejects unknown fields", () => {
    expect(isValidField("cover")).toBe(false);
    expect(isValidField("")).toBe(false);
  });
});
