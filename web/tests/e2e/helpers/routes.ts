export const PUBLIC_ROUTES_AR = [
  "/ar",
  "/ar/books",
  "/ar/books/translated",
  "/ar/books/nominated-for-translation",
  "/ar/articles/harvest",
  "/ar/articles/ideas",
  "/ar/articles/world-reads",
  "/ar/media",
  "/ar/media/books-talk",
  "/ar/media/novel-story",
  "/ar/publishers",
  "/ar/about",
  "/ar/services",
  "/ar/contact",
  "/ar/publish",
  "/ar/team",
  "/ar/privacy",
  "/ar/terms",
] as const;

export const PUBLIC_ROUTES_EN = [
  "/en",
  "/en/books",
  "/en/media",
  "/en/about",
] as const;

export const LEGACY_REDIRECTS = [
  {
    from: "/ar/articles/watch-your-book",
    to: /\/ar\/media\/?$/,
  },
  {
    from: "/ar/media/watch-your-book",
    to: /\/ar\/media\/?$/,
  },
  {
    from: "/ar/articles/books-talk",
    to: /\/ar\/media\/books-talk/,
  },
  {
    from: "/ar/articles/novel-story",
    to: /\/ar\/media\/novel-story/,
  },
] as const;

export const FIXTURE_ROUTES = {
  book: "/ar/books/e2e-fixture-book",
  article: "/ar/articles/e2e-fixture-article",
  media: "/ar/media",
} as const;
