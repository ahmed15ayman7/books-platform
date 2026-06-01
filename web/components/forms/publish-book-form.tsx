"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  draftSubmissionSchema,
  stepRequiredFieldsComplete,
  type DraftSubmissionInput,
} from "@/lib/validation/submission.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ChevronLeft, ChevronRight, Cloud, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadLocalFormValues, useFormAutosave } from "@/lib/forms/use-form-autosave";
import {
  authHeaders,
  clearStoredDraft,
  getAuthorSession,
  getStoredDraftId,
  setStoredDraftId,
  setStoredDraftToken,
} from "@/lib/auth/author-client";

interface PublishBookFormProps {
  locale: string;
}

const FORM_ID = "publish-book";
const STEPS = ["author", "book", "review"] as const;

const defaultValues: DraftSubmissionInput = {
  authorName: "",
  authorEmail: "",
  authorPhone: "",
  authorBio: "",
  bookTitle: "",
  bookSummary: "",
  bookLanguage: "",
  bookCategory: "",
  allowFreeDownload: false,
  currentStep: 0,
};

export function PublishBookForm({ locale }: PublishBookFormProps) {
  const t = useTranslations("publish.form");
  const td = useTranslations("draft");
  const isAr = locale === "ar";
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isFirstFree, setIsFirstFree] = useState<boolean | null>(null);
  const [resumeBanner, setResumeBanner] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<DraftSubmissionInput>({
    resolver: zodResolver(draftSubmissionSchema),
    defaultValues,
  });

  const values = watch();

  const syncDraft = useCallback(async (formValues: DraftSubmissionInput): Promise<string | null> => {
    const payload = { ...formValues, currentStep: step };
    const headers = authHeaders();

    if (draftId) {
      const res = await fetch(`/api/v1/submissions/drafts/${draftId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      return draftId;
    }

    const res = await fetch("/api/v1/submissions/drafts", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json() as {
      success: boolean;
      data?: { draft: { id: string }; draftToken: string };
    };
    if (!res.ok || !data.success || !data.data) throw new Error("create failed");
    setDraftId(data.data.draft.id);
    setStoredDraftId(data.data.draft.id);
    if (data.data.draftToken) setStoredDraftToken(data.data.draftToken);
    return data.data.draft.id;
  }, [draftId, step]);

  const canSyncToServer = useCallback(
    (v: DraftSubmissionInput) => stepRequiredFieldsComplete(step, v),
    [step],
  );

  const { status: autosaveStatus } = useFormAutosave({
    formId: FORM_ID,
    values: { ...values, currentStep: step },
    enabled: initialized,
    canSyncToServer,
    onServerSave: async (v) => {
      await syncDraft(v);
    },
  });

  useEffect(() => {
    async function init() {
      const urlDraftId = searchParams.get("draft");
      const urlStep = parseInt(searchParams.get("step") ?? "0", 10);
      const storedId = urlDraftId ?? getStoredDraftId();

      if (storedId) {
        try {
          const res = await fetch(`/api/v1/submissions/drafts/${storedId}`, {
            headers: authHeaders(),
          });
          const data = await res.json() as {
            success: boolean;
            data?: { draft: { id: string; currentStep: number; formValues: DraftSubmissionInput } };
          };
          if (data.success && data.data?.draft) {
            const { draft } = data.data;
            reset({ ...defaultValues, ...draft.formValues });
            setDraftId(draft.id);
            setStoredDraftId(draft.id);
            setStep(urlDraftId ? urlStep : draft.currentStep);
            setInitialized(true);
            return;
          }
        } catch {
          // fall through to local
        }
      }

      const local = loadLocalFormValues<DraftSubmissionInput & { currentStep?: number }>(FORM_ID);
      if (local) {
        reset({ ...defaultValues, ...local });
        if (local.currentStep !== undefined) setStep(local.currentStep);
        setResumeBanner(true);
      }
      setInitialized(true);
    }
    void init();
  }, [reset, searchParams]);

  const emailVal = watch("authorEmail");

  async function checkEligibility(checkEmail: string) {
    if (!checkEmail?.includes("@")) return;
    try {
      const res = await fetch(
        `/api/v1/submissions/check-eligibility?email=${encodeURIComponent(checkEmail)}`,
      );
      const data = (await res.json()) as { data: { isEligibleForFree: boolean } };
      setIsFirstFree(data.data.isEligibleForFree);
    } catch {
      // silent
    }
  }

  function resumeLocalDraft() {
    setResumeBanner(false);
  }

  function dismissLocalDraft() {
    localStorage.removeItem(`form-autosave:${FORM_ID}`);
    setResumeBanner(false);
  }

  async function onFinalSubmit() {
    setStatus("loading");
    try {
      let id = draftId ?? getStoredDraftId();
      if (!id) {
        id = await syncDraft(getValues());
      }
      if (!id) {
        setStatus("error");
        return;
      }

      const res = await fetch(`/api/v1/submissions/drafts/${id}/submit`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (res.ok) {
        clearStoredDraft();
        localStorage.removeItem(`form-autosave:${FORM_ID}`);
        setStatus("success");
        reset(defaultValues);
        setStep(0);
        setDraftId(null);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const stepLabels = isAr
    ? ["معلومات المؤلف", "معلومات الكتاب", "المراجعة والإرسال"]
    : ["Author Info", "Book Info", "Review & Submit"];

  const publishRedirect = useMemo(() => {
    const base = `/${locale}/publish`;
    const q = draftId ? `?draft=${draftId}&step=${step}` : "";
    return `${base}${q}`;
  }, [draftId, locale, step]);

  const registerHref = `/${locale}/auth/register?redirect=${encodeURIComponent(publishRedirect)}`;
  const loginHref = `/${locale}/auth/login?redirect=${encodeURIComponent(publishRedirect)}`;
  const session = getAuthorSession();

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
    <div className="space-y-5">
      {resumeBanner && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--brand-red)]/30 bg-[var(--brand-red-soft)] p-4">
          <p className="text-sm text-[var(--brand-gray-800)]">{td("resume")}</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={dismissLocalDraft}>
              {isAr ? "تجاهل" : "Dismiss"}
            </Button>
            <Button type="button" size="sm" onClick={resumeLocalDraft}>
              {isAr ? "متابعة" : "Continue"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-xs text-[var(--brand-gray-500)]">
        <div className="flex items-center gap-1.5">
          <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
          {autosaveStatus === "saving" && td("saving")}
          {autosaveStatus === "saved" && td("saved")}
          {autosaveStatus === "error" && td("failed")}
          {autosaveStatus === "idle" && td("idle")}
        </div>
        {session ? (
          <Link href={`/${locale}/author/submissions`} className="text-[var(--brand-red)] hover:underline">
            {isAr ? "مسوداتي" : "My drafts"}
          </Link>
        ) : (
          <span>
            <Link href={loginHref} className="text-[var(--brand-red)] hover:underline">
              {isAr ? "دخول" : "Sign in"}
            </Link>
            {" · "}
            <Link href={registerHref} className="text-[var(--brand-red)] hover:underline">
              {isAr ? "تسجيل" : "Register"}
            </Link>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={STEPS[i]}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-[var(--brand-red)]" : "bg-[var(--brand-gray-200)]",
            )}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-[var(--brand-gray-700)]">
        {step + 1}. {stepLabels[step]}
      </p>

      <form
        onSubmit={handleSubmit(() => {
          if (step < 2) {
            setStep((s) => s + 1);
            setValue("currentStep", step + 1);
            return;
          }
          void onFinalSubmit();
        })}
        className="space-y-5"
        noValidate
      >
        <Input type="text" className="sr-only" tabIndex={-1} autoComplete="off" name="website" />

        {step === 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label={t("authorName")} error={errors.authorName?.message} required>
                <Input className={inputClass(!!errors.authorName)} {...register("authorName")} />
              </FormField>
              <FormField label={t("email")} error={errors.authorEmail?.message} required>
                <Input
                  type="email"
                  className={inputClass(!!errors.authorEmail)}
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
              <Input type="tel" className={inputClass(!!errors.authorPhone)} {...register("authorPhone")} />
            </FormField>
            <FormField label={t("bio")} error={errors.authorBio?.message}>
              <Textarea rows={2} className={inputClass(!!errors.authorBio)} {...register("authorBio")} />
            </FormField>
          </>
        )}

        {step === 1 && (
          <>
            <FormField label={t("bookTitle")} error={errors.bookTitle?.message} required>
              <Input className={inputClass(!!errors.bookTitle)} {...register("bookTitle")} />
            </FormField>
            <FormField label={t("bookSummary")} error={errors.bookSummary?.message} required>
              <Textarea rows={4} className={inputClass(!!errors.bookSummary)} {...register("bookSummary")} />
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label={t("bookLanguage")} error={errors.bookLanguage?.message} required>
                <Controller
                  name="bookLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || "_empty"} onValueChange={(v) => field.onChange(v === "_empty" ? "" : v)}>
                      <SelectTrigger className={inputClass(!!errors.bookLanguage)}>
                        <SelectValue placeholder={isAr ? "اختر اللغة" : "Select language"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_empty">{isAr ? "اختر اللغة" : "Select language"}</SelectItem>
                        <SelectItem value="ar">{isAr ? "العربية" : "Arabic"}</SelectItem>
                        <SelectItem value="en">{isAr ? "الإنجليزية" : "English"}</SelectItem>
                        <SelectItem value="fr">{isAr ? "الفرنسية" : "French"}</SelectItem>
                        <SelectItem value="de">{isAr ? "الألمانية" : "German"}</SelectItem>
                        <SelectItem value="es">{isAr ? "الإسبانية" : "Spanish"}</SelectItem>
                        <SelectItem value="other">{isAr ? "أخرى" : "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label={t("bookCategory")} error={errors.bookCategory?.message}>
                <Input className={inputClass(!!errors.bookCategory)} {...register("bookCategory")} />
              </FormField>
            </div>
            <div className="rounded-lg bg-[var(--brand-gray-50)] border border-[var(--brand-gray-200)] p-4">
              <div className="flex items-center gap-2 text-sm text-[var(--brand-gray-600)]">
                <Upload className="h-4 w-4 shrink-0 text-[var(--brand-red)]" aria-hidden="true" />
                <p>
                  {isAr
                    ? "بعد الإرسال، سنتواصل معك لرفع ملف الكتاب والغلاف"
                    : "After submission, we'll contact you to upload your book file and cover"}
                </p>
              </div>
            </div>
            <Controller
              name="allowFreeDownload"
              control={control}
              render={({ field }) => (
                <div className="flex items-start gap-3">
                  <Checkbox id="allowFreeDownload" checked={!!field.value} onCheckedChange={field.onChange} />
                  <Label htmlFor="allowFreeDownload" className="cursor-pointer text-sm text-[var(--brand-gray-700)]">
                    {t("allowFreeDownload")}
                  </Label>
                </div>
              )}
            />
          </>
        )}

        {step === 2 && (
          <div className="space-y-4 rounded-lg border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] p-4 text-sm">
            <ReviewRow label={t("authorName")} value={values.authorName} />
            <ReviewRow label={t("email")} value={values.authorEmail} />
            <ReviewRow label={t("phone")} value={values.authorPhone} />
            <ReviewRow label={t("bookTitle")} value={values.bookTitle} />
            <ReviewRow label={t("bookLanguage")} value={values.bookLanguage} />
            <ReviewRow label={t("bookCategory")} value={values.bookCategory} />
            <div>
              <p className="font-medium text-[var(--brand-gray-700)]">{t("bookSummary")}</p>
              <p className="mt-1 text-[var(--brand-gray-600)] whitespace-pre-wrap">{values.bookSummary}</p>
            </div>
            {!session && (
              <p className="text-xs text-[var(--brand-gray-500)]">
                {isAr ? "ننصح بـ" : "We recommend"}{" "}
                <Link href={registerHref} className="text-[var(--brand-red)] hover:underline">
                  {isAr ? "إنشاء حساب" : "creating an account"}
                </Link>
                {isAr ? " لحفظ مسودتك والعودة لاحقاً." : " to save your draft and return later."}
              </p>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-md bg-[var(--error-soft)] border border-[var(--error)] p-3 text-sm text-[var(--error)]">
            {isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred. Please try again."}
          </div>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep((s) => s - 1);
                setValue("currentStep", step - 1);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              {isAr ? "السابق" : "Back"}
            </Button>
          )}
          <Button type="submit" size="lg" className="flex-1" loading={status === "loading"}>
            {step < 2 ? (
              <>
                {isAr ? "التالي" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <span className="font-medium text-[var(--brand-gray-700)]">{label}: </span>
      <span className="text-[var(--brand-gray-600)]">{value}</span>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full bg-white",
    hasError
      ? "border-[var(--error)] focus-visible:ring-[var(--error)]"
      : "border-[var(--brand-gray-300)]",
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
      <Label className="text-sm font-medium text-[var(--brand-gray-700)]">
        {label}
        {required && <span className="ms-1 text-[var(--error)]">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
