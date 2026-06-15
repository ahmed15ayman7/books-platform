"use client";

import { useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildBookCategoryLinks,
  buildMediaChannelLinks,
  buildReadingChannelLinks,
  bookCategoriesNavLabel,
  mediaNavLabel,
  readingsNavLabel,
  type NavCategory,
} from "@/lib/nav/site-nav";

interface MobileNavTriggerProps {
  locale: string;
  bookCategories?: NavCategory[];
}

export function MobileNavTrigger({ locale, bookCategories = [] }: MobileNavTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale === "ar";

  const categoryLinks = buildBookCategoryLinks(locale, bookCategories);
  const readingLinks = buildReadingChannelLinks(locale);
  const mediaLinks = buildMediaChannelLinks(locale);

  const homeHref = localeHref(locale, "/");

  const navGroups = [
    { label: isAr ? "الرئيسية" : "Home", href: homeHref, items: null as null },
    {
      label: bookCategoriesNavLabel(locale),
      href: null,
      items: categoryLinks,
    },
    {
      label: isAr ? "كتب مرشحة للترجمة" : "For Translation",
      href: localeHref(locale, "/books/nominated-for-translation"),
      items: null,
    },
    {
      label: isAr ? "كتب مترجمة" : "Translated Books",
      href: localeHref(locale, "/books/translated"),
      items: null,
    },
    { label: readingsNavLabel(locale), href: null, items: readingLinks },
    { label: mediaNavLabel(locale), href: null, items: mediaLinks },
    { label: isAr ? "الناشرون" : "Publishers", href: localeHref(locale, "/publishers"), items: null },
    { label: isAr ? "انشر كتابك" : "Publish", href: localeHref(locale, "/publish"), items: null, isAccent: true },
    { label: isAr ? "من نحن" : "About", href: localeHref(locale, "/about"), items: null },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 hover:text-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
        aria-label={
          isOpen ? (isAr ? "إغلاق القائمة" : "Close menu") : isAr ? "فتح القائمة" : "Open menu"
        }
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? "القائمة الرئيسية" : "Main menu"}
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "absolute inset-y-0 end-0 w-[280px] bg-white shadow-xl",
              "flex flex-col overflow-y-auto",
            )}
          >
            <div className="flex items-center justify-between bg-[var(--brand-black)] px-4 py-3">
              <span className="font-display font-bold text-white">
                {isAr ? "القائمة" : "Menu"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--brand-gray-300)] hover:text-white"
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-4">
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
                        : "text-[var(--brand-gray-700)]",
                    )}
                  >
                    {group.label}
                  </Link>
                ),
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
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-[var(--brand-gray-700)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
        aria-expanded={expanded}
      >
        {label}
        {expanded ? (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      {expanded && (
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
