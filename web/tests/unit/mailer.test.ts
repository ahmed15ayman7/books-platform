import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn() },
}));

describe("mailer", () => {
  afterEach(() => {
    delete process.env["SMTP_HOST"];
    delete process.env["SMTP_USER"];
    delete process.env["SMTP_PASSWORD"];
  });

  it("sendMail returns false and logs when SMTP is not configured", async () => {
    delete process.env["SMTP_HOST"];
    delete process.env["SMTP_USER"];
    delete process.env["SMTP_PASSWORD"];

    const { sendMail, _resetTransporter } = await import("@/lib/email/mailer");
    _resetTransporter();

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await sendMail({ to: "test@example.com", subject: "Test", html: "<p>Test</p>" });
    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("SMTP not configured"), expect.any(String));
    warnSpy.mockRestore();
  });

  it("exports sendMail, sendBulk, and _resetTransporter", async () => {
    const mod = await import("@/lib/email/mailer");
    expect(typeof mod.sendMail).toBe("function");
    expect(typeof mod.sendBulk).toBe("function");
    expect(typeof mod._resetTransporter).toBe("function");
  });
});
