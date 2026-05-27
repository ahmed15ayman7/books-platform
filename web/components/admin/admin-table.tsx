import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getVisiblePageNumbers } from "@/lib/pagination";

// ─── Status Badge ─────────────────────────────────────────────────

type StatusVariant =
  | "published"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "translated"
  | "nominated"
  | "completed"
  | "refunded"
  | "cancelled"
  | "sponsored"
  | "confirmed"
  | "unsubscribed";

const statusConfig: Record<StatusVariant, { label: string; cls: string }> = {
  published:    { label: "منشور",       cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  draft:        { label: "مسودة",       cls: "bg-[var(--brand-gray-800)] text-[var(--brand-gray-400)]" },
  pending:      { label: "قيد المراجعة",cls: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  approved:     { label: "موافق عليه",  cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  rejected:     { label: "مرفوض",       cls: "bg-[var(--error-soft)] text-[var(--error)]" },
  active:       { label: "نشط",         cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  inactive:     { label: "غير نشط",     cls: "bg-[var(--brand-gray-800)] text-[var(--brand-gray-400)]" },
  translated:   { label: "مترجم",       cls: "bg-[var(--info-soft)] text-[var(--info)]" },
  nominated:    { label: "مرشح",        cls: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  completed:    { label: "مكتمل",       cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  refunded:     { label: "مسترجع",      cls: "bg-[var(--brand-gray-800)] text-[var(--brand-gray-400)]" },
  cancelled:    { label: "ملغي",        cls: "bg-[var(--error-soft)] text-[var(--error)]" },
  sponsored:    { label: "مموّل",       cls: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  confirmed:    { label: "مؤكد",        cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  unsubscribed: { label: "غير مشترك",   cls: "bg-[var(--brand-gray-800)] text-[var(--brand-gray-400)]" },
};

interface AdminStatusBadgeProps {
  status: string;
  customLabel?: string;
}

export function AdminStatusBadge({ status, customLabel }: AdminStatusBadgeProps) {
  const cfg = statusConfig[status.toLowerCase() as StatusVariant];
  if (!cfg) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[var(--brand-gray-800)] text-[var(--brand-gray-400)]">
        {customLabel ?? status}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        cfg.cls
      )}
    >
      {customLabel ?? cfg.label}
    </span>
  );
}

// ─── Table ────────────────────────────────────────────────────────

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyMessage = "لا توجد بيانات",
  onRowClick,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-800)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--brand-gray-800)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]",
                  col.headerClassName
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-[var(--brand-gray-400)]"
              >
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--brand-gray-700)] border-t-[var(--brand-red)]" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-[var(--brand-gray-500)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "text-white transition-colors",
                  onRowClick
                    ? "cursor-pointer hover:bg-[var(--brand-gray-800)]/60"
                    : "hover:bg-[var(--brand-gray-800)]/40"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  total?: number;
  pageSize?: number;
}

export function AdminPagination({
  page,
  totalPages,
  onPage,
  total,
  pageSize,
}: AdminPaginationProps) {
  if (totalPages <= 1 && !total) return null;

  const pages = getVisiblePageNumbers(page, totalPages);
  const from = total && pageSize ? Math.min((page - 1) * pageSize + 1, total) : null;
  const to = total && pageSize ? Math.min(page * pageSize, total) : null;

  const btnBase =
    "min-w-[32px] h-8 rounded-lg border border-[var(--brand-gray-700)] px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const btnIdle = `${btnBase} text-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-800)]`;
  const btnActive = `${btnBase} bg-[var(--brand-red)] border-[var(--brand-red)] text-white font-medium`;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      {total !== undefined && from !== null && to !== null ? (
        <span className="text-xs text-[var(--brand-gray-400)]">
          عرض {from}–{to} من {total} نتيجة
        </span>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className={btnIdle}
          aria-label="الصفحة السابقة"
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 min-w-[32px] items-center justify-center text-sm text-[var(--brand-gray-500)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={p === page ? btnActive : btnIdle}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className={btnIdle}
          aria-label="الصفحة التالية"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Pagination (Server / RSC) ────────────────────────────────────

interface AdminPaginationServerProps {
  page: number;
  totalPages: number;
  buildHref: (p: number) => string;
  total?: number;
  pageSize?: number;
}

export function AdminPaginationServer({
  page,
  totalPages,
  buildHref,
  total,
  pageSize,
}: AdminPaginationServerProps) {
  if (totalPages <= 1 && !total) return null;

  const pages = getVisiblePageNumbers(page, totalPages);
  const from = total && pageSize ? Math.min((page - 1) * pageSize + 1, total) : null;
  const to = total && pageSize ? Math.min(page * pageSize, total) : null;

  const linkBase =
    "min-w-[32px] h-8 rounded-lg border border-[var(--brand-gray-700)] px-2 text-sm transition-colors inline-flex items-center justify-center";
  const linkIdle = `${linkBase} text-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-800)]`;
  const linkActive = `${linkBase} bg-[var(--brand-red)] border-[var(--brand-red)] text-white font-medium`;
  const linkDisabled = `${linkBase} text-[var(--brand-gray-600)] pointer-events-none opacity-40`;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      {total !== undefined && from !== null && to !== null ? (
        <span className="text-xs text-[var(--brand-gray-400)]">
          عرض {from}–{to} من {total} نتيجة
        </span>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        {page <= 1 ? (
          <span className={linkDisabled} aria-disabled="true">‹</span>
        ) : (
          <a href={buildHref(page - 1)} className={linkIdle} aria-label="الصفحة السابقة">‹</a>
        )}

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 min-w-[32px] items-center justify-center text-sm text-[var(--brand-gray-500)]"
            >
              …
            </span>
          ) : (
            <a
              key={p}
              href={buildHref(p)}
              className={p === page ? linkActive : linkIdle}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </a>
          )
        )}

        {page >= totalPages ? (
          <span className={linkDisabled} aria-disabled="true">›</span>
        ) : (
          <a href={buildHref(page + 1)} className={linkIdle} aria-label="الصفحة التالية">›</a>
        )}
      </div>
    </div>
  );
}

// ─── Search ───────────────────────────────────────────────────────

interface AdminSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "بحث...",
  onSubmit,
}: AdminSearchProps) {
  return (
    <form
      className="relative max-w-xs"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <svg
        className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-gray-500)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] py-2 ps-10 pe-3 text-sm text-white placeholder:text-[var(--brand-gray-600)] focus:border-[var(--brand-red)] focus:outline-none transition-colors"
      />
    </form>
  );
}
