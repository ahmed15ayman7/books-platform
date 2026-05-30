"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAdminSession } from "@/lib/admin/permissions-client";
import type { Permission } from "@/lib/auth/permissions";

export default function AdminLoginPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const router = useRouter();
  const isAr = locale === "ar";

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
          user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
            isSuperAdmin?: boolean;
            permissions?: Permission[];
          };
        };
        error?: { code: string; message: string };
      };

      if (res.ok && data.success && data.data) {
        if (data.data.user.role !== "ADMIN") {
          setStatus("error");
          setErrorMsg(isAr ? "هذا الحساب غير مصرح له بدخول لوحة التحكم" : "This account cannot access the admin panel");
          return;
        }
        document.cookie = `access_token=${data.data.accessToken}; path=/; max-age=900; samesite=strict`;
        saveAdminSession({
          id: data.data.user.id,
          email: data.data.user.email,
          fullName: data.data.user.fullName,
          role: data.data.user.role,
          isSuperAdmin: Boolean(data.data.user.isSuperAdmin),
          permissions: data.data.user.permissions ?? [],
        });
        router.push(`/${locale}/admin/dashboard`);
      } else {
        setStatus("error");
        const code = data.error?.code;
        setErrorMsg(
          code === "ACCOUNT_LOCKED"
            ? (isAr ? "الحساب مقفول مؤقتاً" : "Account temporarily locked")
            : (isAr ? "بريد أو كلمة مرور غير صحيحة" : "Invalid credentials")
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-black)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-red)] shadow-[var(--shadow-brand)]">
            <BookOpen className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-white">Books Platform</h1>
            <p className="text-sm text-[var(--brand-gray-500)]">Admin Panel</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-[var(--brand-gray-900)] p-6 shadow-2xl border border-[var(--brand-gray-800)]">
          <h2 className="mb-5 font-bold text-white">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--brand-gray-300)] mb-1">
                {isAr ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--brand-gray-600)] focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
                placeholder="admin@booksplatform.net"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--brand-gray-300)] mb-1">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2.5 pe-10 text-sm text-white focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-[var(--brand-gray-500)] hover:text-white"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="rounded-md bg-[var(--error)]/10 border border-[var(--error)]/30 px-3 py-2 text-sm text-[var(--error)]">
                {errorMsg}
              </div>
            )}

            <Button type="submit" className="w-full" loading={status === "loading"}>
              {isAr ? "دخول" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
