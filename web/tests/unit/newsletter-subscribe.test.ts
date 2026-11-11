/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  db: {
    newsletterSubscriber: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email/mailer", () => ({
  sendMail: vi.fn(),
}));

const { db } = await import("@/lib/db");
const { sendMail } = await import("@/lib/email/mailer");
const { POST } = await import("@/app/api/v1/newsletter/subscribe/route");

const subscribers = db.newsletterSubscriber as unknown as {
  findUnique: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};
const send = sendMail as unknown as ReturnType<typeof vi.fn>;

const EMAIL = "reader@example.com";

function request() {
  return new NextRequest("http://localhost/api/v1/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, locale: "en", source: "homepage" }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  subscribers.create.mockResolvedValue({});
  subscribers.update.mockResolvedValue({});
});

async function post() {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const res = await POST(request());
  const json = await res.json();
  const logged = errorSpy.mock.calls.flat().map(String).join(" ");
  errorSpy.mockRestore();
  return { res, json, logged };
}

describe("POST /api/v1/newsletter/subscribe", () => {
  describe("new subscriber", () => {
    beforeEach(() => {
      subscribers.findUnique.mockResolvedValue(null);
    });

    it("returns success when the welcome mail is sent and keeps the pending row", async () => {
      send.mockResolvedValue(true);
      const { res, json, logged } = await post();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: { message: "Check your email to confirm subscription" },
      });
      expect(subscribers.create).toHaveBeenCalledTimes(1);
      const data = subscribers.create.mock.calls[0]?.[0].data;
      expect(data.email).toBe(EMAIL);
      expect(data.status).toBe("PENDING");
      expect(data.confirmToken).toEqual(expect.any(String));
      expect(data.manageToken).toEqual(expect.any(String));
      expect(data.confirmToken.length).toBeGreaterThan(0);
      expect(subscribers.update).not.toHaveBeenCalled();
      expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: EMAIL }));
      expect(logged).not.toContain("[newsletter] welcome mail failed");
    });

    it("returns an error when the welcome mail fails and keeps the pending row", async () => {
      send.mockResolvedValue(false);
      const { res, json, logged } = await post();

      expect(res.status).toBe(500);
      expect(json).toEqual({
        success: false,
        error: {
          code: "WELCOME_MAIL_FAILED",
          message: "Could not send the confirmation email. Please try again.",
        },
      });
      expect(subscribers.create).toHaveBeenCalledTimes(1);
      const data = subscribers.create.mock.calls[0]?.[0].data;
      expect(data.status).toBe("PENDING");
      expect(data.confirmToken).toEqual(expect.any(String));
      expect(data.manageToken).toEqual(expect.any(String));
      expect(subscribers.update).not.toHaveBeenCalled();
      expect(logged).toContain("[newsletter] welcome mail failed");
      expect(logged).not.toContain("@");
    });
  });

  describe("pending subscriber", () => {
    beforeEach(() => {
      subscribers.findUnique.mockResolvedValue({
        id: "sub_pending",
        email: EMAIL,
        status: "PENDING",
        confirmToken: "confirm-token",
        manageToken: "manage-token",
        locale: "en",
      });
    });

    it("returns success when the confirmation mail is resent", async () => {
      send.mockResolvedValue(true);
      const { res, json, logged } = await post();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: { message: "Confirmation email resent" },
      });
      expect(subscribers.create).not.toHaveBeenCalled();
      expect(subscribers.update).toHaveBeenCalledWith({
        where: { id: "sub_pending" },
        data: { confirmToken: "confirm-token", manageToken: "manage-token" },
      });
      expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: EMAIL }));
      expect(logged).not.toContain("[newsletter] welcome mail failed");
    });

    it("returns an error when the resend fails and keeps the existing tokens", async () => {
      send.mockResolvedValue(false);
      const { res, json, logged } = await post();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("WELCOME_MAIL_FAILED");
      expect(subscribers.update).toHaveBeenCalledTimes(1);
      expect(subscribers.update).toHaveBeenCalledWith({
        where: { id: "sub_pending" },
        data: { confirmToken: "confirm-token", manageToken: "manage-token" },
      });
      expect(logged).toContain("[newsletter] welcome mail failed");
      expect(logged).not.toContain("@");
    });
  });

  describe("unsubscribed subscriber", () => {
    beforeEach(() => {
      subscribers.findUnique.mockResolvedValue({
        id: "sub_old",
        email: EMAIL,
        status: "UNSUBSCRIBED",
        confirmToken: null,
        manageToken: "manage-token",
        locale: "ar",
      });
    });

    it("returns success when the resubscription mail is sent", async () => {
      send.mockResolvedValue(true);
      const { res, json, logged } = await post();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: { message: "Resubscription initiated. Check your email." },
      });
      expect(subscribers.create).not.toHaveBeenCalled();
      expect(subscribers.update).toHaveBeenCalledTimes(1);
      const data = subscribers.update.mock.calls[0]?.[0].data;
      expect(data.status).toBe("PENDING");
      expect(data.unsubscribedAt).toBeNull();
      expect(data.manageToken).toBe("manage-token");
      expect(data.confirmToken).toEqual(expect.any(String));
      expect(data.confirmToken.length).toBeGreaterThan(0);
      expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: EMAIL }));
      expect(logged).not.toContain("[newsletter] welcome mail failed");
    });

    it("returns an error when the resubscription mail fails and keeps the pending row", async () => {
      send.mockResolvedValue(false);
      const { res, json, logged } = await post();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("WELCOME_MAIL_FAILED");
      expect(subscribers.update).toHaveBeenCalledTimes(1);
      const data = subscribers.update.mock.calls[0]?.[0].data;
      expect(data.status).toBe("PENDING");
      expect(data.confirmToken).toEqual(expect.any(String));
      expect(data.manageToken).toBe("manage-token");
      expect(logged).toContain("[newsletter] welcome mail failed");
      expect(logged).not.toContain("@");
    });
  });
});
