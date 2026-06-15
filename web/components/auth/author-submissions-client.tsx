"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authHeaders, getAuthorSession } from "@/lib/auth/author-client";
import { formatDate } from "@/lib/utils/formatters";
import type { Locale } from "@/lib/i18n";

interface DraftItem {
  id: string;
  title: string;
  status: string;
  currentStep: number;
  updatedAt: string;
  authorEmail: string | null;
}

export function AuthorSubmissionsClient() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const isAr = locale === "ar";

  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session] = useState(() => getAuthorSession());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/submissions/drafts/mine", { headers: authHeaders() });
      const data = await res.json() as { success: boolean; data?: { drafts: DraftItem[] } };
      if (data.success && data.data) setDrafts(data.data.drafts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-red)]" />
      </div>
    );
  }

  return (
    <div className="container-platform py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[var(--brand-gray-900)]">
            {isAr ? "مسوداتي وطلباتي" : "My Drafts & Submissions"}
          </h1>
          {session && (
            <p className="mt-1 text-sm text-[var(--brand-gray-500)]">
              {session.fullName} · {session.email}
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={`/${locale}/publish`}>
            {isAr ? "انشر كتاباً جديداً" : "Publish New Book"}
          </Link>
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--brand-gray-300)] bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-[var(--brand-gray-300)]" />
          <p className="mt-4 text-[var(--brand-gray-600)]">
            {isAr ? "لا توجد مسودات أو طلبات بعد" : "No drafts or submissions yet"}
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={`/${locale}/publish`}>
              {isAr ? "ابدأ الآن" : "Get Started"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const isDraft = draft.status === "draft";
            const href = isDraft
              ? `/${locale}/publish?draft=${draft.id}&step=${draft.currentStep}`
              : `/${locale}/publish`;
            const statusLabel = isDraft
              ? (isAr ? "مسودة" : "Draft")
              : draft.status === "pending"
                ? (isAr ? "قيد المراجعة" : "Pending")
                : draft.status === "approved"
                  ? (isAr ? "موافق عليه" : "Approved")
                  : (isAr ? "مرفوض" : "Rejected");

            return (
              <Link
                key={draft.id}
                href={href}
                className="flex items-center justify-between gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--brand-red)]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--brand-gray-900)] truncate">
                    {draft.title === "مسودة" && isAr ? (isAr ? "مسودة بدون عنوان" : "Untitled draft") : draft.title}
                  </p>
                  <p className="text-xs text-[var(--brand-gray-400)]">
                    {formatDate(draft.updatedAt, locale as Locale, "PPp")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--brand-gray-100)] px-3 py-1 text-xs font-medium text-[var(--brand-gray-600)]">
                  {statusLabel}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
