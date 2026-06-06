export const SEARCH_SECTIONS = [
  "all",
  "books",
  "articles",
  "media",
  "publishers",
  "authors",
] as const;

export type SearchSectionType = (typeof SEARCH_SECTIONS)[number];

export interface GlobalSearchInput {
  q: string;
  type?: SearchSectionType;
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sort?: "newest" | "oldest" | "title";
  channel?: string;
  country?: string;
}

export interface SearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchPreviewSection<T> {
  items: T[];
  total: number;
}

export interface GlobalSearchPreviewResult {
  mode: "preview";
  query: string;
  books: SearchPreviewSection<{
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string | null;
    imageUrl: string | null;
    translationStatus: string | null;
  }>;
  articles: SearchPreviewSection<{
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    channel: string | null;
    imageUrl: string | null;
    excerpt: string | null;
    date: Date | null;
    videoId: string | null;
    readingTimeMinutes: number | null;
  }>;
  media: SearchPreviewSection<{
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    channel: string | null;
    imageUrl: string | null;
    excerpt: string | null;
    date: Date | null;
    videoId: string | null;
  }>;
  publishers: SearchPreviewSection<{
    id: string;
    slug: string;
    title: string;
    name: string;
    nameAr: string | null;
    imageUrl: string | null;
  }>;
  authors: SearchPreviewSection<{
    id: string;
    slug: string;
    name: string;
    nameAr: string | null;
  }>;
}

export interface GlobalSearchSectionResult {
  mode: "section";
  type: Exclude<SearchSectionType, "all">;
  query: string;
  pagination: SearchPagination;
  books?: GlobalSearchPreviewResult["books"]["items"];
  articles?: GlobalSearchPreviewResult["articles"]["items"];
  media?: GlobalSearchPreviewResult["media"]["items"];
  publishers?: GlobalSearchPreviewResult["publishers"]["items"];
  authors?: GlobalSearchPreviewResult["authors"]["items"];
}

export type GlobalSearchResult = GlobalSearchPreviewResult | GlobalSearchSectionResult;

export function parseSearchSectionType(value: string | null | undefined): SearchSectionType {
  if (value && SEARCH_SECTIONS.includes(value as SearchSectionType)) {
    return value as SearchSectionType;
  }
  return "all";
}
