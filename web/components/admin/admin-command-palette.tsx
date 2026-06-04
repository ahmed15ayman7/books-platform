"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import {
  BookOpen,
  Building2,
  FileText,
  Loader2,
  Search,
  User,
  Video,
  X,
} from "lucide-react";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import {
  adminArticleEditPath,
  adminAuthorEditPath,
  adminBookEditPath,
  adminMediaEditPath,
  adminPublisherEditPath,
} from "@/lib/admin/public-urls";
import { modKeyLabel } from "@/lib/admin/shortcut-labels";
import { useAdminChrome } from "@/lib/admin/admin-chrome-context";

interface SearchBook {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  imageUrl: string | null;
}

interface SearchArticle {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  channel: string | null;
  imageUrl: string | null;
}

interface SearchPublisher {
  id: string;
  slug: string;
  title: string;
  name: string;
  nameAr: string | null;
  imageUrl: string | null;
}

interface SearchAuthor {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
}

interface AdminSearchResults {
  books: SearchBook[];
  articles: SearchArticle[];
  media: SearchArticle[];
  publishers: SearchPublisher[];
  authors: SearchAuthor[];
}

const emptyResults: AdminSearchResults = {
  books: [],
  articles: [],
  media: [],
  publishers: [],
  authors: [],
};

interface SearchSection {
  key: string;
  label: string;
  icon: typeof BookOpen;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    imageUrl?: string | null;
  }>;
}

function ResultThumb({ src, alt, icon: Icon }: { src?: string | null; alt: string; icon: typeof BookOpen }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
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
        <Icon className="h-4 w-4 text-[var(--admin-text-subtle)]" aria-hidden />
      )}
    </div>
  );
}

export function AdminCommandPalette() {
  const { searchOpen, closeSearch } = useAdminChrome();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResults>(emptyResults);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setQuery("");
    setResults(emptyResults);
    setLoading(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    reset();
  }, [searchOpen, reset]);

  const fetchResults = useDebouncedCallback(async (q: string) => {
    abortRef.current?.abort();
    if (q.trim().length < 2) {
      setResults(emptyResults);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/admin/search?q=${encodeURIComponent(q.trim())}`, {
        headers: adminAuthHeaders(),
        signal: controller.signal,
      });
      const data = (await res.json()) as { success: boolean; data?: AdminSearchResults };
      if (!controller.signal.aborted && data.success && data.data) {
        setResults(data.data);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, 220);

  useEffect(() => {
    void fetchResults(query);
  }, [query, fetchResults]);

  const sections = useMemo((): SearchSection[] => {
    const bookItems = results.books.map((b) => ({
      id: b.id,
      title: b.nameAr ?? b.nameEn,
      subtitle: b.slug,
      href: adminBookEditPath(locale, b.id),
      imageUrl: b.imageUrl,
    }));

    const articleItems = results.articles.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.slug,
      href: adminArticleEditPath(locale, a.id, a.channel),
      imageUrl: a.imageUrl,
    }));

    const mediaItems = results.media.map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: m.channel ?? m.slug,
      href: adminMediaEditPath(locale, m.id),
      imageUrl: m.imageUrl,
    }));

    const publisherItems = results.publishers.map((p) => ({
      id: p.id,
      title: p.nameAr ?? p.title ?? p.name,
      subtitle: p.slug,
      href: adminPublisherEditPath(locale, p.id),
      imageUrl: p.imageUrl,
    }));

    const authorItems = results.authors.map((a) => ({
      id: a.id,
      title: a.nameAr ?? a.name,
      subtitle: a.slug,
      href: adminAuthorEditPath(locale, a.id),
    }));

    return [
      { key: "books", label: "الكتب", icon: BookOpen, items: bookItems },
      { key: "articles", label: "المقالات", icon: FileText, items: articleItems },
      { key: "media", label: "الميديا", icon: Video, items: mediaItems },
      { key: "publishers", label: "الناشرون", icon: Building2, items: publisherItems },
      { key: "authors", label: "المؤلفون", icon: User, items: authorItems },
    ].filter((s) => s.items.length > 0);
  }, [locale, results]);

  const hasQuery = query.trim().length >= 2;
  const showEmpty = hasQuery && !loading && sections.length === 0;
  const colCount = Math.max(sections.length, 1);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.button
            type="button"
            aria-label="إغلاق البحث"
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="بحث لوحة التحكم"
            className="fixed inset-x-0 top-14 z-[95] mx-auto w-full max-w-5xl px-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
          >
            <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[var(--admin-border)] px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-[var(--admin-text-subtle)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن كتاب، مقال، ميديا، ناشر، مؤلف..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-subtle)]"
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeSearch();
                  }}
                />
                {loading && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--admin-text-subtle)]" />
                )}
                <kbd className="hidden rounded border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-1.5 py-0.5 text-[10px] text-[var(--admin-text-subtle)] sm:inline">
                  {modKeyLabel()}K
                </kbd>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--admin-text-subtle)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                  aria-label="إغلاق"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[min(70vh,520px)] overflow-y-auto p-4">
                {!hasQuery && (
                  <p className="py-8 text-center text-sm text-[var(--admin-text-subtle)]">
                    اكتب حرفين على الأقل للبحث في كل أقسام لوحة التحكم
                  </p>
                )}

                {showEmpty && (
                  <p className="py-8 text-center text-sm text-[var(--admin-text-subtle)]">
                    لا توجد نتائج لـ «{query.trim()}»
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
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className="min-w-0 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)]/50"
                        >
                          <header className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-2">
                            <section.icon className="h-3.5 w-3.5 text-[var(--admin-accent)]" />
                            <h3 className="text-xs font-semibold text-[var(--admin-text)]">{section.label}</h3>
                            <span className="ms-auto rounded-full bg-[var(--admin-surface)] px-1.5 py-0.5 text-[10px] text-[var(--admin-text-subtle)]">
                              {section.items.length}
                            </span>
                          </header>
                          <ul className="divide-y divide-[var(--admin-border)]/60">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={item.href}
                                  onClick={() => closeSearch()}
                                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--admin-hover)]"
                                >
                                  <ResultThumb src={item.imageUrl} alt="" icon={section.icon} />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                                      {item.title}
                                    </p>
                                    {item.subtitle && (
                                      <p className="truncate text-xs text-[var(--admin-text-subtle)]" dir="ltr">
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

              <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--admin-border)] px-4 py-2 text-[11px] text-[var(--admin-text-subtle)]">
                <span>
                  <kbd className="rounded border border-[var(--admin-border)] px-1">{modKeyLabel()}S</kbd> حفظ
                </span>
                <span>
                  <kbd className="rounded border border-[var(--admin-border)] px-1">{modKeyLabel()}D</kbd> مسودة
                </span>
                <span>
                  <kbd className="rounded border border-[var(--admin-border)] px-1">Esc</kbd> إغلاق
                </span>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
