import { db } from "@/lib/db";
import { notDeleted } from "@/lib/admin/audit-fields";
import { sendMail } from "./mailer";
import { renderDigestEmail } from "./templates/digest";
import type { BookCardData } from "./templates/book-card";
import type { ArticleCardData } from "./templates/article-card";

const DEFAULT_LOOKBACK_DAYS = parseInt(
  process.env["NEWSLETTER_DIGEST_LOOKBACK_DAYS"] ?? "7",
  10,
);

const MAX_BOOKS_PER_DIGEST = 5;
const MAX_ARTICLES_PER_DIGEST = 5;

// ----------------------------------------------------------------
// Internal types
// ----------------------------------------------------------------

interface RawBook {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  shortDesc: string | null;
  shortDescAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  isbn: string | null;
  language: string | null;
  publicationYear: number | null;
  pageCount: number | null;
  edition: string | null;
  editionAr: string | null;
  createdAt: Date;
  primaryCategoryId: string | null;
  publisherId: string | null;
  publisher: { id: string; title: string; name: string; nameAr: string | null } | null;
  primaryCategory: { id: string; name: string; nameAr: string | null } | null;
  authors: { id: string; name: string; nameAr: string | null }[];
}

interface RawArticle {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  content: string | null;
  contentEn: string | null;
  imageUrl: string | null;
  date: Date | null;
  channel: string | null;
  createdAt: Date;
  articleCategoryId: string | null;
  articleCategory: { id: string; name: string; nameAr: string | null } | null;
}

// ----------------------------------------------------------------
// Data loading
// ----------------------------------------------------------------

async function loadNewBooks(since: Date): Promise<RawBook[]> {
  return db.product.findMany({
    where: { published: true, ...notDeleted, createdAt: { gt: since } },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      slug: true,
      nameEn: true,
      nameAr: true,
      shortDesc: true,
      shortDescAr: true,
      description: true,
      descriptionAr: true,
      imageUrl: true,
      isbn: true,
      language: true,
      publicationYear: true,
      pageCount: true,
      edition: true,
      editionAr: true,
      createdAt: true,
      primaryCategoryId: true,
      publisherId: true,
      publisher: { select: { id: true, title: true, name: true, nameAr: true } },
      primaryCategory: { select: { id: true, name: true, nameAr: true } },
      authors: { select: { id: true, name: true, nameAr: true } },
    },
  }) as Promise<RawBook[]>;
}

async function loadNewArticles(since: Date): Promise<RawArticle[]> {
  return db.article.findMany({
    where: { status: "publish", ...notDeleted, createdAt: { gt: since } },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      slug: true,
      title: true,
      titleEn: true,
      excerpt: true,
      excerptEn: true,
      content: true,
      contentEn: true,
      imageUrl: true,
      date: true,
      channel: true,
      createdAt: true,
      articleCategoryId: true,
      articleCategory: { select: { id: true, name: true, nameAr: true } },
    },
  }) as Promise<RawArticle[]>;
}

// ----------------------------------------------------------------
// Preference matching
// ----------------------------------------------------------------

function matchBooks(books: RawBook[], sub: SubscriberPrefs): RawBook[] {
  const hasPrefs =
    sub.prefProductCategoryIds.length > 0 ||
    sub.prefPublisherIds.length > 0 ||
    sub.prefAuthorIds.length > 0;

  if (!hasPrefs) return [];

  return books.filter((b) => {
    if (sub.prefProductCategoryIds.length > 0) {
      const catIds = [b.primaryCategoryId].filter(Boolean) as string[];
      if (catIds.some((id) => sub.prefProductCategoryIds.includes(id))) return true;
    }
    if (sub.prefPublisherIds.length > 0 && b.publisherId) {
      if (sub.prefPublisherIds.includes(b.publisherId)) return true;
    }
    if (sub.prefAuthorIds.length > 0) {
      if (b.authors.some((a) => sub.prefAuthorIds.includes(a.id))) return true;
    }
    return false;
  });
}

function matchArticles(articles: RawArticle[], sub: SubscriberPrefs): RawArticle[] {
  const hasPrefs = sub.prefArticleCategoryIds.length > 0;
  if (!hasPrefs) return [];

  return articles.filter((a) => {
    if (sub.prefArticleCategoryIds.length > 0 && a.articleCategoryId) {
      if (sub.prefArticleCategoryIds.includes(a.articleCategoryId)) return true;
    }
    return false;
  });
}

// ----------------------------------------------------------------
// Random selection for no-preference subscribers
// ----------------------------------------------------------------

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

// ----------------------------------------------------------------
// Adapter: raw → template shape
// ----------------------------------------------------------------

function toBookCard(b: RawBook): BookCardData {
  return {
    slug: b.slug,
    nameEn: b.nameEn,
    nameAr: b.nameAr,
    shortDesc: b.shortDesc,
    shortDescAr: b.shortDescAr,
    description: b.description,
    descriptionAr: b.descriptionAr,
    imageUrl: b.imageUrl,
    isbn: b.isbn,
    language: b.language,
    publicationYear: b.publicationYear,
    pageCount: b.pageCount,
    edition: b.edition,
    editionAr: b.editionAr,
    publisher: b.publisher,
    primaryCategory: b.primaryCategory,
    authors: b.authors,
  };
}

