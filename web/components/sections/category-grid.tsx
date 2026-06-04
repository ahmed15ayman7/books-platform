"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  FlaskConical,
  Globe2,
  GraduationCap,
  Heart,
  Landmark,
  Languages,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export interface CategoryItem {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  linkedCount: number;
}

function iconForCategorySlug(slug: string): LucideIcon {
  const s = slug.toLowerCase();
  if (s.includes("tech") || s.includes("science") || s.includes("تقن")) return FlaskConical;
  if (s.includes("social") || s.includes("دراس")) return GraduationCap;
  if (
    s.includes("philos") ||
    s.includes("culture") ||
    s.includes("فلسف") ||
    s.includes("ثقاف")
  )
    return Brain;
  if (s.includes("relig") || s.includes("دين")) return ScrollText;
  if (s.includes("art") || s.includes("فن")) return Heart;
  if (s.includes("history") || s.includes("تاريخ")) return Landmark;
  if (s.includes("lang") || s.includes("لغ")) return Languages;
  if (s.includes("world") || s.includes("عالم")) return Globe2;
  return BookOpen;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number] },
  },
};

interface CategoryGridProps {
  categories: CategoryItem[];
  locale: Locale;
  className?: string;
  showSpecialLinks?: boolean;
}

export function CategoryGrid({
  categories,
  locale,
  className,
  showSpecialLinks = true,
}: CategoryGridProps) {
  const isAr = locale === "ar";
  const base = `/${locale}/books`;
  const displayCategories = categories.slice(0, 7);

  const allItems = [
    ...displayCategories.map((cat) => ({
      key: cat.id,
      href: `${base}/category/${cat.slug}`,
      Icon: iconForCategorySlug(cat.slug),
      label: isAr && cat.nameAr ? cat.nameAr : cat.name,
    })),
    ...(showSpecialLinks
      ? [
          {
            key: "translated",
            href: `${base}/translated`,
            Icon: Languages,
            label: isAr ? "كتب مترجمة" : "Translated",
          },
          {
            key: "nominated",
            href: `${base}/nominated-for-translation`,
            Icon: Globe2,
            label: isAr ? "مرشحة للترجمة" : "For Translation",
          },
        ]
      : []),
  ];

  return (
    <motion.div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px 0px" }}
    >
      {allItems.map(({ key, href, Icon, label }) => (
        <motion.div key={key} variants={itemVariants}>
          <Link
            href={href}
            className="group flex min-w-[140px] flex-col items-center gap-2 rounded-2xl border border-[var(--brand-gray-200)] bg-white p-4 text-center surface-card md:min-w-0 transition-shadow hover:shadow-[var(--shadow-soft-lg)]"
          >
            <motion.div
              whileHover={{ scale: 1.12, rotate: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)] group-hover:bg-[var(--brand-red)] group-hover:text-white transition-colors"
            >
              <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </motion.div>
            <span className="text-sm font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] transition-colors">
              {label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
