import { SectionBlock } from "@/components/sections/section-block";

interface Deliverable {
  key: string;
  title: string;
  items: string[];
}

export function ServicesDeliverables({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Deliverable[];
}) {
  return (
    <SectionBlock id="deliverables" eyebrow={eyebrow} title={title} textSize="lg">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <article
            key={d.key}
            className="rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[var(--brand-gray-900)] md:text-xl">{d.title}</h3>
            <ul className="mt-4 space-y-2 text-base text-[var(--brand-gray-600)] md:text-lg">
              {d.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
