"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import {
  buildBookCategoryLinks,
  buildReadingChannelLinks,
  buildMediaChannelLinks,
  bookCategoriesNavLabel,
  mediaNavLabel,
  readingsNavLabel,
  mediaHubHref,
  type NavCategory,
} from "@/lib/nav/site-nav";

interface DesktopNavClientProps {
  locale: string;
  bookCategories?: NavCategory[];
}

export function DesktopNavClient({ locale, bookCategories = [] }: DesktopNavClientProps) {
  const pathname = usePathname();
  const isAr = locale === "ar";
  const base = `/${locale}`;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDropdown(name: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const booksDropdown = buildBookCategoryLinks(locale, bookCategories);
  const readingChannels = buildReadingChannelLinks(locale);
  const mediaChannels = buildMediaChannelLinks(locale);

  const mediaPaths = [
    mediaHubHref(locale),
    ...mediaChannels.map((c) => c.href),
  ];

  function isActive(href: string) {
    if (href === base) return pathname === base || pathname === `${base}/`;
    return pathname.startsWith(href);
  }

  const readingsActive =
    pathname.includes("/articles") &&
    !mediaPaths.some((p) => pathname.startsWith(p));

  const mediaActive =
    pathname.includes("/media") ||
    mediaPaths.some((p) => pathname.startsWith(p));

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-0.5"
      role="navigation"
      aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
    >
      <NavLink href={base} active={isActive(base)}>
        {isAr ? "الرئيسية" : "Home"}
      </NavLink>

      <div
        className="relative"
        onMouseEnter={() => openDropdown("books")}
        onMouseLeave={scheduleClose}
        onFocusCapture={() => openDropdown("books")}
        onBlurCapture={scheduleClose}
      >
        <NavLink
          href={`${base}/books`}
          hasDropdown
          active={pathname.includes("/books/category")}
          isOpen={openMenu === "books"}
        >
          {bookCategoriesNavLabel(locale)}
        </NavLink>
        {openMenu === "books" && (
          <DropdownMenu
            items={booksDropdown}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </div>

      <NavLink
        href={`${base}/books/nominated-for-translation`}
        active={pathname.includes("nominated-for-translation")}
      >
        {isAr ? "كتب مرشحة للترجمة" : "For Translation"}
      </NavLink>

      <NavLink href={`${base}/books/translated`} active={pathname.includes("/books/translated")}>
        {isAr ? "كتب مترجمة" : "Translated"}
      </NavLink>

      <div
        className="relative"
        onMouseEnter={() => openDropdown("readings")}
        onMouseLeave={scheduleClose}
        onFocusCapture={() => openDropdown("readings")}
        onBlurCapture={scheduleClose}
      >
        <NavLink
          href={readingChannels[0]?.href ?? `${base}/articles/world-reads`}
          hasDropdown
          active={readingsActive}
          isOpen={openMenu === "readings"}
        >
          {readingsNavLabel(locale)}
        </NavLink>
        {openMenu === "readings" && (
          <DropdownMenu
            items={readingChannels}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => openDropdown("media")}
        onMouseLeave={scheduleClose}
        onFocusCapture={() => openDropdown("media")}
        onBlurCapture={scheduleClose}
      >
        <NavLink
          href={mediaHubHref(locale)}
          hasDropdown
          active={mediaActive}
          isOpen={openMenu === "media"}
        >
          {mediaNavLabel(locale)}
        </NavLink>
        {openMenu === "media" && (
          <DropdownMenu
            items={mediaChannels}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </div>

      <NavLink href={`${base}/publishers`} active={pathname.includes("/publishers")}>
        {isAr ? "ناشرون" : "Publishers"}
      </NavLink>

      <NavLink
        href={`${base}/publish`}
        active={pathname.includes("/publish")}
        accent
        className="nav-publish-pill"
      >
        {isAr ? "انشر كتابك" : "Publish"}
      </NavLink>
    </nav>
  );
}

function NavLink({
  href,
  children,
  hasDropdown,
  active,
  accent,
  isOpen,
  className,
}: {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
  active?: boolean;
  accent?: boolean;
  isOpen?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        className,
        "relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-[var(--motion-base)] md:px-3 hover:bg-white/8",
        accent
          ? "font-semibold bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red-hover)] shadow-sm  active:scale-[0.98]"
          : "hover:text-white",
        active &&
          !accent &&
          "after:absolute after:bottom-0 after:inset-x-1 after:h-[3px] after:rounded-full after:bg-[var(--brand-red)]",
        accent &&
          active &&
          "ring-2 ring-[var(--brand-red)] ring-offset-2 ring-offset-[var(--brand-black)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)]",
      )}
      style={
        accent ? undefined : { color: active ? "#ffffff" : "rgba(255,255,255,0.95)" }
      }
      aria-current={active ? "page" : undefined}
    >
      {children}
      {hasDropdown && (
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-[var(--motion-base)]",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

function DropdownMenu({
  items,
  onMouseEnter,
  onMouseLeave,
}: {
  items: { href: string; label: string }[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute top-full start-0 z-50 mt-1 min-w-[240px] animate-scale-in rounded-2xl border border-[var(--brand-gray-700)] bg-[#141414] py-2 shadow-2xl"
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          role="menuitem"
          className="mx-1 block rounded-xl px-4 py-2.5 text-sm transition-all duration-[var(--motion-base)] hover:bg-[var(--brand-red)] hover:text-white"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
