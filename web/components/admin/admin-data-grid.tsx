import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDataGridProps<T extends { id: string }> {
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  renderCard: (row: T) => ReactNode;
  className?: string;
}

export function AdminDataGrid<T extends { id: string }>({
  data,
  loading,
  emptyMessage = "لا توجد بيانات",
  renderCard,
  className,
}: AdminDataGridProps<T>) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--brand-gray-700)] border-t-[var(--brand-red)]" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] px-4 py-14 text-center text-sm text-[var(--brand-gray-500)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {data.map((row) => (
        <div key={row.id} className="flex h-full min-h-0">
          {renderCard(row)}
        </div>
      ))}
    </div>
  );
}

export function AdminGridCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] transition-colors hover:border-[var(--brand-gray-700)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function AdminGridCardMedia({
  src,
  alt,
  fallback,
}: {
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
}) {
  return (
    <div className="relative aspect-[4/3] w-full shrink-0 bg-[var(--brand-gray-800)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[var(--brand-gray-600)]">
          {fallback ?? <BookOpen className="h-10 w-10 opacity-40" />}
        </div>
      )}
    </div>
  );
}

export function AdminGridCardBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col gap-2 p-4">{children}</div>;
}

export function AdminGridCardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--brand-gray-800)] px-4 py-3">
      {children}
    </div>
  );
}
