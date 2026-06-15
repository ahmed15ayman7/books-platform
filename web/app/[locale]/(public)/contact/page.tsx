import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { ImageTextBand } from "@/components/sections/image-text-band";
import { ContactChannelCards } from "@/components/sections/contact-channel-cards";
import { ContactFaqList } from "@/components/sections/contact-faq-list";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";
import { getContactContent, getFaqLocalized } from "@/lib/content/contact";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const content = getContactContent(locale);
  return buildPageMetadata({
    locale,
    path: `/${locale}/contact`,
    title: locale === "ar" ? "اتصل بنا | منصة الكتب العالمية" : "Contact Us | Books Platform",
    description: content.hero.subtitle,
    keywords: locale === "ar" ? ["اتصل بنا", "تواصل"] : ["contact", "support"],
  });
}

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const content = getContactContent(locale);
  const isAr = locale === "ar";
  const faq = getFaqLocalized(content.faq.items, locale);

  return (
    <ContentPageShell
      locale={locale}
      hero={{
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        variant: "light",
        breadcrumbs: [
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: content.hero.title },
        ],
      }}
    >
      <ImageTextBand
        id="contact-intro"
        title={isAr ? "تواصل معنا" : "Get in Touch"}
        lead={content.hero.subtitle}
        image={{
          src: ABOUT_IMAGES.contact,
          alt: isAr ? "تواصل" : "Contact",
        }}
        imagePosition="left"
      >
        <ContactChannelCards
          phone={content.channels.phone}
          mobile={content.channels.mobile}
          email={content.channels.email}
          secondaryEmail={content.channels.secondaryEmail}
          locationTitle={content.location.title}
          locationBody={content.location.body}
          officeHours={content.channels.officeHours}
          phoneLabel={isAr ? "هاتف" : "Phone"}
          mobileLabel={isAr ? "موبايل" : "Mobile"}
          emailLabel={isAr ? "بريد" : "Email"}
        />
      </ImageTextBand>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <section id="response-times">
            <h2 className="font-bold text-[var(--brand-gray-900)]">
              {isAr ? "مدة الرد المتوقعة" : "Expected Response"}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {content.responseTimes.map((r) => (
                <div key={r.key} className="rounded-lg border bg-white p-4 text-center">
                  <p className="text-xs text-[var(--brand-gray-500)]">{r.label}</p>
                  <p className="mt-1 font-bold text-[var(--brand-red)]">{r.time}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq">
            <h2 className="font-bold text-[var(--brand-gray-900)]">{content.faq.title}</h2>
            <ContactFaqList items={faq} />
          </section>

          <section id="social">
            <p className="mb-3 text-sm font-medium">{isAr ? "تابعنا" : "Follow Us"}</p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <SocialIconCircle key={social.href} href={social.href} label={social.label}>
                  <social.Icon />
                </SocialIconCircle>
              ))}
            </div>
          </section>
        </div>

        <div id="form" className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 md:p-8 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-6 font-bold">{isAr ? "أرسل رسالة" : "Send a Message"}</h2>
          <ContactForm locale={locale} topics={content.formTopics} />
        </div>
      </div>
    </ContentPageShell>
  );
}
