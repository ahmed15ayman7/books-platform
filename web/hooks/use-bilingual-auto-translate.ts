"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { translateFieldText, type TranslateLang } from "@/lib/translation/translate-client";

interface UseBilingualAutoTranslateOptions {
  ar: string;
  en: string;
  onArChange: (value: string) => void;
  onEnChange: (value: string) => void;
  enabled?: boolean;
  debounceMs?: number;
}

export function useBilingualAutoTranslate({
  ar,
  en,
  onArChange,
  onEnChange,
  enabled = true,
  debounceMs = 900,
}: UseBilingualAutoTranslateOptions) {
  const [translating, setTranslating] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const lastAutoAr = useRef<string | null>(null);
  const lastAutoEn = useRef<string | null>(null);
  const requestId = useRef(0);

  const canOverwriteEn = useCallback(
    () => !en.trim() || en === lastAutoEn.current,
    [en],
  );

  const canOverwriteAr = useCallback(
    () => !ar.trim() || ar === lastAutoAr.current,
    [ar],
  );

  const runTranslate = useCallback(
    async (text: string, from: TranslateLang, to: TranslateLang) => {
      if (!text.trim() || !autoEnabled || !enabled) return null;

      const id = ++requestId.current;
      setTranslating(true);
      try {
        const translated = await translateFieldText(text, from, to);
        if (id !== requestId.current) return null;
        return translated;
      } catch {
        return null;
      } finally {
        if (id === requestId.current) setTranslating(false);
      }
    },
    [autoEnabled, enabled],
  );

  const debouncedArToEn = useDebouncedCallback(async (text: string) => {
    if (!canOverwriteEn()) return;
    const translated = await runTranslate(text, "ar", "en");
    if (translated != null) {
      lastAutoEn.current = translated;
      onEnChange(translated);
    }
  }, debounceMs);

  const debouncedEnToAr = useDebouncedCallback(async (text: string) => {
    if (!canOverwriteAr()) return;
    const translated = await runTranslate(text, "en", "ar");
    if (translated != null) {
      lastAutoAr.current = translated;
      onArChange(translated);
    }
  }, debounceMs);

  useEffect(() => () => {
    debouncedArToEn.cancel();
    debouncedEnToAr.cancel();
  }, [debouncedArToEn, debouncedEnToAr]);

  const handleArChange = useCallback(
    (value: string) => {
      onArChange(value);
      if (value.trim()) debouncedArToEn(value);
    },
    [onArChange, debouncedArToEn],
  );

  const handleEnChange = useCallback(
    (value: string) => {
      onEnChange(value);
      if (value.trim()) debouncedEnToAr(value);
    },
    [onEnChange, debouncedEnToAr],
  );

  const forceTranslateArToEn = useCallback(async () => {
    const translated = await runTranslate(ar, "ar", "en");
    if (translated != null) {
      lastAutoEn.current = translated;
      onEnChange(translated);
    }
  }, [ar, onEnChange, runTranslate]);

  const forceTranslateEnToAr = useCallback(async () => {
    const translated = await runTranslate(en, "en", "ar");
    if (translated != null) {
      lastAutoAr.current = translated;
      onArChange(translated);
    }
  }, [en, onArChange, runTranslate]);

  return {
    translating,
    autoEnabled,
    setAutoEnabled,
    handleArChange,
    handleEnChange,
    forceTranslateArToEn,
    forceTranslateEnToAr,
  };
}
