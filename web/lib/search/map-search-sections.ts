import {
  BookOpen,
  Building2,
  FileText,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  adminArticleEditPath,
  adminAuthorEditPath,
  adminBookEditPath,
  adminMediaEditPath,
  adminPublisherEditPath,
} from "@/lib/admin/public-urls";
import { localeHref } from "@/lib/i18n/href";
import type { SearchPaletteSection } from "@/components/search/global-search-palette";

export interface GlobalSearchPayload {
  books: Array<{
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string | null;
    imageUrl: string | null;
  }>;
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    channel: string | null;
    imageUrl: string | null;
  }>;
  media: Array<{
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    channel: string | null;
    imageUrl: string | null;
  }>;
  publishers: Array<{
    id: string;
    slug: string;
    title: string;
    name: string;
    nameAr: string | null;
    imageUrl: string | null;
  }>;
  authors: Array<{
    id: string;
    slug: string;
    name: string;
    nameAr: string | null;
  }>;
}

interface SectionLabels {
  books: string;
  articles: string;
  media: string;
  publishers: string;
  authors: string;
}

function buildSections(
  data: GlobalSearchPayload,
  labels: SectionLabels,
  hrefFor: (key: string, item: { id: string; slug?: string; channel?: string | null }) => string,
): SearchPaletteSection[] {
  const bookItems = data.books.map((b) => ({
    id: b.id,
    title: b.nameAr ?? b.nameEn,
    subtitle: b.slug,
    href: hrefFor("books", b),
    imageUrl: b.imageUrl,
  }));

  const articleItems = data.articles.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.slug,
    href: hrefFor("articles", a),
    imageUrl: a.imageUrl,
  }));

  const mediaItems = data.media.map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: m.channel ?? m.slug,
    href: hrefFor("media", m),
    imageUrl: m.imageUrl,
  }));

  const publisherItems = data.publishers.map((p) => ({
    id: p.id,
    title: p.nameAr ?? p.title ?? p.name,
    subtitle: p.slug,
    href: hrefFor("publishers", p),
    imageUrl: p.imageUrl,
  }));

  const authorItems = data.authors.map((a) => ({
    id: a.id,
    title: a.nameAr ?? a.name,
    subtitle: a.slug,
    href: hrefFor("authors", a),
  }));

  const sections: Array<{
    key: string;
    label: string;
    icon: LucideIcon;
    items: SearchPaletteSection["items"];
  }> = [
    { key: "books", label: labels.books, icon: BookOpen, items: bookItems },
    { key: "articles", label: labels.articles, icon: FileText, items: articleItems },
    { key: "media", label: labels.media, icon: Video, items: mediaItems },
    { key: "publishers", label: labels.publishers, icon: Building2, items: publisherItems },
    { key: "authors", label: labels.authors, icon: User, items: authorItems },
  ];

  return sections.filter((s) => s.items.length > 0);
}

export function mapPublicSearchSections(
  data: GlobalSearchPayload,
  locale: string,
  labels: SectionLabels,
): SearchPaletteSection[] {
  return buildSections(data, labels, (key, item) => {
    switch (key) {
      case "books":
        return localeHref(locale, `/books/${item.slug}`);
      case "articles":
      case "media":
        return localeHref(locale, `/articles/${item.slug}`);
      case "publishers":
        return localeHref(locale, `/publishers/${item.slug}`);
      case "authors":
        return localeHref(locale, `/authors/${item.slug}`);
      default:
        return localeHref(locale, "/");
    }
  });
}

export function mapAdminSearchSections(
  data: GlobalSearchPayload,
  locale: string,
): SearchPaletteSection[] {
  return buildSections(
    data,
    {
      books: "الكتب",
      articles: "المقالات",
      media: "الميديا",
      publishers: "الناشرون",
      authors: "المؤلفون",
    },
    (key, item) => {
      switch (key) {
        case "books":
          return adminBookEditPath(locale, item.id);
        case "articles":
          return adminArticleEditPath(locale, item.id, item.channel);
        case "media":
          return adminMediaEditPath(locale, item.id);
        case "publishers":
          return adminPublisherEditPath(locale, item.id);
        case "authors":
          return adminAuthorEditPath(locale, item.id);
        default:
          return localeHref(locale, "/admin");
      }
    },
  );
}
