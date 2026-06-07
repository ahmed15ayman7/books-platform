"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionBlock } from "@/components/sections/section-block";
import { ScaleIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TimelineStep {
  title: string;
  body: string;
}

interface AboutTimelineProps {
  id?: string;
  eyebrow: string;
  title: string;
  items?: string[];
  steps?: TimelineStep[];
  textSize?: "default" | "lg";
}

export function AboutTimeline({
  id,
  eyebrow,
  title,
  items,
  steps,
  textSize = "default",
}: AboutTimelineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const isLarge = textSize === "lg";
  const entries = steps ?? items?.map((item) => ({ title: "", body: item })) ?? [];

  return (
    <SectionBlock id={id} eyebrow={eyebrow} title={title} textSize={textSize} staggerChildren={false}>
      <ol ref={ref} className="relative space-y-5 border-s-2 border-[var(--brand-red-soft)] ps-6">
        {!reduced && (
          <motion.div
            className="absolute start-[-2px] top-0 w-0.5 origin-top bg-[var(--brand-red)]"
            style={{ height: "100%", scaleY: lineScale }}
          />
        )}
        <StaggerContainer className="space-y-5">
          {entries.map((entry, i) => (
            <StaggerItem key={i}>
              <li className="relative list-none">
                <ScaleIn delay={i * 0.06}>
                  <span className="absolute -start-[1.85rem] flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-red)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </ScaleIn>
                <SlideIn from={i % 2 === 0 ? "start" : "end"}>
                  <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm">
                    {entry.title ? (
                      <>
                        <h3
                          className={cn(
                            "font-bold text-[var(--brand-gray-900)]",
                            isLarge ? "text-lg md:text-xl" : "text-base",
                          )}
                        >
                          {entry.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-1 leading-relaxed text-[var(--brand-gray-700)]",
                            isLarge ? "text-base md:text-lg" : "text-sm md:text-base",
                          )}
                        >
                          {entry.body}
                        </p>
                      </>
                    ) : (
                      <p
                        className={cn(
                          "leading-relaxed text-[var(--brand-gray-700)]",
                          isLarge ? "text-base md:text-lg" : "text-sm md:text-base",
                        )}
                      >
                        {entry.body}
                      </p>
                    )}
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
