export type TranslateLang = "ar" | "en";

const MYMEMORY_MAX_CHARS = 450;

function splitForTranslation(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    let splitAt = remaining.lastIndexOf("\n\n", maxLen);
    if (splitAt < maxLen * 0.4) splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt < maxLen * 0.4) splitAt = remaining.lastIndexOf(" ", maxLen);
    if (splitAt < maxLen * 0.4) splitAt = maxLen;

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateViaLibreTranslate(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> {
  const baseUrl = process.env["LIBRETRANSLATE_URL"]?.trim();
  if (!baseUrl) return null;

  const apiKey = process.env["LIBRETRANSLATE_API_KEY"]?.trim();

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: "text",
        ...(apiKey ? { api_key: apiKey } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { translatedText?: string };
    return data.translatedText?.trim() ?? null;
  } catch {
    return null;
  }
}

async function translateViaMyMemory(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${from}|${to}`);

  const email = process.env["MYMEMORY_EMAIL"]?.trim();
  if (email) url.searchParams.set("de", email);

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error("Translation request failed");

  const data = (await res.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };

  if (data.responseStatus && data.responseStatus !== 200) {
    throw new Error("Translation quota or provider error");
  }

  const translated = data.responseData?.translatedText?.trim();
  if (!translated) throw new Error("Empty translation");
  return translated;
}

/** Server-side AR ↔ EN translation (LibreTranslate if configured, else MyMemory). */
export async function translateText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (from === to) return text;

  const chunks = splitForTranslation(text, MYMEMORY_MAX_CHARS);
  const parts: string[] = [];

  for (const chunk of chunks) {
    const libre = await translateViaLibreTranslate(chunk, from, to);
    if (libre) {
      parts.push(libre);
      continue;
    }
    parts.push(await translateViaMyMemory(chunk, from, to));
  }

  return parts.join("");
}
