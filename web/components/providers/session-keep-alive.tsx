"use client";

import { useEffect } from "react";
import {
  getAccessToken,
  refreshAccessToken,
} from "@/lib/auth/author-client";
import { SESSION_REFRESH_INTERVAL_MS } from "@/lib/auth/session-config";

/**
 * Keeps the user signed in by renewing the access token while the refresh cookie is valid.
 */
export function SessionKeepAlive() {
  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      if (cancelled) return;
      const token = getAccessToken();
      if (token) {
        await refreshAccessToken();
        return;
      }
      await refreshAccessToken();
    }

    void ensureSession();

    const interval = window.setInterval(() => {
      void refreshAccessToken();
    }, SESSION_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
