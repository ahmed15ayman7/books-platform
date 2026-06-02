import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
  padding?: "sm" | "md" | "lg";
}

export function AdminCard({
  children,
  className,
  title,
  actions,
  padding = "md",
}: AdminCardProps) {
  const paddingCls = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  }[padding];

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]",
        className
      )}
    >
      {(title ?? actions) && (
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-3">
          {title && (
            <h2 className="text-sm font-semibold text-[var(--admin-text)]">{title}</h2>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={paddingCls}>{children}</div>
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  alert?: boolean;
  trend?: { value: number; label: string };
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  alert,
  trend,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-[var(--admin-surface)] p-5 transition-colors",
        alert
          ? "border-[var(--brand-red)]/40"
          : "border-[var(--admin-border)] hover:border-[var(--admin-border-strong)]"
      )}
    >
      {alert && (
        <span className="absolute end-3 top-3 h-2 w-2 animate-pulse rounded-full bg-[var(--brand-red)]" />
      )}
      <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
      </div>
      <p className="text-2xl font-black text-[var(--admin-text)]">
        {typeof value === "number" ? value.toLocaleString("ar-EG") : value}
      </p>
      <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{label}</p>
      {trend && (
        <p
          className={cn(
            "mt-2 text-[11px]",
            trend.value >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"
          )}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
