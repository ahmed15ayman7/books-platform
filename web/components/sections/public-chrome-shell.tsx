"use client";

import type { ReactNode } from "react";
import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { NotificationPromptBanner } from "@/components/consent/notification-prompt-banner";
import { PublicKeyboardListener } from "@/components/sections/public-keyboard-listener";

export function PublicChromeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicKeyboardListener />
      {children}
      <CookieConsentBanner />
      <NotificationPromptBanner />
    </>
  );
}
