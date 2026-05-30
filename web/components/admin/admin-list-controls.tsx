"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminViewMode } from "@/lib/admin/list-query";

const selectCls =
  "rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2 text-sm text-white focus:border-[var(--brand-red)] focus:outline-none min-w-[140px]";

export interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminFilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  className?: string;
}

export function AdminFilterSelect({
  label,
  value,
  onChange,
  options,
  className,
}: AdminFilterSelectProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--brand-gray-500)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface AdminSortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  className?: string;
}

export function AdminSortSelect({ value, onChange, options, className }: AdminSortSelectProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--brand-gray-500)]">
        ترتيب حسب
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface AdminViewModeToggleProps {
  mode: AdminViewMode;
  onChange: (mode: AdminViewMode) => void;
}

export function AdminViewModeToggle({ mode, onChange }: AdminViewModeToggleProps) {
  return (
    <div
      className="flex rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] p-0.5"
      role="group"
      aria-label="طريقة العرض"
    >
      <button
        type="button"
        onClick={() => onChange("table")}
        className={cn(
          "inline-flex h-8 w-9 items-center justify-center rounded-md transition-colors",
          mode === "table"
            ? "bg-[var(--brand-red)] text-white"
            : "text-[var(--brand-gray-400)] hover:text-white",
        )}
        aria-pressed={mode === "table"}
        title="جدول"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "inline-flex h-8 w-9 items-center justify-center rounded-md transition-colors",
          mode === "grid"
            ? "bg-[var(--brand-red)] text-white"
            : "text-[var(--brand-gray-400)] hover:text-white",
        )}
        aria-pressed={mode === "grid"}
        title="بطاقات"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

interface AdminListToolbarProps {
  filters?: React.ReactNode;
  sort?: React.ReactNode;
  viewMode: AdminViewMode;
  onViewModeChange: (mode: AdminViewMode) => void;
  className?: string;
}

export function AdminListToolbar({
  filters,
  sort,
  viewMode,
  onViewModeChange,
  className,
}: AdminListToolbarProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between",
        className,
      )}
    >
      {filters ? (
        <div className="flex flex-wrap items-end gap-3">{filters}</div>
      ) : (
        <span className="hidden sm:block" />
      )}
      <div className="flex flex-wrap items-end gap-3">
        {sort}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--brand-gray-500)]">
            العرض
          </span>
          <AdminViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}
