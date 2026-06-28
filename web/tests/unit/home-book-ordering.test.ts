import { describe, expect, it } from "vitest";

describe("home book ordering policy", () => {
  it("prefers createdAt over legacy position zero for newly published books", () => {
    const books = [
      { id: "legacy", position: 500, createdAt: new Date("2024-01-01") },
      { id: "new", position: 0, createdAt: new Date("2026-06-17") },
    ];

    const sorted = [...books].sort((a, b) => {
      const byCreated = b.createdAt.getTime() - a.createdAt.getTime();
      if (byCreated !== 0) return byCreated;
      return b.position - a.position;
    });

    expect(sorted[0]?.id).toBe("new");
  });
});
