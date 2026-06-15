"use client";

import { useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect-url";
import {
  authHeaders,
  getStoredDraftToken,
  saveAuthorSession,
  setAccessToken,
} from "@/lib/auth/author-client";
import { cn } from "@/lib/utils";

interface AuthorLoginPageProps {
  locale: string;
}

export default function AuthorLoginPage({ locale }: AuthorLoginPageProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectUrl(
    searchParams.get("redirect"),
    localeHref(locale, "/author/submissions"),
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as {
        success: boolean;
        data?: {
          accessToken: string;
          user: { id: string; email: string; fullName: string; role: string };
        };
        error?: { code: string; message: string };
      };

      if (!res.ok || !data.success || !data.data) {
        setStatus("error");
        setErrorMsg(isAr ? "بريد أو كلمة مرور غير صحيحة" : "Invalid credentials");
        return;
      }

      if (data.data.user.role !== "AUTHOR") {
        setStatus("error");
        setErrorMsg(
          isAr
            ? "هذا الحساب ليس حساب مؤلف. استخدم لوحة التحكم إن كنت مشرفاً."
            : "This is not an author account.",
        );
        return;
      }

      setAccessToken(data.data.accessToken);
      saveAuthorSession(data.data.user);

      const draftToken = getStoredDraftToken();
      if (draftToken) {
        await fetch("/api/v1/submissions/drafts/claim", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ draftToken }),
        }).catch(() => null);
      }

      router.push(redirect);
    } catch {
      setStatus("error");
      setErrorMsg(isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred");
    }
  }

  const registerHref = localeHref(locale, `/auth/register?redirect=${encodeURIComponent(redirect)}`);

  return (
    <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-red)]">
            <BookOpen className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
            {isAr ? "دخول المؤلف" : "Author Sign In"}
          </h1>
        </div>

        <div className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="author-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                id="author-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="author-password">{isAr ? "كلمة المرور" : "Password"}</Label>
              <div className="relative mt-1">
                <Input
                  id="author-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn("pe-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-[var(--brand-gray-400)]"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-3 py-2 text-sm text-[var(--error)]">
                {errorMsg}
              </div>
            )}

            <Button type="submit" className="w-full" loading={status === "loading"}>
              {isAr ? "دخول" : "Sign In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--brand-gray-500)]">
            {isAr ? "ليس لديك حساب؟" : "No account?"}{" "}
            <Link href={registerHref} className="text-[var(--brand-red)] hover:underline">
              {isAr ? "إنشاء حساب" : "Register"}
            </Link>
          </p>
        </div>
    </div>
  );
}
