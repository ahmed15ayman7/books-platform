"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p className="rounded-lg bg-[var(--brand-red-soft)] p-4 text-center text-sm font-medium text-[var(--brand-gray-900)]">
        {isAr ? "شكراً! سنرد عليك قريباً." : "Thank you! We will get back to you soon."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-[var(--brand-gray-700)]">
          {isAr ? "الاسم" : "Name"}
        </label>
        <input
          id="contact-name"
          name="name"
          required
          className="w-full rounded-md border border-[var(--brand-gray-300)] px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-[var(--brand-gray-700)]">
          {isAr ? "البريد الإلكتروني" : "Email"}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-[var(--brand-gray-300)] px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-[var(--brand-gray-700)]">
          {isAr ? "الرسالة" : "Message"}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-[var(--brand-gray-300)] px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
        />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {isAr ? "إرسال" : "Send"}
      </Button>
    </form>
  );
}
