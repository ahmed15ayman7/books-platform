import { wrapLayout } from "./layout";
import { renderBookCard, type BookCardData } from "./book-card";
import { renderArticleCard, type ArticleCardData } from "./article-card";

const BRAND_RED = "#c0392b";
const BRAND_DARK = "#1a1a2e";
const BORDER = "#e5e7eb";

export interface DigestEmailData {
  books: BookCardData[];
  articles: ArticleCardData[];
  locale?: string;
  manageToken?: string;
}

export function renderDigestEmail(data: DigestEmailData): { html: string; text: string; subject: string } {
  const { books, articles, locale = "ar", manageToken } = data;
  const isAr = locale === "ar";
  const totalItems = books.length + articles.length;

  if (totalItems === 0) {
    throw new Error("renderDigestEmail: no items to render");
  }

  const subject = isAr
    ? `جديد على منصة الكتب العالمية — ${totalItems > 1 ? `${totalItems} إصدارات جديدة` : "إصدار جديد"}`
    : `New on Books Platform — ${totalItems} new ${totalItems === 1 ? "item" : "items"}`;

  const preheader = isAr
    ? "تحديثات جديدة تنتظرك — كتب ومقالات مختارة لك"
    : "New updates just for you — curated books and articles";

  const headlineAr = books.length > 0 && articles.length > 0
    ? "جديد لك — كتب ومقالات"
    : books.length > 0
      ? (books.length === 1 ? "كتاب جديد" : "كتب جديدة")
      : (articles.length === 1 ? "مقال جديد" : "مقالات جديدة");

  const headlineEn = books.length > 0 && articles.length > 0
    ? "New For You — Books & Articles"
    : books.length > 0
      ? (books.length === 1 ? "New Book" : "New Books")
      : (articles.length === 1 ? "New Article" : "New Articles");

  const headline = isAr ? headlineAr : headlineEn;

  const introAr = isAr
    ? "إليك أحدث الإصدارات المتوافقة مع اهتماماتك على منصة الكتب العالمية."
    : "Here are the latest releases matching your interests on Books Platform.";

  let booksSection = "";
  if (books.length > 0) {
    const sectionTitle = isAr ? "كتب جديدة" : "New Books";
    const bookCards = books.map((b) => renderBookCard(b, locale)).join("");
    booksSection = `
      <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:${BRAND_DARK};
                 padding-bottom:10px;border-bottom:2px solid ${BRAND_RED};">
        ${sectionTitle}
      </h2>
      ${bookCards}`;
  }

  let articlesSection = "";
  if (articles.length > 0) {
    const sectionTitle = isAr ? "مقالات وقراءات جديدة" : "New Articles & Reads";
    const articleCards = articles.map((a) => renderArticleCard(a, locale)).join("");
    articlesSection = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="${books.length > 0 ? `margin-top:32px;padding-top:24px;border-top:1px solid ${BORDER};` : ""}">
        <tr><td>
          <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:${BRAND_DARK};
                     padding-bottom:10px;border-bottom:2px solid ${BRAND_RED};">
            ${sectionTitle}
          </h2>
          ${articleCards}
        </td></tr>
      </table>`;
  }

  const bodyHtml = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND_DARK};">${headline}</h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280;line-height:1.6;">${introAr}</p>
    ${booksSection}
    ${articlesSection}`;

  const html = wrapLayout({ locale, manageToken, bodyHtml, preheader });

  const textParts: string[] = [headline, "", introAr, ""];
  for (const b of books) {
    textParts.push(`📚 ${b.nameEn}${b.nameAr ? ` / ${b.nameAr}` : ""}`);
  }
  for (const a of articles) {
    textParts.push(`📰 ${a.title}`);
  }
  const text = textParts.join("\n");

  return { html, text, subject };
}
