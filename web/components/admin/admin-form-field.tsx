import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <label className="block text-xs font-medium text-[var(--brand-gray-300)]">
        {label}
        {required && <span className="ms-0.5 text-[var(--brand-red)]">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-[var(--brand-gray-500)]">{hint}</p>
      )}
      {error && <p className="text-[11px] text-[var(--error)]">{error}</p>}
    </div>
  );
}

// Shared input/textarea/select class
export const adminInputCls =
  "w-full rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2 text-sm text-white placeholder:text-[var(--brand-gray-600)] focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)] transition-colors";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function AdminInput({ label, error, hint, className, ...props }: AdminInputProps) {
  return (
    <AdminFormField label={label} required={props.required} error={error} hint={hint}>
      <input
        {...props}
        className={cn(adminInputCls, error && "border-[var(--error)]", className)}
      />
    </AdminFormField>
  );
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  ...props
}: AdminTextareaProps) {
  return (
    <AdminFormField label={label} required={props.required} error={error} hint={hint}>
      <textarea
        rows={rows}
        {...props}
        className={cn(adminInputCls, "resize-y", error && "border-[var(--error)]", className)}
      />
    </AdminFormField>
  );
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function AdminSelect({
  label,
  error,
  hint,
  options,
  className,
  ...props
}: AdminSelectProps) {
  return (
    <AdminFormField label={label} required={props.required} error={error} hint={hint}>
      <select
        {...props}
        className={cn(adminInputCls, error && "border-[var(--error)]", className)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </AdminFormField>
  );
}

interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AdminCheckbox({ label, className, ...props }: AdminCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
      <input
        type="checkbox"
        {...props}
        className={cn(
          "h-4 w-4 rounded border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] accent-[var(--brand-red)]",
          className
        )}
      />
      {label}
    </label>
  );
}
