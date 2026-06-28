"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2, Bell } from "lucide-react";

interface Option {
  id: string;
  name: string;
  nameAr?: string | null;
  title?: string;
}

interface PrefsData {
  subscriber: {
    email: string;
    locale: string;
    prefProductCategoryIds: string[];
    prefArticleCategoryIds: string[];
    prefPublisherIds: string[];
    prefAuthorIds: string[];
  };
  options: {
    bookCategories: Option[];
    articleCategories: Option[];
    publishers: Option[];
    authors: Option[];
  };
}

function MultiSelect({
  label,
  hint,
  options,
  selected,
  onChange,
  locale,
}: {
  label: string;
  hint?: string;
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
  locale: string;
}) {
  const isAr = locale === "ar";

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-[var(--brand-gray-800)]">{label}</h3>
        {hint && <p className="text-xs text-[var(--brand-gray-500)]">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const displayName = isAr ? (opt.nameAr ?? opt.name ?? opt.title ?? opt.id) : (opt.name ?? opt.title ?? opt.id);
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={[
                "rounded-full border px-3 py-1 text-sm transition-colors",
                active
                  ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                  : "border-[var(--brand-gray-300)] bg-white text-[var(--brand-gray-700)] hover:border-[var(--brand-red)]",
              ].join(" ")}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function NewsletterPreferencesClient({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<PrefsData | null>(null);

  const [productCatIds, setProductCatIds] = useState<string[]>([]);
  const [articleCatIds, setArticleCatIds] = useState<string[]>([]);
  const [publisherIds, setPublisherIds] = useState<string[]>([]);
  const [authorIds, setAuthorIds] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setError(isAr ? "رابط غير صالح" : "Invalid link");
      setLoading(false);
      return;
    }

    void fetch(`/api/v1/newsletter/preferences?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((json) => {
        const d = (json as { success?: boolean; data?: PrefsData }).data;
        if (!d) throw new Error("not found");
        setData(d);
        setProductCatIds(d.subscriber.prefProductCategoryIds);
        setArticleCatIds(d.subscriber.prefArticleCategoryIds);
        setPublisherIds(d.subscriber.prefPublisherIds);
        setAuthorIds(d.subscriber.prefAuthorIds);
      })
      .catch(() => setError(isAr ? "الرابط غير صالح أو منتهي الصلاحية" : "Invalid or expired link"))
      .finally(() => setLoading(false));
  }, [token, isAr]);

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/v1/newsletter/preferences?token=${encodeURIComponent(token)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefProductCategoryIds: productCatIds,
          prefArticleCategoryIds: articleCatIds,
          prefPublisherIds: publisherIds,
          prefAuthorIds: authorIds,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
    } catch {
      setError(isAr ? "فشل الحفظ، حاول مرة أخرى" : "Save failed, please try again");
    } finally {
      setSaving(false);
    }
  }

  async function handleUnsubscribe() {
    if (!token) return;
    if (!window.confirm(isAr ? "هل تريد إلغاء الاشتراك نهائياً؟" : "Unsubscribe from all newsletters?")) return;
    await fetch(`/api/v1/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
    window.location.href = isAr ? "/ar/newsletter/unsubscribed" : "/en/newsletter/unsubscribed";
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-red)]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[var(--error)]" />
        <p className="text-[var(--brand-gray-700)]">{error ?? (isAr ? "خطأ غير متوقع" : "Unexpected error")}</p>
      </div>
    );
  }

  const noPrefs = productCatIds.length === 0 && articleCatIds.length === 0 && publisherIds.length === 0 && authorIds.length === 0;

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)] text-white">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "تفضيلات النشرة البريدية" : "Newsletter Preferences"}
          </h1>
          <p className="text-sm text-[var(--brand-gray-500)]">{data.subscriber.email}</p>
        </div>
      </div>

      <p className="mb-6 text-sm text-[var(--brand-gray-600)]">
        {isAr
          ? "اختر ما يهمك ليصلك المحتوى المناسب. إذا لم تختر شيئاً ستصلك توصية عشوائية عند نزول محتوى جديد."
          : "Choose topics to receive relevant content. If nothing is selected, you'll get a random new item recommendation."}
      </p>

      <div className="space-y-6">
        {data.options.bookCategories.length > 0 && (
          <MultiSelect
            label={isAr ? "تصنيفات الكتب" : "Book Categories"}
            hint={isAr ? "اختر تصنيفات الكتب التي تهتم بها" : "Select book categories you're interested in"}
            options={data.options.bookCategories}
            selected={productCatIds}
            onChange={setProductCatIds}
            locale={locale}
          />
        )}

        {data.options.articleCategories.length > 0 && (
          <MultiSelect
            label={isAr ? "تصنيفات المقالات والقراءات" : "Article Categories"}
            hint={isAr ? "اختر نوع المقالات التي تريد متابعتها" : "Select article types you want to follow"}
            options={data.options.articleCategories}
            selected={articleCatIds}
            onChange={setArticleCatIds}
            locale={locale}
          />
        )}

        {data.options.publishers.length > 0 && (
          <MultiSelect
            label={isAr ? "دور النشر" : "Publishers"}
            hint={isAr ? "اختر الناشرين لمتابعة إصداراتهم" : "Follow specific publishers"}
            options={data.options.publishers}
            selected={publisherIds}
            onChange={setPublisherIds}
            locale={locale}
          />
        )}

        {data.options.authors.length > 0 && (
          <MultiSelect
            label={isAr ? "المؤلفون" : "Authors"}
            hint={isAr ? "اختر المؤلفين لمتابعة كتبهم الجديدة" : "Follow specific authors"}
            options={data.options.authors}
            selected={authorIds}
            onChange={setAuthorIds}
            locale={locale}
          />
        )}
      </div>

      {noPrefs && (
        <p className="mt-4 text-xs text-[var(--brand-gray-400)]">
          {isAr ? "لم تختر شيئاً — ستصلك توصية عشوائية" : "Nothing selected — you'll receive random picks"}
        </p>
      )}

      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--success-bg,#f0fdf4)] px-4 py-3 text-sm text-[var(--success,#16a34a)]">
          <CheckCircle className="h-4 w-4" />
          {isAr ? "تم الحفظ بنجاح" : "Preferences saved"}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-[var(--error)]">{error}</p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-red)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isAr ? "حفظ التفضيلات" : "Save Preferences"}
        </button>

        <button
          type="button"
          onClick={() => void handleUnsubscribe()}
          className="text-sm text-[var(--brand-gray-400)] underline hover:text-[var(--error)] transition"
        >
          {isAr ? "إلغاء الاشتراك نهائياً" : "Unsubscribe from all"}
        </button>
      </div>
    </div>
  );
}
