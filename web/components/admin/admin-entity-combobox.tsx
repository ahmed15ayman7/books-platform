"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { adminFieldClass } from "@/components/admin/admin-form-field";

export interface EntityOption {
  id: string;
  name: string;
  nameAr?: string | null;
  slug?: string;
}

interface AdminEntityComboboxProps {
  id: string;
  label: string;
  mode: "single" | "multi";
  options: EntityOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  getLabel: (o: EntityOption) => string;
  onCreateNew: (searchQuery: string) => void;
  onRemoteSearch?: (query: string) => Promise<EntityOption[]>;
  placeholder?: string;
  emptyLabel?: string;
  createLabel?: string;
}

function entitySearchText(o: EntityOption): string {
  return [o.name, o.nameAr, o.slug].filter(Boolean).join(" ").toLowerCase();
}

function entityMatchesQuery(o: EntityOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = entitySearchText(o);
  const parts = q.split(/\s+/).filter(Boolean);
  return parts.every((part) => haystack.includes(part));
}

function matchScore(o: EntityOption, query: string, getLabel: (o: EntityOption) => string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const label = getLabel(o).toLowerCase();
  const name = o.name.toLowerCase();
  const nameAr = (o.nameAr ?? "").toLowerCase();
  const slug = (o.slug ?? "").toLowerCase();

  if (label === q || name === q || nameAr === q || slug === q) return 100;
  if (label.startsWith(q) || name.startsWith(q) || nameAr.startsWith(q) || slug.startsWith(q)) return 80;
  if (entityMatchesQuery(o, q)) return 50;
  return 0;
}

function mergeOptions(base: EntityOption[], extra: EntityOption[]): EntityOption[] {
  const map = new Map<string, EntityOption>();
  for (const o of base) map.set(o.id, o);
  for (const o of extra) map.set(o.id, o);
  return Array.from(map.values());
}

export function AdminEntityCombobox({
  id,
  label,
  mode,
  options,
  value,
  onChange,
  getLabel,
  onCreateNew,
  onRemoteSearch,
  placeholder,
  emptyLabel = "لا توجد نتائج",
  createLabel = "إضافة جديد",
}: AdminEntityComboboxProps) {
  const [q, setQ] = useState("");
  const [remoteOptions, setRemoteOptions] = useState<EntityOption[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);

  const selectedIds = mode === "multi" ? (value as string[]) : value ? [value as string] : [];
  const query = q.trim();

  useEffect(() => {
    if (!onRemoteSearch || query.length < 2) {
      setRemoteOptions([]);
      setRemoteLoading(false);
      return;
    }

    let cancelled = false;
    setRemoteLoading(true);
    const timer = setTimeout(() => {
      void onRemoteSearch(query)
        .then((rows) => {
          if (!cancelled) setRemoteOptions(rows);
        })
        .catch(() => {
          if (!cancelled) setRemoteOptions([]);
        })
        .finally(() => {
          if (!cancelled) setRemoteLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [onRemoteSearch, query]);

  const pool = useMemo(
    () => mergeOptions(options, remoteOptions),
    [options, remoteOptions],
  );

  const filtered = useMemo(() => {
    const selected = pool.filter((o) => selectedIds.includes(o.id));

    if (!query) {
      return selected.length > 0 ? selected : pool.slice(0, 30);
    }

    const matched = pool
      .filter((o) => entityMatchesQuery(o, query))
      .sort((a, b) => matchScore(b, query, getLabel) - matchScore(a, query, getLabel));

    return mergeOptions(selected, matched).slice(0, 50);
  }, [pool, query, selectedIds, getLabel]);

  const showNoMatchCreate = query.length > 0 && filtered.length === 0 && !remoteLoading;

  const selectedItems = pool.filter((o) => selectedIds.includes(o.id));

  function toggleOption(optionId: string) {
    if (mode === "single") {
      onChange(optionId);
      return;
    }
    const ids = value as string[];
    onChange(
      ids.includes(optionId) ? ids.filter((id) => id !== optionId) : [...ids, optionId],
    );
  }

  function removeChip(optionId: string) {
    if (mode === "multi") {
      onChange((value as string[]).filter((id) => id !== optionId));
    } else {
      onChange("");
    }
  }

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--brand-gray-300)]">
        {label}
      </Label>

      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedItems.map((o) => (
            <span
              key={o.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-red-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-red)]"
            >
              {getLabel(o)}
              <button
                type="button"
                onClick={() => removeChip(o.id)}
                className="opacity-70 hover:opacity-100"
                aria-label="إزالة"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        id={id}
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? `ابحث بالاسم العربي أو الإنجليزي…`}
        className={cn(adminFieldClass, "mb-1")}
      />

      <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--admin-input-border)] bg-[var(--admin-surface)]">
        {remoteLoading && (
          <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-2 text-xs text-[var(--admin-text-subtle)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            جاري البحث…
          </div>
        )}

        {showNoMatchCreate && (
          <button
            type="button"
            onClick={() => onCreateNew(query)}
            className="flex w-full items-center gap-2 border-b border-[var(--admin-border)] bg-[var(--admin-accent-soft)] px-3 py-2.5 text-sm font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-hover)]"
          >
            <Plus className="h-4 w-4 shrink-0" />
            {createLabel}: «{query}»
          </button>
        )}

        {!query && filtered.length === 0 && !remoteLoading ? (
          <p className="px-3 py-2 text-xs text-[var(--admin-text-subtle)]">
            ابدأ بالكتابة للبحث عن {label}
          </p>
        ) : filtered.length === 0 && !showNoMatchCreate && !remoteLoading ? (
          <p className="px-3 py-2 text-xs text-[var(--admin-text-subtle)]">{emptyLabel}</p>
        ) : (
          filtered.map((o) => {
            const isSelected = selectedIds.includes(o.id);
            const secondary =
              o.nameAr && o.name && getLabel(o) !== o.name ? o.name : o.nameAr && getLabel(o) !== o.nameAr ? o.nameAr : null;

            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleOption(o.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border-b border-[var(--admin-border)] px-3 py-2 text-start text-sm last:border-0",
                  isSelected
                    ? "bg-[var(--admin-accent-soft)] text-[var(--admin-text)]"
                    : "text-[var(--admin-text)] hover:bg-[var(--admin-hover)]",
                )}
              >
                <span className="min-w-0 truncate">
                  <span className="block truncate">{getLabel(o)}</span>
                  {secondary && (
                    <span className="block truncate text-xs text-[var(--admin-text-subtle)]">{secondary}</span>
                  )}
                </span>
                {mode === "multi" && (
                  <span
                    className={cn(
                      "h-4 w-4 shrink-0 rounded border",
                      isSelected
                        ? "border-[var(--brand-red)] bg-[var(--brand-red)]"
                        : "border-[var(--brand-gray-600)]",
                    )}
                  />
                )}
              </button>
            );
          })
        )}

        <button
          type="button"
          onClick={() => onCreateNew(query)}
          className="sticky bottom-0 flex w-full items-center gap-2 border-t border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2.5 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
        >
          <Plus className="h-4 w-4 shrink-0 text-[var(--brand-red)]" />
          {createLabel}
        </button>
      </div>
    </div>
  );
}
