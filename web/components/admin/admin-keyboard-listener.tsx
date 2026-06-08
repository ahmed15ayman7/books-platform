"use client";

import { useEffect } from "react";
import { useAdminChrome } from "@/lib/admin/admin-chrome-context";

function isModKey(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey;
}

export function AdminKeyboardListener() {
  const { openSearch, closeSearch, searchOpen, triggerSave, triggerSaveDraft } = useAdminChrome();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();

      if (key === "k" && e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
        return;
      }

      if (!isModKey(e)) return;

      if (key === "s") {
        e.preventDefault();
        triggerSave();
        return;
      }

      if (key === "d") {
        e.preventDefault();
        triggerSaveDraft();
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [closeSearch, openSearch, searchOpen, triggerSave, triggerSaveDraft]);

  return null;
}
