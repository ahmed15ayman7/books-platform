import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe2, Languages, Target } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/about`,
    title: locale === "ar" ? "من نحن" : "About Us",
    description:
      locale === "ar"
        ? "منصة الكتب العالمية — نافذة العالم على الكتب للقارئ العربي"
        : "Books Platform — a window to world books for Arabic readers",
    keywords: locale === "ar" ? ["من نحن", "منصة كتب"] : ["about", "books platform"],
  });
}

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  const pillars = [
    {
      icon: Globe2,
      title: isAr ? "اكتشاف عالمي" : "Global Discovery",
      desc: isAr
        ? "كتب من دور نشر حول العالم في مكان واحد"
        : "Books from publishers worldwide in one place",
    },
    {
      icon: Languages,
      title: isAr ? "ترجمة ونشر" : "Translation & Publishing",
      desc: isAr
        ? "ربط الكتب المرشحة للترجمة بالمترجمين والناشرين"
        : "Connecting nominated books with translators and publishers",
    },
    {
      icon: BookOpen,
      title: isAr ? "محتوى فكري" : "Intellectual Content",
      desc: isAr
        ? "مقالات وحصاد وحديث كتب يعمّق القراءة"
        : "Articles, harvest, and book talk deepen reading",
    },
  ];

  const goals = isAr
    ? [
        "توسيع الوصول للكتب العالمية بالعربية",
        "دعم المترجمين والناشرين العرب",
        "بناء مجتمع قراءة نشط",
        "تسهيل اكتشاف الكتب حسب الاهتمام",
      ]
    : [
        "Expand access to world books in Arabic",
        "Support Arabic translators and publishers",
        "Build an active reading community",
        "Make book discovery easier by interest",
      ];

  const differentiators = isAr
    ? [
        "كتالوج ضخم من دور نشر عالمية",
        "أقسام مقالات متخصصة",
        "مسار واضح لنشر وترجمة الكتب",
        "واجهة ثنائية اللغة عربي/إنجليزي",
      ]
    : [
        "Large catalog from global publishers",
        "Specialized article channels",
        "Clear path to publish and translate books",
        "Bilingual Arabic/English interface",
      ];

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "منصة الكتب العالمية" : "Books Platform"}
        subtitle={
          isAr
            ? "نافذة العالم على الكتب — للقارئ العربي وكل كتاب جديد"
            : "A window to world books — for Arabic readers and every new book"
        }
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "من نحن" : "About Us" },
        ]}
      />

      <div className="container-platform space-y-16 py-12">
        <section>
          <h2 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "فكرة المنصة" : "Our Idea"}
          </h2>
          <p className="mt-4 max-w-3xl text-[var(--brand-gray-700)] leading-relaxed">
            {isAr
              ? "نؤمن أن القارئ العربي يستحق الوصول إلى أفضل ما يُنشر في العالم — من روايات ودراسات إلى علوم وفلسفة — دون حواجز لغوية أو جغرافية. منصتنا تجمع الكتب والناشرين والمقالات في تجربة واحدة متكاملة."
              : "We believe Arabic readers deserve access to the best published worldwide — from novels and studies to science and philosophy — without language or geographic barriers. Our platform unifies books, publishers, and articles in one integrated experience."}
          </p>
        </section>

        <section className="rounded-xl bg-[var(--brand-black)] px-8 py-10 text-center text-white">
          <Target className="mx-auto h-10 w-10 text-[var(--brand-red)]" aria-hidden="true" />
          <blockquote className="mt-4 font-display text-2xl font-bold md:text-3xl">
            {isAr
              ? "«أن نكون الجسر بين العالم والقارئ العربي»"
              : '"To be the bridge between the world and the Arabic reader"'}
          </blockquote>
          <p className="mt-3 text-sm text-[var(--brand-gray-400)]">
            {isAr ? "رؤيتنا" : "Our Vision"}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "رسالتنا" : "Our Mission"}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 text-center"
              >
                <item.icon className="mx-auto h-8 w-8 text-[var(--brand-red)]" aria-hidden="true" />
                <h3 className="mt-3 font-bold text-[var(--brand-gray-900)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--brand-gray-600)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "أهدافنا" : "Our Goals"}
          </h2>
          <ol className="mt-6 space-y-3">
            {goals.map((goal, i) => (
              <li
                key={goal}
                className="flex items-start gap-4 rounded-lg border border-[var(--brand-gray-200)] bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[var(--brand-gray-700)]">{goal}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "ما يميزنا" : "What Sets Us Apart"}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {differentiators.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm text-[var(--brand-gray-700)] border border-[var(--brand-gray-200)]"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="text-center">
          <p className="mx-auto max-w-2xl text-lg text-[var(--brand-gray-700)]">
            {isAr
              ? "غايتنا أن يجد كل قارئ عربي كتابه القادم — وأن يجد كل كتاب عالمي طريقه إلى العربية."
              : "Our aim is for every Arabic reader to find their next book — and for every world book to find its path into Arabic."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/books`}>{isAr ? "تصفّح الكتب" : "Browse Books"}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/publish`}>{isAr ? "انشر كتابك" : "Publish Your Book"}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
