"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminViewMode } from "./list-query";

export function useAdminViewMode(storageKey: string, defaultMode: AdminViewMode = "table") {
  const [viewMode, setViewModeState] = useState<AdminViewMode>(defaultMode);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`admin-view:${storageKey}`);
      if (stored === "grid" || stored === "table") {
        setViewModeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const setViewMode = useCallback(
    (mode: AdminViewMode) => {
      setViewModeState(mode);
      try {
        localStorage.setItem(`admin-view:${storageKey}`, mode);
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  return { viewMode, setViewMode };
}
