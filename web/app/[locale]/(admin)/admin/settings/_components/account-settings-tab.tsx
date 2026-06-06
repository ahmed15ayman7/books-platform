"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput } from "@/components/admin/admin-form-field";
import { PasskeyManager } from "@/components/admin/passkey-manager";
import {
  LoginHistoryTable,
  type LoginHistoryRow,
} from "@/components/admin/login-history-table";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

export function AccountSettingsTab() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const profileDraft = useFormDraft(
    formDraftId.adminAccountProfile(),
    { fullName },
    (v) => setFullName(v.fullName),
    { ready: profileLoaded },
  );
  const [logs, setLogs] = useState<LoginHistoryRow[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { runWithPasskey } = usePasskeyGate();

  useEffect(() => {
    void Promise.all([
      fetch("/api/v1/admin/me/account", { headers: adminAuthHeaders() }).then((r) =>
        r.json()
      ),
      fetch("/api/v1/admin/me/login-history", { headers: adminAuthHeaders() }).then(
        (r) => r.json()
      ),
    ]).then(([acc, hist]) => {
      const a = acc as { success: boolean; data?: { fullName: string; email: string } };
      if (a.success && a.data) {
        setFullName(a.data.fullName);
        setEmail(a.data.email);
      }
      const h = hist as { success: boolean; data?: LoginHistoryRow[] };
      if (h.success && h.data) setLogs(h.data);
      setProfileLoaded(true);
    });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    await runWithPasskey(async () => {
      const res = await fetch("/api/v1/admin/me/account", {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        profileDraft.clearDraft();
        adminToast.success("update", "الملف الشخصي");
      } else {
        adminToast.error("فشل التحديث");
      }
    });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    await runWithPasskey(async () => {
      const res = await fetch("/api/v1/admin/me/password", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as {
        success: boolean;
        error?: { message?: string };
      };
      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        adminToast.success("update", "كلمة المرور");
      } else {
        adminToast.error(data.error?.message ?? "فشل تغيير كلمة المرور");
      }
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={(e) => void saveProfile(e)} className="space-y-4">
        <FormDraftNotice
          showBanner={profileDraft.showBanner}
          status={profileDraft.status}
          onResume={profileDraft.resume}
          onDismiss={profileDraft.dismiss}
        />
        <AdminCard title="الملف الشخصي">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="الاسم الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <AdminInput label="البريد" value={email} disabled hint="لا يمكن تغيير البريد حالياً" />
          </div>
          <Button type="submit" className="mt-4 gap-1.5">
            <Save className="h-4 w-4" />
            حفظ الملف
          </Button>
        </AdminCard>
      </form>

      <form onSubmit={(e) => void changePassword(e)} className="space-y-4">
        <AdminCard title="كلمة المرور">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="كلمة المرور الحالية"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <AdminInput
              label="كلمة المرور الجديدة"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" className="mt-4">
            تغيير كلمة المرور
          </Button>
        </AdminCard>
      </form>

      <PasskeyManager />

      <AdminCard title="سجل تسجيل الدخول">
        <LoginHistoryTable logs={logs} />
      </AdminCard>
    </div>
  );
}
