import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, ExternalLink, Mail, Globe, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "@/components/admin/admin-table";
import { BookMarketingDialog } from "./book-marketing-dialog";
import { EntityShareDialog } from "@/components/share/entity-share-dialog";
import { BookDeleteButton } from "./book-delete-button";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { ArticleContent } from "@/lib/markdown/article-content";
import {
  adminArticleEditPath,
  adminArticleViewPath,
  adminAuthorViewPath,
  adminPublisherViewPath,
  publicArticleUrl,
} from "@/lib/admin/public-urls";

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
    <div className="border-b border-[var(--admin-border)] py-3 last:border-0">
      <dt className="mb-1 text-xs font-medium text-[var(--admin-text-subtle)]">{label}</dt>
      <dd className="text-sm text-[var(--admin-text)]">{value}</dd>
    </div>
  );
}

function DescriptionBlock({ title, text }: { title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
        {title}
      </h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]">
        {text}
      </p>
    </div>
  );
}

function MarkdownDescriptionBlock({ title, text }: { title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
        {title}
      </h3>
      <ArticleContent
        content={text}
        variant="compact"
        className="text-sm [&_p]:text-sm [&_p]:text-[var(--admin-text-muted)] [&_li]:text-sm [&_li]:text-[var(--admin-text-muted)]"
      />
    </div>
  );
}

