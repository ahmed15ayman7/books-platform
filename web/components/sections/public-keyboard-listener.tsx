"use client";

import { useEffect } from "react";
import { usePublicChrome } from "@/lib/public/public-chrome-context";

function isModKey(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey;
}

export function PublicKeyboardListener() {
  const { openSearch, closeSearch, searchOpen } = usePublicChrome();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isModKey(e) || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      if (searchOpen) closeSearch();
      else openSearch();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, openSearch, searchOpen]);

  return null;
}
