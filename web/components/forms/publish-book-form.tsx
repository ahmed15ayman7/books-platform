"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createSubmissionSchema } from "@/lib/validation/submission.schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublishBookFormProps {
  locale: string;
}

export function PublishBookForm({ locale }: PublishBookFormProps) {
  const t = useTranslations("publish.form");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isFirstFree, setIsFirstFree] = useState<boolean | null>(null);
  const isAr = locale === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: { allowFreeDownload: false as boolean },
  });

  const emailVal = watch("authorEmail") as string | undefined;

  async function checkEligibility(checkEmail: string) {
    if (!checkEmail || !checkEmail.includes("@")) return;
    const emailVal = checkEmail;
    try {
      const res = await fetch(`/api/v1/submissions/check-eligibility?email=${encodeURIComponent(emailVal)}`);
      const data = await res.json() as { data: { isEligibleForFree: boolean } };
      setIsFirstFree(data.data.isEligibleForFree);
    } catch {
      // silent
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    setStatus("loading");
    try {
      const res = await fetch("/api/v1/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="h-16 w-16 text-[var(--success)]" aria-hidden="true" />
        <h2 className="text-xl font-bold text-[var(--brand-gray-900)]">{t("success")}</h2>
        <Button onClick={() => setStatus("idle")} variant="outline">
          {isAr ? "إرسال كتاب آخر" : "Submit Another Book"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label={t("authorName")} error={errors.authorName?.message} required>
          <input
            type="text"
            className={inputClass(!!errors.authorName)}
            placeholder={isAr ? "الاسم الكامل" : "Full name"}
            {...register("authorName")}
          />
        </FormField>

        <FormField label={t("email")} error={errors.authorEmail?.message} required>
          <input
            type="email"
            className={inputClass(!!errors.authorEmail)}
            placeholder="email@example.com"
                {...register("authorEmail", {
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => checkEligibility(e.target.value),
            })}
          />
          {emailVal && isFirstFree === true && (
            <p className="mt-1 text-xs text-[var(--success)]">
              {isAr ? "✅ الكتاب الأول مجاناً" : "✅ First book is free"}
            </p>
          )}
          {emailVal && isFirstFree === false && (
            <p className="mt-1 text-xs text-[var(--warning)]">
              {isAr ? "⚠️ سيتم تطبيق رسوم الإرسال" : "⚠️ Submission fee applies"}
            </p>
          )}
        </FormField>
      </div>

      <FormField label={t("phone")} error={errors.authorPhone?.message}>
        <input
          type="tel"
          className={inputClass(!!errors.authorPhone)}
          placeholder="+966 5x xxx xxxx"
          {...register("authorPhone")}
        />
      </FormField>

      <FormField label={t("bio")} error={errors.authorBio?.message}>
        <textarea
          rows={2}
          className={inputClass(!!errors.authorBio)}
          placeholder={isAr ? "نبذة مختصرة عن المؤلف" : "Brief author bio"}
          {...register("authorBio")}
        />
      </FormField>

      <FormField label={t("bookTitle")} error={errors.bookTitle?.message} required>
        <input
          type="text"
          className={inputClass(!!errors.bookTitle)}
          placeholder={isAr ? "عنوان الكتاب" : "Book title"}
          {...register("bookTitle")}
        />
      </FormField>

      <FormField label={t("bookSummary")} error={errors.bookSummary?.message} required>
        <textarea
          rows={4}
          className={inputClass(!!errors.bookSummary)}
          placeholder={isAr ? "ملخص الكتاب (50 حرف على الأقل)" : "Book summary (min. 50 chars)"}
          {...register("bookSummary")}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label={t("bookLanguage")} error={errors.bookLanguage?.message} required>
          <select className={inputClass(!!errors.bookLanguage)} {...register("bookLanguage")}>
            <option value="">{isAr ? "اختر اللغة" : "Select language"}</option>
            <option value="ar">{isAr ? "العربية" : "Arabic"}</option>
            <option value="en">{isAr ? "الإنجليزية" : "English"}</option>
            <option value="fr">{isAr ? "الفرنسية" : "French"}</option>
            <option value="de">{isAr ? "الألمانية" : "German"}</option>
            <option value="es">{isAr ? "الإسبانية" : "Spanish"}</option>
            <option value="other">{isAr ? "أخرى" : "Other"}</option>
          </select>
        </FormField>

        <FormField label={t("bookCategory")} error={errors.bookCategory?.message}>
          <input
            type="text"
            className={inputClass(!!errors.bookCategory)}
            placeholder={isAr ? "تقنية، رواية، دراسات..." : "Technology, Novel, Studies..."}
            {...register("bookCategory")}
          />
        </FormField>
      </div>

      {/* File upload notes */}
      <div className="rounded-lg bg-[var(--brand-gray-50)] border border-[var(--brand-gray-200)] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--brand-gray-600)]">
          <Upload className="h-4 w-4 flex-shrink-0 text-[var(--brand-red)]" aria-hidden="true" />
          <p>
            {isAr
              ? "بعد الإرسال، سنتواصل معك لرفع ملف الكتاب والغلاف"
              : "After submission, we'll contact you to upload your book file and cover"}
          </p>
        </div>
      </div>

      {/* Allow free download */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="allowFreeDownload"
          className="mt-1 h-4 w-4 rounded border-[var(--brand-gray-300)] text-[var(--brand-red)] focus:ring-[var(--brand-red)]"
          {...register("allowFreeDownload")}
        />
        <label htmlFor="allowFreeDownload" className="text-sm text-[var(--brand-gray-700)] cursor-pointer">
          {t("allowFreeDownload")}
        </label>
      </div>

      {status === "error" && (
        <div className="rounded-md bg-[var(--error-soft)] border border-[var(--error)] p-3 text-sm text-[var(--error)]">
          {isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred. Please try again."}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={status === "loading"}>
        {t("submit")}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-md border bg-white px-4 py-2.5 text-sm",
    "placeholder:text-[var(--brand-gray-400)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)] focus:border-transparent",
    hasError
      ? "border-[var(--error)] focus:ring-[var(--error)]"
      : "border-[var(--brand-gray-300)]"
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[var(--brand-gray-700)]">
        {label}
        {required && <span className="ms-1 text-[var(--error)]">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
