import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { absoluteUrl } from "@/lib/seo/site";
import { AdminDetailShell } from "@/components/admin/admin-detail-shell";
import { AdminReadOnlyField } from "@/components/admin/admin-readonly-field";
import { AdminStatusBadge } from "@/components/admin/admin-table";
import { AdminEntityDeleteButton } from "@/components/admin/admin-entity-delete-button";
import {
  adminBookViewPath,
  adminPublisherEditPath,
  publicPublisherUrl,
} from "@/lib/admin/public-urls";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const publisher = await db.publisher.findFirst({
    where: { id, ...notDeleted },
    select: { name: true, nameAr: true },
  });
  return { title: publisher ? (publisher.nameAr ?? publisher.name) : "عرض ناشر" };
}

export default async function AdminPublisherViewPage({ params }: Props) {
  const { id, locale } = await params;

  const publisher = await db.publisher.findFirst({
    where: { id, ...notDeleted },
    include: {
      sponsored: { select: { id: true } },
      countries: { select: { name: true, nameAr: true } },
      products: {
        where: notDeleted,
        take: 10,
        orderBy: { updatedAt: "desc" },
        select: { id: true, slug: true, nameEn: true, nameAr: true, published: true },
      },
      _count: { select: { products: true } },
    },
  });

  if (!publisher) notFound();

  const title = publisher.nameAr ?? publisher.name;
  const publicUrl = absoluteUrl(publicPublisherUrl(locale, publisher.slug));
  const editHref = adminPublisherEditPath(locale, id);

  return (
    <AdminDetailShell
      locale={locale}
      backHref={`/${locale}/admin/publishers`}
      backLabel="العودة للناشرين"
      title={title}
      subtitle={publisher.name !== title ? publisher.name : undefined}
      timestamps={{ createdAt: publisher.createdAt, updatedAt: publisher.updatedAt }}
      editHref={editHref}
      publicHref={publicUrl}
      badges={
        <>
          <AdminStatusBadge status={publisher.status === "publish" ? "published" : "draft"} />
          {publisher.sponsored && (
            <span className="rounded-full bg-[var(--warning)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--warning)]">
              مموّل
            </span>
          )}
        </>
      }
      actions={
        <AdminEntityDeleteButton
          apiPath={`/api/v1/admin/publishers/${id}`}
          entityTitle={title}
          redirectHref={`/${locale}/admin/publishers`}
          confirmTitle="تأكيد حذف الناشر"
          entityLabel="الناشر"
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              التواصل
            </h2>
            <dl>
              <AdminReadOnlyField label="Slug" value={`/publishers/${publisher.slug}`} dir="ltr" />
              <AdminReadOnlyField
                label="الدول"
                value={publisher.countries.map((c) => c.nameAr ?? c.name).join("، ") || undefined}
              />
              <AdminReadOnlyField label="الموقع" value={publisher.websiteUrl} variant="url" />
              <AdminReadOnlyField label="البريد" value={publisher.contactEmail} dir="ltr" />
              <AdminReadOnlyField label="عدد الكتب" value={String(publisher._count.products)} />
            </dl>
          </div>

          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5">
            <h2 className="border-b border-[var(--admin-border)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
              الوصف
            </h2>
            <dl>
              <AdminReadOnlyField
                label="المحتوى"
                bilingual={{ ar: publisher.contentAr, en: publisher.content }}
                variant="prose"
              />
            </dl>
          </div>

          {publisher.products.length > 0 && (
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--admin-text-subtle)]">
                الكتب ({publisher._count.products})
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-subtle)]">
                    <th className="py-2 text-start font-medium">الكتاب</th>
                    <th className="py-2 text-start font-medium">الحالة</th>
                    <th className="py-2 text-start font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {publisher.products.map((book) => (
                    <tr key={book.id} className="border-b border-[var(--admin-border)] last:border-0">
                      <td className="py-3">{book.nameAr ?? book.nameEn}</td>
                      <td className="py-3">
                        <AdminStatusBadge status={book.published ? "published" : "draft"} />
                      </td>
                      <td className="py-3">
                        <Link href={adminBookViewPath(locale, book.id)} className="text-xs text-[var(--brand-red)] hover:underline">
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside>
          {publisher.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
              <div className="relative mx-auto aspect-square max-w-[200px]">
                <Image src={publisher.imageUrl} alt={title} fill className="object-contain" unoptimized />
              </div>
            </div>
          )}
        </aside>
      </div>
    </AdminDetailShell>
  );
}
