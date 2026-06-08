"use client";

import { useCallback, useEffect, useState } from "react";
import { PAGINATION } from "@/lib/utils/constants";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/contact-messages?page=${page}&limit=${PAGINATION.DEFAULT_PAGE_SIZE}`, {
        headers: adminAuthHeaders(),
      });
      const data = await res.json() as {
        success: boolean;
        data?: ContactMsg[];
        pagination?: { totalPages: number };
      };
      if (data.success && data.data) {
        setMessages(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  async function markRead(id: string) {
    await fetch(`/api/v1/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });
    void load();
  }

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader title="رسائل التواصل" subtitle="استفسارات الزوار" />
      {loading ? (
        <p className="text-[var(--admin-text-muted)]">جاري التحميل...</p>
      ) : messages.length === 0 ? (
        <p className="text-[var(--admin-text-muted)]">لا توجد رسائل</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.name} — {m.email}</p>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    {m.topic} · {new Date(m.createdAt).toLocaleString("ar-EG")} · {m.status}
                  </p>
                </div>
                {m.status === "new" && (
                  <Button size="sm" variant="outline" onClick={() => void markRead(m.id)}>
                    تمت القراءة
                  </Button>
                )}
              </div>
              {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--admin-text-muted)]">{m.message}</p>
            </article>
          ))}
        </div>
      )}
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
