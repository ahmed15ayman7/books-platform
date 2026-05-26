import type { LucideIcon } from "lucide-react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = BookOpen,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center animate-scale-in",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-red-soft)] text-[var(--brand-red)] transition-transform duration-[var(--motion-base)] hover:scale-105">
        <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-4 text-lg font-medium text-[var(--brand-gray-700)]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[var(--brand-gray-500)]">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
