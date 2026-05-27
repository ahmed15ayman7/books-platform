"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";

interface Order {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/orders?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Order[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setOrders(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/v1/admin/orders/${id}`, {
      method: "PATCH",
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  const columns = [
    {
      key: "orderNumber",
      label: "رقم الطلب",
      render: (row: Order) => (
        <code className="text-xs text-[var(--brand-gray-300)]">{row.orderNumber ?? row.id.slice(0, 8)}</code>
      ),
    },
    {
      key: "buyerName",
      label: "العميل",
      render: (row: Order) => (
        <div>
          <p className="font-medium">{row.buyerName}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{row.buyerEmail}</p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "المبلغ",
      render: (row: Order) => (
        <span className="font-semibold text-[var(--success)]">
          {Number(row.totalAmount ?? 0).toFixed(2)} ج.م
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Order) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "createdAt",
      label: "التاريخ",
      render: (row: Order) => (
        <span className="text-xs text-[var(--brand-gray-400)]">
          {new Date(row.createdAt).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: Order) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs"
          onClick={() => setDetail(row)}
        >
          <Eye className="h-3 w-3" />
          عرض
        </Button>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="الطلبات"
        subtitle="إدارة طلبات الشراء والمبيعات"
        actions={
          <AdminSearch
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            onSubmit={() => void load()}
            placeholder="بحث بالبريد أو الرقم..."
          />
        }
      />

      <AdminTable columns={columns} data={orders} loading={loading} emptyMessage="لا توجد طلبات بعد" />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] p-6">
            <h2 className="mb-4 text-lg font-bold">تفاصيل الطلب</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--brand-gray-400)]">رقم الطلب</dt>
                <dd><code className="text-xs">{detail.orderNumber ?? detail.id.slice(0, 8)}</code></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--brand-gray-400)]">العميل</dt>
                <dd>{detail.buyerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--brand-gray-400)]">البريد</dt>
                <dd>{detail.buyerEmail}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--brand-gray-400)]">المبلغ</dt>
                <dd className="font-semibold text-[var(--success)]">{Number(detail.totalAmount).toFixed(2)} ج.م</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-[var(--brand-gray-400)]">الحالة</dt>
                <dd>
                  <select
                    value={detail.status}
                    onChange={(e) => { void updateStatus(detail.id, e.target.value); setDetail({ ...detail, status: e.target.value }); }}
                    className="rounded border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-2 py-1 text-xs text-white"
                  >
                    {["PENDING","COMPLETED","REFUNDED","CANCELLED"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </dd>
              </div>
            </dl>
            <Button variant="outline" size="sm" className="mt-5" onClick={() => setDetail(null)}>إغلاق</Button>
          </div>
        </div>
      )}
    </div>
  );
}
