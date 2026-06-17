export type TranslateLang = "ar" | "en";

export type TranslateProviderId = "libretranslate" | "mymemory" | "google" | "lingva";

export interface TranslateProvider {
  id: TranslateProviderId;
  maxChars: number;
  translate: (text: string, from: TranslateLang, to: TranslateLang) => Promise<string | null>;
}

const REQUEST_TIMEOUT_MS = 12_000;

const LINGVA_HOSTS = [
  "https://lingva.ml",
  "https://translate.plausibility.cloud",
  "https://lingva.lunar.icu",
] as const;

const MYMEMORY_FAILURE_SNIPPETS = [
  "MYMEMORY WARNING",
  "USED ALL AVAILABLE FREE TRANSLATIONS",
  "AUTO APPROVED",
] as const;

function isUsableTranslation(text: string | null | undefined): text is string {
  if (!text?.trim()) return false;
  const upper = text.toUpperCase();
  return !MYMEMORY_FAILURE_SNIPPETS.some((snippet) => upper.includes(snippet));
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
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { translatedText?: string };
    const translated = data.translatedText?.trim();
    return isUsableTranslation(translated) ? translated : null;
  } catch {
    return null;
  }
}

async function translateViaMyMemory(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> {
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `${from}|${to}`);

    const email = process.env["MYMEMORY_EMAIL"]?.trim();
    if (email) url.searchParams.set("de", email);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      responseStatus?: number;
      quotaFinished?: boolean;
      responseData?: { translatedText?: string };
    };

    if (data.quotaFinished || (data.responseStatus && data.responseStatus !== 200)) {
      return null;
    }

    const translated = data.responseData?.translatedText?.trim();
    return isUsableTranslation(translated) ? translated : null;
  } catch {
    return null;
  }
}

async function translateViaGoogleGtx(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> {
  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", from);
    url.searchParams.set("tl", to);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BooksPlatform/1.0)",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;

    const translated = (data[0] as unknown[][])
      .map((part) => (typeof part[0] === "string" ? part[0] : ""))
      .join("")
      .trim();

    return isUsableTranslation(translated) ? translated : null;
  } catch {
    return null;
  }
}

async function translateViaLingva(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> {
  for (const host of LINGVA_HOSTS) {
    try {
      const url = `${host}/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      if (!res.ok) continue;

      const data = (await res.json()) as { translation?: string; error?: string };
      const translated = data.translation?.trim();
      if (isUsableTranslation(translated)) return translated;
    } catch {
      continue;
    }
  }

  return null;
}

const PROVIDER_IMPL: Record<TranslateProviderId, TranslateProvider["translate"]> = {
  libretranslate: translateViaLibreTranslate,
  mymemory: translateViaMyMemory,
  google: translateViaGoogleGtx,
  lingva: translateViaLingva,
};

const PROVIDER_MAX_CHARS: Record<TranslateProviderId, number> = {
  libretranslate: 4_500,
  mymemory: 450,
  google: 4_500,
  lingva: 2_000,
};

const DEFAULT_PROVIDER_ORDER: TranslateProviderId[] = [
  "libretranslate",
  "mymemory",
  "google",
  "lingva",
];

export function getTranslationProviders(): TranslateProvider[] {
  const configuredOrder = process.env["TRANSLATION_PROVIDER_ORDER"]
    ?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) as TranslateProviderId[] | undefined;

  const order = configuredOrder?.length ? configuredOrder : DEFAULT_PROVIDER_ORDER;

  return order
    .filter((id) => id in PROVIDER_IMPL)
    .filter((id) => id !== "libretranslate" || Boolean(process.env["LIBRETRANSLATE_URL"]?.trim()))
    .map((id) => ({
      id,
      maxChars: PROVIDER_MAX_CHARS[id],
      translate: PROVIDER_IMPL[id],
    }));
}

export async function translateWithProviders(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
  providers: TranslateProvider[] = getTranslationProviders(),
): Promise<string> {
  const failures: string[] = [];

  for (const provider of providers) {
    if (text.length > provider.maxChars) {
      failures.push(`${provider.id}: chunk too long (${text.length}/${provider.maxChars})`);
      continue;
    }

    try {
      const translated = await provider.translate(text, from, to);
      if (translated) return translated;
      failures.push(`${provider.id}: empty response`);
    } catch (error) {
      failures.push(
        `${provider.id}: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  }

  throw new Error(
    failures.length > 0
      ? `All translation providers failed (${failures.join("; ")})`
      : "No translation providers configured",
  );
}
