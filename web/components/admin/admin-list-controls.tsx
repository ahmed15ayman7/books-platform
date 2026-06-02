"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import type { AdminViewMode } from "@/lib/admin/list-query";

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
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-[10px] font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(adminFieldClass, "min-w-[140px] h-9")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-[var(--admin-input-border)] bg-white text-[var(--admin-text)]">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="focus:bg-[var(--admin-hover)] focus:text-[var(--admin-text)]"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-[10px] font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">
        ترتيب حسب
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(adminFieldClass, "min-w-[140px] h-9")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-[var(--admin-input-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="focus:bg-[var(--admin-hover)] focus:text-[var(--admin-text)]"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface AdminViewModeToggleProps {
  mode: AdminViewMode;
  onChange: (mode: AdminViewMode) => void;
}

export function AdminViewModeToggle({ mode, onChange }: AdminViewModeToggleProps) {
  return (
    <div
      className="flex rounded-lg border border-[var(--admin-input-border)] bg-[var(--admin-surface-muted)] p-0.5"
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
            : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]",
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
            : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]",
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
        "mb-4 flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between",
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
          <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">
            العرض
          </span>
          <AdminViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}
