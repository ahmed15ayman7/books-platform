"use client";

import { PAGINATION } from "@/lib/utils/constants";

import { useCallback, useEffect, useState } from "react";
import { Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
import { appendListParams } from "@/lib/admin/list-query";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import {
  AdminFilterSelect,
  AdminListToolbar,
  AdminSortSelect,
} from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea } from "@/components/admin/admin-form-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const { viewMode, setViewMode } = useAdminViewMode("newsletter");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [campaign, setCampaign] = useState({ subject: "", body: "" });
  const draft = useFormDraft(formDraftId.adminNewsletterCampaign(), campaign, setCampaign);
  const [sending, setSending] = useState(false);
  const [sort, setSort] = useState("createdAt:desc");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(PAGINATION.DEFAULT_PAGE_SIZE) });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, status });
      const res = await fetch(`/api/v1/admin/newsletter/subscribers?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Subscriber[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setSubscribers(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, status]);

  useEffect(() => { void load(); }, [load]);

  async function sendCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/v1/admin/newsletter/send", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (data.success) {
        draft.clearDraft();
        adminToast.success("send", "الحملة البريدية");
      } else {
        adminToast.error(data.error?.message ?? "فشل الإرسال");
      }
    } finally {
      setSending(false);
    }
  }

  const renderCard = (row: Subscriber) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <p className="font-semibold text-[var(--admin-text)]" dir="ltr">
          {row.email}
        </p>
        <AdminStatusBadge status={row.status.toLowerCase()} />
        <p className="text-xs text-[var(--admin-text-subtle)]">
          {new Date(row.createdAt).toLocaleDateString("ar-EG")}
        </p>
      </AdminGridCardBody>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "email",
      label: "البريد الإلكتروني",
      render: (row: Subscriber) => <span className="font-medium" dir="ltr">{row.email}</span>,
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Subscriber) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "createdAt",
      label: "تاريخ الاشتراك",
      render: (row: Subscriber) => (
        <span className="text-xs text-[var(--admin-text-muted)]">
          {new Date(row.createdAt).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="النشرة البريدية"
        subtitle={`${total.toLocaleString("ar-EG")} مشترك مؤكد`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => alert("سيتم تصدير القائمة")}
          >
            <Download className="h-4 w-4" />
            تصدير القائمة
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Send Campaign */}
        <AdminCard title="إرسال حملة بريدية" className="lg:col-span-1">
          <form onSubmit={sendCampaign} className="space-y-3">
            <FormDraftNotice
              showBanner={draft.showBanner}
              status={draft.status}
              onResume={draft.resume}
              onDismiss={draft.dismiss}
            />
            <AdminInput
              label="عنوان الرسالة *"
              value={campaign.subject}
              onChange={(e) => setCampaign((p) => ({ ...p, subject: e.target.value }))}
              required
            />
            <AdminTextarea
              label="محتوى الرسالة *"
              rows={6}
              value={campaign.body}
              onChange={(e) => setCampaign((p) => ({ ...p, body: e.target.value }))}
              required
            />
            <Button type="submit" disabled={sending} className="gap-1.5 w-full">
              <Send className="h-4 w-4" />
              {sending ? "جاري الإرسال..." : "إرسال للكل"}
            </Button>
          </form>
        </AdminCard>

        {/* Subscribers list */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex justify-end">
            <AdminSearch
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              onSubmit={() => void load()}
              placeholder="بحث بالبريد..."
            />
          </div>
          <AdminListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={
              <AdminFilterSelect
                label="الحالة"
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "الكل" },
                  { value: "CONFIRMED", label: "مؤكد" },
                  { value: "PENDING", label: "قيد التأكيد" },
                  { value: "UNSUBSCRIBED", label: "ملغي" },
                ]}
              />
            }
            sort={
              <AdminSortSelect
                value={sort}
                onChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
                options={[
                  { value: "createdAt:desc", label: "الأحدث" },
                  { value: "email:asc", label: "البريد أ–ي" },
                ]}
              />
            }
          />
          <AdminListView
            viewMode={viewMode}
            columns={columns}
            data={subscribers}
            loading={loading}
            emptyMessage="لا يوجد مشتركون بعد"
            renderCard={renderCard}
          />
          <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} />
        </div>
      </div>
    </div>
  );
}
