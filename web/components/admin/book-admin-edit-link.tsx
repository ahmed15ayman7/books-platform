"use client";

import { AdminInlineEdit } from "@/components/admin/admin-public-chrome";
import { localeHref } from "@/lib/i18n/href";

interface BookAdminEditLinkProps {
  locale: string;
  bookId: string;
  className?: string;
}

/** @deprecated Use AdminEntityPublicShell + AdminInlineEdit on public entity pages. */
export function BookAdminEditLink({ locale, bookId, className }: BookAdminEditLinkProps) {
  return (
    <AdminInlineEdit
      editHref={localeHref(locale, `/admin/books/${bookId}/edit`)}
      adminViewHref={localeHref(locale, `/admin/books/${bookId}`)}
      className={className}
    />
  );
}
