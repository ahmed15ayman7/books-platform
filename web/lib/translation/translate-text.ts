import {
  getTranslationProviders,
  translateWithProviders,
  type TranslateLang,
} from "@/lib/translation/translate-providers";

export type { TranslateLang } from "@/lib/translation/translate-providers";

const CHUNK_MAX_CHARS = 450;

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

/** Server-side AR ↔ EN translation with multi-provider fallback per chunk. */
export async function translateText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (from === to) return text;

  const providers = getTranslationProviders();
  const chunks = splitForTranslation(trimmed, CHUNK_MAX_CHARS);
  const parts: string[] = [];

  for (const chunk of chunks) {
    parts.push(await translateWithProviders(chunk, from, to, providers));
  }

  return parts.join("");
}
