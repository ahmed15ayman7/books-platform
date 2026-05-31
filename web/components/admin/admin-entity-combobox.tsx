"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
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
  placeholder?: string;
  emptyLabel?: string;
  createLabel?: string;
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
  placeholder,
  emptyLabel = "لا توجد نتائج",
  createLabel = "إضافة جديد",
}: AdminEntityComboboxProps) {
  const [q, setQ] = useState("");

  const selectedIds = mode === "multi" ? (value as string[]) : value ? [value as string] : [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => getLabel(o).toLowerCase().includes(query));
  }, [options, q, getLabel]);

  const showNoMatchCreate = q.trim().length > 0 && filtered.length === 0;

  const selectedItems = options.filter((o) => selectedIds.includes(o.id));

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
        placeholder={placeholder ?? `ابحث في ${label}…`}
        className={cn(adminFieldClass, "mb-1")}
      />

      <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)]">
        {showNoMatchCreate && (
          <button
            type="button"
            onClick={() => onCreateNew(q.trim())}
            className="flex w-full items-center gap-2 border-b border-[var(--brand-gray-700)] bg-[var(--brand-gray-750)] px-3 py-2.5 text-sm font-medium text-[var(--brand-red)] hover:bg-[var(--brand-gray-700)]"
          >
            <Plus className="h-4 w-4 shrink-0" />
            {createLabel}: «{q.trim()}»
          </button>
        )}

        {filtered.length === 0 && !showNoMatchCreate ? (
          <p className="px-3 py-2 text-xs text-[var(--brand-gray-500)]">{emptyLabel}</p>
        ) : (
          filtered.slice(0, 40).map((o) => {
            const isSelected = selectedIds.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleOption(o.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border-b border-[var(--brand-gray-700)] px-3 py-2 text-start text-sm last:border-0",
                  isSelected
                    ? "bg-[var(--brand-red)]/20 text-white"
                    : "text-white hover:bg-[var(--brand-gray-700)]",
                )}
              >
                <span className="truncate">{getLabel(o)}</span>
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
          onClick={() => onCreateNew(q.trim())}
          className="sticky bottom-0 flex w-full items-center gap-2 border-t border-[var(--brand-gray-600)] bg-[var(--brand-gray-900)] px-3 py-2.5 text-sm text-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-700)] hover:text-white"
        >
          <Plus className="h-4 w-4 shrink-0 text-[var(--brand-red)]" />
          {createLabel}
        </button>
      </div>
    </div>
  );
}
