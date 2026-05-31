"use client";

import { useState } from "react";
import { Send, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea } from "@/components/admin/admin-form-field";

interface BroadcastForm {
  channel: string;
  title: string;
  body: string;
  url: string;
}

const empty: BroadcastForm = { channel: "push", title: "", body: "", url: "" };

export default function AdminNotificationsPage() {
  const [form, setForm] = useState<BroadcastForm>(empty);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/v1/admin/notifications/broadcast", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      setStatus(data.success ? "تم الإرسال بنجاح ✓" : (data.error?.message ?? "فشل الإرسال"));
      if (data.success) setForm(empty);
    } catch {
      setStatus("حدث خطأ في الاتصال");
    } finally {
      setSending(false);
    }
  }

  const set = (k: keyof BroadcastForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const channels = [
    { value: "push", label: "Web Push", icon: Bell },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "telegram", label: "Telegram", icon: Send },
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="الإشعارات"
        subtitle="إرسال إشعارات جماعية لجميع المشتركين"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Broadcast form */}
        <AdminCard title="إرسال إشعار جماعي">
          <form onSubmit={handleSend} className="space-y-4">
            {/* Channel selector */}
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--admin-text-muted)]">قناة الإرسال</p>
              <div className="flex gap-2">
                {channels.map((ch) => (
                  <button
                    key={ch.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, channel: ch.value }))}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      form.channel === ch.value
                        ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                        : "border-[var(--admin-border-strong)] text-[var(--admin-text-muted)] hover:border-[var(--admin-input-border)] hover:text-[var(--admin-accent)]"
                    }`}
                  >
                    <ch.icon className="h-4 w-4" />
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <AdminInput label="عنوان الإشعار *" value={form.title} onChange={set("title")} required />
            <AdminTextarea label="نص الإشعار *" rows={4} value={form.body} onChange={set("body")} required />
            <AdminInput label="رابط الإشعار (اختياري)" value={form.url} onChange={set("url")} placeholder="https://..." />

            {status && (
              <p className={`text-sm ${status.includes("✓") ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                {status}
              </p>
            )}

            <Button type="submit" disabled={sending} className="gap-1.5 w-full">
              <Send className="h-4 w-4" />
              {sending ? "جاري الإرسال..." : "إرسال للكل"}
            </Button>
          </form>
        </AdminCard>

        {/* Stats */}
        <div className="space-y-4">
          <AdminCard title="إحصائيات الإشعارات">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "مشتركو Web Push", value: "—" },
                { label: "مشتركو WhatsApp", value: "—" },
                { label: "مشتركو Telegram", value: "—" },
                { label: "إشعارات اليوم", value: "0" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-[var(--admin-surface-muted)] p-4 text-center"
                >
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="ملاحظات">
            <ul className="space-y-2 text-sm text-[var(--admin-text-muted)]">
              <li className="flex items-start gap-2">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-red)]" />
                <span>Web Push: يصل للمتصفح حتى عند إغلاق الموقع</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                <span>WhatsApp: يتطلب إعداد WhatsApp Business API</span>
              </li>
              <li className="flex items-start gap-2">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-[var(--info)]" />
                <span>Telegram: يُرسَل عبر Bot إلى قناة المنصة</span>
              </li>
            </ul>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