function toArticleCard(a: RawArticle): ArticleCardData {
  return {
    slug: a.slug,
    title: a.title,
    titleEn: a.titleEn,
    excerpt: a.excerpt,
    excerptEn: a.excerptEn,
    content: a.content,
    contentEn: a.contentEn,
    imageUrl: a.imageUrl,
    date: a.date,
    channel: a.channel,
    articleCategory: a.articleCategory,
  };
}

// ----------------------------------------------------------------
// Subscriber type
// ----------------------------------------------------------------

interface SubscriberPrefs {
  id: string;
  email: string;
  locale: string;
  manageToken: string | null;
  lastDigestAt: Date | null;
  prefProductCategoryIds: string[];
  prefArticleCategoryIds: string[];
  prefPublisherIds: string[];
  prefAuthorIds: string[];
}

// ----------------------------------------------------------------
// Main digest runner
// ----------------------------------------------------------------

export interface DigestResult {
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
}

export async function runNewsletterDigest(): Promise<DigestResult> {
  const now = new Date();
  const globalSince = new Date(now.getTime() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  // Load all new content once (based on the global lookback window)
  const [allBooks, allArticles] = await Promise.all([
    loadNewBooks(globalSince),
    loadNewArticles(globalSince),
  ]);

  if (allBooks.length === 0 && allArticles.length === 0) {
    return { processed: 0, sent: 0, skipped: 0, failed: 0 };
  }

  // Load all confirmed subscribers
  const subscribers = await db.newsletterSubscriber.findMany({
    where: { status: "CONFIRMED" },
    select: {
      id: true,
      email: true,
      locale: true,
      manageToken: true,
      lastDigestAt: true,
      prefProductCategoryIds: true,
      prefArticleCategoryIds: true,
      prefPublisherIds: true,
      prefAuthorIds: true,
    },
  }) as SubscriberPrefs[];

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      const since = sub.lastDigestAt ?? globalSince;

      // Items new since this subscriber's last digest
      const freshBooks = allBooks.filter((b) => b.createdAt > since);
      const freshArticles = allArticles.filter((a) => a.createdAt > since);

      if (freshBooks.length === 0 && freshArticles.length === 0) {
        skipped++;
        continue;
      }

      const hasAnyPref =
        sub.prefProductCategoryIds.length > 0 ||
        sub.prefArticleCategoryIds.length > 0 ||
        sub.prefPublisherIds.length > 0 ||
        sub.prefAuthorIds.length > 0;

      let books: RawBook[];
      let articles: RawArticle[];

      if (hasAnyPref) {
        books = matchBooks(freshBooks, sub).slice(0, MAX_BOOKS_PER_DIGEST);
        articles = matchArticles(freshArticles, sub).slice(0, MAX_ARTICLES_PER_DIGEST);

        // If preferences found nothing, fall back to one random item
        if (books.length === 0 && articles.length === 0) {
          const allFresh = [...freshBooks, ...freshArticles];
          const randomItem = pickRandom(allFresh);
          if (!randomItem) { skipped++; continue; }
          books = "nameEn" in randomItem ? [randomItem as RawBook] : [];
          articles = "nameEn" in randomItem ? [] : [randomItem as RawArticle];
        }
      } else {
        // No preferences: send one random item
        const allFresh = [...freshBooks, ...freshArticles];
        const randomItem = pickRandom(allFresh);
        if (!randomItem) { skipped++; continue; }
        books = "nameEn" in randomItem ? [randomItem as RawBook] : [];
        articles = "nameEn" in randomItem ? [] : [randomItem as RawArticle];
      }

      if (books.length === 0 && articles.length === 0) { skipped++; continue; }

      const locale = sub.locale ?? "ar";
      const { html, text, subject } = renderDigestEmail({
        books: books.map(toBookCard),
        articles: articles.map(toArticleCard),
        locale,
        manageToken: sub.manageToken ?? undefined,
      });

      const ok = await sendMail({ to: sub.email, subject, html, text });

      if (ok) {
        sent++;
        // Log each item sent to this subscriber
        const bookLogEntries = books.map((b) => ({ productId: b.id, articleId: undefined as string | undefined }));
        const articleLogEntries = articles.map((a) => ({ articleId: a.id, productId: undefined as string | undefined }));
        await Promise.all(
          [...bookLogEntries, ...articleLogEntries].map((entry) =>
            db.notificationLog.create({
              data: {
                type: "newsletter_digest",
                recipient: sub.email,
                subject,
                body: text.slice(0, 500),
                status: "sent",
                productId: entry.productId ?? null,
                articleId: entry.articleId ?? null,
              },
            }).catch(() => {}),
          ),
        );
        // Update high-water mark
        await db.newsletterSubscriber.update({
          where: { id: sub.id },
          data: { lastDigestAt: now },
        });
      } else {
        failed++;
        await db.notificationLog.create({
          data: {
            type: "newsletter_digest",
            recipient: sub.email,
            subject,
            body: "send failed",
            status: "failed",
            errorMessage: "SMTP send returned false",
          },
        }).catch(() => {});
      }
    } catch (err) {
      failed++;
      console.error(`[newsletter-digest] Error for ${sub.email}:`, err);
    }
  }

  return { processed: subscribers.length, sent, skipped, failed };
}
