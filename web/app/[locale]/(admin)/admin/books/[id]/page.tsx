import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, ExternalLink, Mail, Globe, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo/site";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "@/components/admin/admin-table";
import { BookMarketingDialog } from "./book-marketing-dialog";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

const TRANSLATION_LABELS: Record<string, string> = {
  NOT_TRANSLATED: "غير مترجم",
  NOMINATED: "مرشح للترجمة",
  TRANSLATED: "مترجم",
  PARTIAL: "ترجمة جزئية",
};

const PURCHASE_LABELS: Record<string, string> = {
  NOT_AVAILABLE: "غير متاح",
  DIRECT: "شراء مباشر",
  REFERRAL: "رابط إحالة",
};

function formatDate(value: Date | null | undefined) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return new Date(value).toISOString().slice(0, 10);
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const book = await db.product.findUnique({
    where: { id },
    select: { nameEn: true, nameAr: true },
  });
  return { title: book ? book.nameAr ?? book.nameEn : "عرض كتاب" };
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "" || value === "—") {
    return null;
  }
  return (
    <div className="border-b border-[var(--brand-gray-800)] py-3 last:border-0">
      <dt className="mb-1 text-xs font-medium text-[var(--brand-gray-500)]">{label}</dt>
      <dd className="text-sm text-white">{value}</dd>
    </div>
  );
}

function DescriptionBlock({ title, text }: { title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
        {title}
      </h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-gray-200)]">
        {text}
      </p>
    </div>
  );
}

