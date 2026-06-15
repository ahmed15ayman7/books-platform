import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ServicesBibliographyFeature } from "@/components/sections/services/services-bibliography-feature";
import { ServicesClosing } from "@/components/sections/services/services-closing";
import { ServicesOutputMap } from "@/components/sections/services/services-output-map";
import { ServicesPageHero } from "@/components/sections/services/services-page-hero";
import { ServicesPlatformList } from "@/components/sections/services/services-platform-list";
import { ServicesProductsCards } from "@/components/sections/services/services-products-cards";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { getServicesContent } from "@/lib/content/services";
import { localeHref, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getServicesContent(locale);
  return buildPageMetadata({
    locale,
    path: localeHref(locale, "/services"),
    title: locale === "ar" ? "خدماتنا | منصة الكتب العالمية" : "Our Services | Books Platform",
    description: content.platformServices.intro.slice(0, 155),
    keywords: locale === "ar" ? ["خدمات", "ببليوغرافيا"] : ["services", "bibliography"],
  });
}

export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;
  const content = getServicesContent(locale);
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-white text-[var(--brand-gray-900)]">
      <ServicesPageHero
        locale={locale}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        imageSrc={ABOUT_IMAGES.servicesHero}
        imageAlt={isAr ? "خدمات منصة الكتب" : "Books Platform services"}
      />

      <div className="container-platform space-y-16 py-14 md:space-y-24 md:py-20">
        <ServicesPlatformList
          locale={locale}
          title={content.platformServices.title}
          intro={content.platformServices.intro}
          items={content.platformServices.items}
        />

        <ServicesOutputMap
          locale={locale}
          title={content.outputMap.title}
          blocks={content.outputMap.blocks}
        />

        <ServicesBibliographyFeature
          locale={locale}
          title={content.bibliography.title}
          body={content.bibliography.body}
          imageSrc={ABOUT_IMAGES.servicesBibliography}
          imageAlt={isAr ? "ببليوغرافيا المنصة" : "Platform bibliography"}
        />

        <ServicesProductsCards
          locale={locale}
          title={content.products.title}
          audiencesLabel={content.products.audiencesLabel}
          cards={content.products.cards}
        />

        <ServicesClosing locale={locale} text={content.closing} />
      </div>
    </div>
  );
}
