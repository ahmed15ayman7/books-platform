"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface ArticleCategory {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
}

interface DesktopNavClientProps {
  locale: string;
  articleCategories?: ArticleCategory[];
}

export function DesktopNavClient({ locale, articleCategories = [] }: DesktopNavClientProps) {
  const pathname = usePathname();
  const t = locale === "ar";
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

  const booksDropdown = [
    { href: `${base}/books`, label: t ? "كل الكتب" : "All Books" },
    { href: `${base}/books/nominated-for-translation`, label: t ? "مرشحة للترجمة" : "For Translation" },
    { href: `${base}/books/translated`, label: t ? "كتب مترجمة" : "Translated Books" },
  ];

  const articlesChannels = [
    { href: `${base}/articles/world-reads`, label: t ? "العالم يقرأ" : "World Reads" },
    { href: `${base}/articles/harvest`, label: t ? "حصاد الكتب" : "Book Harvest" },
    { href: `${base}/articles/ideas`, label: t ? "زبدة الأفكار" : "Essence of Ideas" },
    { href: `${base}/articles/books-talk`, label: t ? "حديث الكتب" : "Book Talk" },
    { href: `${base}/articles/watch-your-book`, label: t ? "شاهد كتابك" : "Watch Your Book" },
    { href: `${base}/articles/novel-story`, label: t ? "رواية فحكاية" : "Novel & Story" },
  ];

  function isActive(href: string) {
    if (href === base) return pathname === base || pathname === `${base}/`;
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-0.5"
      role="navigation"
      aria-label={t ? "التنقل الرئيسي" : "Main navigation"}
    >
      <NavLink href={base} active={isActive(base)}>
        {t ? "الرئيسية" : "Home"}
      </NavLink>

      <div
        className="relative"
        onMouseEnter={() => openDropdown("books")}
        onMouseLeave={scheduleClose}
        onFocusCapture={() => openDropdown("books")}
        onBlurCapture={scheduleClose}
      >
        <NavLink href={`${base}/books`} hasDropdown active={pathname.includes("/books")} isOpen={openMenu === "books"}>
          {t ? "تصنيفات الكتب" : "Books"}
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
        {t ? "كتب مرشحة للترجمة" : "For Translation"}
      </NavLink>

      <NavLink href={`${base}/books/translated`} active={pathname.includes("/books/translated")}>
        {t ? "كتب مترجمة" : "Translated"}
      </NavLink>

      <div
        className="relative"
        onMouseEnter={() => openDropdown("articles")}
        onMouseLeave={scheduleClose}
        onFocusCapture={() => openDropdown("articles")}
        onBlurCapture={scheduleClose}
      >
        <NavLink
          href={`${base}/articles/harvest`}
          hasDropdown
          active={pathname.includes("/articles")}
          isOpen={openMenu === "articles"}
        >
          {t ? "قراءات وعروض" : "Readings"}
        </NavLink>
        {openMenu === "articles" && (
          <ArticlesDropdown
            channels={articlesChannels}
            categories={articleCategories}
            locale={locale}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </div>

      <NavLink href={`${base}/publishers`} active={pathname.includes("/publishers")}>
        {t ? "ناشرون" : "Publishers"}
      </NavLink>

      <NavLink
        href={`${base}/publish`}
        active={pathname.includes("/publish")}
        accent
        className="nav-publish-pill"
      >
        {t ? "انشر كتابك" : "Publish"}
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)]"
      )}
      style={
        accent
          ? undefined
          : { color: active ? "#ffffff" : "rgba(255,255,255,0.95)" }
      }
      aria-current={active ? "page" : undefined}
    >
      {children}
      {hasDropdown && (
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-[var(--motion-base)]",
            isOpen && "rotate-180"
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

function ArticlesDropdown({
  channels: _channels,
  categories,
  locale,
  onMouseEnter,
  onMouseLeave,
}: {
  channels: { href: string; label: string }[];
  categories: ArticleCategory[];
  locale: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isAr = locale === "ar";
  const base = `/${locale}`;

  return (
    <div
      className="absolute top-full start-0 z-50 mt-1 min-w-[280px] max-h-[70vh] overflow-y-auto animate-scale-in rounded-2xl border border-[var(--brand-gray-700)] bg-[#141414] py-2 shadow-2xl"
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="px-4 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
        {isAr ? "القنوات" : "Channels"}
      </p>
      {/* {channels.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          role="menuitem"
          className="mx-1 block rounded-xl px-4 py-2.5 text-sm transition-all duration-[var(--motion-base)] hover:bg-[var(--brand-red)] hover:text-white"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {item.label}
        </Link>
      ))} */}

      {categories.length > 0 && (
        <>
          <div className="my-2 mx-2 border-t border-white/10" />
          <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
            {isAr ? "التصنيفات" : "Categories"}
          </p>
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`${base}/articles/category/${cat.slug}`}
              role="menuitem"
              className="mx-1 block rounded-xl px-4 py-2 text-sm transition-all duration-[var(--motion-base)] hover:bg-[var(--brand-red)] hover:text-white"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {isAr && cat.nameAr ? cat.nameAr : cat.name}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
