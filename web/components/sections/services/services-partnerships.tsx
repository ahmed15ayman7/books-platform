import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { Button } from "@/components/ui/button";

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
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.key}
            className="flex flex-col rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[var(--brand-gray-900)] md:text-2xl">{p.title}</h3>
            <p className="mt-3 flex-1 text-lg leading-relaxed text-[var(--brand-gray-600)] md:text-xl">
              {p.body}
            </p>
            <Button asChild variant="outline" size="lg" className="mt-5 w-fit">
              <Link href={p.href}>{p.title}</Link>
            </Button>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
