import { adminAuthHeaders } from "@/lib/admin/auth-client";

export type TranslateLang = "ar" | "en";

export async function translateFieldText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const res = await fetch("/api/v1/admin/translate", {
    method: "POST",
    headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ text, from, to }),
  });

  const data = (await res.json()) as {
    success: boolean;
    data?: { translated: string };
    error?: { message: string };
  };

  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error?.message ?? "Translation failed");
  }

  return data.data.translated;
}
