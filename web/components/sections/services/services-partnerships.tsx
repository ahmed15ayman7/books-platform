import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { cn } from "@/lib/utils";

interface Partnership {
  key: string;
  title: string;
  body: string;
  href: string;
}

export function ServicesPartnerships({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Partnership[];
}) {
  return (
    <SectionBlock id="partnerships" eyebrow={eyebrow} title={title} textSize="lg">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.key}
            className="flex flex-col rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[var(--brand-gray-900)] md:text-xl">{p.title}</h3>
            <p className="mt-2 flex-1 text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg">
              {p.body}
            </p>
            <Link
              href={p.href}
              className={cn(
                "mt-4 inline-flex w-fit items-center rounded-md border border-[var(--brand-gray-300)] px-4 py-2",
                "text-base font-medium text-[var(--brand-gray-900)] transition-colors",
                "hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]",
              )}
            >
              {p.title}
            </Link>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
