import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";
import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

const CONTACT_EMAIL = "info@booksplatform.net";
const CONTACT_PHONE = "+966500000000";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/contact`,
    title: locale === "ar" ? "اتصل بنا" : "Contact Us",
    description:
      locale === "ar"
        ? "تواصل مع فريق منصة الكتب العالمية"
        : "Get in touch with the Books Platform team",
    keywords: locale === "ar" ? ["اتصل بنا", "تواصل"] : ["contact", "support"],
  });
}

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "تواصل معنا" : "Contact Us"}
        subtitle={
          isAr
            ? "نسعد باستفساراتك واقتراحاتك وشراكاتك"
            : "We welcome your questions, suggestions, and partnerships"
        }
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "اتصل بنا" : "Contact Us" },
        ]}
      />

      <div className="container-platform py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-bold text-[var(--brand-gray-900)]">
              {isAr ? "بيانات التواصل" : "Contact Details"}
            </h2>

            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 transition-colors hover:border-[var(--brand-red)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-[var(--brand-gray-500)]">{isAr ? "هاتف" : "Phone"}</p>
                <p className="font-semibold text-[var(--brand-gray-900)]" dir="ltr">
                  {CONTACT_PHONE}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 transition-colors hover:border-[var(--brand-red)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-[var(--brand-gray-500)]">{isAr ? "بريد" : "Email"}</p>
                <p className="font-semibold text-[var(--brand-gray-900)]">{CONTACT_EMAIL}</p>
              </div>
            </a>

            <div>
              <p className="mb-3 text-sm font-medium text-[var(--brand-gray-700)]">
                {isAr ? "تابعنا" : "Follow Us"}
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <SocialIconCircle
                    key={social.href}
                    href={social.href}
                    label={social.label}
                  >
                    <social.Icon />
                  </SocialIconCircle>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 md:p-8">
            <h2 className="mb-6 font-bold text-[var(--brand-gray-900)]">
              {isAr ? "أرسل رسالة" : "Send a Message"}
            </h2>
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
