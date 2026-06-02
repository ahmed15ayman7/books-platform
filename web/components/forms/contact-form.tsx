"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";

interface ContactFormProps {
  locale: string;
}

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm({ locale }: ContactFormProps) {
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const draft = useFormDraft(formDraftId.contact(), values, setValues);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 600));
    draft.clearDraft();
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
      <FormDraftNotice
        variant="public"
        showBanner={draft.showBanner}
        status={draft.status}
        onResume={draft.resume}
        onDismiss={draft.dismiss}
      />
      <div>
        <Label htmlFor="contact-name" className="mb-1 text-[var(--brand-gray-700)]">
          {isAr ? "الاسم" : "Name"}
        </Label>
        <Input
          id="contact-name"
          name="name"
          required
          value={values.name}
          onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contact-email" className="mb-1 text-[var(--brand-gray-700)]">
          {isAr ? "البريد الإلكتروني" : "Email"}
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contact-message" className="mb-1 text-[var(--brand-gray-700)]">
          {isAr ? "رسالتك" : "Message"}
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={(e) => setValues((p) => ({ ...p, message: e.target.value }))}
        />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full gap-2">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isAr ? "جاري الإرسال..." : "Sending..."}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {isAr ? "إرسال" : "Send"}
          </>
        )}
      </Button>
    </form>
  );
}
