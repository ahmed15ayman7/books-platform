"use client";

import { Languages, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBilingualAutoTranslate } from "@/hooks/use-bilingual-auto-translate";

interface BilingualFieldLabels {
  ar: string;
  en: string;
}

interface AdminBilingualFieldProps {
  arValue: string;
  enValue: string;
  onArChange: (value: string) => void;
  onEnChange: (value: string) => void;
  labels: BilingualFieldLabels;
  inputClassName?: string;
  arPlaceholder?: string;
  enPlaceholder?: string;
  arRequired?: boolean;
  enRequired?: boolean;
  /** full = each field spans 2 cols; half = one col each */
  layout?: "full" | "half";
  multiline?: boolean;
  rows?: number;
  enMonospace?: boolean;
  /** Hide shared toolbar when stacking multiple bilingual groups */
  showToolbar?: boolean;
}

function FieldShell({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout: "full" | "half";
}) {
  return (
    <div className={cn("flex flex-col", layout === "full" ? "col-span-full sm:col-span-2" : undefined)}>
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[var(--admin-text-muted)]"
    >
      {children}
      {required && <span className="ms-0.5 text-[var(--brand-red)]">*</span>}
    </label>
  );
}

export function AdminBilingualToolbar({
  translating,
  autoEnabled,
  onToggleAuto,
  onArToEn,
  onEnToAr,
  arDisabled,
  enDisabled,
}: {
  translating: boolean;
  autoEnabled: boolean;
  onToggleAuto: () => void;
  onArToEn: () => void;
  onEnToAr: () => void;
  arDisabled: boolean;
  enDisabled: boolean;
}) {
  return (
    <div className="col-span-full mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2 text-xs text-[var(--admin-text-muted)]">
      <Languages className="h-3.5 w-3.5 text-[var(--brand-red)]" aria-hidden="true" />
      <span>ترجمة تلقائية عربي ↔ إنجليزي</span>
      <button
        type="button"
        onClick={onToggleAuto}
        className={cn(
          "rounded-md px-2 py-0.5 font-medium transition-colors",
          autoEnabled
            ? "bg-[var(--brand-red)] text-white"
            : "bg-[var(--admin-surface)] text-[var(--admin-text-subtle)]",
        )}
      >
        {autoEnabled ? "مفعّلة" : "متوقفة"}
      </button>
      {translating && (
        <span className="inline-flex items-center gap-1 text-[var(--admin-text-subtle)]">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          جاري الترجمة…
        </span>
      )}
      <div className="ms-auto flex gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[11px]"
          onClick={onArToEn}
          disabled={translating || arDisabled}
        >
          عربي → EN
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[11px]"
          onClick={onEnToAr}
          disabled={translating || enDisabled}
        >
          EN → عربي
        </Button>
      </div>
    </div>
  );
}

export function AdminBilingualField({
  arValue,
  enValue,
  onArChange,
  onEnChange,
  labels,
  inputClassName,
  arPlaceholder,
  enPlaceholder,
  arRequired,
  enRequired,
  layout = "full",
  multiline = false,
  rows = 4,
  enMonospace = false,
  showToolbar = true,
}: AdminBilingualFieldProps) {
  const {
    translating,
    autoEnabled,
    setAutoEnabled,
    handleArChange,
    handleEnChange,
    forceTranslateArToEn,
    forceTranslateEnToAr,
  } = useBilingualAutoTranslate({
    ar: arValue,
    en: enValue,
    onArChange,
    onEnChange,
  });

  const InputComponent = multiline ? Textarea : Input;
  const arExtra = multiline ? { rows } : {};
  const enExtra = multiline ? { rows } : {};

  const toolbar = showToolbar ? (
    <AdminBilingualToolbar
      translating={translating}
      autoEnabled={autoEnabled}
      onToggleAuto={() => setAutoEnabled((v) => !v)}
      onArToEn={() => void forceTranslateArToEn()}
      onEnToAr={() => void forceTranslateEnToAr()}
      arDisabled={!arValue.trim()}
      enDisabled={!enValue.trim()}
    />
  ) : null;

  if (layout === "half") {
    return (
      <>
        {toolbar}
        <FieldShell layout="half">
          <FieldLabel htmlFor={`bilingual-ar-${labels.ar}`} required={arRequired}>
            {labels.ar}
          </FieldLabel>
          <InputComponent
            id={`bilingual-ar-${labels.ar}`}
            className={cn(inputClassName, multiline && "min-h-[80px] resize-y")}
            value={arValue}
            onChange={(e) => handleArChange(e.target.value)}
            placeholder={arPlaceholder}
            {...arExtra}
          />
        </FieldShell>
        <FieldShell layout="half">
          <FieldLabel htmlFor={`bilingual-en-${labels.en}`} required={enRequired}>
            {labels.en}
          </FieldLabel>
          <InputComponent
            id={`bilingual-en-${labels.en}`}
            className={cn(
              inputClassName,
              multiline && "min-h-[80px] resize-y",
              enMonospace && "font-mono text-[13px]",
            )}
            value={enValue}
            onChange={(e) => handleEnChange(e.target.value)}
            placeholder={enPlaceholder}
            dir="ltr"
            {...enExtra}
          />
        </FieldShell>
      </>
    );
  }

  return (
    <>
      {toolbar}
      <FieldShell layout="full">
        <FieldLabel htmlFor={`bilingual-ar-${labels.ar}`} required={arRequired}>
          {labels.ar}
        </FieldLabel>
        <InputComponent
          id={`bilingual-ar-${labels.ar}`}
          className={cn(inputClassName, multiline && "min-h-[100px] resize-y")}
          value={arValue}
          onChange={(e) => handleArChange(e.target.value)}
          placeholder={arPlaceholder}
          {...arExtra}
        />
      </FieldShell>
      <FieldShell layout="full">
        <FieldLabel htmlFor={`bilingual-en-${labels.en}`} required={enRequired}>
          {labels.en}
        </FieldLabel>
        <InputComponent
          id={`bilingual-en-${labels.en}`}
          className={cn(
            inputClassName,
            multiline && "min-h-[100px] resize-y",
            enMonospace && "font-mono text-[13px]",
          )}
          value={enValue}
          onChange={(e) => handleEnChange(e.target.value)}
          placeholder={enPlaceholder}
          dir="ltr"
          {...enExtra}
        />
      </FieldShell>
    </>
  );
}
