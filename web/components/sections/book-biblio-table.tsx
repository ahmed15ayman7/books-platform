import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  bio?: string | null;
  bioAr?: string | null;
}

interface Publisher {
  title: string;
  slug: string;
  websiteUrl?: string | null;
  address?: string | null;
  countries?: Array<{ name: string; nameAr?: string | null }>;
}

interface BookBiblioTableProps {
  className?: string;
  isbn?: string | null;
  language?: string | null;
  publicationYear?: number | null;
  country?: string | null;
  pageCount?: number | null;
  edition?: string | null;
  dimensions?: string | null;
  translationStatus?: string | null;
  notes?: string | null;
  type?: string | null;
  publisher?: Publisher | null;
  primaryCategory?: Category | null;
  categories?: Category[];
  tags?: Tag[];
  authors?: Author[];
  locale: Locale;
}

const LANGUAGE_NAMES: Record<string, { ar: string; en: string }> = {
  en: { ar: "الإنجليزية",  en: "English" },
  ar: { ar: "العربية",     en: "Arabic" },
  fr: { ar: "الفرنسية",    en: "French" },
  de: { ar: "الألمانية",   en: "German" },
  es: { ar: "الإسبانية",   en: "Spanish" },
  it: { ar: "الإيطالية",   en: "Italian" },
  zh: { ar: "الصينية",     en: "Chinese" },
  ja: { ar: "اليابانية",   en: "Japanese" },
  ru: { ar: "الروسية",     en: "Russian" },
  pt: { ar: "البرتغالية",  en: "Portuguese" },
  tr: { ar: "التركية",     en: "Turkish" },
  fa: { ar: "الفارسية",    en: "Persian" },
  ur: { ar: "الأردية",     en: "Urdu" },
};

const TRANSLATION_STATUS: Record<string, { ar: string; en: string; variant: "translated" | "nominated" | "not-translated" }> = {
  TRANSLATED:     { ar: "مترجم",           en: "Translated",     variant: "translated" },
  NOMINATED:      { ar: "مرشح للترجمة",    en: "Nominated",      variant: "nominated" },
  NOT_TRANSLATED: { ar: "غير مترجم",       en: "Not Translated", variant: "not-translated" },
};

function resolveLanguage(code: string | null | undefined, locale: Locale): string | null {
  if (!code) return null;
  const key = code.toLowerCase().split("-")[0] ?? code.toLowerCase();
  const entry = LANGUAGE_NAMES[key];
  if (!entry) return code.toUpperCase();
  return locale === "ar" ? `${entry.ar} (${code.toUpperCase()})` : `${entry.en} (${code.toUpperCase()})`;
}

interface RowProps {
  label: string;
  children: React.ReactNode;
  even: boolean;
}

function Row({ label, children, even }: RowProps) {
  return (
    <tr className={cn("border-b border-[var(--brand-gray-100)]", even ? "bg-[var(--brand-gray-50)]" : "bg-white")}>
      <th
        scope="row"
        className="w-[38%] px-4 py-3.5 text-start text-base font-bold text-[var(--brand-gray-600)] align-top"
      >
        {label}
      </th>
      <td className="px-4 py-3.5 text-base text-[var(--brand-gray-800)] align-top leading-relaxed">
        {children}
      </td>
    </tr>
  );
}

