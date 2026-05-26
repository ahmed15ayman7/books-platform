import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { BookService } from "@/server/services/book.service";
import { PageHero } from "@/components/sections/page-hero";
import { PublishBookForm } from "@/components/forms/publish-book-form";
import { BookCard } from "@/components/sections/book-card";
import { CheckCircle, ArrowRight, Eye } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/publish`,
    title: locale === "ar" ? "انشر كتابك" : "Publish Your Book",
    description:
      locale === "ar"
        ? "انشر كتابك وصله لآلاف القراء — الكتاب الأول مجاناً"
        : "Publish your book and reach thousands of readers",
    keywords: locale === "ar" ? ["نشر", "مؤلفون"] : ["publish", "authors"],
  });
}

export default async function PublishPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("publish");

  const recentBooks = await BookService.list({ limit: 4, sort: "newest" })
    .then((r) => r.books)
    .catch(() => []);

  const isAr = locale === "ar";

  const steps = [
    { icon: <ArrowRight className="h-6 w-6" />, label: t("steps.submit"), step: 1 },
    { icon: <Eye className="h-6 w-6" />, label: t("steps.review"), step: 2 },
    { icon: <CheckCircle className="h-6 w-6" />, label: t("steps.publish"), step: 3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        size="lg"
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: t("title") },
        ]}
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red)] text-white">
                {step.icon}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
              {index < steps.length - 1 && (
                <ArrowRight
                  className={`hidden h-5 w-5 text-[var(--brand-gray-500)] sm:block ${isAr ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </PageHero>

      <div className="container-platform py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-[var(--brand-gray-200)] md:p-8">
              <PublishBookForm locale={locale} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* First Free badge */}
            <div className="rounded-xl bg-[var(--brand-red)] p-5 text-white text-center">
              <p className="text-2xl font-black">🎉</p>
              <p className="mt-1 text-lg font-bold">{t("form.firstFreeNote")}</p>
              <p className="mt-1 text-sm text-[var(--brand-red-soft)]">
                {isAr
                  ? "الكتاب الأول دائماً مجاناً بدون أي تكلفة"
                  : "Your first book submission is always free"}
              </p>
            </div>

            {/* Recent published books */}
            {recentBooks.length > 0 && (
              <div>
                <h3 className="mb-3 font-bold text-[var(--brand-gray-900)]">
                  {isAr ? "آخر الإصدارات" : "Recent Releases"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {recentBooks.slice(0, 4).map((book) => (
                    <BookCard key={book.id} {...book} locale={locale} compact />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
