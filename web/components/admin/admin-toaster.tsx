"use client";

import { Toaster } from "sonner";

export function AdminToaster() {
  return (
    <Toaster
      dir="rtl"
      position="top-center"
      closeButton
      richColors
      toastOptions={{
        duration: 4500,
        classNames: {
          toast:
            "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-lg",
          title: "text-sm font-semibold",
          description: "text-xs text-[var(--admin-text-muted)]",
          actionButton:
            "rounded-lg bg-[var(--brand-red)] text-white text-xs font-medium px-3 py-1.5",
          cancelButton:
            "rounded-lg border border-[var(--admin-border)] text-xs font-medium px-3 py-1.5",
          closeButton:
            "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]",
        },
      }}
    />
  );
}
