"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { BooksPagination } from "@/components/sections/books-pagination";
import {
  GlobalSearchResults,
  SearchSectionTabs,
} from "@/components/sections/global-search/global-search-results";
import { SearchSectionFilters } from "@/components/sections/global-search/search-section-filters";
import type { Locale } from "@/lib/i18n";
import type { GlobalSearchResult, SearchSectionType } from "@/lib/search/search-types";
import { parseSearchSectionType } from "@/lib/search/search-types";

interface CategoryOption {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
}

interface CountryOption {
  slug: string;
  name: string;
  nameAr?: string | null;
}

interface GlobalSearchPageProps {
  locale: Locale;
  bookCategories: CategoryOption[];
  articleCategories: CategoryOption[];
  countries: CountryOption[];
  initialQuery: string;
  initialType: SearchSectionType;
}

export function GlobalSearchPageClient({
  locale,
  bookCategories,
  articleCategories,
  countries,
  initialQuery,
  initialType,
}: GlobalSearchPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [data, setData] = useState<GlobalSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("q")?.trim() ?? "";
  const type = parseSearchSectionType(searchParams.get("type") ?? initialType);

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const fetchResults = async () => {
      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("q")) params.set("q", query);
      try {
        const res = await fetch(`/api/v1/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const json = await res.json();
        setData(json.data ?? json);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchResults();
    return () => controller.abort();
  }, [query, searchParams]);

  function handleInputChange(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ q: value.trim() || null, page: null });
    }, 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushParams({ q: inputValue.trim() || null, page: null });
  }

  function handleSectionChange(nextType: SearchSectionType) {
    pushParams({
      type: nextType === "all" ? null : nextType,
      page: null,
      category: null,
      status: null,
      channel: null,
      country: null,
    });
  }

  function clearSearch() {
    setInputValue("");
    pushParams({ q: null, page: null });
    inputRef.current?.focus();
  }

  const pagination =
    data?.mode === "section"
      ? data.pagination
      : { page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false };

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <section className="relative overflow-hidden border-b border-[var(--brand-gray-200)] bg-gradient-to-br from-[var(--brand-gray-900)] via-[#2a1218] to-[var(--brand-gray-900)] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(177,30,46,0.45), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 40%)",
          }}
          aria-hidden="true"
        />
        <div className="container-platform relative py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isAr ? "بحث شامل في المنصة" : "Platform-wide search"}
            </div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              {isAr ? "ابحث في كل المحتوى" : "Search everything"}
            </h1>
            <p className="mt-2 text-sm text-white/75 md:text-base">
              {isAr
                ? "ابحث في العناوين والأوصاف والمحتوى — كتب، مقالات، فيديوهات، ناشرون، ومؤلفون"
                : "Search titles, descriptions, and content — books, articles, videos, publishers, and authors"}
            </p>

            <form onSubmit={handleSubmit} className="relative mt-8 flex items-center gap-2 justify-center">
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/20 transition-shadow focus-within:shadow-[0_0_0_4px_rgba(177,30,46,0.35)] flex-grow">
                <Search
                  className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-gray-400)] ${
                    isAr ? "end-4" : "start-4"
                  }`}
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) =>{
                    e.preventDefault();
                     handleInputChange(e.target.value)
                    }
                    }
                  placeholder={
                    isAr
                      ? "ابحث عن كتاب، مقال، ناشر، مؤلف..."
                      : "Search books, articles, publishers, authors..."
                  }
                  className={`h-14 w-full bg-transparent text-base text-[var(--brand-gray-900)] outline-none placeholder:text-[var(--brand-gray-400)] ${
                    isAr ? "pe-28 ps-12 text-right" : "ps-12 pe-28 text-left"
                  }`}
                  aria-label={isAr ? "بحث" : "Search"}
                  autoComplete="off"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--brand-gray-500)] hover:bg-[var(--brand-gray-100)] ${
                      isAr ? "start-24" : "end-24"
                    }`}
                    aria-label={isAr ? "مسح" : "Clear"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {/* <div
                  className={`absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 text-[10px] text-[var(--brand-gray-500)] sm:flex ${
                    isAr ? "start-4" : "end-4"
                  }`}
                >
                  <kbd className="rounded border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-1.5 py-0.5">
                    {searchShortcutKeyLabel()}
                  </kbd>
                </div> */}
              </div>
                <button
                  type="submit"
                  className={`rounded-xl bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-red-hover)] ${
                    isAr ? "ms-2" : "me-2"
                  }`}
                >
                  {isAr ? "بحث" : "Search"}
                </button>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="container-platform py-8">
        <div className="mb-6">
          <SearchSectionTabs locale={locale} active={type} onChange={handleSectionChange} />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {type !== "all" && (
            <aside className="w-full lg:w-64 lg:shrink-0">
              <SearchSectionFilters
                locale={locale}
                type={type}
                bookCategories={bookCategories}
                articleCategories={articleCategories}
                countries={countries}
              />
            </aside>
          )}

          <main className="min-w-0 flex-1">
            <GlobalSearchResults
              locale={locale}
              data={data}
              loading={loading && query.length >= 2}
              onSectionChange={handleSectionChange}
            />

            {data?.mode === "section" && pagination.totalPages > 1 && (
              <div className="mt-8">
                <BooksPagination pagination={pagination} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
