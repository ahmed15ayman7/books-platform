"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { headersForMultipartUpload } from "@/lib/http/upload-headers";
import type { UploadFolder, UploadField } from "@/lib/storage/image-key";

interface UploadResult {
  url: string;
  key: string;
  sha256: string;
  deduplicated: boolean;
}

export interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder: UploadFolder;
  field: UploadField;
  /** Integer id (articles, products, publishers) */
  originalId?: number | null;
  /** String cuid (hero slides, draft submissions) */
  entityId?: string | null;
  /** Full URL for the upload endpoint */
  uploadUrl?: string;
  /** Extra headers (e.g. Authorization) */
  headers?: HeadersInit;
  /** Extra form fields appended to multipart */
  extraFields?: Record<string, string>;
  disabled?: boolean;
  className?: string;
  /** Placeholder shown before any image */
  placeholder?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label,
  folder,
  field,
  originalId,
  entityId,
  uploadUrl = "/api/v1/admin/uploads/image",
  headers,
  extraFields,
  disabled = false,
  className,
  placeholder,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setStatus("uploading");
      setErrorMsg(null);

      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      form.append("field", field);
      if (originalId != null) form.append("originalId", String(originalId));
      if (entityId) form.append("entityId", entityId);
      if (extraFields) {
        for (const [k, v] of Object.entries(extraFields)) {
          form.append(k, v);
        }
      }

      try {
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: headersForMultipartUpload(headers),
          body: form,
        });
        const data = (await res.json()) as {
          success: boolean;
          data?: UploadResult;
          error?: { message: string };
        };

        if (!res.ok || !data.success || !data.data) {
          throw new Error(data.error?.message ?? "Upload failed");
        }

        onChange(data.data.url);
        setStatus("idle");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Upload failed");
        setStatus("error");
      }
    },
    [folder, field, originalId, entityId, uploadUrl, headers, extraFields, onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--admin-text-primary)]">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && !status.includes("uploading") && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          value ? "border-[var(--admin-border)] bg-[var(--admin-bg-subtle)]" : "border-[var(--admin-border)] bg-[var(--admin-bg-card)]",
          !disabled && "hover:border-[var(--brand-red)] hover:bg-[var(--admin-bg-subtle)]",
          disabled && "cursor-not-allowed opacity-50",
          status === "error" && "border-red-400",
        )}
        style={{ minHeight: value ? 120 : 96 }}
      >
        {status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {value ? (
          <div className="relative w-full p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="preview"
              className="mx-auto max-h-40 w-auto rounded object-contain"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <p className="mt-1.5 text-center text-xs text-[var(--admin-text-muted)]">
              اضغط لاستبدال الصورة
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center">
            {status === "error" ? (
              <ImageIcon className="h-7 w-7 text-red-400" />
            ) : (
              <Upload className="h-7 w-7 text-[var(--admin-text-muted)]" />
            )}
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">
              {placeholder ?? "اسحب الصورة أو اضغط للرفع"}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">
              JPEG · PNG · WebP · GIF — حتى 5 MB
            </p>
          </div>
        )}
      </div>

      {status === "error" && errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}

      {/* URL fallback input */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أو الصق رابط الصورة مباشرةً…"
        disabled={disabled}
        className={cn(
          "w-full rounded-md border px-3 py-1.5 text-xs text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)]",
          "border-[var(--admin-border)] bg-[var(--admin-bg-card)] outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)]",
          disabled && "cursor-not-allowed opacity-50",
        )}
        dir="ltr"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}