export default async function AdminBookViewPage({ params }: Props) {
  const { id, locale } = await params;

  const book = await db.product.findUnique({
    where: { id },
    include: {
      publisher: {
        include: {
          countries: { select: { id: true, name: true, nameAr: true, slug: true } },
        },
      },
      primaryCategory: { select: { name: true, nameAr: true, slug: true } },
      categories: { select: { id: true, name: true, nameAr: true, slug: true } },
      authors: {
        select: {
          id: true,
          name: true,
          nameAr: true,
          slug: true,
          bio: true,
          bioAr: true,
          linkedCount: true,
        },
      },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!book) notFound();

  const title = book.nameAr ?? book.nameEn;
  const publicUrl = absoluteUrl(`/${locale}/books/${book.slug}`);

  return (
    <div className="text-white">
      <Link
        href={`/${locale}/admin/books`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--brand-gray-400)] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        العودة للقائمة
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {book.nameAr && book.nameEn && book.nameAr !== book.nameEn && (
            <p className="mt-1 text-sm text-[var(--brand-gray-400)]" dir="ltr">
              {book.nameEn}
            </p>
          )}
          <p className="mt-2 text-sm text-[var(--brand-gray-500)]" dir="ltr">
            /books/{book.slug}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AdminStatusBadge status={book.published ? "published" : "draft"} />
            {book.featured && (
              <span className="rounded-full bg-[var(--brand-red-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-red)]">
                مميز
              </span>
            )}
            <AdminStatusBadge
              status={book.translationStatus.toLowerCase()}
              customLabel={TRANSLATION_LABELS[book.translationStatus] ?? book.translationStatus}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={`/${locale}/admin/books/${id}/edit`}>
            <Button className="gap-2">
              <Pencil className="h-4 w-4" />
              تعديل
            </Button>
          </Link>
          <BookMarketingDialog
            bookTitle={title}
            publicUrl={publicUrl}
            imageUrl={book.imageUrl}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
            {book.imageUrl ? (
              <div className="relative aspect-[3/4] w-full bg-[var(--brand-gray-800)]">
                <Image
                  src={book.imageUrl}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 320px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-sm text-[var(--brand-gray-500)]">
                لا توجد صورة غلاف
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
              الرابط العام
            </h2>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 break-all text-sm text-[var(--brand-red)] hover:underline"
              dir="ltr"
            >
              {publicUrl}
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] px-5">
            <h2 className="border-b border-[var(--brand-gray-800)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
              البيانات الببليوغرافية
            </h2>
            <dl>
              <DetailRow label="ISBN" value={book.isbn} />
              <DetailRow label="اللغة" value={book.language} />
              <DetailRow label="سنة النشر" value={book.publicationYear?.toString()} />
              <DetailRow label="بلد النشر" value={book.country} />
              <DetailRow label="عدد الصفحات" value={book.pageCount?.toString()} />
              <DetailRow label="الطبعة" value={book.edition} />
              <DetailRow label="المقاسات" value={book.dimensions} />
              <DetailRow label="دار النشر" value={book.publisher?.title} />
              <DetailRow
                label="التصنيف الرئيسي"
                value={book.primaryCategory?.nameAr ?? book.primaryCategory?.name}
              />
              <DetailRow
                label="تصنيفات إضافية"
                value={
                  book.categories.length > 0
                    ? book.categories.map((c) => c.nameAr ?? c.name).join("، ")
                    : null
                }
              />
              <DetailRow
                label="المؤلفون"
                value={
                  book.authors.length > 0
                    ? book.authors.map((a) => a.nameAr ?? a.name).join("، ")
                    : null
                }
              />
              <DetailRow
                label="خيار الشراء"
                value={PURCHASE_LABELS[book.purchaseOption] ?? book.purchaseOption}
              />
              <DetailRow
                label="السعر"
                value={
                  book.price != null
                    ? `${Number(book.price).toFixed(2)} ${book.currency ?? ""}`
                    : null
                }
              />
              <DetailRow label="رابط الإحالة" value={book.referralLink} />
              <DetailRow label="متوفر" value={book.inStock ? "نعم" : "لا"} />
              <DetailRow label="السماح بالمراجعات" value={book.reviewsAllowed ? "نعم" : "لا"} />
              <DetailRow label="ظهور في الكتالوج" value={book.catalogVisibility} />
              <DetailRow label="نوع المنتج" value={book.type} />
              <DetailRow label="ترتيب العرض" value={book.position?.toString()} />
              <DetailRow label="المعرف الأصلي" value={book.originalId?.toString()} />
              <DetailRow
                label="الوسوم"
                value={
                  book.tags.length > 0
                    ? book.tags.map((t) => t.name).join("، ")
                    : null
                }
              />
            </dl>
          </div>

          <DescriptionBlock title="وصف قصير — عربي" text={book.shortDescAr} />
          <DescriptionBlock title="وصف قصير — إنجليزي" text={book.shortDesc} />
          <DescriptionBlock title="الوصف الكامل — عربي" text={book.descriptionAr} />
          <DescriptionBlock title="الوصف الكامل — إنجليزي" text={book.description} />
          <DescriptionBlock title="وصف SEO (Yoast)" text={book.yoastMetadesc} />

          {book.authors.length > 0 && (
            <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
                المؤلفون ({book.authors.length})
              </h2>
              <div className="space-y-4">
                {book.authors.map((author) => (
                  <div
                    key={author.id}
                    className="rounded-lg border border-[var(--brand-gray-800)] bg-[var(--brand-gray-950)] p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {author.nameAr ?? author.name}
                      </h3>
                      {author.nameAr && author.name && author.nameAr !== author.name && (
                        <span className="text-xs text-[var(--brand-gray-400)]" dir="ltr">
                          {author.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--brand-gray-500)]" dir="ltr">
                      /{author.slug}
                    </p>
                    {(author.bioAr?.trim() || author.bio?.trim()) && (
                      <div className="mt-3 space-y-2">
                        {author.bioAr?.trim() && (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-gray-200)]">
                            {author.bioAr}
                          </p>
                        )}
                        {author.bio?.trim() && (
                          <p
                            className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-gray-300)]"
                            dir="ltr"
                          >
                            {author.bio}
                          </p>
                        )}
                      </div>
                    )}
                    {author.linkedCount != null && (
                      <p className="mt-3 text-xs text-[var(--brand-gray-500)]">
                        كتب مرتبطة: {author.linkedCount}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {book.publisher && (
            <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
                دار النشر
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                {book.publisher.imageUrl && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--brand-gray-800)] bg-[var(--brand-gray-950)]">
                    <Image
                      src={book.publisher.imageUrl}
                      alt={book.publisher.title}
                      fill
                      className="object-contain"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">{book.publisher.title}</h3>
                  <p className="mt-1 text-xs text-[var(--brand-gray-500)]" dir="ltr">
                    /{book.publisher.slug}
                  </p>

                  {book.publisher.excerpt?.trim() && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--brand-gray-200)]">
                      {book.publisher.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {book.publisher.websiteUrl && (
                      <a
                        href={book.publisher.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--brand-red)] hover:underline"
                        dir="ltr"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {book.publisher.websiteUrl}
                      </a>
                    )}
                    {book.publisher.contactEmail && (
                      <a
                        href={`mailto:${book.publisher.contactEmail}`}
                        className="inline-flex items-center gap-1.5 text-[var(--brand-red)] hover:underline"
                        dir="ltr"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {book.publisher.contactEmail}
                      </a>
                    )}
                  </div>

                  {book.publisher.address?.trim() && (
                    <p className="mt-3 flex items-start gap-1.5 whitespace-pre-wrap text-sm text-[var(--brand-gray-300)]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand-gray-500)]" />
                      {book.publisher.address}
                    </p>
                  )}
                </div>
              </div>

              <dl className="mt-5 border-t border-[var(--brand-gray-800)] pt-3">
                <DetailRow
                  label="الدول"
                  value={
                    book.publisher.countries.length > 0
                      ? book.publisher.countries.map((c) => c.nameAr ?? c.name).join("، ")
                      : null
                  }
                />
                <DetailRow label="الوسوم" value={book.publisher.tags} />
                <DetailRow label="الحالة" value={book.publisher.status} />
                <DetailRow label="تاريخ النشر" value={formatDate(book.publisher.date)} />
                <DetailRow
                  label="آخر تعديل"
                  value={formatDate(book.publisher.postModifiedDate)}
                />
                <DetailRow label="الرابط الدائم" value={book.publisher.permalink} />
                <DetailRow
                  label="جهة الإدخال"
                  value={
                    [
                      book.publisher.authorFirstName,
                      book.publisher.authorLastName,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    book.publisher.authorUsername ||
                    book.publisher.authorEmail
                  }
                />
                <DetailRow label="المعرف الأصلي" value={book.publisher.originalId?.toString()} />
              </dl>

              {book.publisher.content?.trim() && (
                <div className="mt-4 border-t border-[var(--brand-gray-800)] pt-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">
                    نبذة عن الدار
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-gray-200)]">
                    {book.publisher.content}
                  </p>
                </div>
              )}
            </div>
          )}

          {book.notes?.trim() && (
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-600">
                ملاحظات داخلية
              </h3>
              <p className="whitespace-pre-wrap text-sm text-amber-100/90">{book.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
