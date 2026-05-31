"use client";

import { useCallback, useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { adminAuthHeaders, setPasskeyVerification } from "@/lib/admin/auth-client";

export function usePasskeyGate() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ensurePasskeyVerification = useCallback(async (): Promise<boolean> => {
    setError("");
    setBusy(true);
    try {
      const listRes = await fetch("/api/v1/admin/passkey", {
        headers: adminAuthHeaders(),
      });
      const listData = (await listRes.json()) as {
        success: boolean;
        data?: { hasPasskeys: boolean };
      };
      if (!listData.success) {
        setError("تعذّر التحقق من Passkey");
        return false;
      }
      if (!listData.data?.hasPasskeys) {
        return true;
      }

      const optRes = await fetch("/api/v1/admin/passkey/authenticate/options", {
        method: "POST",
        headers: adminAuthHeaders(),
      });
      const optData = (await optRes.json()) as {
        success: boolean;
        data?: { options: Parameters<typeof startAuthentication>[0]["optionsJSON"]; challengeToken: string };
        error?: { message: string };
      };
      if (!optData.success || !optData.data) {
        setError(optData.error?.message ?? "فشل بدء التحقق");
        return false;
      }

      const assertion = await startAuthentication({
        optionsJSON: optData.data.options,
      });

      const verifyRes = await fetch("/api/v1/admin/passkey/authenticate/verify", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          response: assertion,
          challengeToken: optData.data.challengeToken,
        }),
      });
      const verifyData = (await verifyRes.json()) as {
        success: boolean;
        data?: { verificationToken: string };
        error?: { message: string };
      };
      if (!verifyData.success || !verifyData.data?.verificationToken) {
        setError(verifyData.error?.message ?? "فشل التحقق بـ Passkey");
        return false;
      }

      setPasskeyVerification(verifyData.data.verificationToken);
      return true;
    } catch {
      setError("ألغيت التحقق أو فشل الجهاز");
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const registerPasskey = useCallback(async (deviceName?: string): Promise<boolean> => {
    setError("");
    setBusy(true);
    try {
      const optRes = await fetch("/api/v1/admin/passkey/register/options", {
        method: "POST",
        headers: adminAuthHeaders(),
      });
      const optData = (await optRes.json()) as {
        success: boolean;
        data?: { options: Parameters<typeof startRegistration>[0]["optionsJSON"]; challengeToken: string };
      };
      if (!optData.success || !optData.data) {
        setError("فشل تسجيل Passkey");
        return false;
      }

      const attestation = await startRegistration({
        optionsJSON: optData.data.options,
      });

      const verifyRes = await fetch("/api/v1/admin/passkey/register/verify", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          response: attestation,
          challengeToken: optData.data.challengeToken,
          deviceName,
        }),
      });
      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        setError("فشل حفظ Passkey");
        return false;
      }
      return true;
    } catch {
      setError("تعذّر إكمال تسجيل Passkey");
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const runWithPasskey = useCallback(
    async (action: () => Promise<void>) => {
      const ok = await ensurePasskeyVerification();
      if (!ok) return;
      await action();
    },
    [ensurePasskeyVerification]
  );

  return { busy, error, setError, ensurePasskeyVerification, registerPasskey, runWithPasskey };
}
