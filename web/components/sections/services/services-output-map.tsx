import { Bookmark } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { ServicesSectionHeading } from "@/components/sections/services/services-section-heading";
import { cn } from "@/lib/utils";

interface OutputMapBlock {
  key: string;
  title: string;
  body: string;
  bullets?: string[];
  spanFullWidth?: boolean;
}

interface ServicesOutputMapProps {
  locale: Locale;
  title: string;
  blocks: OutputMapBlock[];
}

function BlockTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--brand-red)]"
        aria-hidden="true"
      >
        <Bookmark className="h-4 w-4 fill-white text-white" />
      </span>
      <h3 className="font-display text-xl font-bold text-[var(--brand-gray-900)] md:text-2xl">
        {title}
      </h3>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-lg text-[var(--brand-gray-700)] md:text-xl"
        >
          <span
            className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-red)]"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SplitFullWidthBlock({ block }: { block: OutputMapBlock }) {
  return (
    <article className="border-b border-[var(--brand-gray-200)] px-0 py-8 md:col-span-2 md:px-8">
      <BlockTitle title={block.title} />
      <div className="grid gap-6 md:grid-cols-2 md:gap-8 md:divide-x md:divide-[var(--brand-gray-200)]">
        <p className="text-lg leading-relaxed text-[var(--brand-gray-700)] md:pe-8 md:text-xl">
          {block.body}
        </p>
        {block.bullets && block.bullets.length > 0 ? (
          <div className="md:ps-8">
            <BulletList items={block.bullets} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function RegularBlock({
  block,
  className,
}: {
  block: OutputMapBlock;
  className?: string;
}) {
  return (
    <article className={cn("border-[var(--brand-gray-200)] px-0 py-8 md:px-8", className)}>
      <BlockTitle title={block.title} />
      <p className="text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl">
        {block.body}
      </p>
      {block.bullets && block.bullets.length > 0 ? (
        <div className="mt-4">
          <BulletList items={block.bullets} />
        </div>
      ) : null}
    </article>
  );
}

export function ServicesOutputMap({ locale, title, blocks }: ServicesOutputMapProps) {
  const isAr = locale === "ar";
  const fullWidthBlocks = blocks.filter((b) => b.spanFullWidth);
  const gridBlocks = blocks.filter((b) => !b.spanFullWidth);

  return (
    <section id="output-map" dir={isAr ? "rtl" : "ltr"}>
      <ServicesSectionHeading title={title} />
      <div className="mt-10 grid gap-0 md:grid-cols-2 md:divide-x md:divide-[var(--brand-gray-200)]">
        {fullWidthBlocks.map((block) => (
          <SplitFullWidthBlock key={block.key} block={block} />
        ))}

        {gridBlocks.map((block, index) => (
          <RegularBlock
            key={block.key}
            block={block}
            className={cn(
              "border-b last:border-b-0 md:last:border-b",
              index < gridBlocks.length - 2 && "md:border-b",
              index % 2 === 0 && index < gridBlocks.length - 1 && "md:border-b md:border-e-0",
              index % 2 === 1 && "md:border-b",
            )}
          />
        ))}
      </div>
    </section>
  );
}
