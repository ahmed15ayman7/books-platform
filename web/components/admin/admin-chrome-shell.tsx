"use client";

import type { ReactNode } from "react";
import { AdminChromeProvider } from "@/lib/admin/admin-chrome-context";
import { AdminKeyboardListener } from "@/components/admin/admin-keyboard-listener";
import { AdminCommandPalette } from "@/components/admin/admin-command-palette";

export function AdminChromeShell({ children }: { children: ReactNode }) {
  return (
    <AdminChromeProvider>
      <div className="admin-shell relative min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <AdminKeyboardListener />
        <AdminCommandPalette />
        {children}
      </div>
    </AdminChromeProvider>
  );
}
