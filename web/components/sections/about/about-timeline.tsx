"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionBlock } from "@/components/sections/section-block";
import { ScaleIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

interface AboutTimelineProps {
  id?: string;
  eyebrow: string;
  title: string;
  items: string[];
}

export function AboutTimeline({ id, eyebrow, title, items }: AboutTimelineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <SectionBlock id={id} eyebrow={eyebrow} title={title} staggerChildren={false}>
      <ol ref={ref} className="relative space-y-5 border-s-2 border-[var(--brand-red-soft)] ps-6">
        {!reduced && (
          <motion.div
            className="absolute start-[-2px] top-0 w-0.5 origin-top bg-[var(--brand-red)]"
            style={{ height: "100%", scaleY: lineScale }}
          />
        )}
        <StaggerContainer className="space-y-5">
          {items.map((item, i) => (
            <StaggerItem key={i}>
              <li className="relative list-none">
                <ScaleIn delay={i * 0.06}>
                  <span className="absolute -start-[1.85rem] flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-red)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </ScaleIn>
                <SlideIn from={i % 2 === 0 ? "start" : "end"}>
                  <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-[var(--brand-gray-700)] md:text-base">{item}</p>
                  </div>
                </SlideIn>
              </li>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ol>
    </SectionBlock>
  );
}