export function BookBiblioTable({
  className,
  isbn,
  language,
  publicationYear,
  country,
  pageCount,
  edition,
  dimensions,
  translationStatus,
  notes,
  publisher,
  primaryCategory,
  categories = [],
  tags = [],
  authors = [],
  locale,
}: BookBiblioTableProps) {
  const isAr = locale === "ar";

  type RowEntry = { label: string; content: React.ReactNode };
  const rows: RowEntry[] = [];

  // ── Authors ─────────────────────────────────────────────────────────
  if (authors.length > 0) {
    rows.push({
      label: isAr ? "المؤلف" : "Author",
      content: (
        <div className="flex flex-col gap-1">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/${locale}/authors/${author.slug}`}
              className="font-medium text-[var(--brand-red)] hover:underline"
            >
              {isAr && author.nameAr ? author.nameAr : author.name}
            </Link>
          ))}
        </div>
      ),
    });
  }

  // ── Publisher ────────────────────────────────────────────────────────
  if (publisher) {
    rows.push({
      label: isAr ? "دار النشر" : "Publisher",
      content: (
        <span className="flex flex-wrap items-center gap-2">
          <Link
            href={`/${locale}/publishers/${publisher.slug}`}
            className="font-medium text-[var(--brand-red)] hover:underline"
          >
            {publisher.title}
          </Link>
          {publisher.websiteUrl && (
            <a
              href={publisher.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--brand-gray-400)] hover:text-[var(--brand-red)] transition-colors"
              aria-label={isAr ? "زيارة الموقع" : "Visit website"}
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              {isAr ? "الموقع" : "Website"}
            </a>
          )}
        </span>
      ),
    });
  }

  // ── Publisher address ─────────────────────────────────────────────────
  if (publisher?.address) {
    rows.push({
      label: isAr ? "عنوان الناشر" : "Publisher Address",
      content: <span className="text-sm leading-relaxed">{publisher.address}</span>,
    });
  }

  // ── Publisher country ─────────────────────────────────────────────────
  const pubCountry = publisher?.countries?.[0];
  if (pubCountry) {
    const countryName = isAr && pubCountry.nameAr ? pubCountry.nameAr : pubCountry.name;
    rows.push({
      label: isAr ? "بلد النشر" : "Country",
      content: countryName,
    });
  } else if (country) {
    rows.push({
      label: isAr ? "بلد النشر" : "Country",
      content: country,
    });
  }

  // ── Primary category ─────────────────────────────────────────────────
  if (primaryCategory) {
    const catName = isAr && primaryCategory.nameAr ? primaryCategory.nameAr : primaryCategory.name;
    rows.push({
      label: isAr ? "التصنيف الرئيسي" : "Primary Category",
      content: (
        <Link
          href={`/${locale}/books/category/${primaryCategory.slug}`}
          className="text-[var(--brand-red)] hover:underline font-medium"
        >
          {catName}
        </Link>
      ),
    });
  }

  // ── Additional categories ─────────────────────────────────────────────
  const extraCats = categories.filter((c) => c.id !== primaryCategory?.id);
  if (extraCats.length > 0) {
    rows.push({
      label: isAr ? "تصنيفات إضافية" : "Also In",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {extraCats.map((cat) => (
            <Link key={cat.id} href={`/${locale}/books/category/${cat.slug}`}>
              <Badge variant="category" className="text-xs">
                {isAr && cat.nameAr ? cat.nameAr : cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      ),
    });
  }

  // ── Publication year ──────────────────────────────────────────────────
  if (publicationYear) {
    rows.push({
      label: isAr ? "سنة النشر" : "Published",
      content: <span className="font-mono">{publicationYear}</span>,
    });
  }

  // ── Language ──────────────────────────────────────────────────────────
  const langLabel = resolveLanguage(language, locale);
  if (langLabel) {
    rows.push({
      label: isAr ? "اللغة الأصلية" : "Language",
      content: langLabel,
    });
  }

  // ── Page count ────────────────────────────────────────────────────────
  if (pageCount) {
    rows.push({
      label: isAr ? "عدد الصفحات" : "Pages",
      content: (
        <span className="font-mono">
          {pageCount} {isAr ? "صفحة" : "pages"}
        </span>
      ),
    });
  }

  // ── Edition ───────────────────────────────────────────────────────────
  if (edition) {
    rows.push({
      label: isAr ? "الطبعة" : "Edition",
      content: edition,
    });
  }

  // ── Dimensions ────────────────────────────────────────────────────────
  if (dimensions) {
    rows.push({
      label: isAr ? "الحجم" : "Dimensions",
      content: <span className="font-mono text-xs">{dimensions}</span>,
    });
  }

  // ── ISBN ──────────────────────────────────────────────────────────────
  if (isbn) {
    rows.push({
      label: "ISBN",
      content: (
        <span className="font-mono text-xs tracking-wider bg-[var(--brand-gray-100)] px-2 py-0.5 rounded">
          {isbn}
        </span>
      ),
    });
  }

  // ── Translation status ────────────────────────────────────────────────
  if (translationStatus) {
    const st = TRANSLATION_STATUS[translationStatus];
    if (st) {
      rows.push({
        label: isAr ? "حالة الترجمة" : "Translation",
        content: (
          <Badge variant={st.variant} className="text-xs">
            {isAr ? st.ar : st.en}
          </Badge>
        ),
      });
    }
  }

  // ── Tags / Keywords ───────────────────────────────────────────────────
  if (tags.length > 0) {
    rows.push({
      label: isAr ? "الكلمات المفتاحية" : "Keywords",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-block rounded-full bg-[var(--brand-gray-100)] px-2.5 py-0.5 text-xs text-[var(--brand-gray-600)]"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ),
    });
  }

  // ── Notes ─────────────────────────────────────────────────────────────
  if (notes) {
    rows.push({
      label: isAr ? "ملاحظات" : "Notes",
      content: <p className="text-xs leading-relaxed text-[var(--brand-gray-500)]">{notes}</p>,
    });
  }

  if (rows.length === 0) return null;

  // Author bio section (shown below the table)
  const authorsWithBio = authors.filter((a) => (isAr ? a.bioAr ?? a.bio : a.bio));

  return (
    <div className={cn("mt-6 space-y-4", className)}>
      <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm">
        <div className="border-b border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-5 py-3">
          <h3 className="text-sm font-bold text-[var(--brand-gray-700)]">
            {isAr ? "البيانات الببليوغرافية" : "Bibliographic Data"}
          </h3>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {rows.map((row, i) => (
              <Row key={row.label} label={row.label} even={i % 2 === 0}>
                {row.content}
              </Row>
            ))}
          </tbody>
        </table>
      </div>

      {/* Author bio cards */}
      {authorsWithBio.map((author) => {
        const bioText = isAr ? (author.bioAr ?? author.bio) : author.bio;
        const authorName = isAr && author.nameAr ? author.nameAr : author.name;
        if (!bioText) return null;
        return (
          <div
            key={author.id}
            className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm"
          >
            <div className="border-b border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-5 py-3">
              <h3 className="text-sm font-bold text-[var(--brand-gray-700)]">
                {isAr ? `نبذة عن ${authorName}` : `About ${authorName}`}
              </h3>
            </div>
            <p className="px-5 py-4 text-base leading-relaxed text-[var(--brand-gray-700)]">
              {bioText}
            </p>
            <div className="border-t border-[var(--brand-gray-200)] px-5 py-3">
              <Link
                href={`/${locale}/authors/${author.slug}`}
                className="text-sm font-medium text-[var(--brand-red)] hover:underline"
              >
                {isAr ? "عرض كل كتب المؤلف" : "View all books by this author"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
