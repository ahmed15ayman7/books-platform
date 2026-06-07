"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface PublisherCountryOption {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
}

interface PublisherCountryFilterProps {
  locale: Locale;
  countries: PublisherCountryOption[];
  activeCountry?: string;
  searchQuery?: string;
  visibleCount?: number;
}

const STORAGE_KEY = "publishers-country-visible-slugs";
const PANEL_WIDTH = 320;
const PANEL_MAX_HEIGHT = 288;

function countryLabel(country: PublisherCountryOption, locale: Locale): string {
  return locale === "ar" && country.nameAr ? country.nameAr : country.name;
}

function countryMatchesQuery(country: PublisherCountryOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [country.name, country.nameAr, country.slug].filter(Boolean).join(" ").toLowerCase();
  return q.split(/\s+/).every((part) => haystack.includes(part));
}

function buildVisibleSlugs(
  countries: PublisherCountryOption[],
  stored: string[] | null,
  activeSlug: string | undefined,
  visibleCount: number,
): string[] {
  const allSlugs = countries.map((c) => c.slug);
  if (allSlugs.length === 0) return [];

  let visible = (stored ?? [])
    .filter((slug) => allSlugs.includes(slug))
    .slice(0, visibleCount);

  if (visible.length === 0) {
    visible = allSlugs.slice(0, visibleCount);
  }

  if (activeSlug && allSlugs.includes(activeSlug) && !visible.includes(activeSlug)) {
    visible = [activeSlug, ...visible.filter((s) => s !== activeSlug).slice(0, visibleCount - 1)];
  }

  while (visible.length < Math.min(visibleCount, allSlugs.length)) {
    const next = allSlugs.find((slug) => !visible.includes(slug));
    if (!next) break;
    visible.push(next);
  }

  return visible.slice(0, visibleCount);
}

function slugsEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((slug, index) => slug === b[index]);
}

function promoteSlug(current: string[], slug: string, visibleCount: number): string[] {
  const without = current.filter((s) => s !== slug);
  return [slug, ...without].slice(0, visibleCount);
}

function chipClass(active: boolean): string {
  return cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    active
      ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
      : "border-[var(--brand-gray-300)] bg-white text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]",
  );
}

function computePanelStyle(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(PANEL_WIDTH, window.innerWidth - 16);
  const margin = 8;

  let top = rect.bottom + margin;
  if (top + PANEL_MAX_HEIGHT > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - PANEL_MAX_HEIGHT - margin);
  }

  let left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = window.innerWidth - width - margin;
  }
  left = Math.max(margin, left);

  return {
    position: "fixed",
    top,
    left,
    width,
    zIndex: 300,
  };
}

