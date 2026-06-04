"use client";

import { cn } from "@/lib/utils";

interface AdminHubTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

export function AdminHubTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: AdminHubTabsProps<T>) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-1",
        className,
      )}
      role="tablist"
      aria-label="تصفية حسب النوع"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--brand-red)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
