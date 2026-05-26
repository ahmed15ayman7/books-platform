import { describe, it, expect } from "vitest";

// JWT signing tests are integration-level and run against actual Node.js crypto.
// They are covered in integration tests where the full HTTP server runs.
// Here we test the password utilities only.
describe("JWT module structure", () => {
  it("exports required functions", async () => {
    const module = await import("@/lib/auth/jwt");
    expect(typeof module.signAccessToken).toBe("function");
    expect(typeof module.signRefreshToken).toBe("function");
    expect(typeof module.verifyAccessToken).toBe("function");
    expect(typeof module.verifyRefreshToken).toBe("function");
  });

  it("verifyAccessToken returns null for garbage input", async () => {
    const { verifyAccessToken } = await import("@/lib/auth/jwt");
    const result = await verifyAccessToken("not.a.valid.token");
    expect(result).toBeNull();
  });
});

describe("Password utilities", () => {
  it("hashes password and verifies correctly", async () => {
    const { hashPassword, verifyPassword } = await import("@/lib/auth/password");
    const password = "SecurePass123";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("validates password strength", async () => {
    const { validatePasswordStrength } = await import("@/lib/auth/password");

    expect(validatePasswordStrength("short").valid).toBe(false);
    expect(validatePasswordStrength("nouppercase123").valid).toBe(false);
    expect(validatePasswordStrength("NoNumbers").valid).toBe(false);
    expect(validatePasswordStrength("ValidPass1").valid).toBe(true);
  });
});
