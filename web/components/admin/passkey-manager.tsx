"use client";

import { useCallback, useEffect, useState } from "react";
import { Fingerprint, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput } from "@/components/admin/admin-form-field";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";

interface PasskeyRow {
  id: string;
  deviceName: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<PasskeyRow[]>([]);
  const [deviceName, setDeviceName] = useState("");
  const { busy, error, registerPasskey } = usePasskeyGate();

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/admin/passkey", { headers: adminAuthHeaders() });
    const data = (await res.json()) as {
      success: boolean;
      data?: { passkeys: PasskeyRow[] };
    };
    if (data.success && data.data) setPasskeys(data.data.passkeys);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRegister() {
    const ok = await registerPasskey(deviceName || undefined);
    if (ok) {
      setDeviceName("");
      void load();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/v1/admin/passkey/${id}`, {
      method: "DELETE",
      headers: adminAuthHeaders(),
    });
    void load();
  }

  return (
    <AdminCard title="مفاتيح Passkey (اختياري)">
      <p className="mb-4 text-xs text-[var(--brand-gray-500)]">
        يمكنك إضافة مفتاح أمان أو بصمة للدخول السريع — غير مطلوب لأي عملية
      </p>
      <div className="space-y-4 -mt-2">
        <div className="flex flex-wrap gap-2">
          <AdminInput
            label="اسم الجهاز (اختياري)"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="min-w-[200px] flex-1"
          />
          <Button
            type="button"
            className="mt-6 gap-1.5"
            disabled={busy}
            onClick={() => void handleRegister()}
          >
            <Fingerprint className="h-4 w-4" />
            {busy ? "جاري..." : "إضافة Passkey"}
          </Button>
        </div>

        {error && <p className="text-sm text-[var(--error)]">{error}</p>}

        <ul className="divide-y divide-[var(--admin-border)] rounded-lg border border-[var(--admin-border)]">
          {passkeys.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[var(--admin-text-subtle)]">
              لا توجد مفاتيح — يمكنك إضافة واحد اختيارياً
            </li>
          ) : (
            passkeys.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-[var(--admin-text)]">
                    {p.deviceName ?? "Passkey"}
                  </p>
                  <p className="text-xs text-[var(--admin-text-subtle)]">
                    أُضيف {new Date(p.createdAt).toLocaleString("ar-EG")}
                    {p.lastUsedAt
                      ? ` · آخر استخدام ${new Date(p.lastUsedAt).toLocaleString("ar-EG")}`
                      : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-[var(--error)]"
                  disabled={busy}
                  onClick={() => void handleDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </AdminCard>
  );
}
