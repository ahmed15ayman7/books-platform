"use client";

import type { ReactNode } from "react";
import { AdminChromeProvider } from "@/lib/admin/admin-chrome-context";
import { AdminKeyboardListener } from "@/components/admin/admin-keyboard-listener";
import { AdminCommandPalette } from "@/components/admin/admin-command-palette";

export function AdminChromeShell({ children }: { children: ReactNode }) {
  return (
    <AdminChromeProvider>
      <AdminKeyboardListener />
      <AdminCommandPalette />
      {children}
    </AdminChromeProvider>
  );
}
