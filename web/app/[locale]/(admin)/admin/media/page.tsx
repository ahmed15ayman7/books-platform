"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";

interface MediaItem {
  id: string;
  slug: string;
  title: string;
  channel: string | null;
  status: string;
  date: string | null;
  mediaType: string | null;
}

const mediaChannelLabel: Record<string, string> = {
  "watch-your-book": "شاهد كتابك",
  "books-talk": "حديث الكتب",
  "novel-story": "رواية فحكاية",
};

export default function AdminMediaPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: "20",
        type: "media",
      });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/articles?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: MediaItem[]; pagination?: { totalPages: number } };
      if (data.success && data.data) {
        setItems(data.data.filter((a) =>
          ["watch-your-book", "books-talk", "novel-story"].includes(a.channel ?? "")
        ));
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  const columns = [
    {
      key: "title",
      label: "العنوان",
      render: (row: MediaItem) => (
        <span className="block max-w-[280px] truncate font-medium">{row.title}</span>
      ),
    },
    {
      key: "channel",
      label: "القناة",
      render: (row: MediaItem) => (
        <span className="text-[var(--brand-gray-300)] text-xs">
          {row.channel ? (mediaChannelLabel[row.channel] ?? row.channel) : "—"}
        </span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      render: (row: MediaItem) => (
        <span className="text-[var(--brand-gray-400)] text-xs">
          {row.date ? new Date(row.date).toLocaleDateString("ar-EG") : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: MediaItem) => (
        <AdminStatusBadge status={row.status === "publish" ? "published" : "draft"} />
      ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: MediaItem) => (
        <Link href={`/${locale}/admin/media/${row.id}`}>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Pencil className="h-3 w-3" />
            تعديل
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="الميديا"
        subtitle="إدارة الفيديوهات والبودكاست والمحتوى المرئي"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              onSubmit={() => void load()}
              placeholder="بحث..."
            />
            <Link href={`/${locale}/admin/media/new`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                إضافة محتوى
              </Button>
            </Link>
          </div>
        }
      />
      <AdminTable columns={columns} data={items} loading={loading} emptyMessage="لا يوجد محتوى ميديا بعد" />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
