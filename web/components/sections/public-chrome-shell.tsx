"use client";

import type { ReactNode } from "react";
import { PublicChromeProvider } from "@/lib/public/public-chrome-context";
import { PublicKeyboardListener } from "@/components/sections/public-keyboard-listener";
import { PublicCommandPalette } from "@/components/sections/public-command-palette";

export function PublicChromeShell({ children }: { children: ReactNode }) {
  return (
    <PublicChromeProvider>
      <PublicKeyboardListener />
      <PublicCommandPalette />
      {children}
    </PublicChromeProvider>
  );
}
