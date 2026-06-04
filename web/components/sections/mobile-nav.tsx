"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavTriggerProps {
  locale: string;
}

export function MobileNavTrigger({ locale }: MobileNavTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = locale === "ar";
  const base = `/${locale}`;

  const navGroups = [
    {
      label: t ? "الرئيسية" : "Home",
      href: base,
      items: null,
    },
    {
      label: t ? "الكتب" : "Books",
      href: null,
      items: [
        { href: `${base}/books`, label: t ? "كل الكتب" : "All Books" },
        { href: `${base}/books/nominated-for-translation`, label: t ? "مرشحة للترجمة" : "For Translation" },
        { href: `${base}/books/translated`, label: t ? "كتب مترجمة" : "Translated Books" },
      ],
    },
    {
      label: t ? "المقالات" : "Articles",
      href: null,
      items: [
        { href: `${base}/articles/harvest`, label: t ? "حصاد الكتب" : "Book Harvest" },
        { href: `${base}/articles/ideas`, label: t ? "زبدة الأفكار" : "Essence of Ideas" },
        { href: `${base}/articles/world-reads`, label: t ? "العالم يقرأ" : "World Reads" },
        { href: `${base}/articles/books-talk`, label: t ? "حديث الكتب" : "Book Talk" },
        { href: `${base}/articles/watch-your-book`, label: t ? "شاهد كتابك" : "Watch Your Book" },
        { href: `${base}/articles/novel-story`, label: t ? "رواية فحكاية" : "Novel & Story" },
      ],
    },
    {
      label: t ? "الناشرون" : "Publishers",
      href: `${base}/publishers`,
      items: null,
    },
    {
      label: t ? "انشر كتابك" : "Publish",
      href: `${base}/publish`,
      items: null,
      isAccent: true,
    },
    {
      label: t ? "من نحن" : "About",
      href: `${base}/about`,
      items: null,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 hover:text-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
        aria-label={isOpen ? (t ? "إغلاق القائمة" : "Close menu") : (t ? "فتح القائمة" : "Open menu")}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={t ? "القائمة الرئيسية" : "Main menu"}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <div
            className={cn(
              "absolute inset-y-0 end-0 w-[280px] bg-white shadow-xl",
              "flex flex-col overflow-y-auto"
            )}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between bg-[var(--brand-black)] px-4 py-3">
              <span className="font-display font-bold text-white">
                {t ? "القائمة" : "Menu"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--brand-gray-300)] hover:text-white"
                aria-label={t ? "إغلاق" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1">
              {navGroups.map((group) =>
                group.items ? (
                  <MobileNavGroup
                    key={group.label}
                    label={group.label}
                    items={group.items}
                    onClose={() => setIsOpen(false)}
                  />
                ) : (
                  <Link
                    key={group.label}
                    href={group.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm font-medium",
                      "transition-colors hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]",
                      group.isAccent
                        ? "mx-2 rounded-lg bg-white px-4 py-3 font-semibold text-[var(--brand-red)] shadow-sm hover:bg-[var(--brand-gray-100)]"
                        : "text-[var(--brand-gray-700)]"
                    )}
                  >
                    {group.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavGroup({
  label,
  items,
  onClose,
}: {
  label: string;
  items: { href: string; label: string }[];
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-[var(--brand-gray-700)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
        aria-expanded={isOpen}
      >
        {label}
        {isOpen ? (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className="ms-3 mt-1 space-y-1 border-s-2 border-[var(--brand-red-soft)] ps-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-sm text-[var(--brand-gray-600)] hover:text-[var(--brand-red)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
