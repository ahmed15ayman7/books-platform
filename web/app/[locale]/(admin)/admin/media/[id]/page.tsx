import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { AdminDetailShell } from "@/components/admin/admin-detail-shell";
import { AdminReadOnlyField } from "@/components/admin/admin-readonly-field";
import { AdminStatusBadge } from "@/components/admin/admin-table";
import { AdminEntityDeleteButton } from "@/components/admin/admin-entity-delete-button";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { isMediaChannel } from "@/lib/media/youtube";
import {
  adminArticleViewPath,
  adminBookViewPath,
  adminMediaEditPath,
  publicArticleUrl,
  publicBookUrl,
} from "@/lib/admin/public-urls";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

const CHANNEL_LABELS: Record<string, string> = {
  "watch-your-book": "شاهد كتابك",
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
  return { title: article?.title ?? "عرض فيديو" };
}

export default async function AdminMediaViewPage({ params }: Props) {
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

  if (!isMediaChannel(article.channel)) {
    redirect(adminArticleViewPath(locale, id, article.channel));
  }

  const publicUrl = absoluteUrl(publicArticleUrl(locale, article.slug));
  const editHref = adminMediaEditPath(locale, id);

  return (
    <AdminDetailShell
      locale={locale}
      backHref={`/${locale}/admin/media`}
      backLabel="العودة للميديا"
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
            <span className="rounded-full bg-[var(--brand-red-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-red)]">
              {CHANNEL_LABELS[article.channel] ?? article.channel}
            </span>
          )}
        </>
      }
      actions={
        <AdminEntityDeleteButton
          apiPath={`/api/v1/admin/articles/${id}`}
          entityTitle={article.title}
          redirectHref={`/${locale}/admin/media`}
          confirmTitle="تأكيد حذف الفيديو"
          entityLabel="الفيديو"
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {article.videoId && (
            <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
              <YoutubeEmbed videoId={article.videoId} title={article.title} />
            </div>
          )}

          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              الإعدادات
            </h2>
            <dl>
              <AdminReadOnlyField label="Slug" value={`/articles/${article.slug}`} dir="ltr" />
              <AdminReadOnlyField label="تاريخ النشر" value={formatDate(article.date)} />
              {article.youtubeUrl && (
                <AdminReadOnlyField label="YouTube" value={article.youtubeUrl} variant="url" />
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
                label="الوصف"
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
              <ul className="space-y-2">
                {article.products.map((book) => (
                  <li key={book.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span>{book.nameAr ?? book.nameEn}</span>
                    <div className="flex gap-2">
                      <Link href={adminBookViewPath(locale, book.id)} className="text-xs text-[var(--brand-red)] hover:underline">
                        عرض
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside>
          {article.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
              <div className="relative aspect-video w-full">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" unoptimized />
              </div>
            </div>
          )}
        </aside>
      </div>
    </AdminDetailShell>
  );
}
