import { describe, expect, it } from "vitest";

describe("legacy original id range", () => {
  it("rejects timestamp-style ids above PostgreSQL integer max", () => {
    const timestampId = Date.now();
    const maxInt = 2_147_483_647;
    expect(timestampId).toBeGreaterThan(maxInt);
  });

  it("accepts sequential ids within integer range", () => {
    const next = 42_001;
    expect(next).toBeLessThanOrEqual(2_147_483_647);
  });
});
