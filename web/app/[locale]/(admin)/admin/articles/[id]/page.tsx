import { notFound } from "next/navigation";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { AdminDetailShell } from "@/components/admin/admin-detail-shell";
import { AdminReadOnlyField } from "@/components/admin/admin-readonly-field";
import { AdminStatusBadge } from "@/components/admin/admin-table";
import { AdminEntityDeleteButton } from "@/components/admin/admin-entity-delete-button";
import { isMediaChannel } from "@/lib/media/youtube";
import {
  adminArticleEditPath,
  adminBookViewPath,
  publicArticleUrl,
  publicBookUrl,
} from "@/lib/admin/public-urls";
import { redirect } from "next/navigation";
import { EntityMarketingDialog } from "@/components/share/entity-marketing-dialog";
import { EntityShareDialog } from "@/components/share/entity-share-dialog";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

const CHANNEL_LABELS: Record<string, string> = {
  harvest: "حصاد الكتب",
  ideas: "زبدة الأفكار",
  "world-reads": "العالم يقرأ",
  "books-talk": "حديث الكتب",
  "novel-story": "رواية فحكاية",
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
  const article = await db.article.findFirst({
    where: { id, ...notDeleted },
    select: { title: true },
  });
  return { title: article?.title ?? "عرض مقال" };
}

export default async function AdminArticleViewPage({ params }: Props) {
  const { id, locale } = await params;

  const article = await db.article.findFirst({
    where: { id, ...notDeleted },
    include: {
      products: {
        select: { id: true, slug: true, nameEn: true, nameAr: true, imageUrl: true },
      },
      createdBy: { select: { fullName: true } },
    },
  });

  if (!article) notFound();

  if (isMediaChannel(article.channel)) {
    redirect(localeHref(locale, `/admin/media/${id}`));
  }

  const publicUrl = absoluteUrl(publicArticleUrl(locale, article.slug));
  const editHref = adminArticleEditPath(locale, id, article.channel);

  return (
    <AdminDetailShell
      locale={locale}
      backHref={localeHref(locale, "/admin/articles")}
      backLabel="العودة للمقالات"
      title={article.title}
      subtitle={article.titleEn ?? undefined}
      timestamps={{ createdAt: article.createdAt, updatedAt: article.updatedAt }}
      editHref={editHref}
      publicHref={publicUrl}
      badges={
        <>
          <AdminStatusBadge
            status={article.status === "publish" ? "published" : article.status === "scheduled" ? "pending" : "draft"}
          />
          {article.channel && (
            <span className="rounded-full bg-[var(--admin-surface-muted)] px-2.5 py-0.5 text-xs font-medium">
              {CHANNEL_LABELS[article.channel] ?? article.channel}
            </span>
          )}
        </>
      }
      actions={
        <>
          <EntityMarketingDialog
            entityType="article"
            title={article.title}
            publicUrl={publicUrl}
            imageUrl={article.imageUrl}
          />
          <EntityShareDialog
            title={article.title}
            publicUrl={publicUrl}
            imageUrl={article.imageUrl}
            variant="admin"
          />
          <AdminEntityDeleteButton
            apiPath={`/api/v1/admin/articles/${id}`}
            entityTitle={article.title}
            redirectHref={localeHref(locale, "/admin/articles")}
            confirmTitle="تأكيد حذف المقال"
            entityLabel="المقال"
          />
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              الإعدادات
            </h2>
            <dl>
              <AdminReadOnlyField label="Slug" value={`/articles/${article.slug}`} dir="ltr" />
              <AdminReadOnlyField label="تاريخ النشر" value={formatDate(article.date)} />
              <AdminReadOnlyField label="صورة" value={article.imageUrl} variant="url" />
              {article.youtubeUrl && (
                <AdminReadOnlyField label="YouTube" value={article.youtubeUrl} variant="url" />
              )}
              {article.createdBy && (
                <AdminReadOnlyField label="أنشأه" value={article.createdBy.fullName} />
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              المحتوى
            </h2>
            <dl>
              <AdminReadOnlyField
                label="العنوان"
                bilingual={{ ar: article.title, en: article.titleEn }}
              />
              <AdminReadOnlyField
                label="المقتطف"
                bilingual={{ ar: article.excerpt, en: article.excerptEn }}
                variant="prose"
              />
              <AdminReadOnlyField
                label="المحتوى"
                bilingual={{ ar: article.content, en: article.contentEn }}
                variant="prose"
              />
            </dl>
          </div>

          {article.products.length > 0 && (
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                الكتب المرتبطة
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-subtle)]">
                      <th className="py-2 text-start font-medium">الكتاب</th>
                      <th className="py-2 text-start font-medium">Slug</th>
                      <th className="py-2 text-start font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {article.products.map((book) => (
                      <tr key={book.id} className="border-b border-[var(--admin-border)] last:border-0">
                        <td className="py-3">{book.nameAr ?? book.nameEn}</td>
                        <td className="py-3 font-mono text-xs text-[var(--admin-text-muted)]" dir="ltr">
                          {book.slug}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Link
                              href={adminBookViewPath(locale, book.id)}
                              className="text-xs text-[var(--brand-red)] hover:underline"
                            >
                              عرض في الأدمن
                            </Link>
                            <a
                              href={absoluteUrl(publicBookUrl(locale, book.slug))}
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
        </div>

        <aside className="space-y-4">
          {article.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
              <div className="relative aspect-video w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </AdminDetailShell>
  );
}
