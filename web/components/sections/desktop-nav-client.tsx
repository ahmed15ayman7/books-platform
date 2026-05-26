"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopNavClientProps {
  locale: string;
}

export function DesktopNavClient({ locale }: DesktopNavClientProps) {
  const pathname = usePathname();
  const t = locale === "ar";
  const base = `/${locale}`;

  const booksDropdown = [
    { href: `${base}/books`, label: t ? "كل الكتب" : "All Books" },
    { href: `${base}/books/nominated-for-translation`, label: t ? "مرشحة للترجمة" : "For Translation" },
    { href: `${base}/books/translated`, label: t ? "كتب مترجمة" : "Translated Books" },
  ];

  const articlesDropdown = [
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

      <div className="group relative">
        <NavLink href={`${base}/books`} hasDropdown active={pathname.includes("/books")}>
          {t ? "تصنيفات الكتب" : "Books"}
        </NavLink>
        <DropdownMenu items={booksDropdown} />
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

      <div className="group relative">
        <NavLink href={`${base}/articles/harvest`} hasDropdown active={pathname.includes("/articles")}>
          {t ? "قراءات وعروض" : "Readings"}
        </NavLink>
        <DropdownMenu items={articlesDropdown} />
      </div>

      <NavLink href={`${base}/publishers`} active={pathname.includes("/publishers")}>
        {t ? "ناشرون" : "Publishers"}
      </NavLink>

      <NavLink href={`${base}/publish`} active={pathname.includes("/publish")} accent>
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
}: {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-[var(--motion-base)] md:px-3 md:text-sm hover:bg-white/8",
        accent ? "hover:text-[#e85a68]" : "hover:text-white",
        active &&
          !accent &&
          "after:absolute after:bottom-0 after:inset-x-1 after:h-[3px] after:rounded-full after:bg-[var(--brand-red)]",
        accent &&
          active &&
          "after:absolute after:bottom-0 after:inset-x-1 after:h-[3px] after:rounded-full after:bg-[var(--brand-red)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)]"
      )}
      style={{
        color: accent ? "var(--brand-red)" : active ? "#ffffff" : "rgba(255,255,255,0.95)",
      }}
      aria-current={active ? "page" : undefined}
    >
      {children}
      {hasDropdown && (
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform group-hover:rotate-180"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

function DropdownMenu({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div
      className={cn(
        "absolute top-full start-0 z-50 mt-2 hidden min-w-[240px]",
        "animate-scale-in rounded-2xl border border-[var(--brand-gray-700)] bg-[#141414] py-2 shadow-2xl",
        "group-hover:block group-focus-within:block"
      )}
      role="menu"
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
