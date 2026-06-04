"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils/formatters";
import { createCommentSchema } from "@/lib/validation/comment.schema";
import type { Locale } from "@/lib/i18n";

export interface ArticleCommentItem {
  id: string;
  authorName: string;
  content: string;
  commentDate: Date | string | null;
}

interface ArticleCommentsSectionProps {
  articleId: string;
  locale: Locale;
  initialComments: ArticleCommentItem[];
}

type FormValues = {
  authorName: string;
  email: string;
  content: string;
  website: string;
};

const emptyForm: FormValues = {
  authorName: "",
  email: "",
  content: "",
  website: "",
};

export function ArticleCommentsSection({
  articleId,
  locale,
  initialComments,
}: ArticleCommentsSectionProps) {
  const isAr = locale === "ar";
  const [comments, setComments] = useState(initialComments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function resetForm() {
    setForm(emptyForm);
    setFieldErrors({});
    setSubmitError("");
  }

  function closeDialog() {
    setDialogOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    const payload = {
      authorName: form.authorName.trim(),
      email: form.email.trim() || undefined,
      content: form.content.trim(),
      articleId,
      website: form.website,
    };

    const parsed = createCommentSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json() as {
        success: boolean;
        data?: {
          comment?: ArticleCommentItem & { status?: string };
          message?: string;
        };
        error?: { message: string };
      };

      if (!res.ok || !data.success) {
        setSubmitError(
          data.error?.message
            ?? (isAr ? "فشل إرسال التعليق. حاول مرة أخرى." : "Failed to submit comment. Please try again."),
        );
        return;
      }

      const created = data.data?.comment;
      if (created?.status === "approved") {
        setComments((prev) => [
          ...prev,
          {
            id: created.id,
            authorName: created.authorName,
            content: created.content,
            commentDate: created.commentDate ?? new Date().toISOString(),
          },
        ]);
        setSuccessMessage(
          isAr ? "تم نشر تعليقك بنجاح." : "Your comment has been posted.",
        );
      } else {
        setSuccessMessage(
          isAr
            ? "شكراً! تعليقك قيد المراجعة وسيظهر بعد الموافقة."
            : "Thank you! Your comment is pending review and will appear once approved.",
        );
      }

      closeDialog();
    } catch {
      setSubmitError(isAr ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="mt-12" aria-labelledby="comments-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="comments-heading" className="font-bold text-[var(--brand-gray-900)]">
            {isAr ? "التعليقات" : "Comments"}
            {comments.length > 0 && (
              <span className="ms-2 text-sm font-normal text-[var(--brand-gray-500)]">
                ({comments.length})
              </span>
            )}
          </h2>
          <Button
            type="button"
            variant="outline"
            className="gap-1.5 border-[var(--brand-gray-200)]"
            onClick={() => {
              setSuccessMessage("");
              setDialogOpen(true);
            }}
          >
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
            {isAr ? "أضف تعليقاً" : "Add a comment"}
          </Button>
        </div>

        {successMessage && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-[var(--success)]/30 bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--brand-gray-800)]"
          >
            {successMessage}
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-[var(--brand-gray-500)]">
            {isAr ? "لا توجد تعليقات بعد. كن أول من يعلق!" : "No comments yet. Be the first to comment!"}
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--brand-gray-900)]">
                    {comment.authorName}
                  </span>
                  {comment.commentDate && (
                    <time
                      dateTime={
                        typeof comment.commentDate === "string"
                          ? comment.commentDate
                          : comment.commentDate.toISOString()
                      }
                      className="text-xs text-[var(--brand-gray-400)]"
                    >
                      {formatDate(comment.commentDate, locale, "PP")}
                    </time>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[var(--brand-gray-700)] whitespace-pre-wrap">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <DialogContent className="border-[var(--brand-gray-200)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isAr ? "أضف تعليقاً" : "Add a comment"}</DialogTitle>
            <DialogDescription>
              {isAr
                ? "شاركنا رأيك في هذا المقال. البريد الإلكتروني اختياري."
                : "Share your thoughts on this article. Email is optional."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div>
              <Label htmlFor="comment-author">
                {isAr ? "الاسم" : "Name"}
                <span className="text-[var(--brand-red)]"> *</span>
              </Label>
              <Input
                id="comment-author"
                value={form.authorName}
                onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
                placeholder={isAr ? "اسمك" : "Your name"}
                maxLength={100}
                autoComplete="name"
              />
              {fieldErrors.authorName && (
                <p className="mt-1 text-xs text-[var(--error)]">{fieldErrors.authorName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="comment-email">
                {isAr ? "البريد الإلكتروني (اختياري)" : "Email (optional)"}
              </Label>
              <Input
                id="comment-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder={isAr ? "example@email.com" : "example@email.com"}
                dir="ltr"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-[var(--error)]">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="comment-content">
                {isAr ? "التعليق" : "Comment"}
                <span className="text-[var(--brand-red)]"> *</span>
              </Label>
              <Textarea
                id="comment-content"
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder={isAr ? "اكتب تعليقك هنا..." : "Write your comment here..."}
                rows={5}
                maxLength={2000}
              />
              {fieldErrors.content && (
                <p className="mt-1 text-xs text-[var(--error)]">{fieldErrors.content}</p>
              )}
            </div>

            {submitError && (
              <p className="form-error-banner rounded-md px-3 py-2 text-sm">{submitError}</p>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={submitting}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={submitting} className="gap-1.5">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {submitting
                  ? (isAr ? "جاري الإرسال..." : "Submitting...")
                  : (isAr ? "إرسال التعليق" : "Submit comment")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
