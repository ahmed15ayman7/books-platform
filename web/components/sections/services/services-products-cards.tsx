import type { Locale } from "@/lib/i18n";
import { ServicesSectionHeading } from "@/components/sections/services/services-section-heading";

interface ProductCard {
  key: string;
  title: string;
  body: string;
  audiences: string;
}

interface ServicesProductsCardsProps {
  locale: Locale;
  title: string;
  audiencesLabel: string;
  cards: ProductCard[];
}

function RedProductCard({
  title,
  body,
  audiencesLabel,
  audiences,
}: {
  title: string;
  body: string;
  audiencesLabel: string;
  audiences: string;
}) {
  return (
    <article className="flex flex-col rounded-xl bg-[var(--brand-red)] px-6 py-8 text-white shadow-sm md:px-8 md:py-10">
      <h3 className="text-center font-display text-xl font-bold md:text-2xl">{title}</h3>
      <div className="mx-auto my-4 h-px w-16 bg-white/60" aria-hidden="true" />
      <div className="space-y-4 text-start text-base leading-relaxed md:text-lg">
        <p>{body}</p>
        <p>
          <span className="font-semibold">{audiencesLabel}</span> {audiences}
        </p>
      </div>
    </article>
  );
}

export function ServicesProductsCards({
  locale,
  title,
  audiencesLabel,
  cards,
}: ServicesProductsCardsProps) {
  const isAr = locale === "ar";
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3, 5);

  return (
    <section id="products" dir={isAr ? "rtl" : "ltr"}>
      <ServicesSectionHeading title={title} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topRow.map((card) => (
          <RedProductCard
            key={card.key}
            title={card.title}
            body={card.body}
            audiencesLabel={audiencesLabel}
            audiences={card.audiences}
          />
        ))}
      </div>
      {bottomRow.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-[calc(66.666%+1.25rem)]">
          {bottomRow.map((card) => (
            <RedProductCard
              key={card.key}
              title={card.title}
              body={card.body}
              audiencesLabel={audiencesLabel}
              audiences={card.audiences}
            />
          ))}
        </div>
      )}
    </section>
  );
}
