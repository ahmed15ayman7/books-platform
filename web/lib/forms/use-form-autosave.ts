"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface UseFormAutosaveOptions<T extends Record<string, unknown>> {
  formId: string;
  values: T;
  enabled?: boolean;
  debounceMs?: number;
  canSyncToServer?: (values: T) => boolean;
  onServerSave?: (values: T) => Promise<void>;
}

function storageKey(formId: string) {
  return `form-autosave:${formId}`;
}

export function loadLocalFormValues<T>(formId: string): T | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(formId));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useFormAutosave<T extends Record<string, unknown>>({
  formId,
  values,
  enabled = true,
  debounceMs = 600,
  canSyncToServer,
  onServerSave,
}: UseFormAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const persist = useCallback(async (nextValues: T) => {
    if (!enabled) return;

    const serialized = JSON.stringify(nextValues);
    if (serialized === lastSavedRef.current) return;

    try {
      localStorage.setItem(storageKey(formId), serialized);
    } catch {
      // ignore quota errors
    }

    if (!onServerSave || !canSyncToServer?.(nextValues)) {
      lastSavedRef.current = serialized;
      setStatus("saved");
      return;
    }

    setStatus("saving");
    try {
      await onServerSave(nextValues);
      if (!mountedRef.current) return;
      lastSavedRef.current = serialized;
      setStatus("saved");
    } catch {
      if (!mountedRef.current) return;
      setStatus("error");
    }
  }, [canSyncToServer, enabled, formId, onServerSave]);

  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void persist(values);
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [values, debounceMs, enabled, persist]);

  return { status };
}
