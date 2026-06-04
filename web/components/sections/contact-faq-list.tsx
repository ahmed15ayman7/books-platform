"use client";

import { FadeIn } from "@/components/motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ContactFaqListProps {
  items: FaqItem[];
}

export function ContactFaqList({ items }: ContactFaqListProps) {
  return (
    <div className="mt-4 space-y-2">
      {items.map((item, index) => (
        <FadeIn key={item.id} delay={index * 0.05}>
          <details className="rounded-lg border border-[var(--brand-gray-200)] bg-white p-4">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-[var(--brand-gray-600)]">{item.answer}</p>
          </details>
        </FadeIn>
      ))}
    </div>
  );
}
