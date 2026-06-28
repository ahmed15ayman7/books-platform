import { absoluteUrl } from "@/lib/seo/site";
import { seoCanonicalPath } from "@/lib/i18n/href";

const BRAND_RED = "#c0392b";
const BRAND_DARK = "#1a1a2e";
const BRAND_GRAY = "#6b7280";
const BORDER = "#e5e7eb";

export interface ArticleCardData {
  slug: string;
  title: string;
  titleEn?: string | null;
  excerpt?: string | null;
  excerptEn?: string | null;
  content?: string | null;
  contentEn?: string | null;
  imageUrl?: string | null;
  date?: Date | null;
  channel?: string | null;
  articleCategory?: { name: string; nameAr?: string | null } | null;
}

const CHANNEL_LABELS: Record<string, { ar: string; en: string }> = {
  "harvest": { ar: "حصاد الكتب", en: "Book Harvest" },
  "ideas": { ar: "زبدة الأفكار", en: "Ideas" },
  "world-reads": { ar: "العالم يقرأ", en: "World Reads" },
  "books-talk": { ar: "حديث الكتب", en: "Books Talk" },
  "novel-story": { ar: "رواية فحكاية", en: "Novel Story" },
};

function truncate(text: string | null | undefined, max = 300): string {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>/g, "").replace(/\*\*|__|\*|_|`/g, "").trim();
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}

export function renderArticleCard(article: ArticleCardData, locale: string): string {
  const isAr = locale === "ar";
  const title = isAr ? article.title : (article.titleEn ?? article.title);
  const excerpt = truncate(
    isAr ? (article.excerpt ?? article.content) : (article.excerptEn ?? article.contentEn ?? article.excerpt ?? article.content),
    300,
  );
  const imageUrl = article.imageUrl
    ? (article.imageUrl.startsWith("http") ? article.imageUrl : absoluteUrl(article.imageUrl))
    : null;
  const articleUrl = absoluteUrl(seoCanonicalPath(locale, `/articles/${article.slug}`));
  const readMoreLabel = isAr ? "اقرأ المقال كاملاً" : "Read Full Article";
  const channelInfo = article.channel ? CHANNEL_LABELS[article.channel] : null;
  const channelLabel = channelInfo ? (isAr ? channelInfo.ar : channelInfo.en) : null;

  const dateStr = article.date
    ? new Date(article.date).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin-bottom:24px;">
  ${imageUrl ? `
  <tr>
    <td style="padding:0;">
      <a href="${articleUrl}" style="display:block;text-decoration:none;">
        <img src="${imageUrl}" alt="${title}" width="600" height="220"
          style="display:block;width:100%;max-width:600px;height:220px;object-fit:cover;" />
      </a>
    </td>
  </tr>` : ""}
  <tr>
    <td style="padding:20px 20px 16px 20px;">
      ${channelLabel ? `<p style="margin:0 0 6px 0;font-size:12px;font-weight:600;color:${BRAND_RED};text-transform:uppercase;letter-spacing:.5px;">${channelLabel}</p>` : ""}
      <a href="${articleUrl}" style="text-decoration:none;">
        <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:${BRAND_DARK};line-height:1.4;">${title}</h3>
      </a>
      ${dateStr ? `<p style="margin:0 0 10px 0;font-size:12px;color:${BRAND_GRAY};">${dateStr}</p>` : ""}
      ${excerpt ? `<p style="margin:0 0 16px 0;font-size:14px;color:#374151;line-height:1.7;">${excerpt}</p>` : ""}
      <a href="${articleUrl}"
        style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:14px;font-weight:600;
               padding:9px 20px;border-radius:6px;text-decoration:none;">
        ${readMoreLabel}
      </a>
    </td>
  </tr>
</table>`;
}
