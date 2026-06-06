"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { adminToast } from "@/lib/admin/admin-toast";

interface BookDeleteButtonProps {
  bookId: string;
  bookTitle: string;
  locale: string;
  variant?: "icon" | "text";
  onDeleted?: () => void;
  isBooksPage?: boolean;
}

export function BookDeleteButton({
  bookId,
  bookTitle,
  locale,
  variant = "text",
  onDeleted,
  isBooksPage = false,
}: BookDeleteButtonProps) {
  if (!can(PERMISSIONS.books.delete)) return null;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function executeDelete() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v1/admin/books/${bookId}`, {
          method: "DELETE",
          headers: adminAuthHeaders(),
        });
        const data = (await res.json()) as {
          success?: boolean;
          error?: { message?: string };
        };

        if (!res.ok || !data.success) {
          adminToast.error(data.error?.message ?? "فشل حذف الكتاب");
          return;
        }

        adminToast.success("delete", bookTitle);
        setOpen(false);
        if (isBooksPage) {
          router.refresh();
        } else {
          router.push(`/${locale}/admin/books`);
        }
        onDeleted?.();
      } catch {
        adminToast.error("حدث خطأ في الاتصال");
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={
          variant === "icon"
            ? "h-9 w-9 border-[var(--admin-border-strong)] p-0 text-red-400 hover:border-red-800/60 hover:bg-red-950/30"
            : "gap-2 border-[var(--admin-border-strong)] text-red-400 hover:border-red-800/60 hover:bg-red-950/30"
        }
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        {variant === "text" ? "حذف" : null}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-book-title"
        >
          <div className="w-full max-w-md rounded-xl border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--admin-border)] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/50 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="delete-book-title" className="text-lg font-bold text-[var(--admin-text)]">
                    تأكيد حذف الكتاب
                  </h2>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    سينقل الكتاب إلى سلة المحذوفات ويمكن استعادته لاحقاً.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isPending && setOpen(false)}
                disabled={isPending}
                className="rounded-lg p-1 text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)] disabled:opacity-50"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-sm text-[var(--admin-text-muted)]">
                هل أنت متأكد من حذف الكتاب التالي؟
              </p>
              <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2 text-sm font-medium text-[var(--admin-text)]">
                {bookTitle}
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[var(--admin-border-strong)] text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
                  disabled={isPending}
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  className="gap-2 bg-red-700 text-white hover:bg-red-600"
                  disabled={isPending}
                  onClick={executeDelete}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  نعم، احذف الكتاب
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
