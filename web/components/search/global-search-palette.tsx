"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchPaletteTheme } from "@/lib/search/palette-themes";

export interface SearchPaletteSection {
  key: string;
  label: string;
  icon: LucideIcon;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    imageUrl?: string | null;
  }>;
}

interface GlobalSearchPaletteProps {
  open: boolean;
  onClose: () => void;
  theme: SearchPaletteTheme;
  placeholder: string;
  emptyHint: string;
  noResultsHint?: (query: string) => string;
  ariaLabel: string;
  topClassName?: string;
  modKeyLabel?: string;
  footer?: ReactNode;
  showSectionCounts?: boolean;
  fetchResults: (query: string, signal: AbortSignal) => Promise<SearchPaletteSection[]>;
}

function ResultThumb({
  src,
  alt,
  icon: Icon,
  theme,
}: {
  src?: string | null;
  alt: string;
  icon: LucideIcon;
  theme: SearchPaletteTheme;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        theme.thumb,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon className={cn("h-4 w-4", theme.thumbIcon)} aria-hidden />
      )}
    </div>
  );
}

export function GlobalSearchPalette({
  open,
  onClose,
  theme,
  placeholder,
  emptyHint,
  noResultsHint,
  ariaLabel,
  topClassName = "top-[max(5rem,10vh)]",
  modKeyLabel,
  footer,
  showSectionCounts = true,
  fetchResults,
}: GlobalSearchPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [sections, setSections] = useState<SearchPaletteSection[]>([]);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setQuery("");
    setSections([]);
    setLoading(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    reset();
  }, [open, reset]);

  useEffect(() => {
    abortRef.current?.abort();
    if (!open || query.trim().length < 2) {
      setSections([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const timer = window.setTimeout(() => {
      void fetchResults(query.trim(), controller.signal)
        .then((next) => {
          if (!controller.signal.aborted) setSections(next);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query, fetchResults]);

  const hasQuery = query.trim().length >= 2;
  const showEmpty = hasQuery && !loading && sections.length === 0;
  const colCount = Math.max(sections.length, 1);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            className={cn("fixed inset-0 z-[200]", theme.overlay)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={cn(
              "fixed inset-x-0 z-[210] mx-auto w-full max-w-5xl px-4",
              topClassName,
            )}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.75 }}
          >
            <div
              className={cn(
                "overflow-hidden rounded-2xl border",
                theme.panel,
                theme.panelShadow,
              )}
            >
              <div className={cn("flex items-center gap-3 border-b px-4 py-3.5", theme.header)}>
                <Search className={cn("h-4 w-4 shrink-0", theme.icon)} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className={cn(
                    "min-w-0 flex-1 bg-transparent text-sm outline-none",
                    theme.input,
                    theme.inputPlaceholder,
                  )}
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") onClose();
                  }}
                />
                {loading && (
                  <Loader2 className={cn("h-4 w-4 shrink-0 animate-spin", theme.icon)} />
                )}
                {modKeyLabel && (
                  <kbd
                    className={cn(
                      "hidden rounded border px-1.5 py-0.5 text-[10px] sm:inline",
                      theme.kbd,
                    )}
                  >
                    {modKeyLabel}K
                  </kbd>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    theme.closeBtn,
                  )}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[min(68vh,520px)] overflow-y-auto p-4">
                {!hasQuery && (
                  <p className={cn("py-10 text-center text-sm", theme.empty)}>{emptyHint}</p>
                )}

                {showEmpty && (
                  <p className={cn("py-10 text-center text-sm", theme.empty)}>
                    {noResultsHint?.(query.trim()) ?? query.trim()}
                  </p>
                )}

                {sections.length > 0 && (
                  <motion.div
                    layout
                    className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(var(--search-cols),minmax(0,1fr))]"
                    style={{ "--search-cols": String(colCount) } as CSSProperties}
                  >
                    <AnimatePresence mode="popLayout">
                      {sections.map((section) => (
                        <motion.section
                          key={section.key}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className={cn("min-w-0 rounded-xl border", theme.section)}
                        >
                          <header
                            className={cn(
                              "flex items-center gap-2 border-b px-3 py-2.5",
                              theme.sectionHeader,
                            )}
                          >
                            <section.icon className={cn("h-3.5 w-3.5", theme.sectionIcon)} />
                            <h3 className={cn("text-xs font-semibold", theme.sectionTitle)}>
                              {section.label}
                            </h3>
                            {showSectionCounts && (
                              <span
                                className={cn(
                                  "ms-auto rounded-full px-1.5 py-0.5 text-[10px]",
                                  theme.sectionBadge,
                                )}
                              >
                                {section.items.length}
                              </span>
                            )}
                          </header>
                          <ul className={cn("divide-y", theme.divider)}>
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 transition-colors",
                                    theme.itemHover,
                                  )}
                                >
                                  <ResultThumb
                                    src={item.imageUrl}
                                    alt=""
                                    icon={section.icon}
                                    theme={theme}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={cn(
                                        "truncate text-sm font-medium",
                                        theme.itemTitle,
                                      )}
                                    >
                                      {item.title}
                                    </p>
                                    {item.subtitle && (
                                      <p
                                        className={cn(
                                          "truncate text-xs",
                                          theme.itemSubtitle,
                                        )}
                                        dir="ltr"
                                      >
                                        {item.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.section>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {footer && (
                <footer className={cn("flex flex-wrap items-center gap-3 border-t px-4 py-2.5 text-[11px]", theme.footer)}>
                  {footer}
                </footer>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
