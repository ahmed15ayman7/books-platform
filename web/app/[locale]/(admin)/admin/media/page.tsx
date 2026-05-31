"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { appendListParams } from "@/lib/admin/list-query";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
import {
  AdminFilterSelect,
  AdminListToolbar,
  AdminSortSelect,
} from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
  AdminGridCardFooter,
  AdminGridCardMedia,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
import { sortClientList } from "@/lib/admin/client-list-sort";

interface MediaItem {
  id: string;
  slug: string;
  title: string;
  channel: string | null;
  status: string;
  date: string | null;
  imageUrl?: string | null;
}

const mediaChannelLabel: Record<string, string> = {
  "watch-your-book": "شاهد كتابك",
  "books-talk": "حديث الكتب",
  "novel-story": "رواية فحكاية",
};

const MEDIA_CHANNELS = ["watch-your-book", "books-talk", "novel-story"];

export default function AdminMediaPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const { viewMode, setViewMode } = useAdminViewMode("media");

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("updatedAt:desc");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, channel, status });
      const res = await fetch(`/api/v1/admin/articles?${q}`, { headers: adminAuthHeaders() });
      const data = (await res.json()) as {
        success: boolean;
        data?: MediaItem[];
        pagination?: { totalPages: number };
      };
      if (data.success && data.data) {
        const media = data.data.filter((a) => MEDIA_CHANNELS.includes(a.channel ?? ""));
        setItems(media);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, channel, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const displayed = useMemo(() => {
    let list = items;
    if (channel !== "all") list = list.filter((i) => i.channel === channel);
    if (status !== "all") list = list.filter((i) => i.status === status);
    return sortClientList(
      list,
      sort,
      {
        title: (i) => i.title,
        date: (i) => i.date ?? "",
        updatedAt: (i) => i.date ?? "",
      },
      "updatedAt",
    );
  }, [items, channel, status, sort]);

  const editBtn = (row: MediaItem) => (
    <Link href={`/${locale}/admin/articles/${row.id}`}>
      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
        <Pencil className="h-3 w-3" />
        تعديل
      </Button>
    </Link>
  );

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
        <span className="text-xs text-[var(--brand-gray-300)]">
          {row.channel ? (mediaChannelLabel[row.channel] ?? row.channel) : "—"}
        </span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      render: (row: MediaItem) => (
        <span className="text-xs text-[var(--brand-gray-400)]">
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
    { key: "actions", label: "", headerClassName: "w-16", render: editBtn },
  ];

  const renderCard = (row: MediaItem) => (
    <AdminGridCard>
      <AdminGridCardMedia
        src={row.imageUrl}
        alt={row.title}
        fallback={<Video className="h-10 w-10" />}
      />
      <AdminGridCardBody>
        <h3 className="line-clamp-2 font-semibold text-white">{row.title}</h3>
        <p className="text-xs text-[var(--brand-gray-500)]">
          {row.channel ? (mediaChannelLabel[row.channel] ?? row.channel) : "—"}
        </p>
        <AdminStatusBadge status={row.status === "publish" ? "published" : "draft"} />
      </AdminGridCardBody>
      <AdminGridCardFooter>{editBtn(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  return (
    <div className="text-white">
      <AdminPageHeader
        title="الميديا"
        subtitle="إدارة الفيديوهات والبودكاست والمحتوى المرئي"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              onSubmit={() => void load()}
              placeholder="بحث..."
            />
            <Link href={`/${locale}/admin/articles/new`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                إضافة محتوى
              </Button>
            </Link>
          </div>
        }
      />

      <AdminListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={
          <>
            <AdminFilterSelect
              label="القناة"
              value={channel}
              onChange={(v) => {
                setChannel(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "الكل" },
                ...MEDIA_CHANNELS.map((c) => ({
                  value: c,
                  label: mediaChannelLabel[c] ?? c,
                })),
              ]}
            />
            <AdminFilterSelect
              label="الحالة"
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "publish", label: "منشور" },
                { value: "draft", label: "مسودة" },
              ]}
            />
          </>
        }
        sort={
          <AdminSortSelect
            value={sort}
            onChange={(v) => {
              setSort(v);
              setPage(1);
            }}
            options={[
              { value: "updatedAt:desc", label: "آخر تحديث" },
              { value: "date:desc", label: "تاريخ النشر" },
              { value: "title:asc", label: "العنوان أ–ي" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={displayed}
        loading={loading}
        emptyMessage="لا يوجد محتوى ميديا بعد"
        renderCard={renderCard}
      />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