export function PublisherCountryFilter({
  locale,
  countries,
  activeCountry,
  searchQuery,
  visibleCount = 15,
}: PublisherCountryFilterProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipStorageWriteRef = useRef(true);

  const countrySlugsKey = useMemo(
    () => countries.map((country) => country.slug).join("\0"),
    [countries],
  );

  const [visibleSlugs, setVisibleSlugs] = useState<string[]>(() =>
    buildVisibleSlugs(countries, null, activeCountry, visibleCount),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let stored: string[] | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as string[];
    } catch {
      stored = null;
    }

    const next = buildVisibleSlugs(countries, stored, activeCountry, visibleCount);
    skipStorageWriteRef.current = true;
    setVisibleSlugs((prev) => (slugsEqual(prev, next) ? prev : next));
  }, [countrySlugsKey, activeCountry, visibleCount, countries]);

  useEffect(() => {
    if (skipStorageWriteRef.current) {
      skipStorageWriteRef.current = false;
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visibleSlugs));
    } catch {
      /* ignore */
    }
  }, [visibleSlugs]);

  const repositionPanel = useCallback(() => {
    if (!triggerRef.current) return;
    const nextStyle = computePanelStyle(triggerRef.current);
    setPanelStyle((prev) => {
      if (
        prev.top === nextStyle.top &&
        prev.left === nextStyle.left &&
        prev.width === nextStyle.width
      ) {
        return prev;
      }
      return nextStyle;
    });
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;

    repositionPanel();
    inputRef.current?.focus({ preventScroll: true });

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setPickerOpen(false);
      setQuery("");
    };

    let rafId = 0;
    const onReposition = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(repositionPanel);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onReposition);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onReposition);
    };
  }, [pickerOpen, repositionPanel]);

  useEffect(() => {
    if (!pickerOpen) setQuery("");
  }, [pickerOpen]);

  const countryBySlug = useMemo(
    () => new Map(countries.map((country) => [country.slug, country])),
    [countrySlugsKey, countries],
  );

  const visibleCountries = useMemo(
    () =>
      visibleSlugs
        .map((slug) => countryBySlug.get(slug))
        .filter((country): country is PublisherCountryOption => Boolean(country)),
    [visibleSlugs, countryBySlug],
  );

  const hiddenCountries = useMemo(
    () => countries.filter((country) => !visibleSlugs.includes(country.slug)),
    [countries, visibleSlugs],
  );

  const hiddenCount = hiddenCountries.length;

  const filteredHidden = useMemo(
    () => hiddenCountries.filter((country) => countryMatchesQuery(country, query)),
    [hiddenCountries, query],
  );

  const baseHref = `/${locale}/publishers`;
  const searchSuffix = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

  const navigateToCountry = useCallback(
    (slug: string) => {
      const href = `${baseHref}?country=${encodeURIComponent(slug)}${searchSuffix}`;
      router.push(href);
    },
    [baseHref, router, searchSuffix],
  );

  function handleSelectHiddenCountry(slug: string) {
    setVisibleSlugs((prev) => promoteSlug(prev, slug, visibleCount));
    setPickerOpen(false);
    navigateToCountry(slug);
  }

  if (countries.length === 0) return null;

  const pickerPanel =
    pickerOpen && mounted ? (
      <>
        <button
          type="button"
          aria-label={isAr ? "إغلاق" : "Close"}
          className="fixed inset-0 z-[290] cursor-default bg-black/20"
          onClick={() => setPickerOpen(false)}
        />
        <div
          ref={panelRef}
          id={listId}
          style={panelStyle}
          className="overflow-hidden rounded-xl border border-[var(--brand-gray-300)] bg-white shadow-2xl ring-1 ring-black/5"
          role="dialog"
          aria-label={isAr ? "اختر دولة" : "Choose country"}
        >
          <div className="border-b border-[var(--brand-gray-200)] bg-white p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-gray-400)]"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن دولة..." : "Search countries..."}
                className="w-full rounded-md border border-[var(--brand-gray-300)] bg-white py-2 pe-3 ps-9 text-sm text-[var(--brand-gray-900)] outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)]"
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto bg-white py-1" role="listbox">
            {filteredHidden.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--brand-gray-500)]">
                {isAr ? "لا توجد نتائج" : "No results"}
              </li>
            ) : (
              filteredHidden.map((country) => (
                <li key={country.id} role="option">
                  <button
                    type="button"
                    onClick={() => handleSelectHiddenCountry(country.slug)}
                    className="flex w-full flex-col bg-white px-3 py-2 text-start text-sm text-[var(--brand-gray-900)] hover:bg-[var(--brand-gray-100)]"
                  >
                    <span>{countryLabel(country, locale)}</span>
                    {country.nameAr && country.name && countryLabel(country, locale) !== country.name && (
                      <span className="text-xs text-[var(--brand-gray-500)]">{country.name}</span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    ) : null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href={searchQuery ? `${baseHref}?search=${encodeURIComponent(searchQuery)}` : baseHref}
          className={chipClass(!activeCountry)}
        >
          {isAr ? "الكل" : "All"}
        </Link>

        {visibleCountries.map((country) => (
          <Link
            key={country.id}
            href={`${baseHref}?country=${encodeURIComponent(country.slug)}${searchSuffix}`}
            className={chipClass(activeCountry === country.slug)}
          >
            {countryLabel(country, locale)}
          </Link>
        ))}

        {hiddenCount > 0 && (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className={cn(
              chipClass(false),
              "inline-flex items-center gap-1",
              pickerOpen && "border-[var(--brand-red)] text-[var(--brand-red)]",
            )}
            aria-expanded={pickerOpen}
            aria-controls={listId}
          >
            +{hiddenCount.toLocaleString(isAr ? "ar-EG" : "en-US")}
          </button>
        )}
      </div>

      {mounted && pickerPanel ? createPortal(pickerPanel, document.body) : null}
    </>
  );
}
