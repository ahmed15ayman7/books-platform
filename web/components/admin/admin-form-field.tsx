"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
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
import { AUTO_SLUG_HINT } from "@/lib/admin/slugify";

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children?: ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  required,
  hint,
  error,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label className="text-xs font-medium text-[var(--admin-text-muted)]">
        {label}
        {required && <span className="ms-0.5 text-[var(--brand-red)]">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-[var(--admin-text-subtle)]">{hint}</p>
      )}
      {error && <p className="form-error-text text-[11px]">{error}</p>}
    </div>
  );
}

export const adminFieldClass =
  "border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] text-[var(--admin-text)] placeholder:text-[var(--admin-text-subtle)] focus-visible:ring-[var(--admin-accent)] focus-visible:ring-offset-0";

/** @deprecated Use adminFieldClass */
export const adminInputCls = adminFieldClass;

interface AdminInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  hint?: string;
}

export function AdminInput({ label, error, hint, className, id, ...props }: AdminInputProps) {
  const fieldId = id ?? props.name;
  return (
    <AdminFormField label={label} required={props.required} error={error} hint={hint}>
      <Input
        id={fieldId}
        {...props}
        className={cn(adminFieldClass, error && "border-[var(--error)]", className)}
      />
    </AdminFormField>
  );
}

interface AdminSlugInputProps extends Omit<AdminInputProps, "hint"> {
  hint?: string;
}

/** Slug field with default hint about auto-generation from English name. */
export function AdminSlugInput({ hint = AUTO_SLUG_HINT, dir = "ltr", ...props }: AdminSlugInputProps) {
  return <AdminInput hint={hint} dir={dir} {...props} />;
}

interface AdminTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
  hint?: string;
}

export function AdminTextarea({
  label,
  error,
  hint,
  rows = 3,
  className,
  id,
  ...props
}: AdminTextareaProps) {
  const fieldId = id ?? props.name;
  return (
    <AdminFormField label={label} required={props.required} error={error} hint={hint}>
      <Textarea
        id={fieldId}
        rows={rows}
        {...props}
        className={cn(adminFieldClass, "resize-y", error && "border-[var(--error)]", className)}
      />
    </AdminFormField>
  );
}

interface AdminSelectProps {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  placeholder?: string;
}

export function AdminSelect({
  label,
  error,
  hint,
  options,
  value = "",
  onChange,
  onValueChange,
  disabled,
  required,
  className,
  id,
  name,
  placeholder,
}: AdminSelectProps) {
  const fieldId = id ?? name;

  const handleValueChange = (next: string) => {
    onValueChange?.(next);
    onChange?.({
      target: { value: next, name: name ?? "" },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <AdminFormField label={label} required={required} error={error} hint={hint}>
      <Select value={value} onValueChange={handleValueChange} disabled={disabled} name={name}>
        <SelectTrigger
          id={fieldId}
          className={cn(adminFieldClass, error && "border-[var(--error)]", className)}
        >
          <SelectValue placeholder={placeholder ?? "اختر..."} />
        </SelectTrigger>
        <SelectContent className="border-[var(--admin-input-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="focus:bg-[var(--admin-hover)] focus:text-[var(--admin-text)]"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </AdminFormField>
  );
}

interface AdminCheckboxProps extends Omit<React.ComponentProps<typeof Checkbox>, "onChange"> {
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function AdminCheckbox({ label, className, checked, onChange, ...props }: AdminCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={props.id ?? props.name}
        checked={checked}
        onCheckedChange={(state) => {
          onChange?.({
            target: { checked: state === true },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        className={cn(
          "border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--admin-accent)] data-[state=checked]:border-[var(--admin-accent)]",
          className,
        )}
        {...props}
      />
      <Label
        htmlFor={props.id ?? props.name}
        className="cursor-pointer text-sm font-normal text-[var(--admin-text)]"
      >
        {label}
      </Label>
    </div>
  );
}
