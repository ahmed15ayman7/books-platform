"use client";

import { useState } from "react";
import { Megaphone, Copy, Check, ExternalLink, X } from "lucide-react";
import { SOCIAL_LINKS, IconInstagram } from "@/components/icons";
import { Button } from "@/components/ui/button";

const SHARE_PLATFORMS = SOCIAL_LINKS.filter((s) =>
  ["X (Twitter)", "Facebook", "Instagram", "Telegram", "LinkedIn"].includes(s.label)
);

interface BookMarketingDialogProps {
  bookTitle: string;
  publicUrl: string;
  imageUrl?: string | null;
}

function buildShareUrl(platform: string, postText: string, publicUrl: string, bookTitle: string) {
  const encodedText = encodeURIComponent(postText);
  const encodedUrl = encodeURIComponent(publicUrl);
  switch (platform) {
    case "X (Twitter)":
      return `https://twitter.com/intent/tweet?text=${encodedText}`;
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "LinkedIn":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "Telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(bookTitle)}`;
    default:
      return null;
  }
}

export function BookMarketingDialog({
  bookTitle,
  publicUrl,
  imageUrl,
}: BookMarketingDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const postText = `${bookTitle}\n${publicUrl}${imageUrl ? `\n${imageUrl}` : ""}`;

  async function copyPost() {
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="gap-2 border-[var(--admin-border-strong)] text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
        onClick={() => setOpen(true)}
      >
        <Megaphone className="h-4 w-4" />
        تسويق
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketing-dialog-title"
        >
          <div className="w-full max-w-lg rounded-xl border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
              <h2 id="marketing-dialog-title" className="text-lg font-bold text-[var(--admin-text)]">
                تسويق الكتاب
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-sm text-[var(--admin-text-muted)]">
                انشر على المنصات المتفق عليها. انسخ النص أو افتح منصة للمشاركة.
              </p>
              <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-3 text-xs text-[var(--admin-text-muted)]">
                {postText}
              </pre>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={() => void copyPost()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "تم النسخ" : "نسخ نص المنشور"}
              </Button>

              <div className="grid gap-2 sm:grid-cols-2">
                {SHARE_PLATFORMS.map(({ label, Icon }) => {
                  const href = buildShareUrl(label, postText, publicUrl, bookTitle);
                  const isInstagram = label === "Instagram";

                  if (isInstagram) {
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => void copyPost()}
                        className="flex items-center gap-3 rounded-lg border border-[var(--admin-border-strong)] px-4 py-3 text-sm text-[var(--admin-text)] transition-colors hover:border-[var(--brand-red)] hover:bg-[var(--admin-hover)] sm:col-span-2"
                      >
                        <IconInstagram className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                        <span className="flex-1 text-start font-medium">
                          Instagram — انسخ النص للصق في التطبيق
                        </span>
                        <Copy className="h-4 w-4 text-[var(--admin-text-subtle)]" />
                      </button>
                    );
                  }

                  return (
                    <a
                      key={label}
                      href={href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!href) {
                          e.preventDefault();
                          void copyPost();
                        }
                      }}
                      className="flex items-center gap-3 rounded-lg border border-[var(--admin-border-strong)] px-4 py-3 text-sm text-[var(--admin-text)] transition-colors hover:border-[var(--brand-red)] hover:bg-[var(--admin-hover)]"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                      <span className="flex-1 font-medium">{label}</span>
                      <ExternalLink className="h-4 w-4 text-[var(--admin-text-subtle)]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
