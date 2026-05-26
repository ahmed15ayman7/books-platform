# Project Plan — منصة الكتب العالمية

> آخر تحديث: May 2026  
> الإصدار: 1.0

---

## Module Status Dashboard

| # | Module | Phase | Status | DoD | Notes |
|---|--------|-------|--------|-----|-------|
| 0 | Foundation (Setup) | 0 | ✅ Done | ✅ | Next.js 16 + Tailwind v4 + Prisma + Design System |
| 1 | Homepage & Global Navigation | 1 | 🔄 In Progress | ⬜ | |
| 2 | Book Catalog & Detail Page | 1 | ⬜ Not Started | ⬜ | |
| 3 | Books Recommended for Translation | 1 | ⬜ Not Started | ⬜ | |
| 4 | Translated Books Section | 1 | ⬜ Not Started | ⬜ | |
| 5 | Publisher Directory & Profiles | 1 | ⬜ Not Started | ⬜ | |
| 6 | Editorial Content Hub | 2 | ⬜ Not Started | ⬜ | |
| 7 | Media Creations Hub | 2 | ⬜ Not Started | ⬜ | |
| 8 | Publish Your Book | 3 | ⬜ Not Started | ⬜ | |
| 9 | E-Commerce & Shopping Cart | 3 | ⬜ Not Started | ⬜ | |
| 10 | Comments & Ratings | 2 | ⬜ Not Started | ⬜ | |
| 11 | Wish List & Reading Lists | 2 | ⬜ Not Started | ⬜ | |
| 12 | Newsletter & Email Subscription | 2 | ⬜ Not Started | ⬜ | |
| 13 | B2B Institutional Subscriptions | 4 | ⬜ Not Started | ⬜ | |
| 14 | Sponsored Publisher Profiles | 4 | ⬜ Not Started | ⬜ | |
| 15 | Search & Filtering | 1 | ⬜ Not Started | ⬜ | |
| 16 | Admin Panel | 4 | ⬜ Not Started | ⬜ | |
| 17 | Bilingual Platform (AR/EN) | 1 | 🔄 In Progress | ⬜ | next-intl + messages setup done |
| 18 | SEO & Technical Marketing | 3 | ⬜ Not Started | ⬜ | |
| 19 | Smart Notification System | 5 | ⬜ Not Started | ⬜ | |
| 20 | Visitor Analytics | 5 | ⬜ Not Started | ⬜ | |
| 21 | Recommendation Engine | 5 | ⬜ Not Started | ⬜ | |
| 22 | Ambassador Referral Program | 5 | ⬜ Not Started | ⬜ | |

---

## Phase Checklists

### ✅ Phase 0 — Foundation (COMPLETE)

- [x] Next.js 16.2.6 initialized in `web/` with TypeScript strict
- [x] Tailwind CSS v4 configured with Brand Design System (red/black/white tokens)
- [x] All tools installed (shadcn/ui, Prisma, jose, zod, RHF, TanStack Query, Zustand, next-intl, ...)
- [x] `prisma/schema.prisma` — full schema with 30+ models, indexes, relations
- [x] `prisma.config.ts` — Prisma 7 configuration
- [x] `lib/db/client.ts` — Prisma singleton with PG adapter
- [x] Design System: `globals.css` (CSS variables) + `tailwind.config.ts` (tokens)
- [x] Base UI components: Button, Badge, Skeleton, SectionHeading, SocialIconCircle, LanguageSwitcher
- [x] ESLint + Prettier + Husky + lint-staged + commitlint
- [x] Vitest + Playwright configs
- [x] Docker Compose (Postgres + Redis)
- [x] `.env.example` with all required variables
- [x] GitHub Actions CI workflow
- [x] PR template
- [x] `next.config.ts` with security headers + image optimization
- [x] Root layout with fonts (Tajawal + Inter)
- [x] `[locale]/layout.tsx` with NextIntlClientProvider + ThemeProvider
- [x] `(public)/layout.tsx` with TopUtilityBar + Header + Footer
- [x] `messages/ar.json` + `messages/en.json` — base translations
- [x] TopUtilityBar (black bg + social circles + language switcher)
- [x] Header (logo + desktop nav + cart icon + mobile nav)
- [x] Footer (4 columns + social icons)
- [x] `middleware.ts` for locale routing
- [x] `project-plan.md` created
- [x] `api-docs.md` created

---

### 🔄 Phase 1 — Public Content Core (IN PROGRESS)

#### Module 17 — Bilingual Platform
- [x] next-intl installed + configured
- [x] `messages/ar.json` + `messages/en.json` base translations
- [x] Locale middleware
- [x] RTL/LTR via `dir` attribute on `<html>`
- [ ] Full translation coverage for all modules
- [ ] locale-aware date/number formatting tested

#### Module 1 — Homepage
- [ ] Hero section (Three.js particles)
- [ ] Search bar (cmdk)
- [ ] Categories grid
- [ ] Newly Released carousel (Embla)
- [ ] By Category tabs
- [ ] Publish Your Book banner
- [ ] Publishers marquee
- [ ] Essence of Ideas articles
- [ ] Book Harvest articles
- [ ] Watch Your Book video
- [ ] Book Talk episodes
- [ ] Novel & Story
- [ ] Stats counters (live from DB)
- [ ] Final CTA strip
- [ ] Newsletter strip

#### Module 2 — Book Catalog + Detail
- [ ] `/books` catalog page with filters + pagination
- [ ] `/books/category/[slug]` page
- [ ] `/books/[slug]` detail page
- [ ] Rating + comments on detail
- [ ] Similar books carousel
- [ ] APIs documented in api-docs.md

#### Module 3 — Recommended for Translation
- [ ] `/books/nominated-for-translation` page
- [ ] Filters: language, publisher, year

