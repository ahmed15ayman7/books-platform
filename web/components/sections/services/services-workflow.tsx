import { SectionBlock } from "@/components/sections/section-block";

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
  return (
    <SectionBlock id="workflow" eyebrow={eyebrow} title={title} variant="card">
      <ol className="relative space-y-6 border-s-2 border-[var(--brand-red-soft)] ps-6">
        {steps.map((step, i) => (
          <li key={i} className="relative">
            <span className="absolute -start-[1.85rem] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3 className="font-bold text-[var(--brand-gray-900)]">{step.title}</h3>
            <p className="mt-1 text-sm text-[var(--brand-gray-600)] md:text-base">{step.body}</p>
          </li>
        ))}
      </ol>
    </SectionBlock>
  );
}
