"use client";

import { cn } from "@/lib/utils";

export function FilterPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-5 rounded-2xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <h2 className="font-bold text-[var(--brand-gray-900)]">{title}</h2>
      {children}
    </div>
  );
}

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-gray-500)]">
        {title}
      </p>
      {children}
    </div>
  );
}

export function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-sm text-start transition-all duration-[var(--motion-base)]",
        active
          ? "bg-[var(--brand-red-soft)] font-medium text-[var(--brand-red)] shadow-sm"
          : "text-[var(--brand-gray-700)] hover:scale-[1.01] hover:bg-[var(--brand-gray-100)]",
      )}
    >
      {children}
    </button>
  );
}
