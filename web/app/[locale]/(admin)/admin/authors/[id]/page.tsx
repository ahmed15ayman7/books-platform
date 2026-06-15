import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { AdminDetailShell } from "@/components/admin/admin-detail-shell";
import { AdminReadOnlyField } from "@/components/admin/admin-readonly-field";
import { AdminEntityDeleteButton } from "@/components/admin/admin-entity-delete-button";
import {
  adminAuthorEditPath,
  adminBookViewPath,
  publicAuthorUrl,
  publicBookUrl,
} from "@/lib/admin/public-urls";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const author = await db.author.findUnique({
    where: { id },
    select: { name: true, nameAr: true },
  });
  return { title: author ? (author.nameAr ?? author.name) : "عرض مؤلف" };
}

export default async function AdminAuthorViewPage({ params }: Props) {
  const { id, locale } = await params;

  const author = await db.author.findUnique({
    where: { id },
    include: {
      products: {
        where: notDeleted,
        take: 20,
        orderBy: { updatedAt: "desc" },
        select: { id: true, slug: true, nameEn: true, nameAr: true, imageUrl: true },
      },
      _count: { select: { products: true } },
    },
  });

  if (!author) notFound();

  const title = author.nameAr ?? author.name;
  const publicUrl = absoluteUrl(publicAuthorUrl(locale, author.slug));
  const editHref = adminAuthorEditPath(locale, id);

  return (
    <AdminDetailShell
      locale={locale}
      backHref={`/${locale}/admin/authors`}
      backLabel="العودة للمؤلفين"
      title={title}
      subtitle={author.name !== title ? author.name : undefined}
      timestamps={{ createdAt: author.createdAt, updatedAt: author.updatedAt }}
      editHref={editHref}
      publicHref={publicUrl}
      actions={
        <AdminEntityDeleteButton
          apiPath={`/api/v1/admin/authors/${id}`}
          entityTitle={title}
          redirectHref={`/${locale}/admin/authors`}
          confirmTitle="تأكيد حذف المؤلف"
          entityLabel="المؤلف"
        />
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
          <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
            البيانات
          </h2>
          <dl>
            <AdminReadOnlyField label="Slug" value={`/authors/${author.slug}`} dir="ltr" />
            <AdminReadOnlyField label="عدد الكتب" value={String(author._count.products)} />
            <AdminReadOnlyField
              label="السيرة"
              bilingual={{ ar: author.bioAr, en: author.bio }}
              variant="prose"
            />
          </dl>
        </div>

        {author.products.length > 0 && (
          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              الكتب المرتبطة
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {author.products.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm"
                >
                  <span className="truncate font-medium">{book.nameAr ?? book.nameEn}</span>
                  <div className="flex shrink-0 gap-2">
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminDetailShell>
  );
}
