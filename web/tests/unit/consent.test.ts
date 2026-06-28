import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COOKIE_CONSENT_KEY,
  shouldShowCookieConsent,
  saveCookieConsent,
} from "@/lib/consent/cookie-consent";
import {
  NOTIFICATION_PROMPT_KEY,
  shouldShowNotificationPrompt,
  saveNotificationPrompt,
} from "@/lib/consent/notification-prompt";

describe("cookie consent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the banner only before the user responds", () => {
    expect(shouldShowCookieConsent()).toBe(true);

    saveCookieConsent("dismissed");
    expect(shouldShowCookieConsent()).toBe(false);

    localStorage.clear();
    saveCookieConsent("accepted");
    expect(shouldShowCookieConsent()).toBe(false);
  });

  it("does not re-show after the remind window would have elapsed", () => {
    saveCookieConsent("dismissed");
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ status: "dismissed", at: Date.now() - 30 * 24 * 60 * 60 * 1000 }),
    );

    expect(shouldShowCookieConsent()).toBe(false);
  });
});

describe("notification prompt", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("Notification", {
      permission: "default",
    });
  });

  it("shows only while permission is default and no prior response exists", () => {
    expect(shouldShowNotificationPrompt()).toBe(true);

    saveNotificationPrompt("dismissed");
    expect(shouldShowNotificationPrompt()).toBe(false);
  });

  it("does not show when browser permission is already decided", () => {
    vi.stubGlobal("Notification", {
      permission: "granted",
    });
    expect(shouldShowNotificationPrompt()).toBe(false);

    vi.stubGlobal("Notification", {
      permission: "denied",
    });
    expect(shouldShowNotificationPrompt()).toBe(false);
  });

  it("does not re-show after the remind window would have elapsed", () => {
    saveNotificationPrompt("dismissed");
    localStorage.setItem(
      NOTIFICATION_PROMPT_KEY,
      JSON.stringify({ status: "dismissed", at: Date.now() - 30 * 24 * 60 * 60 * 1000 }),
    );

    expect(shouldShowNotificationPrompt()).toBe(false);
  });
});
