"use client";

import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AutosaveStatus } from "@/lib/forms/use-form-autosave";

interface FormDraftNoticeProps {
  showBanner?: boolean;
  status?: AutosaveStatus;
  onResume?: () => void;
  onDismiss?: () => void;
  className?: string;
  variant?: "admin" | "public";
}

const statusLabels: Record<AutosaveStatus, string> = {
  idle: "يُحفظ تلقائياً",
  saving: "جاري الحفظ…",
  saved: "تم الحفظ",
  error: "تعذّر الحفظ — سيتم إعادة المحاولة",
};

export function FormDraftNotice({
  showBanner = false,
  status = "idle",
  onResume,
  onDismiss,
  className,
  variant = "admin",
}: FormDraftNoticeProps) {
  const isAdmin = variant === "admin";

  return (
    <div className={cn("space-y-2", className)}>
      {showBanner && onResume && onDismiss && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm",
            isAdmin
              ? "border-[var(--admin-accent)]/30 bg-[var(--admin-accent-soft)] text-[var(--admin-text)]"
              : "border-[var(--brand-red)]/30 bg-[var(--brand-red-soft)] text-[var(--brand-gray-800)]",
          )}
        >
          <p>لديك مسودة غير محفوظة — هل تريد متابعة العمل عليها؟</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={onDismiss}>
              تجاهل
            </Button>
            <Button type="button" size="sm" onClick={onResume}>
              متابعة
            </Button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-1.5 text-xs",
          isAdmin ? "text-[var(--admin-text-subtle)]" : "text-[var(--brand-gray-500)]",
        )}
      >
        <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{statusLabels[status]}</span>
      </div>
    </div>
  );
}
