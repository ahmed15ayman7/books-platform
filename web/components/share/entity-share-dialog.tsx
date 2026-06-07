"use client";

import { useState, type ComponentType } from "react";
import { Share2, Copy, Check, ExternalLink, X, Link2 } from "lucide-react";
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconTelegram,
  IconX,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildSharePostText,
  buildPlatformShareUrl,
  SHARE_PLATFORMS,
  tryNativeShare,
  type EntitySharePayload,
  type SharePlatform,
} from "@/lib/share/entity-share";

const PLATFORM_ICONS: Record<SharePlatform, ComponentType<{ className?: string }>> = {
  Facebook: IconFacebook,
  "X (Twitter)": IconX,
  LinkedIn: IconLinkedin,
  WhatsApp: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  Telegram: IconTelegram,
  Instagram: IconInstagram,
};

interface EntityShareDialogProps extends EntitySharePayload {
  dialogTitle?: string;
  triggerLabel?: string;
  triggerIcon?: ComponentType<{ className?: string }>;
  variant?: "admin" | "public";
  size?: "default" | "sm" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function EntityShareDialog({
  title,
  publicUrl,
  imageUrl,
  dialogTitle = "مشاركة",
  triggerLabel = "مشاركة",
  triggerIcon: TriggerIcon = Share2,
  variant = "admin",
  size = "default",
  className,
  showLabel = true,
}: EntityShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const payload: EntitySharePayload = { title, publicUrl, imageUrl };
  const postText = buildSharePostText(payload);

  async function copyPost() {
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  async function handleTriggerClick() {
    // const shared = await tryNativeShare(payload);
    setOpen(true);
    // if (!shared)
  }

  const isAdmin = variant === "admin";
  const triggerClass = isAdmin
    ? "gap-2 border-[var(--admin-border-strong)] text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
    : "gap-2 border-[var(--brand-gray-200)] text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]";

  return (
    <>
      {size === "icon" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "flex-1 border border-[var(--brand-gray-200)] text-[var(--brand-gray-600)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]",
            className,
          )}
          aria-label={triggerLabel}
          onClick={() => void handleTriggerClick()}
        >
          <TriggerIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size={size === "sm" ? "sm" : "default"}
          className={cn(triggerClass, className)}
          onClick={() => void handleTriggerClick()}
        >
          <TriggerIcon className="h-4 w-4" aria-hidden="true" />
          {showLabel && triggerLabel}
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="entity-share-dialog-title"
        >
          <div
            className={cn(
              "w-full max-w-lg rounded-xl border shadow-2xl",
              isAdmin
                ? "border-[var(--admin-border-strong)] bg-[var(--admin-surface)]"
                : "border-[var(--brand-gray-200)] bg-white",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between border-b px-5 py-4",
                isAdmin ? "border-[var(--admin-border)]" : "border-[var(--brand-gray-200)]",
              )}
            >
              <h2
                id="entity-share-dialog-title"
                className={cn(
                  "text-lg font-bold",
                  isAdmin ? "text-[var(--admin-text)]" : "text-[var(--brand-gray-900)]",
                )}
              >
                {dialogTitle}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg p-1 transition-colors",
                  isAdmin
                    ? "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
                    : "text-[var(--brand-gray-500)] hover:bg-[var(--brand-gray-100)]",
                )}
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <p
                className={cn(
                  "text-sm",
                  isAdmin ? "text-[var(--admin-text-muted)]" : "text-[var(--brand-gray-600)]",
                )}
              >
                انسخ النص أو شارك على المنصات. يتضمن العنوان والرابط والصورة.
              </p>
              <pre
                className={cn(
                  "max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border p-3 text-xs",
                  isAdmin
                    ? "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]"
                    : "border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] text-[var(--brand-gray-700)]",
                )}
              >
                {postText}
              </pre>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={() => void copyPost()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "تم النسخ" : "نسخ نص المنشور"}
              </Button>

              <div className="grid gap-2 sm:grid-cols-2">
                {SHARE_PLATFORMS.map((platform) => {
                  const Icon = PLATFORM_ICONS[platform];
                  const isInstagram = platform === "Instagram";
                  const href = buildPlatformShareUrl(platform, payload, postText);

                  if (isInstagram) {
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => void copyPost()}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors sm:col-span-2",
                          isAdmin
                            ? "border-[var(--admin-border-strong)] text-[var(--admin-text)] hover:border-[var(--brand-red)] hover:bg-[var(--admin-hover)]"
                            : "border-[var(--brand-gray-200)] text-[var(--brand-gray-900)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                        <span className="flex-1 text-start font-medium">
                          Instagram — انسخ النص للصق في التطبيق
                        </span>
                        <Copy className="h-4 w-4 opacity-60" />
                      </button>
                    );
                  }

                  return (
                    <a
                      key={platform}
                      href={href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!href) {
                          e.preventDefault();
                          void copyPost();
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                        isAdmin
                          ? "border-[var(--admin-border-strong)] text-[var(--admin-text)] hover:border-[var(--brand-red)] hover:bg-[var(--admin-hover)]"
                          : "border-[var(--brand-gray-200)] text-[var(--brand-gray-900)] hover:border-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                      <span className="flex-1 font-medium">{platform}</span>
                      <ExternalLink className="h-4 w-4 opacity-60" />
                    </a>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => void copyLink()}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
                  isAdmin ? "bg-[var(--brand-gray-600)] hover:bg-[var(--brand-gray-800)]" : "bg-[var(--brand-gray-700)] hover:bg-[var(--brand-gray-900)]",
                )}
              >
                <Link2 className="h-4 w-4" />
                {linkCopied ? "تم نسخ الرابط" : "نسخ الرابط"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
