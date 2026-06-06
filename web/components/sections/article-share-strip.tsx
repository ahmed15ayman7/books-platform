"use client";

import { Link2, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface ArticleShareStripProps {
  locale: Locale;
  url: string;
  title: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ArticleShareStrip({ locale, url, title }: ArticleShareStripProps) {
  const isAr = locale === "ar";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-[#1877f2] hover:bg-[#166fe5]",
      icon: <FacebookIcon className="h-4 w-4" />,
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: "bg-[#0f1419] hover:bg-black",
      icon: <XIcon className="h-4 w-4" />,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "bg-[#0a66c2] hover:bg-[#095bab]",
      icon: <LinkedInIcon className="h-4 w-4" />,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      className: "bg-[#25d366] hover:bg-[#20bd5a]",
      icon: <MessageCircle className="h-4 w-4" />,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-10 border-t border-[var(--brand-gray-200)] pt-8">
      <p className="mb-4 text-center text-base font-semibold text-[var(--brand-gray-900)]">
        {isAr ? "شارك المقالة على..." : "Share this article on..."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {links.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white transition-colors ${item.className}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-2 rounded bg-[var(--brand-gray-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-gray-800)]"
        >
          <Link2 className="h-4 w-4" />
          {isAr ? "نسخ الرابط" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
