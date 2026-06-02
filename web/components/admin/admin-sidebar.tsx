"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  BookOpen,
  Building2,
  FileText,
  Video,
  Inbox,
  ShoppingBag,
  MessageSquare,
  Mail,
  Tag,
  UserPen,
  FileEdit,
  Users,
  BadgeDollarSign,
  ClipboardList,
  Bell,
  LogOut,
  Globe,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessNav, clearAdminSession } from "@/lib/admin/permissions-client";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "الرئيسية",
    items: [
      { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin/dashboard" },
      { icon: Images, label: "سلايدر الرئيسية", href: "/admin/home-slider" },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { icon: BookOpen, label: "الكتب", href: "/admin/books" },
      { icon: Building2, label: "الناشرون", href: "/admin/publishers" },
      { icon: UserPen, label: "المؤلفون", href: "/admin/authors" },
      { icon: Tag, label: "التصنيفات", href: "/admin/categories" },
      { icon: FileText, label: "المقالات", href: "/admin/articles" },
      { icon: Video, label: "الميديا", href: "/admin/media" },
    ],
  },
  {
    label: "التفاعل",
    items: [
      { icon: Inbox, label: "طلبات النشر", href: "/admin/submissions" },
      { icon: ShoppingBag, label: "الطلبات", href: "/admin/orders" },
      { icon: MessageSquare, label: "التعليقات", href: "/admin/comments" },
      { icon: Mail, label: "النشرة البريدية", href: "/admin/newsletter" },
    ],
  },
  {
    label: "الشراكات",
    items: [
      { icon: BadgeDollarSign, label: "B2B المؤسسي", href: "/admin/b2b" },
      { icon: Users, label: "السفراء", href: "/admin/ambassadors" },
    ],
  },
  {
    label: "النظام",
    items: [
      { icon: Bell, label: "الإشعارات", href: "/admin/notifications" },
      { icon: FileEdit, label: "الصفحات الثابتة", href: "/admin/pages" },
      { icon: Globe, label: "الإعدادات العامة", href: "/admin/settings" },
      { icon: ClipboardList, label: "سجل الأحداث", href: "/admin/audit-log" },
      { icon: Shield, label: "مديرو النظام", href: "/admin/users" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  async function handleLogout() {
    clearAdminSession();
    await fetch("/api/v1/auth/logout", { method: "POST" });
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-[var(--admin-surface)] flex flex-col h-screen sticky top-0 border-e border-[var(--admin-border)]">
      {/* Logo */}
      <div className="border-b border-[var(--admin-border)] p-4">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-red)] shadow-[0_0_16px_rgba(177,30,46,0.4)]">
            <BookOpen className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--admin-text)] leading-tight">
              Books Platform
            </p>
            <p className="text-[10px] text-[var(--admin-text-subtle)]">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-3 space-y-4"
        aria-label="Admin navigation"
      >
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => canAccessNav(item.href));
          if (visibleItems.length === 0) return null;
          return (
          <div key={group.label}>
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const href = `/${locale}${item.href}`;
                const isActive =
                  pathname === href ||
                  (pathname.startsWith(href + "/") && href !== `/${locale}/admin/dashboard`);
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-[var(--brand-red)] text-white"
                        : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                    )}
                  >
                    <item.icon
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--admin-border)] p-2">
        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] transition-colors"
        >
          <Globe className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>عرض الموقع</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
