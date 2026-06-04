"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminCheckbox } from "@/components/admin/admin-form-field";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";
import { can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";

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

export function PlatformSettingsTab() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const draft = useFormDraft(formDraftId.adminPlatformSettings(), settings, setSettings, { ready: loaded });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const { runWithPasskey, error: passkeyError } = usePasskeyGate();
  const canUpdate = can(PERMISSIONS.settings.update);

  useEffect(() => {
    void fetch("/api/v1/admin/settings", { headers: adminAuthHeaders() })
      .then((r) => r.json())
      .then((d: { success: boolean; data?: Partial<Settings> }) => {
        if (d.success && d.data) setSettings((p) => ({ ...p, ...d.data }));
      })
      .catch(() => null)
      .finally(() => setLoaded(true));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canUpdate) return;
    setSaving(true);
    setStatus("");
    await runWithPasskey(async () => {
      try {
        const res = await fetch("/api/v1/admin/settings", {
          method: "PATCH",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const data = (await res.json()) as { success: boolean };
        if (data.success) draft.clearDraft();
        setStatus(data.success ? "تم الحفظ بنجاح ✓" : "فشل الحفظ");
      } catch {
        setStatus("حدث خطأ");
      } finally {
        setSaving(false);
      }
    });
    setSaving(false);
  }

  const set =
    (k: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSettings((p) => ({
        ...p,
        [k]:
          e.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value,
      }));

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-2xl space-y-5">
      <FormDraftNotice
        showBanner={draft.showBanner}
        status={draft.status}
        onResume={draft.resume}
        onDismiss={draft.dismiss}
      />
      <AdminCard title="معلومات المنصة">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminBilingualField
            arValue={settings.platformNameAr}
            enValue={settings.platformNameEn}
            onArChange={(v) => setSettings((p) => ({ ...p, platformNameAr: v }))}
            onEnChange={(v) => setSettings((p) => ({ ...p, platformNameEn: v }))}
            labels={{ ar: "اسم المنصة (عربي)", en: "Platform Name (EN)" }}
            layout="half"
          />
          <AdminInput
            label="بريد التواصل"
            type="email"
            value={settings.contactEmail}
            onChange={set("contactEmail")}
          />
        </div>
      </AdminCard>

      <AdminCard title="روابط التواصل الاجتماعي">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Facebook" value={settings.socialFacebook} onChange={set("socialFacebook")} />
          <AdminInput label="Instagram" value={settings.socialInstagram} onChange={set("socialInstagram")} />
          <AdminInput label="X (Twitter)" value={settings.socialX} onChange={set("socialX")} />
          <AdminInput label="Telegram" value={settings.socialTelegram} onChange={set("socialTelegram")} />
          <AdminInput label="YouTube" value={settings.socialYoutube} onChange={set("socialYoutube")} />
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
            onChange={(e) =>
              setSettings((p) => ({ ...p, cartRecoveryEnabled: e.target.checked }))
            }
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
          onChange={(e) =>
            setSettings((p) => ({ ...p, maintenanceMode: e.target.checked }))
          }
        />
      </AdminCard>

      {(status || passkeyError) && (
        <p
          className={`text-sm ${status.includes("✓") ? "text-[var(--success)]" : "text-[var(--error)]"}`}
        >
          {passkeyError || status}
        </p>
      )}

      {canUpdate && (
        <Button type="submit" disabled={saving} className="gap-1.5">
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      )}
    </form>
  );
}
