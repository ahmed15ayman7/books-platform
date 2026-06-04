"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Calendar } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils/formatters";
import { FadeIn } from "@/components/motion";

interface TeamStatsMiniProps {
  locale: Locale;
  totalMembers: number;
  featuredCount: number;
}

function useCountUp(target: number, started: boolean) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!started || hasRun.current) return;
    hasRun.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, started]);

  return count;
}

function MiniStat({
  value,
  label,
  Icon,
  index,
}: {
  value: number;
  label: string;
  Icon: typeof Users;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="flex flex-col items-center gap-2 rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 text-center shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <span className="font-display text-2xl font-black text-[var(--brand-red)]">
        {formatNumber(count, "en")}
      </span>
      <span className="text-sm text-[var(--brand-gray-600)]">{label}</span>
    </motion.div>
  );
}

export function TeamStatsMini({ locale, totalMembers, featuredCount }: TeamStatsMiniProps) {
  const isAr = locale === "ar";

  return (
    <FadeIn>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniStat
          value={totalMembers}
          label={isAr ? "عضو في الفريق" : "Team Members"}
          Icon={Users}
          index={0}
        />
        <MiniStat
          value={featuredCount}
          label={isAr ? "قيادة" : "Leadership"}
          Icon={Star}
          index={1}
        />
        <MiniStat
          value={2020}
          label={isAr ? "منذ عام" : "Since Year"}
          Icon={Calendar}
          index={2}
        />
      </div>
    </FadeIn>
  );
}