export default async function AdminBookViewPage({ params }: Props) {
  const { id, locale } = await params;

  const book = await db.product.findFirst({
    where: { id, ...notDeleted },
    include: {
      createdBy: { select: { fullName: true, email: true } },
      updatedBy: { select: { fullName: true, email: true } },
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

  const linkedArticles = await db.article.findMany({
    where: { ...notDeleted, products: { some: { id } } },
    orderBy: { date: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      title: true,
      titleEn: true,
      channel: true,
      status: true,
      videoId: true,
      date: true,
    },
  });

  const title = book.nameAr ?? book.nameEn;
  const publicUrl = absoluteUrl(`/${locale}/books/${book.slug}`);

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={`/${locale}/admin/books`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-accent)]"
      >
        <ArrowLeft className="h-4 w-4" />
        العودة للقائمة
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <AdminTimestamps
            createdAt={book.createdAt}
            updatedAt={book.updatedAt}
            compact
            className="mt-2"
          />
          {book.nameAr && book.nameEn && book.nameAr !== book.nameEn && (
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]" dir="ltr">
              {book.nameEn}
            </p>
          )}
          <p className="mt-2 text-sm text-[var(--admin-text-subtle)]" dir="ltr">
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
          <EntityShareDialog
            title={title}
            publicUrl={publicUrl}
            imageUrl={book.imageUrl}
            variant="admin"
          />
          <BookDeleteButton bookId={id} bookTitle={title} locale={locale} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            {book.imageUrl ? (
              <div className="relative aspect-[3/4] w-full bg-[var(--admin-surface-muted)]">
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
              <div className="flex aspect-[3/4] items-center justify-center text-sm text-[var(--admin-text-subtle)]">
                لا توجد صورة غلاف
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
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
          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              البيانات الببليوغرافية
            </h2>
            <dl>
              <DetailRow label="ISBN" value={book.isbn} />
              <DetailRow label="اللغة" value={book.language} />
              <DetailRow label="سنة النشر" value={book.publicationYear?.toString()} />
              <DetailRow label="بلد النشر" value={book.country} />
              <DetailRow label="عدد الصفحات" value={book.pageCount?.toString()} />
              <DetailRow label="الطبعة (EN)" value={book.edition} />
              <DetailRow label="الطبعة (AR)" value={book.editionAr} />
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
              <DetailRow
                label="أُنشئ بواسطة"
                value={
                  book.createdBy
                    ? `${book.createdBy.fullName} (${book.createdBy.email})`
                    : null
                }
              />
              <DetailRow
                label="آخر تعديل بواسطة"
                value={
                  book.updatedBy
                    ? `${book.updatedBy.fullName} (${book.updatedBy.email})`
                    : null
                }
              />
            </dl>
          </div>

          <DescriptionBlock title="وصف قصير — عربي" text={book.shortDescAr} />
          <DescriptionBlock title="وصف قصير — إنجليزي" text={book.shortDesc} />
          <MarkdownDescriptionBlock title="الوصف الكامل — عربي" text={book.descriptionAr} />
          <MarkdownDescriptionBlock title="الوصف الكامل — إنجليزي" text={book.description} />
          <DescriptionBlock title="وصف SEO (Yoast)" text={book.yoastMetadesc} />

          {book.authors.length > 0 && (
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                المؤلفون ({book.authors.length})
              </h2>
              <div className="space-y-4">
                {book.authors.map((author) => (
                  <div
                    key={author.id}
                    className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[var(--admin-text)]">
                          {author.nameAr ?? author.name}
                        </h3>
                        {author.nameAr && author.name && author.nameAr !== author.name && (
                          <span className="text-xs text-[var(--admin-text-muted)]" dir="ltr">
                            {author.name}
                          </span>
                        )}
                      </div>
                      <Link
                        href={adminAuthorViewPath(locale, author.id)}
                        className="text-xs text-[var(--brand-red)] hover:underline"
                      >
                        عرض في الأدمن
                      </Link>
                    </div>
                    <p className="text-xs text-[var(--admin-text-subtle)]" dir="ltr">
                      /{author.slug}
                    </p>
                    {(author.bioAr?.trim() || author.bio?.trim()) && (
                      <div className="mt-3 space-y-2">
                        {author.bioAr?.trim() && (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]">
                            {author.bioAr}
                          </p>
                        )}
                        {author.bio?.trim() && (
                          <p
                            className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]"
                            dir="ltr"
                          >
                            {author.bio}
                          </p>
                        )}
                      </div>
                    )}
                    {author.linkedCount != null && (
                      <p className="mt-3 text-xs text-[var(--admin-text-subtle)]">
                        كتب مرتبطة: {author.linkedCount}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {book.publisher && (
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                دار النشر
              </h2>
              <div className="mb-3">
                <Link
                  href={adminPublisherViewPath(locale, book.publisher.id)}
                  className="text-xs text-[var(--brand-red)] hover:underline"
                >
                  عرض في لوحة التحكم
                </Link>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                {book.publisher.imageUrl && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
                    <Image
                      src={book.publisher.imageUrl}
                      alt={book.publisher.nameAr ?? book.publisher.name ?? book.publisher.title}
                      fill
                      className="object-contain"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[var(--admin-text)]">
                    {book.publisher.nameAr ?? book.publisher.name ?? book.publisher.title}
                  </h3>
                  {(book.publisher.nameAr || book.publisher.name) && (
                    <p className="mt-1 text-sm text-[var(--admin-text-muted)]" dir="ltr">
                      {book.publisher.name}
                      {book.publisher.nameAr && book.publisher.name ? ` · ${book.publisher.nameAr}` : null}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--admin-text-subtle)]" dir="ltr">
                    /{book.publisher.slug}
                  </p>

                  {(book.publisher.contentAr?.trim() || book.publisher.content?.trim()) && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--admin-text-muted)]">
                      {book.publisher.contentAr?.trim() || book.publisher.content}
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
                    <p className="mt-3 flex items-start gap-1.5 whitespace-pre-wrap text-sm text-[var(--admin-text-muted)]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--admin-text-subtle)]" />
                      {book.publisher.address}
                    </p>
                  )}
                </div>
              </div>

              <dl className="mt-5 border-t border-[var(--admin-border)] pt-3">
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
                <div className="mt-4 border-t border-[var(--admin-border)] pt-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                    نبذة عن الدار
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]">
                    {book.publisher.content}
                  </p>
                </div>
              )}
            </div>
          )}

          {linkedArticles.length > 0 && (
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                  المقالات المرتبطة ({linkedArticles.length})
                </h2>
                <Link
                  href={`/${locale}/admin/articles/new?bookId=${id}`}
                  className="text-xs text-[var(--brand-red)] hover:underline"
                >
                  + مقال جديد
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-subtle)]">
                      <th className="py-2 text-start font-medium">العنوان</th>
                      <th className="py-2 text-start font-medium">القناة</th>
                      <th className="py-2 text-start font-medium">الحالة</th>
                      <th className="py-2 text-start font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedArticles.map((article) => (
                      <tr key={article.id} className="border-b border-[var(--admin-border)] last:border-0">
                        <td className="max-w-[200px] truncate py-3">{article.title}</td>
                        <td className="py-3 text-xs text-[var(--admin-text-muted)]">
                          {article.channel ?? "—"}
                          {article.videoId ? " · فيديو" : ""}
                        </td>
                        <td className="py-3">
                          <AdminStatusBadge
                            status={
                              article.status === "publish"
                                ? "published"
                                : article.status === "scheduled"
                                  ? "pending"
                                  : "draft"
                            }
                          />
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={adminArticleViewPath(locale, article.id, article.channel)}
                              className="text-xs text-[var(--brand-red)] hover:underline"
                            >
                              عرض
                            </Link>
                            <Link
                              href={adminArticleEditPath(locale, article.id, article.channel)}
                              className="text-xs text-[var(--admin-text-muted)] hover:underline"
                            >
                              تعديل
                            </Link>
                            <a
                              href={absoluteUrl(publicArticleUrl(locale, article.slug))}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[var(--admin-text-muted)] hover:underline"
                            >
                              الموقع
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
