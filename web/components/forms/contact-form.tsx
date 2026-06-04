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
  topics: { value: string; label: string }[];
}

type ContactValues = {
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  website: string;
};

export function ContactForm({ locale, topics }: ContactFormProps) {
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    topic: "general",
    subject: "",
    message: "",
    website: "",
  });
  const draft = useFormDraft(formDraftId.contact(), values, setValues);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = await res.json() as { success?: boolean };
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(isAr ? "فشل الإرسال. حاول مرة أخرى." : "Failed to send. Please try again.");
        return;
      }
      draft.clearDraft();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(isAr ? "حدث خطأ في الاتصال" : "Connection error");
    }
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
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(e) => setValues((p) => ({ ...p, website: e.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <FormDraftNotice
        variant="public"
        showBanner={draft.showBanner}
        status={draft.status}
        onResume={draft.resume}
        onDismiss={draft.dismiss}
      />
      <div>
        <Label htmlFor="contact-name">{isAr ? "الاسم" : "Name"}</Label>
        <Input id="contact-name" required value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="contact-email">{isAr ? "البريد" : "Email"}</Label>
        <Input id="contact-email" type="email" required value={values.email} onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="contact-topic">{isAr ? "الموضوع" : "Topic"}</Label>
        <select
          id="contact-topic"
          value={values.topic}
          onChange={(e) => setValues((p) => ({ ...p, topic: e.target.value }))}
          className="mt-1 w-full rounded-md border border-[var(--brand-gray-200)] px-3 py-2 text-sm"
        >
          {topics.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="contact-subject">{isAr ? "عنوان (اختياري)" : "Subject (optional)"}</Label>
        <Input id="contact-subject" value={values.subject} onChange={(e) => setValues((p) => ({ ...p, subject: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="contact-message">{isAr ? "رسالتك" : "Message"}</Label>
        <Textarea id="contact-message" required rows={5} minLength={20} value={values.message} onChange={(e) => setValues((p) => ({ ...p, message: e.target.value }))} />
      </div>
      {errorMsg && <p className="text-sm text-[var(--brand-red)]">{errorMsg}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full gap-2">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isAr ? "إرسال" : "Send"}
      </Button>
    </form>
  );
}