#### Module 4 — Translated Books
- [ ] `/books/translated` page
- [ ] Collage hero

#### Module 5 — Publishers
- [ ] `/publishers` directory page
- [ ] `/publishers/[slug]` profile page
- [ ] World map (React Simple Maps)

#### Module 15 — Search
- [ ] cmdk SearchCommand palette
- [ ] `GET /api/v1/search` endpoint
- [ ] `GET /api/v1/search/suggestions` endpoint
- [ ] Fuse.js client-side instant results

---

### ⬜ Phase 2 — Editorial, Media & Engagement

#### Module 6 — Editorial Hub
- [ ] Book Harvest `/articles/harvest`
- [ ] Essence of Ideas `/articles/ideas`
- [ ] World Reads `/articles/world-reads`
- [ ] Article Detail `/articles/[slug]` (MDX)

#### Module 7 — Media Hub
- [ ] Watch Your Book `/articles/watch-your-book`
- [ ] Book Talk `/articles/books-talk`
- [ ] Novel & Story `/articles/novel-story`
- [ ] React Player integration

#### Module 10 — Comments & Ratings
- [ ] Comment form + honeypot spam protection
- [ ] Admin moderation queue
- [ ] Star ratings + aggregate display

#### Module 11 — Wishlist
- [ ] Email-based wishlist
- [ ] Magic link access
- [ ] Translation alert trigger

#### Module 12 — Newsletter
- [ ] Subscribe form + double opt-in
- [ ] Unsubscribe page
- [ ] Resend integration
- [ ] GDPR compliance

---

### ⬜ Phase 3 — Submissions, Commerce & SEO

#### Module 8 — Publish Your Book
- [ ] Full submission form
- [ ] UploadThing file upload
- [ ] First-free logic
- [ ] Admin email notifications

#### Module 9 — E-Commerce
- [ ] Cart (Zustand + localStorage)
- [ ] Checkout flow
- [ ] Payment gateway (Stripe / Paymob)
- [ ] Abandoned cart recovery cron

#### Module 18 — SEO
- [ ] generateMetadata() for all pages
- [ ] JSON-LD structured data
- [ ] next-sitemap dynamic sitemap
- [ ] hreflang AR ↔ EN

---

### ⬜ Phase 4 — Admin Panel

- [ ] JWT Auth (login/refresh/logout)
- [ ] Admin layout + sidebar
- [ ] 16A Dashboard
- [ ] 16B Books CRUD
- [ ] 16C Publishers CRUD + Sponsored toggle
- [ ] 16D/E Articles + Media CRUD
- [ ] 16F Submissions queue
- [ ] 16G Orders management
- [ ] 16H Comments moderation
- [ ] 16I Newsletter campaigns
- [ ] 16J Categories management
- [ ] 16K Static pages editor
- [ ] 16L Settings panel
- [ ] 16M B2B clients
- [ ] 16N Ambassadors management
- [ ] 16O Audit log viewer

---

### ⬜ Phase 5 — Intelligence Layer

- [ ] Module 19: Web Push + WhatsApp + Telegram
- [ ] Module 20: PostHog + Pixels + Heatmaps
- [ ] Module 21: Recommendation Engine
- [ ] Module 22: Ambassador Dashboard + Referral Links
- [ ] Social Auto-Post (Facebook/X/Instagram)

---

### ⬜ Phase 6 — Launch

- [ ] Unit tests (Vitest) > 70% coverage on services
- [ ] E2E tests (Playwright) — 9 critical flows
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Lighthouse > 90 on all pages
- [ ] Security audit (OWASP Top 10)
- [ ] Data migration (WordPress → new schema)
- [ ] Production deployment (Vercel + Neon + Upstash)
- [ ] api-docs.md v1.0 final
- [ ] README.md complete

---

## Definition of Done (DoD)

Every module must satisfy ALL before marked ✅:

1. [ ] Functionality complete per Business Scope doc
2. [ ] UI matches Design System (red/black/white tokens)
3. [ ] Responsive: 375px / 768px / 1440px
4. [ ] RTL correct in Arabic
5. [ ] AR + EN translations complete
6. [ ] Loading + Error + Empty states
7. [ ] Accessibility: keyboard nav + axe clean + WCAG AA contrast
8. [ ] Unit tests (services) + integration tests (API routes)
9. [ ] Lighthouse > 90
10. [ ] `api-docs.md` updated with new endpoints
11. [ ] This checklist updated
12. [ ] PR merged after CI passing
13. [ ] No console errors / warnings in dev mode
14. [ ] No unresolved TODO/FIXME comments

---

## Decisions Log (ADRs)

| # | Decision | Date | File |
|---|----------|------|------|
| 1 | Next.js 16 App Router + TypeScript strict | May 2026 | `docs/adr/0001-tech-stack.md` |
| 2 | Prisma 7 with PG adapter (no `url` in schema) | May 2026 | `docs/adr/0002-prisma-v7.md` |
| 3 | Brand colors: #B11E2E red + #0B0B0B black + #FFFFFF white | May 2026 | `web-tools.md` |
| 4 | JWT Access (15min) + Refresh (7d, HTTP-only cookie) | — | `docs/adr/0003-auth.md` |

---

## Open Issues / Blockers

| # | Issue | Status | Owner |
|---|-------|--------|-------|
| 1 | Local PostgreSQL DB needed to run migrations | Open | DevOps |
| 2 | Payment gateway (Stripe vs Paymob) decision pending | Open | Product |
| 3 | Social media API keys needed for auto-post feature | Open | Marketing |

---

_آلية التحديث: بعد كل مهمة منجزة → ✅ + تحديث `api-docs.md` + commit بـ Conventional Commits_
