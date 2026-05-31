import { formatAdminDateTime } from "@/lib/admin/format-dates";

interface AdminTimestampsProps {
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  compact?: boolean;
  className?: string;
}

export function AdminTimestamps({
  createdAt,
  updatedAt,
  compact,
  className = "",
}: AdminTimestampsProps) {
  if (!createdAt && !updatedAt) return null;

  if (compact) {
    return (
      <p className={`text-xs text-[var(--admin-text-subtle)] ${className}`}>
        {createdAt && <span>أُنشئ: {formatAdminDateTime(createdAt)}</span>}
        {createdAt && updatedAt && <span className="mx-2">·</span>}
        {updatedAt && <span>آخر تحديث: {formatAdminDateTime(updatedAt)}</span>}
      </p>
    );
  }

  return (
    <dl
      className={`grid gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 text-sm sm:grid-cols-2 ${className}`}
    >
      <div>
        <dt className="text-xs text-[var(--admin-text-subtle)]">تاريخ الإنشاء</dt>
        <dd className="text-[var(--admin-text)]">{formatAdminDateTime(createdAt)}</dd>
      </div>
      <div>
        <dt className="text-xs text-[var(--admin-text-subtle)]">آخر تحديث</dt>
        <dd className="text-[var(--admin-text)]">{formatAdminDateTime(updatedAt)}</dd>
      </div>
    </dl>
  );
}

export function adminCreatedAtColumn<T extends { createdAt?: Date | string | null }>() {
  return {
    key: "createdAt",
    label: "تاريخ الإنشاء",
    className: "whitespace-nowrap text-xs text-[var(--admin-text-muted)]",
    render: (row: T) => formatAdminDateTime(row.createdAt),
  };
}

export function adminUpdatedAtColumn<T extends { updatedAt?: Date | string | null }>() {
  return {
    key: "updatedAt",
    label: "آخر تحديث",
    className: "whitespace-nowrap text-xs text-[var(--admin-text-muted)]",
    render: (row: T) => formatAdminDateTime(row.updatedAt),
  };
}
