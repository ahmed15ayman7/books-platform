"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Building2, Languages, Globe2 } from "lucide-react";
import { formatNumber } from "@/lib/utils/formatters";

interface StatItem {
  value: number;
  labelKey: string;
  Icon: LucideIcon;
}

interface StatsCounterProps {
  totalBooks: number;
  totalPublishers: number;
  totalTranslatedBooks: number;
  totalCountries: number;
  locale: string;
}

function useCountUp(target: number, duration = 1600, started = false) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!started || hasRun.current || target === 0) return;
    hasRun.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);

  return count;
}

function StatCard({
  stat,
  locale,
  index,
}: {
  stat: StatItem;
  locale: string;
  index: number;
}) {
  const t = useTranslations("home.stats");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const count = useCountUp(stat.value, 1600, inView);
  const Icon = stat.Icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.8, 0.25, 1] }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[var(--brand-red)]"
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </motion.div>
      <span className="font-display text-display-md font-black text-[var(--brand-red)]">
        {formatNumber(count, locale as "ar" | "en")}+
      </span>
      <span className="text-sm font-medium text-[var(--brand-gray-300)]">
        {t(stat.labelKey as "books" | "publishers" | "translatedBooks" | "countries")}
      </span>
    </motion.div>
  );
}

export function StatsCounter({
  totalBooks,
  totalPublishers,
  totalTranslatedBooks,
  totalCountries,
  locale,
}: StatsCounterProps) {
  const stats: StatItem[] = [
    { value: totalBooks, labelKey: "books", Icon: BookOpen },
    { value: totalPublishers, labelKey: "publishers", Icon: Building2 },
    { value: totalTranslatedBooks, labelKey: "translatedBooks", Icon: Languages },
    { value: totalCountries, labelKey: "countries", Icon: Globe2 },
  ];

  return (
    <section className="bg-[var(--brand-black)] py-16" aria-label="Platform statistics">
      <div className="container-platform">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.labelKey} stat={stat} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
