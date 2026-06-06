"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

function isModKey(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey;
}

export function PublicKeyboardListener() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isModKey(e) || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      router.push(`/${locale}/search`);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locale, router]);

  return null;
}
