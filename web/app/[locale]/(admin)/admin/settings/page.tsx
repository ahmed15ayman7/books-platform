"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminCheckbox } from "@/components/admin/admin-form-field";

interface Settings {
  platformNameAr: string;
  platformNameEn: string;
  contactEmail: string;
  socialFacebook: string;
  socialInstagram: string;
  socialX: string;
  socialTelegram: string;
  socialYoutube: string;
  submissionFee: string;
  cartRecoveryEnabled: boolean;
  cartRecoveryDelay: string;
  cartRecoveryDiscount: string;
  maintenanceMode: boolean;
}

const defaultSettings: Settings = {
  platformNameAr: "منصة الكتب العالمية",
  platformNameEn: "Books Platform",
  contactEmail: "",
  socialFacebook: "",
  socialInstagram: "",
  socialX: "",
  socialTelegram: "",
  socialYoutube: "",
  submissionFee: "50",
  cartRecoveryEnabled: false,
  cartRecoveryDelay: "24",
  cartRecoveryDiscount: "10",
  maintenanceMode: false,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void fetch("/api/v1/admin/settings", { headers: adminAuthHeaders() })
      .then((r) => r.json())
      .then((d: { success: boolean; data?: Partial<Settings> }) => {
        if (d.success && d.data) setSettings((p) => ({ ...p, ...d.data }));
      })
      .catch(() => null);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json() as { success: boolean };
      setStatus(data.success ? "تم الحفظ بنجاح ✓" : "فشل الحفظ");
    } catch {
      setStatus("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((p) => ({ ...p, [k]: e.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="text-white">
      <AdminPageHeader title="إعدادات المنصة" subtitle="ضبط الإعدادات العامة للمنصة" />

      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        <AdminCard title="معلومات المنصة">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="اسم المنصة (عربي)" value={settings.platformNameAr} onChange={set("platformNameAr")} />
            <AdminInput label="Platform Name (EN)" value={settings.platformNameEn} onChange={set("platformNameEn")} />
            <AdminInput label="بريد التواصل" type="email" value={settings.contactEmail} onChange={set("contactEmail")} />
          </div>
        </AdminCard>

        <AdminCard title="روابط التواصل الاجتماعي">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Facebook" value={settings.socialFacebook} onChange={set("socialFacebook")} placeholder="https://facebook.com/..." />
            <AdminInput label="Instagram" value={settings.socialInstagram} onChange={set("socialInstagram")} placeholder="https://instagram.com/..." />
            <AdminInput label="X (Twitter)" value={settings.socialX} onChange={set("socialX")} placeholder="https://x.com/..." />
            <AdminInput label="Telegram" value={settings.socialTelegram} onChange={set("socialTelegram")} placeholder="https://t.me/..." />
            <AdminInput label="YouTube" value={settings.socialYoutube} onChange={set("socialYoutube")} placeholder="https://youtube.com/..." />
          </div>
        </AdminCard>

        <AdminCard title="إعدادات النشر (انشر كتابك)">
          <AdminInput
            label="رسوم الطلب المدفوع (ج.م)"
            type="number"
            value={settings.submissionFee}
            onChange={set("submissionFee")}
            hint="الطلب الأول مجاني دائماً"
          />
        </AdminCard>

        <AdminCard title="استرجاع السلة المتروكة">
          <div className="space-y-4">
            <AdminCheckbox
              label="تفعيل استرجاع السلة المتروكة"
              checked={settings.cartRecoveryEnabled}
              onChange={(e) => setSettings((p) => ({ ...p, cartRecoveryEnabled: e.target.checked }))}
            />
            {settings.cartRecoveryEnabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput
                  label="وقت الانتظار (ساعة)"
                  type="number"
                  value={settings.cartRecoveryDelay}
                  onChange={set("cartRecoveryDelay")}
                />
                <AdminInput
                  label="نسبة الخصم (%)"
                  type="number"
                  value={settings.cartRecoveryDiscount}
                  onChange={set("cartRecoveryDiscount")}
                />
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard title="وضع الصيانة">
          <AdminCheckbox
            label="تفعيل وضع الصيانة (يُظهر رسالة للزوار)"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings((p) => ({ ...p, maintenanceMode: e.target.checked }))}
          />
          {settings.maintenanceMode && (
            <p className="mt-2 text-xs text-[var(--warning)]">
              ⚠️ تفعيل هذا الوضع سيُظهر رسالة الصيانة لجميع الزوار
            </p>
          )}
        </AdminCard>

        {status && (
          <p className={`text-sm ${status.includes("✓") ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
            {status}
          </p>
        )}

        <Button type="submit" disabled={saving} className="gap-1.5">
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </form>
    </div>
  );
}
