"use client";

import { useCallback, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { adminAuthHeaders } from "@/lib/admin/auth-client";

export function usePasskeyGate() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ensurePasskeyVerification = useCallback(async (): Promise<boolean> => {
    return true;
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

  const runWithPasskey = useCallback(async (action: () => Promise<void>) => {
    await action();
  }, []);

  return { busy, error, setError, ensurePasskeyVerification, registerPasskey, runWithPasskey };
}
