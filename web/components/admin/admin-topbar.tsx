"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, Home, Search } from "lucide-react";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { useAdminChrome } from "@/lib/admin/admin-chrome-context";
import { modKeyLabel } from "@/lib/search/shortcut-labels";
import { AdminHubLinks } from "@/components/admin/admin-hub-links";

const routeLabels: Record<string, string> = {
  admin: "لوحة التحكم",
  dashboard: "لوحة التحكم",
  books: "الكتب",
  publishers: "الناشرين",
  articles: "المقالات",
  media: "الميديا",
  submissions: "طلبات النشر",
  orders: "الطلبات",
  comments: "التعليقات",
  newsletter: "النشرة البريدية",
  categories: "التصنيفات",
  authors: "المؤلفون",
  pages: "الصفحات الثابتة",
  b2b: "B2B المؤسسي",
  ambassadors: "السفراء",
  notifications: "الإشعارات",
  "audit-log": "سجل الأحداث",
  settings: "الإعدادات",
  "home-slider": "سلايدر الرئيسية",
  new: "إضافة جديد",
  edit: "تعديل",
  users: "المستخدمون",
  trash: "سلة المحذوفات",
  drafts: "المسودات",
};

/** Prisma cuid-style ids in admin book routes */
const BOOK_ID_PATTERN = /^c[a-z0-9]{10,}$/i;

function isBookIdSegment(seg: string, prev?: string) {
  return prev === "books" && BOOK_ID_PATTERN.test(seg);
}

function crumbHref(locale: string, crumbs: string[], index: number): string {
  const seg = crumbs[index];
  if (seg === "admin" && index === 0) {
    return `/${locale}/admin/dashboard`;
  }
  return `/${locale}/${crumbs.slice(0, index + 1).join("/")}`;
}

function crumbLabel(
  seg: string,
  prev: string | undefined,
  bookSlugs: Record<string, string>,
): string {
  if (isBookIdSegment(seg, prev)) {
    return bookSlugs[seg] ?? seg;
  }
  return routeLabels[seg] ?? seg;
}

export function AdminTopbar() {
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const { openSearch } = useAdminChrome();
  const [bookSlugs, setBookSlugs] = useState<Record<string, string>>({});

  const segments = pathname.split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const crumbs = adminIndex >= 0 ? segments.slice(adminIndex) : [];

  const bookIdsToResolve = useMemo(
    () =>
      crumbs.filter((seg, i) => isBookIdSegment(seg, crumbs[i - 1])),
    [crumbs],
  );

  useEffect(() => {
    for (const id of bookIdsToResolve) {
      if (bookSlugs[id]) continue;

      void fetch(`/api/v1/admin/books/${id}`, { headers: adminAuthHeaders() })
        .then((r) => r.json())
        .then((d: { success: boolean; data?: { slug?: string } }) => {
          if (d.success && d.data?.slug) {
            setBookSlugs((prev) => ({ ...prev, [id]: d.data!.slug! }));
          }
        })
        .catch(() => null);
    }
  }, [bookIdsToResolve, bookSlugs]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/95 px-6 backdrop-blur-sm">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="flex shrink-0 items-center gap-1 text-[var(--admin-text-subtle)] transition-colors hover:text-[var(--admin-accent)]"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        {crumbs.map((seg, i) => {
          const label = crumbLabel(seg, crumbs[i - 1], bookSlugs);
          const isLast = i === crumbs.length - 1;
          const href = crumbHref(locale, crumbs, i);

          return (
            <span key={`${seg}-${i}`} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight className="h-3 w-3 shrink-0 text-[var(--admin-border-strong)] rtl:rotate-180" />
              {isLast ? (
                <span className="truncate font-medium text-[var(--admin-text)]" dir="ltr">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="truncate text-[var(--admin-text-subtle)] transition-colors hover:text-[var(--admin-accent)]"
                  dir={isBookIdSegment(seg, crumbs[i - 1]) ? "ltr" : undefined}
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openSearch}
          className="hidden items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-1.5 text-xs text-[var(--admin-text-subtle)] transition-colors hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)] sm:flex"
          aria-label="بحث لوحة التحكم"
        >
          <Search className="h-3.5 w-3.5" />
          <span>بحث...</span>
          <kbd className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] px-1 py-0.5 text-[10px]">
            {modKeyLabel()}K
          </kbd>
        </button>
        <button
          type="button"
          onClick={openSearch}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)] sm:hidden"
          aria-label="بحث"
        >
          <Search className="h-4 w-4" />
        </button>
        <AdminHubLinks />
        <button
          type="button"
          aria-label="الإشعارات"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 select-none items-center justify-center rounded-lg bg-[var(--brand-red)] text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
