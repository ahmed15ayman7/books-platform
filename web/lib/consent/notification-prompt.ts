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

/** Show only while browser permission is still "default" and the user has not responded yet. */
export function shouldShowNotificationPrompt(): boolean {
  if (!isNotificationSupported()) return false;

  const permission = Notification.permission;
  if (permission === "granted" || permission === "denied") return false;

  return readRecord() === null;
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
