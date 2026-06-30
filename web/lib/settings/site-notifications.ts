export const SITE_NOTIFICATIONS_KEY = "site_notifications";

export interface SiteNotificationSettings {
  push: { enabled: boolean; broadcastAllowed: boolean };
  mobile: { enabled: boolean; broadcastAllowed: boolean };
  web: { enabled: boolean };
  email: { enabled: boolean; from: string; provider: "resend" | "smtp" };
}

export const DEFAULT_SITE_NOTIFICATIONS: SiteNotificationSettings = {
  push: { enabled: true, broadcastAllowed: true },
  mobile: { enabled: true, broadcastAllowed: true },
  web: { enabled: true },
  email: { enabled: false, from: "", provider: "resend" },
};

export function parseSiteNotifications(value: unknown): SiteNotificationSettings {
  if (!value || typeof value !== "object") return DEFAULT_SITE_NOTIFICATIONS;
  const v = value as Partial<SiteNotificationSettings>;
  return {
    push: {
      enabled: v.push?.enabled ?? DEFAULT_SITE_NOTIFICATIONS.push.enabled,
      broadcastAllowed:
        v.push?.broadcastAllowed ?? DEFAULT_SITE_NOTIFICATIONS.push.broadcastAllowed,
    },
    mobile: {
      enabled: v.mobile?.enabled ?? DEFAULT_SITE_NOTIFICATIONS.mobile.enabled,
      broadcastAllowed:
        v.mobile?.broadcastAllowed ?? DEFAULT_SITE_NOTIFICATIONS.mobile.broadcastAllowed,
    },
    web: {
      enabled: v.web?.enabled ?? DEFAULT_SITE_NOTIFICATIONS.web.enabled,
    },
    email: {
      enabled: v.email?.enabled ?? DEFAULT_SITE_NOTIFICATIONS.email.enabled,
      from: v.email?.from ?? "",
      provider:
        v.email?.provider === "smtp" ? "smtp" : DEFAULT_SITE_NOTIFICATIONS.email.provider,
    },
  };
}
