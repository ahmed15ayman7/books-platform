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
    <SectionBlock id="deliverables" eyebrow={eyebrow} title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <article
            key={d.key}
            className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-[var(--brand-gray-900)]">{d.title}</h3>
            <ul className="mt-3 space-y-1 text-sm text-[var(--brand-gray-600)]">
              {d.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" />
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
