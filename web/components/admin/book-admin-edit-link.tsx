"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getAdminAccessToken } from "@/lib/admin/auth-client";
import { loadAdminSession } from "@/lib/admin/permissions-client";
import { Button } from "@/components/ui/button";

interface BookAdminEditLinkProps {
  locale: string;
  bookId: string;
  className?: string;
}

/** Shown on public book page when an admin is signed in. */
export function BookAdminEditLink({ locale, bookId, className }: BookAdminEditLinkProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = getAdminAccessToken();
    const session = loadAdminSession();
    setVisible(Boolean(token && session?.role === "ADMIN"));
  }, []);

  if (!visible) return null;

  return (
    <Link href={`/${locale}/admin/books/${bookId}/edit`} className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 border-[var(--brand-red)]/40 text-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        تعديل في لوحة التحكم
      </Button>
    </Link>
  );
}
