import type { Page, Response } from "@playwright/test";

const CONSOLE_ALLOWLIST: RegExp[] = [
  /Download the React DevTools/,
  /Failed to load resource.*favicon/,
  /Third-party cookie/,
  /Permissions-Policy/,
  /posthog/i,
  /clarity/i,
  /sentry/i,
  /hydration/i,
  /Extra attributes from the server/,
  /Image with src .* has either width or height modified/,
  /was preloaded using link preload but not used/,
  /Encountered a script tag while rendering React component/,
  /Failed to load resource: the server responded with a status of 404/,
  /Failed to load resource: the server responded with a status of 500/,
  /Permissions policy violation/,
  /compute-pressure/,
];

const IGNORED_HOSTS = [
  "youtube.com",
  "youtu.be",
  "googlevideo.com",
  "ytimg.com",
  "facebook.com",
  "posthog.com",
  "clarity.ms",
  "sentry.io",
  "google-analytics.com",
];

function isIgnoredUrl(url: string): boolean {
  return IGNORED_HOSTS.some((host) => url.includes(host));
}

function isSameOriginApi(url: string, baseURL: string): boolean {
  try {
    const parsed = new URL(url);
    const base = new URL(baseURL);
    return parsed.origin === base.origin && parsed.pathname.startsWith("/api/v1/");
  } catch {
    return false;
  }
}

export interface GuardHandles {
  dispose: () => void;
  assertClean: () => void;
}

export function attachConsoleNetworkGuard(
  page: Page,
  baseURL: string,
): GuardHandles {
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (CONSOLE_ALLOWLIST.some((re) => re.test(text))) return;
    consoleErrors.push(text);
  };

  const onResponse = (response: Response) => {
    const url = response.url();
    if (isIgnoredUrl(url)) return;
    if (!isSameOriginApi(url, baseURL)) return;
    const status = response.status();
    if (status >= 400) {
      failedResponses.push(`${status} ${url}`);
    }
  };

  page.on("console", onConsole);
  page.on("response", onResponse);

  return {
    dispose: () => {
      page.off("console", onConsole);
      page.off("response", onResponse);
    },
    assertClean: () => {
      if (consoleErrors.length > 0) {
        throw new Error(
          `Console errors detected:\n${consoleErrors.join("\n")}`,
        );
      }
      if (failedResponses.length > 0) {
        throw new Error(
          `Failed API responses:\n${failedResponses.join("\n")}`,
        );
      }
    },
  };
}
