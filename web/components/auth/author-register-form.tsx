"use client";

import { useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect-url";
import {
  getStoredDraftToken,
  saveAuthorSession,
  setAccessToken,
} from "@/lib/auth/author-client";

interface AuthorRegisterFormProps {
  locale: string;
}

export default function AuthorRegisterForm({ locale }: AuthorRegisterFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectUrl(
    searchParams.get("redirect"),
    localeHref(locale, "/author/submissions"),
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const draftToken = getStoredDraftToken();
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          ...(draftToken ? { draftToken } : {}),
        }),
      });

      const data = await res.json() as {
        success: boolean;
        data?: {
          accessToken: string;
          user: { id: string; email: string; fullName: string; role: string };
        };
        error?: { message: string };
      };

      if (!res.ok || !data.success || !data.data) {
        setStatus("error");
        setErrorMsg(data.error?.message ?? (isAr ? "فشل التسجيل" : "Registration failed"));
        return;
      }

      setAccessToken(data.data.accessToken);
      saveAuthorSession(data.data.user);
      router.push(redirect);
    } catch {
      setStatus("error");
      setErrorMsg(isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred");
    }
  }

  const loginHref = localeHref(locale, `/auth/login?redirect=${encodeURIComponent(redirect)}`);

  return (
    <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-red)]">
            <BookOpen className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "تسجيل مؤلف جديد" : "Author Registration"}
          </h1>
        </div>

        <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="reg-name">{isAr ? "الاسم الكامل" : "Full name"}</Label>
              <Input
                id="reg-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reg-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reg-password">{isAr ? "كلمة المرور" : "Password"}</Label>
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-[var(--brand-gray-400)]">
                {isAr ? "8 أحرف على الأقل، حرف كبير ورقم" : "Min 8 chars, uppercase + number"}
              </p>
            </div>

            {status === "error" && (
              <div className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-3 py-2 text-sm text-[var(--error)]">
                {errorMsg}
              </div>
            )}

            <Button type="submit" className="w-full" loading={status === "loading"}>
              {isAr ? "إنشاء حساب" : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--brand-gray-500)]">
            {isAr ? "لديك حساب؟" : "Already have an account?"}{" "}
            <Link href={loginHref} className="text-[var(--brand-red)] hover:underline">
              {isAr ? "دخول" : "Sign in"}
            </Link>
          </p>
        </div>
    </div>
  );
}
