import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  BookOpen,
  Building2,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  FileText,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-card";
import { AdminStatusBadge } from "@/components/admin/admin-table";

export const metadata: Metadata = {
  title: "لوحة التحكم — Books Platform Admin",
};

async function getDashboardData() {
  const [
    totalBooks,
    totalPublishers,
    pendingSubmissions,
    totalOrders,
    pendingComments,
    newsletterSubscribers,
    totalArticles,
    recentBooks,
    recentOrders,
  ] = await Promise.all([
    db.product.count({ where: { published: true } }),
    db.publisher.count({ where: { status: "publish" } }),
    db.publishBookSubmission.count({ where: { status: "pending" } }),
    db.order.count(),
    db.comment.count({ where: { status: "pending" } }),
    db.newsletterSubscriber.count({ where: { status: "CONFIRMED" } }),
    db.article.count({ where: { status: "publish" } }),
    db.product.findMany({
      take: 5,
      orderBy: { id: "desc" },
      select: { id: true, nameEn: true, nameAr: true, published: true },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, customerEmail: true, total: true, status: true, orderNumber: true, createdAt: true },
    }),
  ]);

  return {
    totalBooks,
    totalPublishers,
    pendingSubmissions,
    totalOrders,
    pendingComments,
    newsletterSubscribers,
    totalArticles,
    recentBooks,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData().catch(() => ({
    totalBooks: 0,
    totalPublishers: 0,
    pendingSubmissions: 0,
    totalOrders: 0,
    pendingComments: 0,
    newsletterSubscribers: 0,
    totalArticles: 0,
    recentBooks: [],
    recentOrders: [],
  }));

  const kpis = [
    {
      label: "إجمالي الكتب",
      value: data.totalBooks,
      icon: BookOpen,
      color: "text-[var(--brand-red)]",
      bg: "bg-[var(--brand-red-soft)]",
    },
    {
      label: "دور النشر",
      value: data.totalPublishers,
      icon: Building2,
      color: "text-[var(--info)]",
      bg: "bg-[var(--info-soft)]",
    },
    {
      label: "المقالات",
      value: data.totalArticles,
      icon: FileText,
      color: "text-[var(--brand-red)]",
      bg: "bg-[var(--brand-red-soft)]",
    },
    {
      label: "طلبات الشراء",
      value: data.totalOrders,
      icon: ShoppingBag,
      color: "text-[var(--success)]",
      bg: "bg-[var(--success-soft)]",
    },
    {
      label: "مشتركو النشرة",
      value: data.newsletterSubscribers,
      icon: Mail,
      color: "text-[var(--warning)]",
      bg: "bg-[var(--warning-soft)]",
    },
    {
      label: "تعليقات للمراجعة",
      value: data.pendingComments,
      icon: MessageSquare,
      color: "text-[var(--error)]",
      bg: "bg-[var(--error-soft)]",
      alert: data.pendingComments > 0,
    },
    {
      label: "كتب للمراجعة",
      value: data.pendingSubmissions,
      icon: Users,
      color: "text-[var(--warning)]",
      bg: "bg-[var(--warning-soft)]",
      alert: data.pendingSubmissions > 0,
    },
  ];

  const quickActions = [
    { label: "إضافة كتاب", href: "books/new", icon: Plus },
    { label: "إضافة ناشر", href: "publishers/new", icon: Plus },
    { label: "إضافة مقال", href: "articles/new", icon: Plus },
    { label: "مراجعة الطلبات", href: "submissions", icon: ArrowUpRight },
  ];

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-[var(--brand-gray-500)]">
          نظرة عامة على المنصة
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <AdminStatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-[var(--brand-gray-300)]">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] px-4 py-3 text-sm font-medium text-[var(--brand-gray-300)] transition-colors hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
            >
              <action.icon className="h-4 w-4" aria-hidden="true" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent data */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Books */}
        <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
          <div className="flex items-center justify-between border-b border-[var(--brand-gray-800)] px-5 py-3">
            <h2 className="text-sm font-semibold">آخر الكتب المضافة</h2>
            <Link
              href="books"
              className="text-xs text-[var(--brand-red)] hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[var(--brand-gray-800)]">
            {data.recentBooks.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--brand-gray-500)]">
                لا توجد كتب بعد
              </p>
            ) : (
              data.recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {(book.nameAr as string | null) ?? (book.nameEn as string)}
                    </p>
                  </div>
                  <AdminStatusBadge
                    status={(book.published as boolean) ? "published" : "draft"}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
          <div className="flex items-center justify-between border-b border-[var(--brand-gray-800)] px-5 py-3">
            <h2 className="text-sm font-semibold">آخر الطلبات</h2>
            <Link
              href="orders"
              className="text-xs text-[var(--brand-red)] hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[var(--brand-gray-800)]">
            {data.recentOrders.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--brand-gray-500)]">
                لا توجد طلبات بعد
              </p>
            ) : (
              data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {order.customerEmail as string}
                    </p>
                    <p className="text-xs text-[var(--brand-gray-500)]">
                      {order.total
                        ? `${Number(order.total).toFixed(2)} ج.م`
                        : "—"}
                    </p>
                  </div>
                  <AdminStatusBadge status={String(order.status).toLowerCase()} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
