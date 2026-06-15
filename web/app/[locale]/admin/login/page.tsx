"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAdminSession } from "@/lib/admin/permissions-client";
import { setAccessToken } from "@/lib/auth/author-client";
import { cn } from "@/lib/utils";
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
        setAccessToken(data.data.accessToken);
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
    <div className="admin-shell flex min-h-screen items-center justify-center bg-[var(--admin-bg)] px-4 text-[var(--admin-text)]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-red)] shadow-[var(--shadow-brand)]">
            <BookOpen className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-[var(--admin-text)]">Books Platform</h1>
            <p className="text-sm text-[var(--admin-text-subtle)]">Admin Panel</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-[var(--shadow-soft-lg)]">
          <h2 className="mb-5 font-bold text-[var(--admin-text)]">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
                {isAr ? "البريد الإلكتروني" : "Email"}
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={adminFieldClass}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-[var(--admin-text-muted)]">
                {isAr ? "كلمة المرور" : "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(adminFieldClass, "pe-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-[var(--admin-text-subtle)] hover:text-[var(--admin-accent)]"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="form-error-banner rounded-md px-3 py-2 text-sm">
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
