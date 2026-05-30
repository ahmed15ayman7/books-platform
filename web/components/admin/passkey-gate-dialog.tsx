"use client";

import { Fingerprint, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasskeyGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  busy?: boolean;
  error?: string;
  title?: string;
  description?: string;
}

export function PasskeyGateDialog({
  open,
  onOpenChange,
  onConfirm,
  busy,
  error,
  title = "تأكيد بـ Passkey",
  description = "هذه العملية حساسة. أكّد هويتك بمفتاح الأمان أو بصمة الجهاز.",
}: PasskeyGateDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--brand-gray-800)] px-5 py-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-[var(--brand-red)]" />
            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={() => !busy && onOpenChange(false)}
            className="rounded-lg p-1 text-[var(--brand-gray-400)] hover:bg-[var(--brand-gray-800)]"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm text-[var(--brand-gray-400)]">{description}</p>
          {error && <p className="text-sm text-[var(--error)]">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
              إلغاء
            </Button>
            <Button onClick={onConfirm} disabled={busy} className="gap-1.5">
              <Fingerprint className="h-4 w-4" />
              {busy ? "جاري التحقق..." : "تحقق ومتابعة"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
