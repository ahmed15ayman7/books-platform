import type { ReactNode } from "react";
import type { AdminViewMode } from "@/lib/admin/list-query";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminDataGrid } from "@/components/admin/admin-data-grid";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface AdminListViewProps<T extends { id: string }> {
  viewMode: AdminViewMode;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  renderCard: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

export function AdminListView<T extends { id: string }>({
  viewMode,
  columns,
  data,
  loading,
  emptyMessage,
  renderCard,
  onRowClick,
}: AdminListViewProps<T>) {
  if (viewMode === "grid") {
    return (
      <AdminDataGrid
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
        renderCard={renderCard}
      />
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
    />
  );
}
