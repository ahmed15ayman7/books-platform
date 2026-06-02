"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "لوحة التحكم",
  books: "الكتب",
  publishers: "الناشرون",
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
};

export function AdminTopbar() {
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  // Build breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const crumbs = adminIndex >= 0 ? segments.slice(adminIndex) : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/95 px-6 backdrop-blur-sm">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="flex items-center gap-1 text-[var(--admin-text-subtle)] hover:text-[var(--admin-accent)] transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        {crumbs.map((seg, i) => {
          const label = routeLabels[seg] ?? seg;
          const isLast = i === crumbs.length - 1;
          return (
            <span key={seg} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-[var(--admin-border-strong)] rtl:rotate-180" />
              <span
                className={
                  isLast
                    ? "font-medium text-[var(--admin-text)]"
                    : "text-[var(--admin-text-subtle)]"
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          aria-label="الإشعارات"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)] transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded-lg bg-[var(--brand-red)] flex items-center justify-center text-xs font-bold text-white select-none">
          A
        </div>
      </div>
    </header>
  );
}
