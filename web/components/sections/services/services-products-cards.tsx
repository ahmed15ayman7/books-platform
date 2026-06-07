import type { Locale } from "@/lib/i18n";
import { ServicesSectionHeading } from "@/components/sections/services/services-section-heading";

interface ProductCard {
  key: string;
  title: string;
  items: string[];
}

interface ServicesProductsCardsProps {
  locale: Locale;
  title: string;
  cards: ProductCard[];
}

function RedProductCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="flex min-h-[220px] flex-col rounded-xl bg-[var(--brand-red)] px-6 py-8 text-center text-white shadow-sm md:min-h-[260px] md:px-8 md:py-10">
      <h3 className="font-display text-xl font-bold md:text-2xl">{title}</h3>
      <div className="mx-auto my-4 h-px w-16 bg-white/60" aria-hidden="true" />
      <ul className="flex flex-1 flex-col justify-center space-y-2 text-base leading-relaxed md:text-lg">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function ServicesProductsCards({ locale, title, cards }: ServicesProductsCardsProps) {
  const isAr = locale === "ar";
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3, 5);

  return (
    <section id="products" dir={isAr ? "rtl" : "ltr"}>
      <ServicesSectionHeading title={title} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topRow.map((card) => (
          <RedProductCard key={card.key} title={card.title} items={card.items} />
        ))}
      </div>
      {bottomRow.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-[calc(66.666%+1.25rem)]">
          {bottomRow.map((card) => (
            <RedProductCard key={card.key} title={card.title} items={card.items} />
          ))}
        </div>
      )}
    </section>
  );
}
