import { describe, it, expect } from "vitest";

const TEST_SLUG = "test-book";
const TEST_BOOK = {
  slug: TEST_SLUG,
  nameEn: "The Great Novel",
  nameAr: "الرواية العظيمة",
  description: "A long description that tells you about the book",
  descriptionAr: "وصف طويل يروي قصة الكتاب",
  shortDesc: "Short description",
  shortDescAr: "وصف قصير",
  imageUrl: "https://cdn.example.com/cover.jpg",
  isbn: "978-3-16-148410-0",
  language: "ar",
  publicationYear: 2024,
  pageCount: 320,
  edition: "1st",
  editionAr: "الأولى",
  publisher: { id: "pub1", title: "Dar Al Shorouk", name: "Dar Al Shorouk", nameAr: "دار الشروق" },
  primaryCategory: { id: "cat1", name: "Fiction", nameAr: "روايات" },
  authors: [{ id: "auth1", name: "Ahmed Ali", nameAr: "أحمد علي" }],
};

const TEST_ARTICLE = {
  slug: "test-article",
  title: "أفضل كتب 2024",
  titleEn: "Best Books 2024",
  excerpt: "ملخص المقال الطويل الذي يتكون من كلمات كثيرة",
  excerptEn: "A long article excerpt that summarizes the content",
  content: "محتوى المقال الكامل",
  imageUrl: "https://cdn.example.com/article.jpg",
  date: new Date("2024-06-15"),
  channel: "harvest",
  articleCategory: { id: "acat1", name: "Book Harvest", nameAr: "حصاد الكتب" },
};

describe("renderBookCard", () => {
  it("renders book title, ISBN, publisher, author in Arabic", async () => {
    const { renderBookCard } = await import("@/lib/email/templates/book-card");
    const html = renderBookCard(TEST_BOOK, "ar");

    expect(html).toContain("الرواية العظيمة");
    expect(html).toContain("978-3-16-148410-0");
    expect(html).toContain("دار الشروق");
    expect(html).toContain("أحمد علي");
    expect(html).toContain("روايات");
    expect(html).toContain("2024");
    expect(html).toContain("320");
    expect(html).toContain("https://cdn.example.com/cover.jpg");
    expect(html).toContain("عرض الكتاب");
    expect(html).toContain(`/ar/books/${TEST_SLUG}`);
  });

  it("renders English book correctly", async () => {
    const { renderBookCard } = await import("@/lib/email/templates/book-card");
    const html = renderBookCard(TEST_BOOK, "en");

    expect(html).toContain("The Great Novel");
    expect(html).toContain("Dar Al Shorouk");
    expect(html).toContain("Ahmed Ali");
    expect(html).toContain("View Book");
    expect(html).toContain(`/en/books/${TEST_SLUG}`);
  });
});

describe("renderArticleCard", () => {
  it("renders article title, excerpt, and CTA in Arabic", async () => {
    const { renderArticleCard } = await import("@/lib/email/templates/article-card");
    const html = renderArticleCard(TEST_ARTICLE, "ar");

    expect(html).toContain("أفضل كتب 2024");
    expect(html).toContain("ملخص المقال");
    expect(html).toContain("اقرأ المقال كاملاً");
    expect(html).toContain(`/ar/articles/test-article`);
    expect(html).toContain("حصاد الكتب");
  });

  it("renders article in English with fallback title", async () => {
    const { renderArticleCard } = await import("@/lib/email/templates/article-card");
    const html = renderArticleCard(TEST_ARTICLE, "en");

    expect(html).toContain("Best Books 2024");
    expect(html).toContain("Read Full Article");
    expect(html).toContain(`/en/articles/test-article`);
  });
});

describe("renderWelcomeEmail", () => {
  it("contains confirm URL, manage token, and correct subject in Arabic", async () => {
    const { renderWelcomeEmail } = await import("@/lib/email/templates/welcome");
    const result = renderWelcomeEmail({
      email: "user@example.com",
      confirmToken: "confirm-abc",
      manageToken: "manage-xyz",
      locale: "ar",
    });

    expect(result.subject).toContain("أكد اشتراكك");
    expect(result.html).toContain("/api/v1/newsletter/confirm?token=confirm-abc");
    expect(result.html).toContain("manage-xyz");
    expect(result.html).toContain("user@example.com");
    expect(result.text).toContain("/api/v1/newsletter/confirm?token=confirm-abc");
  });

  it("renders English welcome email", async () => {
    const { renderWelcomeEmail } = await import("@/lib/email/templates/welcome");
    const result = renderWelcomeEmail({
      email: "user@example.com",
      confirmToken: "confirm-en",
      manageToken: "manage-en",
      locale: "en",
    });

    expect(result.subject).toContain("Confirm your");
    expect(result.html).toContain("Confirm & Choose Preferences");
  });
});

describe("renderDigestEmail", () => {
  it("renders combined books and articles digest", async () => {
    const { renderDigestEmail } = await import("@/lib/email/templates/digest");
    const result = renderDigestEmail({
      books: [TEST_BOOK],
      articles: [TEST_ARTICLE],
      locale: "ar",
      manageToken: "manage-token-123",
    });

    expect(result.subject).toContain("جديد على منصة الكتب");
    expect(result.html).toContain("الرواية العظيمة");
    expect(result.html).toContain("أفضل كتب 2024");
    expect(result.html).toContain("manage-token-123");
    expect(result.text).toContain("الرواية العظيمة");
    expect(result.text).toContain("أفضل كتب 2024");
  });

  it("throws when called with no items", async () => {
    const { renderDigestEmail } = await import("@/lib/email/templates/digest");
    expect(() => renderDigestEmail({ books: [], articles: [], locale: "ar" })).toThrow();
  });

  it("renders books-only digest", async () => {
    const { renderDigestEmail } = await import("@/lib/email/templates/digest");
    const result = renderDigestEmail({ books: [TEST_BOOK], articles: [], locale: "ar" });
    expect(result.html).toContain("الرواية العظيمة");
    expect(result.html).not.toContain("أفضل كتب 2024");
  });
});
