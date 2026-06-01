"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadLocalFormValues, useFormAutosave } from "@/lib/forms/use-form-autosave";

const FORM_ID = "newsletter-email";

export function NewsletterStrip() {
  const t = useTranslations("home.newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const saved = loadLocalFormValues<{ email: string }>(FORM_ID);
    if (saved?.email) setEmail(saved.email);
  }, []);

  useFormAutosave({
    formId: FORM_ID,
    values: { email },
    canSyncToServer: (v) => v.email.includes("@"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source: "homepage" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        localStorage.removeItem(`form-autosave:${FORM_ID}`);
      }
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.8, 0.25, 1] }}
      className="bg-[var(--brand-red-soft)] py-12"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-platform">
        <div className="mx-auto max-w-xl text-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="mb-2 flex justify-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red)] text-white shadow-[var(--shadow-brand)]">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </span>
          </motion.div>
          <h2
            id="newsletter-heading"
            className="font-display text-display-xs font-bold text-[var(--brand-gray-900)]"
          >
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-[var(--brand-gray-600)]">{t("subtitle")}</p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center justify-center gap-2 text-[var(--success)]"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{t("success")}</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              aria-label={t("title")}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t("placeholder")}
              </label>
              <Input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                maxLength={254}
                className="flex-1"
              />
              <Button type="submit" loading={status === "loading"} className="shrink-0">
                {t("subscribe")}
              </Button>
            </form>
          )}

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[var(--error)]"
            >
              {t("error")}
            </motion.p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
