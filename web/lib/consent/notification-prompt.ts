import { CONSENT_REMIND_MS } from "@/lib/consent/cookie-consent";

export const NOTIFICATION_PROMPT_KEY = "bp-notification-prompt";

export type NotificationPromptStatus = "granted" | "denied" | "dismissed";

export interface NotificationPromptRecord {
  status: NotificationPromptStatus;
  at: number;
}

function readRecord(): NotificationPromptRecord | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(NOTIFICATION_PROMPT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NotificationPromptRecord;
    if (
      parsed.status !== "granted" &&
      parsed.status !== "denied" &&
      parsed.status !== "dismissed"
    ) {
      return null;
    }
    if (typeof parsed.at !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function shouldShowNotificationPrompt(now = Date.now()): boolean {
  if (!isNotificationSupported()) return false;

  const permission = Notification.permission;
  if (permission === "granted" || permission === "denied") return false;

  const record = readRecord();
  if (!record) return true;
  if (record.status === "granted" || record.status === "denied") return false;
  return now - record.at >= CONSENT_REMIND_MS;
}

export function saveNotificationPrompt(status: NotificationPromptStatus): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    NOTIFICATION_PROMPT_KEY,
    JSON.stringify({ status, at: Date.now() } satisfies NotificationPromptRecord),
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";
  const result = await Notification.requestPermission();
  if (result === "granted") {
    saveNotificationPrompt("granted");
  } else if (result === "denied") {
    saveNotificationPrompt("denied");
  }
  return result;
}
