import { absoluteUrl } from "@/lib/seo/site";
import { seoCanonicalPath } from "@/lib/i18n/href";
import {
  localizedBookName,
  localizedBookDescription,
  localizedBookShortDesc,
  localizedAuthorName,
} from "@/lib/i18n/book-locale";

const BRAND_RED = "#c0392b";
const BRAND_DARK = "#1a1a2e";
const BRAND_GRAY = "#6b7280";
const BORDER = "#e5e7eb";

export interface BookCardData {
  slug: string;
  nameEn: string;
  nameAr?: string | null;
  shortDesc?: string | null;
  shortDescAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  isbn?: string | null;
  language?: string | null;
  publicationYear?: number | null;
  pageCount?: number | null;
  edition?: string | null;
  editionAr?: string | null;
  publisher?: { title: string; nameAr?: string | null; name: string } | null;
  primaryCategory?: { name: string; nameAr?: string | null } | null;
  authors?: { name: string; nameAr?: string | null }[];
}

function truncate(text: string | null | undefined, max = 200): string {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>/g, "").replace(/\*\*|__|\*|_|`/g, "");
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}

export function renderBookCard(book: BookCardData, locale: string): string {
  const isAr = locale === "ar";
  const title = localizedBookName(book, locale);
  const desc = truncate(localizedBookDescription(book, locale) ?? localizedBookShortDesc(book, locale), 250);
  const coverUrl = book.imageUrl
    ? (book.imageUrl.startsWith("http") ? book.imageUrl : absoluteUrl(book.imageUrl))
    : absoluteUrl("/images/book-placeholder.png");
  const bookUrl = absoluteUrl(seoCanonicalPath(locale, `/books/${book.slug}`));

  const publisherName = book.publisher
    ? (isAr && book.publisher.nameAr ? book.publisher.nameAr : book.publisher.name || book.publisher.title)
    : null;

  const authorNames = book.authors
    ?.map((a) => localizedAuthorName(a, locale))
    .join(isAr ? "، " : ", ");

  const categoryLabel = book.primaryCategory
    ? (isAr && book.primaryCategory.nameAr ? book.primaryCategory.nameAr : book.primaryCategory.name)
    : null;

  const viewLabel = isAr ? "عرض الكتاب" : "View Book";
  const publisherLabel = isAr ? "الناشر" : "Publisher";
  const authorLabel = isAr ? "المؤلف" : "Author";
  const categoryLbl = isAr ? "التصنيف" : "Category";
  const isbnLabel = "ISBN";
  const yearLabel = isAr ? "سنة النشر" : "Year";
  const langLabel = isAr ? "اللغة" : "Language";
  const pagesLabel = isAr ? "الصفحات" : "Pages";

  const metaRows = [
    publisherName ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${publisherLabel}</td><td style="font-size:13px;color:${BRAND_DARK};">${publisherName}</td></tr>` : "",
    authorNames ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${authorLabel}</td><td style="font-size:13px;color:${BRAND_DARK};">${authorNames}</td></tr>` : "",
    categoryLabel ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${categoryLbl}</td><td style="font-size:13px;color:${BRAND_DARK};">${categoryLabel}</td></tr>` : "",
    book.isbn ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${isbnLabel}</td><td style="font-size:13px;color:${BRAND_DARK};direction:ltr;">${book.isbn}</td></tr>` : "",
    book.publicationYear ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${yearLabel}</td><td style="font-size:13px;color:${BRAND_DARK};">${book.publicationYear}</td></tr>` : "",
    book.language ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${langLabel}</td><td style="font-size:13px;color:${BRAND_DARK};">${book.language}</td></tr>` : "",
    book.pageCount ? `<tr><td style="color:${BRAND_GRAY};font-size:13px;padding:2px 0;white-space:nowrap;padding-${isAr ? "left" : "right"}:12px;">${pagesLabel}</td><td style="font-size:13px;color:${BRAND_DARK};">${book.pageCount}</td></tr>` : "",
  ].filter(Boolean).join("");

  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin-bottom:24px;">
  <tr>
    <!-- Cover image -->
    <td width="120" valign="top" style="padding:16px;background:#fafafa;">
      <a href="${bookUrl}" style="display:block;text-decoration:none;">
        <img src="${coverUrl}" alt="${title}" width="96" height="128"
          style="display:block;width:96px;height:128px;object-fit:cover;border-radius:4px;border:1px solid ${BORDER};" />
      </a>
    </td>
    <!-- Info -->
    <td valign="top" style="padding:16px;">
      <a href="${bookUrl}" style="text-decoration:none;">
        <h3 style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:${BRAND_DARK};line-height:1.3;">${title}</h3>
      </a>
      ${metaRows ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">${metaRows}</table>` : ""}
      ${desc ? `<p style="margin:0 0 14px 0;font-size:14px;color:#374151;line-height:1.6;">${desc}</p>` : ""}
      <a href="${bookUrl}"
        style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:14px;font-weight:600;
               padding:9px 20px;border-radius:6px;text-decoration:none;">
        ${viewLabel}
      </a>
    </td>
  </tr>
</table>`;
}
