"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionBlock } from "@/components/sections/section-block";
import { ScaleIn, StaggerContainer, StaggerItem, FadeIn } from "@/components/motion";
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
  const lineScale = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <SectionBlock id="workflow" eyebrow={eyebrow} title={title} variant="card" staggerChildren={false}>
      <ol ref={ref} className="relative space-y-6 border-s-2 border-[var(--brand-red-soft)] ps-6">
        {!reduced && (
          <motion.div
            className="absolute start-[-2px] top-0 w-0.5 origin-top bg-[var(--brand-red)]"
            style={{ height: "100%", scaleY: lineScale }}
          />
        )}
        <StaggerContainer className="space-y-6">
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <li className="relative list-none">
                <ScaleIn delay={i * 0.08}>
                  <span className="absolute -start-[1.85rem] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </ScaleIn>
                <FadeIn delay={0.1 + i * 0.06}>
                  <h3 className="font-bold text-[var(--brand-gray-900)]">{step.title}</h3>
                  <p className="mt-1 text-sm text-[var(--brand-gray-600)] md:text-base">{step.body}</p>
                </FadeIn>
              </li>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ol>
    </SectionBlock>
  );
}
