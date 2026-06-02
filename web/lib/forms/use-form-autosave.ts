"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface UseFormAutosaveOptions<T extends object> {
  formId: string;
  values: T;
  enabled?: boolean;
  debounceMs?: number;
  canSyncToServer?: (values: T) => boolean;
  onServerSave?: (values: T) => Promise<void>;
}

const SENSITIVE_KEY = /password|token|secret|credential/i;

function storageKey(formId: string) {
  return `form-autosave:${formId}`;
}

function sanitizeForDraft<T extends object>(values: T): T {
  const out = { ...values } as Record<string, unknown>;
  for (const key of Object.keys(out)) {
    if (SENSITIVE_KEY.test(key)) {
      delete out[key];
    }
  }
  return out as T;
}

export function clearFormDraft(formId: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(storageKey(formId));
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

export function useFormAutosave<T extends object>({
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

    const safe = sanitizeForDraft(nextValues);
    const serialized = JSON.stringify(safe);
    if (serialized === lastSavedRef.current) return;

    try {
      localStorage.setItem(storageKey(formId), serialized);
    } catch {
      // ignore quota errors
    }

    if (!onServerSave || !canSyncToServer?.(safe)) {
      lastSavedRef.current = serialized;
      setStatus("saved");
      return;
    }

    setStatus("saving");
    try {
      await onServerSave(safe);
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

interface UseFormDraftOptions {
  /** Wait until async load completes before checking/restoring drafts */
  ready?: boolean;
  /** When false, draft check resets (e.g. closed dialog) */
  enabled?: boolean;
  debounceMs?: number;
  canSyncToServer?: (values: object) => boolean;
  onServerSave?: (values: object) => Promise<void>;
}

export function useFormDraft<T extends object>(
  formId: string,
  values: T,
  setValues: (values: T) => void,
  options: UseFormDraftOptions = {},
) {
  const {
    ready = true,
    enabled = true,
    debounceMs,
    canSyncToServer,
    onServerSave,
  } = options;

  const [pendingDraft, setPendingDraft] = useState<boolean | null>(null);
  const checkedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !enabled) {
      checkedForRef.current = null;
      return;
    }
    if (checkedForRef.current === formId) return;
    checkedForRef.current = formId;
    const saved = loadLocalFormValues<T>(formId);
    setPendingDraft(saved !== null);
  }, [ready, enabled, formId]);

  const autosaveEnabled = enabled && ready && pendingDraft === false;

  const { status } = useFormAutosave({
    formId,
    values,
    enabled: autosaveEnabled,
    debounceMs,
    canSyncToServer,
    onServerSave,
  });

  const resume = useCallback(() => {
    const saved = loadLocalFormValues<T>(formId);
    if (saved) setValues(saved);
    setPendingDraft(false);
  }, [formId, setValues]);

  const dismiss = useCallback(() => {
    clearFormDraft(formId);
    setPendingDraft(false);
  }, [formId]);

  const clearDraft = useCallback(() => {
    clearFormDraft(formId);
    setPendingDraft(false);
  }, [formId]);

  return {
    status: autosaveEnabled ? status : ("idle" as AutosaveStatus),
    showBanner: pendingDraft === true,
    resume,
    dismiss,
    clearDraft,
  };
}

/** Build stable draft keys across the app */
export const formDraftId = {
  publish: (draftId?: string | null) => `public:publish:${draftId ?? "new"}`,
  contact: () => "public:contact",
  newsletter: () => "public:newsletter",
  adminBook: (id?: string | null) => `admin:book:${id ?? "new"}`,
  adminArticle: (id: string) => `admin:article:${id}`,
  adminPublisher: (id: string) => `admin:publisher:${id}`,
  adminCategory: (id?: string | null) => `admin:category:${id ?? "new"}`,
  adminAuthor: (id?: string | null) => `admin:author:${id ?? "new"}`,
  adminPublisherDialog: (id?: string | null) => `admin:publisher-dialog:${id ?? "new"}`,
  adminCategoryDialog: () => "admin:category-dialog",
  adminHomeSlide: (id?: string | null) => `admin:home-slide:${id ?? "new"}`,
  adminB2b: (id?: string | null) => `admin:b2b:${id ?? "new"}`,
  adminAmbassador: (id?: string | null) => `admin:ambassador:${id ?? "new"}`,
  adminPage: (id: string) => `admin:page:${id}`,
  adminPlatformSettings: () => "admin:settings:platform",
  adminNotificationSettings: () => "admin:settings:notifications",
  adminAccountProfile: () => "admin:settings:account-profile",
  adminUser: (id?: string | null) => `admin:user:${id ?? "new"}`,
  adminNewsletterCampaign: () => "admin:newsletter:campaign",
  adminNotificationBroadcast: () => "admin:notifications:broadcast",
};
