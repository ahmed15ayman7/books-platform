"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface AdminFormActions {
  onSave?: () => void;
  onSaveDraft?: () => void;
}

interface AdminChromeContextValue {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  registerFormActions: (actions: AdminFormActions) => () => void;
  triggerSave: () => void;
  triggerSaveDraft: () => void;
}

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function AdminChromeProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const formActionsRef = useRef<AdminFormActions>({});

  const registerFormActions = useCallback((actions: AdminFormActions) => {
    formActionsRef.current = actions;
    return () => {
      if (formActionsRef.current === actions) {
        formActionsRef.current = {};
      }
    };
  }, []);

  const triggerSave = useCallback(() => {
    if (formActionsRef.current.onSave) {
      formActionsRef.current.onSave();
      return;
    }
    const form = document.querySelector<HTMLFormElement>(
      "main form[data-admin-save-form]",
    );
    form?.requestSubmit();
  }, []);

  const triggerSaveDraft = useCallback(() => {
    if (formActionsRef.current.onSaveDraft) {
      formActionsRef.current.onSaveDraft();
      return;
    }
    const draftBtn = document.querySelector<HTMLButtonElement>(
      "main [data-admin-save-draft]",
    );
    draftBtn?.click();
  }, []);

  const value = useMemo(
    () => ({
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      toggleSearch: () => setSearchOpen((v) => !v),
      registerFormActions,
      triggerSave,
      triggerSaveDraft,
    }),
    [searchOpen, registerFormActions, triggerSave, triggerSaveDraft],
  );

  return (
    <AdminChromeContext.Provider value={value}>{children}</AdminChromeContext.Provider>
  );
}

export function useAdminChrome() {
  const ctx = useContext(AdminChromeContext);
  if (!ctx) {
    throw new Error("useAdminChrome must be used within AdminChromeProvider");
  }
  return ctx;
}

export function useAdminChromeOptional() {
  return useContext(AdminChromeContext);
}
