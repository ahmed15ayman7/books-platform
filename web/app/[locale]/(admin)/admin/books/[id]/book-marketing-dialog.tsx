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
        className="gap-2 border-[var(--brand-gray-700)] text-white hover:bg-[var(--brand-gray-800)]"
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
          <div className="w-full max-w-lg rounded-xl border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--brand-gray-800)] px-5 py-4">
              <h2 id="marketing-dialog-title" className="text-lg font-bold text-white">
                تسويق الكتاب
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[var(--brand-gray-400)] hover:bg-[var(--brand-gray-800)] hover:text-white"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-sm text-[var(--brand-gray-400)]">
                انشر على المنصات المتفق عليها. انسخ النص أو افتح منصة للمشاركة.
              </p>
              <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--brand-gray-800)] bg-[var(--brand-gray-800)] p-3 text-xs text-[var(--brand-gray-200)]">
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
                        className="flex items-center gap-3 rounded-lg border border-[var(--brand-gray-700)] px-4 py-3 text-sm text-white transition-colors hover:border-[var(--brand-red)] hover:bg-[var(--brand-gray-800)] sm:col-span-2"
                      >
                        <IconInstagram className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                        <span className="flex-1 text-start font-medium">
                          Instagram — انسخ النص للصق في التطبيق
                        </span>
                        <Copy className="h-4 w-4 text-[var(--brand-gray-500)]" />
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
                      className="flex items-center gap-3 rounded-lg border border-[var(--brand-gray-700)] px-4 py-3 text-sm text-white transition-colors hover:border-[var(--brand-red)] hover:bg-[var(--brand-gray-800)]"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[var(--brand-red)]" />
                      <span className="flex-1 font-medium">{label}</span>
                      <ExternalLink className="h-4 w-4 text-[var(--brand-gray-500)]" />
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
