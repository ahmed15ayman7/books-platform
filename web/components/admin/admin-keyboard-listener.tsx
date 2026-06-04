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
      if (!isModKey(e)) return;

      const key = e.key.toLowerCase();

      if (key === "k") {
        e.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
        return;
      }

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

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, openSearch, searchOpen, triggerSave, triggerSaveDraft]);

  return null;
}
