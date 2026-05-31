import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PublisherService } from "@/server/services/publisher.service";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/sections/book-card";
import { BooksPagination } from "@/components/sections/books-pagination";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface PublisherPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PublisherPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const publisher = await PublisherService.getBySlug(slug).catch(() => null);
  if (!publisher) return { title: "Publisher Not Found" };
  return buildPageMetadata({
    locale: locale as Locale,
    path: `/${locale}/publishers/${slug}`,
    title: publisher.title,
    description: publisher.excerpt ?? (locale === "ar" ? `ناشر ${publisher.title}` : `Publisher ${publisher.title}`),
    imageUrl: publisher.imageUrl,
    keywords: [publisher.title, locale === "ar" ? "ناشرون" : "publishers"],
  });
}

export default async function PublisherDetailPage({
  params,
  searchParams,
}: PublisherPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = (await getLocale()) as Locale;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [publisher, { books, pagination }] = await Promise.all([
    PublisherService.getBySlug(slug).catch(() => null),
    PublisherService.getPublisherBooks(slug, page, 16).catch(() => ({
      books: [],
      pagination: { page: 1, limit: 16, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
  ]);

  if (!publisher) notFound();

  const isAr = locale === "ar";
  const isSponsored = publisher.sponsored?.isActive && publisher.sponsored.endsAt > new Date();

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      {/* Header */}
      <div className={`py-10 ${isSponsored ? "bg-gradient-to-r from-[var(--brand-black)] to-[#2a0a10]" : "bg-[var(--brand-black)]"}`}>
        <div className="container-platform">
          <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--brand-gray-400)]">
            <Link href={`/${locale}`} className="hover:text-white">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/publishers`} className="hover:text-white">
              {isAr ? "الناشرون" : "Publishers"}
            </Link>
            <span>/</span>
            <span className="text-white">{publisher.title}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Logo */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
              {publisher.imageUrl ? (
                <Image
                  src={publisher.imageUrl}
                  alt={publisher.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Globe className="h-12 w-12 text-[var(--brand-red)]" aria-hidden="true" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-display-sm font-black text-white">
                  {publisher.title}
                </h1>
                {isSponsored && (
                  <Badge variant="sponsored">
                    {isAr ? "ناشر مميز" : "Featured Publisher"}
                  </Badge>
                )}
              </div>

              {publisher.countries.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {publisher.countries.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 text-sm text-[var(--brand-gray-300)]">
                      <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {isAr && c.nameAr ? c.nameAr : c.name}
                    </span>
                  ))}
                </div>
              )}

              {publisher.excerpt && (
                <p className="mt-3 text-sm text-[var(--brand-gray-300)] max-w-2xl">
                  {publisher.excerpt}
                </p>
              )}

              {/* External Links */}
              <div className="mt-4 flex flex-wrap gap-3">
                {publisher.websiteUrl && (
                  <Button asChild variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                    <a href={publisher.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      {isAr ? "زيارة الموقع" : "Visit Website"}
                    </a>
                  </Button>
                )}
                {publisher.contactEmail && (
                  <Button asChild variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                    <a href={`mailto:${publisher.contactEmail}`}>
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {isAr ? "تواصل" : "Contact"}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books */}
      <div className="container-platform py-8">
        <SectionHeading
          title={isAr ? `كتب ${publisher.title}` : `Books by ${publisher.title}`}
          subtitle={`${pagination.total} ${isAr ? "كتاب" : "books"}`}
          className="mb-6"
        />

        {books.length === 0 ? (
          <div className="py-20 text-center text-[var(--brand-gray-500)]">
            <p>{isAr ? "لا توجد كتب منشورة لهذا الناشر" : "No published books for this publisher"}</p>
            <Link
              href={`/${locale}/publishers`}
              className="mt-4 inline-block text-sm text-[var(--brand-red)] hover:underline"
            >
              {isAr ? "تصفح كل الناشرين" : "Browse all publishers"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} {...book} locale={locale} />
              ))}
            </div>
            <div className="mt-8">
              <BooksPagination pagination={pagination} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
