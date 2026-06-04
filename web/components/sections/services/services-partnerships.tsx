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
    <SectionBlock id="partnerships" eyebrow={eyebrow} title={title}>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.key}
            className="flex flex-col rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold text-[var(--brand-gray-900)]">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--brand-gray-600)]">{p.body}</p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-fit">
              <Link href={p.href}>{p.title}</Link>
            </Button>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
