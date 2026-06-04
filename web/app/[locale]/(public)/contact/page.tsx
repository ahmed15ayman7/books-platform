import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ContentPageShell } from "@/components/sections/content-page-shell";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";
import { Mail, Phone, MapPin } from "lucide-react";
import { getContactContent, getFaqLocalized } from "@/lib/content/contact";
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
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <section id="channels">
            <h2 className="font-bold text-[var(--brand-gray-900)]">
              {isAr ? "بيانات التواصل" : "Contact Details"}
            </h2>
            <div className="mt-4 space-y-3">
              <a
                href={`tel:${content.channels.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 hover:border-[var(--brand-red)]"
              >
                <Phone className="h-5 w-5 text-[var(--brand-red)]" />
                <div>
                  <p className="text-sm text-[var(--brand-gray-500)]">{isAr ? "هاتف" : "Phone"}</p>
                  <p className="font-semibold" dir="ltr">{content.channels.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${content.channels.email}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 hover:border-[var(--brand-red)]"
              >
                <Mail className="h-5 w-5 text-[var(--brand-red)]" />
                <div>
                  <p className="text-sm text-[var(--brand-gray-500)]">{isAr ? "بريد" : "Email"}</p>
                  <p className="font-semibold">{content.channels.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4">
                <MapPin className="h-5 w-5 text-[var(--brand-red)]" />
                <div>
                  <p className="text-sm text-[var(--brand-gray-500)]">{content.location.title}</p>
                  <p className="text-sm">{content.location.body}</p>
                  <p className="mt-1 text-xs text-[var(--brand-gray-500)]">{content.channels.officeHours}</p>
                </div>
              </div>
            </div>
          </section>

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
            <div className="mt-4 space-y-2">
              {faq.map((item) => (
                <details
                  key={item.id}
                  className="rounded-lg border border-[var(--brand-gray-200)] bg-white p-4"
                >
                  <summary className="cursor-pointer font-medium">{item.question}</summary>
                  <p className="mt-2 text-sm text-[var(--brand-gray-600)]">{item.answer}</p>
                </details>
              ))}
            </div>
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
