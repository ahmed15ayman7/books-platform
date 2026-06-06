"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PublicChromeContextValue {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const PublicChromeContext = createContext<PublicChromeContextValue | null>(null);

export function PublicChromeProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const value = useMemo(
    () => ({
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      toggleSearch: () => setSearchOpen((v) => !v),
    }),
    [searchOpen],
  );

  return (
    <PublicChromeContext.Provider value={value}>{children}</PublicChromeContext.Provider>
  );
}

export function usePublicChrome() {
  const ctx = useContext(PublicChromeContext);
  if (!ctx) {
    throw new Error("usePublicChrome must be used within PublicChromeProvider");
  }
  return ctx;
}

export function usePublicChromeOptional() {
  return useContext(PublicChromeContext);
}
