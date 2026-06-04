"use client";

import { AdminInlineEdit } from "@/components/admin/admin-public-chrome";

interface BookAdminEditLinkProps {
  locale: string;
  bookId: string;
  className?: string;
}

/** @deprecated Use AdminEntityPublicShell + AdminInlineEdit on public entity pages. */
export function BookAdminEditLink({ locale, bookId, className }: BookAdminEditLinkProps) {
  return (
    <AdminInlineEdit
      editHref={`/${locale}/admin/books/${bookId}/edit`}
      adminViewHref={`/${locale}/admin/books/${bookId}`}
      className={className}
    />
  );
}
