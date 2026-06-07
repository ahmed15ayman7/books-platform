import { Bookmark } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { ServicesSectionHeading } from "@/components/sections/services/services-section-heading";
import { cn } from "@/lib/utils";

interface OutputMapBlock {
  key: string;
  title: string;
  body: string;
  bullets?: string[];
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

export function ServicesOutputMap({ locale, title, blocks }: ServicesOutputMapProps) {
  const isAr = locale === "ar";

  return (
    <section id="output-map" dir={isAr ? "rtl" : "ltr"}>
      <ServicesSectionHeading title={title} />
      <div className="mt-10 grid gap-0 md:grid-cols-2 md:divide-x md:divide-[var(--brand-gray-200)]">
        {blocks.map((block, index) => (
          <article
            key={block.key}
            className={cn(
              "border-[var(--brand-gray-200)] px-0 py-8 md:px-8",
              index < blocks.length - 2 && "md:border-b",
              index % 2 === 0 && index < blocks.length - 1 && "md:border-b md:border-e-0",
              index % 2 === 1 && "md:border-b",
              "border-b last:border-b-0 md:last:border-b",
            )}
          >
            <BlockTitle title={block.title} />
            <p className="text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl">
              {block.body}
            </p>
            {block.bullets && block.bullets.length > 0 && (
              <ul className="mt-4 space-y-2">
                {block.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-lg text-[var(--brand-gray-700)] md:text-xl"
                  >
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
