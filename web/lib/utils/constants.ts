export const LOCALES = ["ar", "en"] as const;
export type SupportedLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "ar";

export const TRANSLATION_STATUS = {
  NOT_TRANSLATED: "NOT_TRANSLATED",
  NOMINATED: "NOMINATED",
  TRANSLATED: "TRANSLATED",
} as const;

export const ARTICLE_CHANNELS = {
  HARVEST: "harvest",
  IDEAS: "ideas",
  WORLD_READS: "world-reads",
  BOOKS_TALK: "books-talk",
  WATCH_YOUR_BOOK: "watch-your-book",
  NOVEL_STORY: "novel-story",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const PURCHASE_OPTIONS = {
  DIRECT: "DIRECT",
  REFERRAL: "REFERRAL",
  NOT_AVAILABLE: "NOT_AVAILABLE",
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com",
  INSTAGRAM: "https://instagram.com",
  X: "https://x.com",
  TELEGRAM: "https://t.me",
  YOUTUBE: "https://youtube.com",
  LINKEDIN: "https://linkedin.com",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

export const CACHE_KEYS = {
  BOOKS: "books",
  PUBLISHERS: "publishers",
  ARTICLES: "articles",
  HOME_STATS: "home-stats",
  FEATURED_BOOKS: "featured-books",
} as const;

export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  VERY_LONG: 86400, // 1 day
} as const;
