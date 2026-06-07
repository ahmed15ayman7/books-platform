"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionBlock } from "@/components/sections/section-block";
import { ScaleIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

interface Step {
  title: string;
  body: string;
}

export function ServicesWorkflow({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <SectionBlock id="workflow" eyebrow={eyebrow} title={title} textSize="lg" staggerChildren={false}>
      <ol ref={ref} className="relative space-y-5 border-s-2 border-[var(--brand-red-soft)] ps-6">
        {!reduced && (
          <motion.div
            className="absolute start-[-2px] top-0 w-0.5 origin-top bg-[var(--brand-red)]"
            style={{ height: "100%", scaleY: lineScale }}
          />
        )}
        <StaggerContainer className="space-y-5">
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <li className="relative list-none">
                <ScaleIn delay={i * 0.06}>
                  <span className="absolute -start-[1.85rem] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </ScaleIn>
                <SlideIn from={i % 2 === 0 ? "start" : "end"}>
                  <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--brand-gray-900)] md:text-xl">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg">
                      {step.body}
                    </p>
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
