"use client";

import type { ReactNode } from "react";
import { PublicKeyboardListener } from "@/components/sections/public-keyboard-listener";

export function PublicChromeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicKeyboardListener />
      {children}
    </>
  );
}
