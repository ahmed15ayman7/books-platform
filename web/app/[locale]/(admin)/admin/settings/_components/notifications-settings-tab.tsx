"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminCheckbox, AdminInput } from "@/components/admin/admin-form-field";
import {
  DEFAULT_SITE_NOTIFICATIONS,
  type SiteNotificationSettings,
} from "@/lib/settings/site-notifications";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";
import { can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

interface LogRow {
  id: string;
  type: string;
  recipient: string;
  subject: string | null;
  status: string;
  sentAt: string;
}

export function NotificationsSettingsTab() {
  const [settings, setSettings] = useState<SiteNotificationSettings>(
    DEFAULT_SITE_NOTIFICATIONS
  );
  const [loaded, setLoaded] = useState(false);
  const draft = useFormDraft(formDraftId.adminNotificationSettings(), settings, setSettings, { ready: loaded });
  const [logs, setLogs] = useState<LogRow[]>([]);
  const { runWithPasskey } = usePasskeyGate();
  const canUpdate = can(PERMISSIONS.settings.update);

  useEffect(() => {
    void fetch("/api/v1/admin/settings/notifications", {
      headers: adminAuthHeaders(),
    })
      .then((r) => r.json())
      .then(
        (d: {
          success: boolean;
          data?: { settings: SiteNotificationSettings; recentLogs: LogRow[] };
        }) => {
          if (d.success && d.data) {
            setSettings(d.data.settings);
            setLogs(d.data.recentLogs);
          }
        }
      )
      .finally(() => setLoaded(true));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canUpdate) return;
    await runWithPasskey(async () => {
      const res = await fetch("/api/v1/admin/settings/notifications", {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        draft.clearDraft();
        adminToast.success("save", "إعدادات الإشعارات");
      } else {
        adminToast.error("فشل الحفظ");
      }
    });
  }

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-2xl space-y-5">
      <FormDraftNotice
        showBanner={draft.showBanner}
        status={draft.status}
        onResume={draft.resume}
        onDismiss={draft.dismiss}
      />
      <AdminCard title="Web Push">
        <div className="space-y-3">
          <AdminCheckbox
            label="تفعيل إشعارات Push للموقع"
            checked={settings.push.enabled}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                push: { ...s.push, enabled: e.target.checked },
              }))
            }
          />
          <AdminCheckbox
            label="السماح بالبث الجماعي عبر Push"
            checked={settings.push.broadcastAllowed}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                push: { ...s.push, broadcastAllowed: e.target.checked },
              }))
            }
          />
        </div>
      </AdminCard>

      <AdminCard title="إشعارات الويب (Telegram / WhatsApp)">
        <AdminCheckbox
          label="تفعيل قنوات المراسلة"
          checked={settings.web.enabled}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              web: { enabled: e.target.checked },
            }))
          }
        />
      </AdminCard>

      <AdminCard title="البريد الإلكتروني">
        <div className="space-y-3">
          <AdminCheckbox
            label="تفعيل إشعارات البريد"
            checked={settings.email.enabled}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                email: { ...s.email, enabled: e.target.checked },
              }))
            }
          />
          <AdminInput
            label="عنوان المرسل (From)"
            value={settings.email.from}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                email: { ...s.email, from: e.target.value },
              }))
            }
          />
          <p className="text-xs text-[var(--admin-text-subtle)]">
            الإرسال الفعلي عبر Resend/SMTP يُفعّل لاحقاً — حالياً يُسجّل في السجل فقط عند البث.
          </p>
        </div>
      </AdminCard>

      <AdminCard title="آخر الإشعارات المرسلة">
        <div className="max-h-64 overflow-y-auto text-sm">
          {logs.length === 0 ? (
            <p className="text-[var(--admin-text-subtle)]">لا سجلات</p>
          ) : (
            <ul className="divide-y divide-[var(--admin-border)]">
              {logs.map((l) => (
                <li key={l.id} className="py-2">
                  <span className="text-[var(--admin-text)]">{l.type}</span>
                  <span className="mx-2 text-[var(--admin-text-subtle)]">·</span>
                  <span className="text-[var(--admin-text-muted)]">{l.subject ?? l.recipient}</span>
                  <span className="block text-xs text-[var(--admin-text-subtle)]">
                    {new Date(l.sentAt).toLocaleString("ar-EG")} — {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AdminCard>

      {canUpdate && (
        <Button type="submit" className="gap-1.5">
          <Save className="h-4 w-4" />
          حفظ إعدادات الإشعارات
        </Button>
      )}
    </form>
  );
}
