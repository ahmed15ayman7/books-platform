"use client";

import { useEffect, useRef } from "react";
import { useAdminChromeOptional } from "@/lib/admin/admin-chrome-context";

interface UseAdminFormShortcutsOptions {
  onSave: () => void;
  onSaveDraft?: () => void;
  enabled?: boolean;
}

export function useAdminFormShortcuts({
  onSave,
  onSaveDraft,
  enabled = true,
}: UseAdminFormShortcutsOptions) {
  const chrome = useAdminChromeOptional();
  const onSaveRef = useRef(onSave);
  const onSaveDraftRef = useRef(onSaveDraft);

  onSaveRef.current = onSave;
  onSaveDraftRef.current = onSaveDraft;

  useEffect(() => {
    if (!enabled || !chrome) return;

    return chrome.registerFormActions({
      onSave: () => onSaveRef.current(),
      onSaveDraft: onSaveDraftRef.current
        ? () => onSaveDraftRef.current?.()
        : undefined,
    });
  }, [chrome, enabled]);
}
