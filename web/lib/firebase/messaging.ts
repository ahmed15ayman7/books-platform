import { getMessaging, type Message, type MulticastMessage } from "firebase-admin/messaging";

import { getFirebaseAdmin } from "./admin";

export interface FcmNotificationPayload {
  title: string;
  body: string;
  type?: string;
  slug?: string;
  url?: string;
}

export interface FcmSendResult {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
}

const FCM_BATCH_SIZE = 500;

function buildDataPayload(payload: FcmNotificationPayload): Record<string, string> {
  const data: Record<string, string> = {};
  if (payload.type) data["type"] = payload.type;
  if (payload.slug) data["slug"] = payload.slug;
  if (payload.url) data["url"] = payload.url;
  return data;
}

function buildMulticastMessage(
  tokens: string[],
  payload: FcmNotificationPayload,
): MulticastMessage {
  return {
    tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: buildDataPayload(payload),
    android: {
      priority: "high",
      notification: { channelId: "books_platform_channel" },
    },
    apns: {
      payload: { aps: { sound: "default" } },
    },
  };
}

export async function sendFcmToTokens(
  tokens: string[],
  payload: FcmNotificationPayload,
): Promise<FcmSendResult> {
  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error("Firebase is not configured");
  }

  const messaging = getMessaging(app);
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens: string[] = [];

  for (let i = 0; i < tokens.length; i += FCM_BATCH_SIZE) {
    const batch = tokens.slice(i, i + FCM_BATCH_SIZE);
    const response = await messaging.sendEachForMulticast(
      buildMulticastMessage(batch, payload),
    );

    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((result, index) => {
      if (result.success) return;
      const code = result.error?.code;
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered"
      ) {
        invalidTokens.push(batch[index]!);
      }
    });
  }

  return { successCount, failureCount, invalidTokens };
}

export async function sendFcmToToken(
  token: string,
  payload: FcmNotificationPayload,
): Promise<void> {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error("Firebase is not configured");
  }

  const message: Message = {
    token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: buildDataPayload(payload),
    android: {
      priority: "high",
      notification: { channelId: "books_platform_channel" },
    },
    apns: {
      payload: { aps: { sound: "default" } },
    },
  };

  await getMessaging(app).send(message);
}
