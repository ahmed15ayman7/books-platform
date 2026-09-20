# Books Platform — منصة الكتب العالمية

> **A window to world books — discover, read, and publish.** | **نافذة العالم على الكتب — اكتشف، اقرأ، انشر**

A bilingual (Arabic/English) books discovery and publishing platform consisting of a **Next.js web application** and a **Flutter mobile application** (iOS + Android), sharing a common PostgreSQL database and REST API.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Features](#features)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Setup](#environment-setup)
   - [Installation](#installation)
   - [Run](#run)
   - [Build](#build)
5. [Project Structure](#project-structure)
6. [API Overview](#api-overview)
7. [State Management](#state-management)
8. [Dependency Injection (Mobile)](#dependency-injection-mobile)
9. [Environment Variables Reference](#environment-variables-reference)
10. [Testing](#testing)
11. [CI/CD](#cicd)
12. [Deployment](#deployment)
13. [Contributing](#contributing)
14. [Known Limitations / TODO](#known-limitations--todo)
15. [License](#license)

---

## Tech Stack

### Web (`web/`)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, standalone output) | 16.2.6 |
| UI runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Component primitives | Radix UI (shadcn/ui) | various ^1–^2 |
| Animation | Framer Motion | ^12.40.0 |
| Icons | Lucide React | ^1.16.0 |
| Rich text editor | Tiptap | ^2.27.2 |
| State — client | Zustand | ^5.0.13 |
| State — server | TanStack React Query | ^5.100.14 |
| Database | PostgreSQL 16 + Prisma ORM | 7.8.0 |
| Auth | JWT (jose, HS256) + Passkeys (SimpleWebAuthn) | 6.2.3 / 13.3.x |
| Password hashing | bcryptjs | ^3.0.3 |
| Rate limiting | Upstash Redis + @upstash/ratelimit | ^2.0.8 |
| File storage | Cloudflare R2 (S3-compatible) | aws-sdk v3 ^3.1068 |
| Email | Nodemailer (SMTP) | ^9.0.1 |
| Push notifications | Web Push (VAPID) | ^3.6.7 |
| Localization | next-intl | ^4.12.0 |
| Search | Fuse.js | ^7.3.0 |
| Charts | Recharts | ^3.8.1 |
| 3D | Three.js + @react-three/fiber + @react-three/drei | 0.184 / 9.6.1 / 10.7.7 |
| Maps | react-simple-maps | ^3.0.0 |
| Forms | React Hook Form + Zod | ^7.76.1 / ^4.4.3 |
| Sitemap | next-sitemap | ^4.2.3 |
| Unit tests | Vitest | ^4.1.7 |
| E2E tests | Playwright | ^1.60.0 |
| Linting | ESLint + Prettier | ^10.4.0 / ^3.8.3 |
| Git hooks | Husky + lint-staged + commitlint | ^9.1.7 / ^16.4.0 / ^21.0.1 |
| Containerization | Docker (multi-stage, node:20-bookworm-slim) | — |

### Mobile (`mobile/`)

| Layer | Technology | Version |
|---|---|---|
| Framework | Flutter | SDK ^3.11.5 |
| Language | Dart | ^3.11.5 |
| App version | booksplatform | 2.0.0+9 |
| Platforms | iOS + Android | Android min SDK 21 |
| State management | flutter_bloc (Cubit) | ^9.1.1 |
| Dependency injection | get_it + injectable | ^9.2.1 / ^3.0.0 |
| HTTP | Dio + pretty_dio_logger | ^5.9.2 / ^1.4.0 |
| Functional programming | dartz (Either) | ^0.10.1 |
| Secure storage | flutter_secure_storage | ^10.2.0 |
| Local preferences | shared_preferences | ^2.5.5 |
| UI scaling | flutter_screenutil (390 × 844 canvas) | ^5.9.3 |
| SVG | flutter_svg | ^2.3.0 |
| Image caching | cached_network_image | ^3.4.1 |
| Shimmer loading | shimmer | ^3.0.0 |
| Localization | easy_localization | ^3.0.3 |
| Internationalization | intl | ^0.20.2 |
| Connectivity | connectivity_plus | ^7.1.1 |
| Equality | equatable | ^2.0.8 |
| Audio playback | just_audio | ^0.9.40 |
| Text-to-speech | flutter_tts | ^4.2.0 |
| Markdown rendering | flutter_markdown | ^0.7.7 |
| URL handling | url_launcher | ^6.3.2 |
| Fonts | google_fonts | ^6.2.1 |
| File picking | file_picker + image_picker | ^8.1.7 / ^1.1.2 |
| Unit tests | flutter_test + mocktail | SDK / ^1.0.4 |
| Code generation | build_runner + injectable_generator | ^2.15.0 / ^3.0.2 |
| App icons | flutter_launcher_icons | ^0.14.4 |

---

## Architecture Overview

### Web — Layered App Router (Next.js)

The web app is a Next.js 16 application using the **App Router** with a `[locale]` dynamic segment for bilingual routing. Server Components handle data fetching; Client Components manage interactive UI. All API logic lives in Route Handlers under `app/api/v1/`.

```
web/
├── app/                        # Next.js App Router root
│   ├── [locale]/               # AR/EN locale prefix (next-intl)
│   │   ├── (public)/           # Public-facing pages (layout + routes)
│   │   │   ├── books/          # Book catalog, detail, category, translated
│   │   │   ├── articles/       # Article list + detail
│   │   │   ├── publishers/     # Publisher list + profile
│   │   │   ├── authors/        # Author list + profile
│   │   │   ├── media/          # Media / video content
│   │   │   ├── search/         # Global search
│   │   │   ├── publish/        # Book submission form
│   │   │   ├── about/contact/  # Static + marketing pages
│   │   │   └── auth/           # Login + register
│   │   └── admin/              # Admin dashboard + login
│   └── api/v1/                 # REST Route Handlers (JSON)
│       ├── books/ articles/ publishers/ authors/ media/ search/
│       ├── auth/ cart/ wishlist/ ratings/ comments/ contact/
│       ├── newsletter/ notifications/ orders/ submissions/
│       ├── admin/ (CRUD for all content types, passkey management)
│       ├── ambassador/         # Ambassador dashboard + referral links
│       └── cron/               # Newsletter digest + trash purge cron jobs
├── components/                 # Shared React components
│   ├── ui/                     # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── sections/               # Page-level section components (home, about, …)
│   ├── admin/ auth/ forms/     # Domain-specific components
│   └── seo/ share/ motion/     # SEO tags, share buttons, animation wrappers
├── lib/                        # Server-side utilities + domain logic
│   ├── auth/                   # JWT, passkeys, RBAC, session management
│   ├── db/                     # Prisma client singleton
│   ├── email/ storage/ cache/  # Nodemailer, R2 upload, Redis cache
│   ├── articles/ search/       # Domain-specific helpers
│   └── validation/ forms/      # Zod schemas + form helpers
├── hooks/                      # Custom React hooks
├── i18n/                       # next-intl config + request locale resolver
├── messages/                   # Translation JSON files (ar.json, en.json)
├── prisma/                     # Prisma schema + migrations + seed
├── server/services/            # Longer server-side service classes
├── tests/
│   ├── unit/                   # Vitest unit tests
│   └── e2e/                    # Playwright end-to-end tests
└── scripts/                    # One-off data scripts (backfill, seed, verify)
```

### Mobile — Clean Architecture, Feature-First (Flutter)

The mobile app enforces a strict **Clean Architecture** with feature-first folders. Each feature is isolated from others; all shared infrastructure lives in `core/`. The layer boundary is: `Presentation → Domain → Data` and `Feature → Core`.

```
mobile/lib/
├── core/                       # Shared infrastructure (no feature code here)
│   ├── constants/              # ApiConstants, AppConstants, AppSpacing
│   ├── di/                     # get_it + injectable DI container
│   ├── helpers/                # DialogHelper, SnackBarHelper, BottomSheetHelper, …
│   ├── network/                # ApiManager, Dio, AuthInterceptor, Failure hierarchy
│   ├── router/                 # AppRouter, AppRoutes, typed args classes
│   ├── storage/                # SecureStorageHelper, cart/wishlist/search storage
│   ├── theme/                  # AppColors, AppTextStyles, AppTheme
│   └── widgets/                # Shared widgets (AppBarWidget, BookCoverWidget, TtsPlayerWidget, …)
└── features/                   # One folder per product feature
    ├── articles/               # Article list + detail (audio player, video player, comments)
    ├── books/                  # Home, catalog, book detail, category, translated, recommended
    ├── cart/                   # Cart state (global lazySingleton) + cart screen
    ├── media_creations/        # Video media content list
    ├── more/                   # "More" bottom sheet
    ├── newsletter/             # Newsletter subscription
    ├── notifications/          # Push notification settings
    ├── onboarding/             # Splash, language selection, onboarding slides
    ├── publish/                # Multi-step book publishing form
    ├── publishers/             # Publishers list + detail
    ├── search/                 # Global search + search history
    └── wishlist/               # Wishlist management
```

Each feature follows the same three-layer layout:

```
features/<feature>/
├── data/
│   ├── datasources/            # Remote data source (HTTP via ApiManager)
│   ├── models/                 # *_request.dart (toJson) + *_response.dart (fromJson + toEntity)
│   └── repositories/           # Repository implementation (@LazySingleton)
├── domain/
│   ├── entities/               # Pure Dart + Equatable, no data imports
│   ├── repositories/           # Abstract repository contract
│   └── use_cases/              # Only when called from 2+ cubits or has domain logic
└── presentation/
    ├── cubit/                  # Sealed state + Cubit (@injectable factory)
    └── pages/                  # Screens (flat file or folder when >250 lines)
```

---

## Features

### Web Platform

- **Bilingual browsing** — full AR/EN locale switching with RTL support, clean URLs via `next.config.mjs` rewrites
- **Book catalog** — paginated/filtered listing, category browsing, translated books, nominated-for-translation subset
- **Book detail** — full bibliographic info, cover image, description, ratings, related articles
- **Article hub** — list with featured card, article detail with rich content, comments, media embeds
- **Publisher profiles** — publisher directory with associated book listings
- **Author profiles** — author directory with associated books
- **Media content** — video/media showcase section
- **Global search** — Fuse.js fuzzy search + autocomplete suggestions
- **Publish your book** — multi-step book submission form with cover upload to Cloudflare R2, draft save/resume
- **User auth** — JWT + Passkey (WebAuthn) login, registration, refresh token rotation
- **Cart + checkout** — add to cart, order placement, Stripe/Paymob payment integration
- **Wishlist** — per-user wishlist persistence
- **Book ratings** — user star ratings on books
- **Comments** — article commenting system
- **Newsletter** — subscribe/confirm/unsubscribe with double-opt-in, digest email via cron
- **Push notifications** — Web Push (VAPID) subscription management + admin broadcast
- **Ambassador program** — referral links + dashboard for ambassadors
- **Contact form** — validated contact submission with email notification
- **Admin dashboard** — full CRUD for books, articles, publishers, authors, categories, users, hero slides, orders, submissions, drafts, static pages, comments, B2B inquiries, trash/restore
- **Auto-translation** — admin-triggered AI translation via fallback chain (LibreTranslate → MyMemory → Google → Lingva)
- **SEO** — per-page metadata, OG images, sitemap generation, Google Search Console verification
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **3D / map visualization** — Three.js scenes + world map (react-simple-maps)
- **Analytics** — PostHog, Microsoft Clarity, Meta Pixel, TikTok Pixel (env-gated)
- **Cron jobs** — newsletter digest and trash purge (secret-protected endpoints)

### Mobile App

- **Onboarding** — splash, language selection, illustrated slides
- **Home** — hero carousel (from admin-managed hero slides), category sections, book carousels, publisher strip, newsletter CTA
- **Book catalog** — paginated grid, filter by category, sort order
- **Book detail** — hero cover, bibliographic table, TTS (text-to-speech) player, similar books, purchase options
- **Category books** — filtered listing per category
- **Translated / Recommended books** — dedicated screens
- **Article hub** — featured card + article rows; detail with hero header, rich markdown body, embedded audio player, video badge/player, reader comments
- **Publishers** — list + detail with about section and book listing
- **Media creations** — video content card list
- **Global search** — real-time search with persistent history
- **Cart** — line items, quantity management, order summary card
- **Wishlist** — add/remove books with local persistence
- **Publish a book** — multi-step form: author info → book info → review → success
- **Newsletter** — bottom sheet subscription widget
- **Push notification settings** — toggle notification preferences
- **Static pages** — About Us, Contact, Services, Team, Privacy Policy, Terms of Use
- **Bilingual** — AR/EN with easy_localization JSON keys; RTL layout via `EdgeInsetsDirectional`

---

## Getting Started

### Prerequisites

**For the web app:**

| Tool | Version |
|---|---|
| Node.js | 20.x |
| npm | bundled with Node 20 |
| PostgreSQL | 16 |
| Docker + Docker Compose | any recent stable |

**For the mobile app:**

| Tool | Version |
|---|---|
| Flutter SDK | ^3.11.5 |
| Dart SDK | ^3.11.5 (bundled with Flutter) |
| Android Studio / Xcode | Latest stable |
| Android emulator or physical device | Android min SDK 21 |
| iOS Simulator or physical device | iOS 14+ recommended |

### Environment Setup

#### Web

1. Copy the example env file and fill in your values:
   ```bash
   cp web/.env.example web/.env.local
   ```
2. At minimum, set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `NEXT_PUBLIC_APP_URL`. All other variables are optional for local development (features that require them will be disabled or error gracefully).

#### Mobile

No `.env` file needed. The mobile app uses compile-time `--dart-define` flags:

- **Dev** (default): run without any flags — the app points to `https://booksplatform.net/api/v1`
- **Prod**: pass `--dart-define=ENVIRONMENT=prod`

To set this permanently in VS Code, add to `.vscode/launch.json`:
```json
{
  "args": ["--dart-define=ENVIRONMENT=prod"]
}
```

### Installation

#### Web

```bash
cd web
npm ci
npx prisma generate   # generate Prisma client
npm run db:migrate    # run migrations (requires DATABASE_URL in .env.local)
npm run db:seed       # optional — seed sample data
```

#### Mobile

```bash
cd mobile
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # generate DI config
```

### Run

#### Web

```bash
cd web
npm run dev           # starts Next.js dev server on http://localhost:3000
```

#### Mobile

```bash
cd mobile
flutter run                                # dev environment (default)
flutter run --dart-define=ENVIRONMENT=prod # prod environment
```

To run on a specific device/emulator:
```bash
flutter devices                            # list connected devices
flutter run -d <device-id>
```

### Build

#### Web

```bash
cd web
npm run build         # runs `prisma generate && next build`
npm start             # serve the production build locally
```

**Docker:**
```bash
cd web
docker build -t books-platform-web .
docker-compose up     # production-mode Docker run
```

#### Mobile

```bash
cd mobile
# Android APK
flutter build apk --dart-define=ENVIRONMENT=prod

# iOS (requires Xcode + Apple developer account)
flutter build ios --dart-define=ENVIRONMENT=prod

# Android App Bundle (Play Store)
flutter build appbundle --dart-define=ENVIRONMENT=prod
```

> For iOS App Store submission, see `mobile/build_release.ps1` for build automation steps.

---

## Project Structure

```
books-platform/               # Monorepo root
├── mobile/                   # Flutter mobile application
│   ├── lib/
│   │   ├── core/             # Infrastructure: DI, networking, routing, theme, storage
│   │   └── features/         # Product features (articles, books, cart, …)
│   ├── test/                 # Unit + widget tests
│   ├── assets/
│   │   ├── translations/     # en.json, ar.json (easy_localization)
│   │   ├── static/           # Static images
│   │   ├── branding/         # App icons
│   │   ├── icons/social/     # Social media icons
│   │   └── onboarding/       # Onboarding slide images
│   └── pubspec.yaml          # Dependency manifest
├── web/                      # Next.js web application
│   ├── app/                  # App Router pages + API routes
│   ├── components/           # React components
│   ├── lib/                  # Server utilities + domain logic
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # next-intl configuration
│   ├── messages/             # Translation files (ar.json, en.json)
│   ├── prisma/               # Schema + migrations + seed
│   ├── tests/                # Vitest unit + Playwright E2E
│   ├── scripts/              # Data management scripts
│   ├── Dockerfile            # Multi-stage production build
│   ├── docker-compose.yml    # Coolify / server deployment
│   └── package.json          # Dependency manifest
├── schema.prisma             # Root-level Prisma schema reference (canonical copy in web/prisma/)
└── api-docs.md               # API endpoint documentation
```

---

## API Overview

**Base URL:** `https://booksplatform.net/api/v1`

**Auth:** JWT Bearer token via `Authorization: Bearer <token>` header, or HTTP-only cookie set by `/auth/login`. Token refresh is handled at `/auth/refresh`.

**Response shape:** Most endpoints return JSON directly. Admin endpoints require a valid admin session. Rate limits apply globally (see environment variables).

| Group | Prefix | Description |
|---|---|---|
| Books | `/books` | List, detail, categories, stats, similar |
| Articles | `/articles` | List, detail, related articles, categories |
| Publishers | `/publishers` | List + publisher book listing |
| Authors | `/authors` | Via admin CRUD |
| Media | `/media` | Media list + home subset |
| Search | `/search` | Full-text search + suggestions |
| Auth | `/auth` | Login, register, logout, token refresh |
| Cart | `/cart` | Cart CRUD |
| Wishlist | `/wishlist` | Wishlist CRUD |
| Ratings | `/ratings` | Book star ratings |
| Comments | `/comments` | Article comments |
| Contact | `/contact` | Contact form submission |
| Newsletter | `/newsletter` | Subscribe, confirm, unsubscribe, preferences |
| Notifications | `/notifications` | Web Push subscription + channel subscription |
| Orders | `/orders/checkout` | Order placement |
| Submissions | `/submissions` | Book publishing submissions + draft management |
| Hero Slides | `/hero-slides` | Home carousel slides |
| Admin | `/admin/*` | Full CRUD — requires admin role |
| Ambassador | `/ambassador/*` | Dashboard + referral links — requires ambassador role |
| Cron | `/cron/*` | Newsletter digest + trash purge — requires `CRON_SECRET` |

---

## State Management

### Web

- **Zustand** (`lib/store/`) — client-side global state (cart, UI preferences, consent)
- **TanStack React Query** — server state, data fetching, caching, background refresh in Client Components
- **React Hook Form + Zod** — form state and validation

### Mobile

All feature state is managed with **flutter_bloc Cubits** following a strict pattern:

- Every cubit uses `sealed class` + `final class` states extending `Equatable`
- Features with both reads and writes use **separate cubits** (action cubit + query cubit) to prevent state collisions
- Action cubits use `BlocConsumer` in the UI (listener triggers list refresh); list cubits use `BlocBuilder`
- `BlocProvider` is always created in `AppRouter.generateRoute`, never inside screen widgets

**Example state file:** `mobile/lib/features/books/presentation/cubit/catalog_cubit/catalog_state.dart`

```
AuthInterceptor (Bearer injection + 401 logout)
     ↓
ApiManager (Dio wrapper, single error boundary)
     ↓
Either<Failure, T>
     ↓
Repository impl (.toEntity() conversion)
     ↓
Domain entity
     ↓
Cubit (emits sealed state)
     ↓
BlocBuilder / BlocConsumer (renders UI)
```

---

## Dependency Injection (Mobile)

DI is wired with **get_it** (`@lazySingleton`) and **injectable** (code generation). After adding or modifying any `@injectable`/`@lazySingleton` class, regenerate the config:

```bash
cd mobile
dart run build_runner build --delete-conflicting-outputs
```

Verify the result in `mobile/lib/core/di/injection_container.config.dart`.

To register a new dependency:
1. Annotate the class with `@lazySingleton`, `@LazySingleton(as: Interface)`, or `@injectable`
2. Add constructor parameters for injected dependencies
3. Run `build_runner build`

| Scope | Annotation | Used for |
|---|---|---|
| Lifetime lazy singleton | `@lazySingleton` | Data sources, repository impls, helpers |
| Lifetime lazy singleton (bound) | `@LazySingleton(as: Repo)` | Repository impls bound to abstract interface |
| Factory | `@injectable` | Cubits, use cases |
| Global exception (CartCubit) | `@lazySingleton` | Shared cart state across AppBar + CartScreen |

**DI module file:** `mobile/lib/core/di/register_module.dart`
**Entry point:** `mobile/lib/core/di/injection_container.dart`

---

## Environment Variables Reference

### Web (`web/.env.local`)

| Key | Purpose | Required? |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_APP_URL` | Public base URL (canonical URLs, OG, redirects) | Yes |
| `NODE_ENV` | Runtime environment (`development`/`production`) | Yes |
| `JWT_SECRET` | Access token signing secret (min 32 chars) | Yes |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (min 32 chars) | Yes |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (e.g. `5h`) | No (default: 5h) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) | No (default: 7d) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting | Yes (prod) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token | Yes (prod) |
| `SMTP_HOST` | SMTP server hostname for outbound email | Yes (email features) |
| `SMTP_PORT` | SMTP port (465 for TLS, 587 for STARTTLS) | Yes (email features) |
| `SMTP_SECURE` | `true` for TLS, `false` for STARTTLS | Yes (email features) |
| `SMTP_USER` | SMTP account username | Yes (email features) |
| `SMTP_PASSWORD` | SMTP account password | Yes (email features) |
| `EMAIL_FROM_EMAIL` | From address for outbound email | Yes (email features) |
| `EMAIL_FROM_NAME` | Display name for outbound email | No |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID for R2 | Yes (file uploads) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Yes (file uploads) |
| `R2_ACCESS_KEY_ID` | R2 S3-compatible access key | Yes (file uploads) |
| `R2_SECRET_ACCESS_KEY` | R2 S3-compatible secret key | Yes (file uploads) |
| `R2_BUCKET` | R2 bucket name | Yes (file uploads) |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Yes (file uploads) |
| `CDN_BASE_URL` | Public CDN URL for uploaded assets | Yes (file uploads) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for Web Push | Yes (push notifications) |
| `VAPID_PRIVATE_KEY` | VAPID private key | Yes (push notifications) |
| `VAPID_SUBJECT` | VAPID subject (mailto URI) | Yes (push notifications) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes (payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes (payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes (payments) |
| `PAYMOB_API_KEY` | Paymob API key (Egypt) | No |
| `PAYMOB_INTEGRATION_ID` | Paymob integration ID | No |
| `PAYMOB_IFRAME_ID` | Paymob iframe ID | No |
| `CRON_SECRET` | Secret for cron endpoint authentication | Yes (cron jobs) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | No |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity project ID | No |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Meta Pixel ID | No |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel ID | No |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token | No |
| `NEXT_PUBLIC_APP_STORE_URL` | iOS App Store link (footer badge) | No |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | Google Play link (footer badge) | No |
| `NEXT_PUBLIC_SITE_NAME_AR` | Arabic site name (SEO) | No |
| `NEXT_PUBLIC_SITE_NAME_EN` | English site name (SEO) | No |
| `NEWSLETTER_DIGEST_LOOKBACK_DAYS` | Days to look back on first digest run | No |
| `OPENAI_API_KEY` | OpenAI key for AI description generation | No |
| `FACEBOOK_ACCESS_TOKEN` | Facebook Graph API token for auto-post | No |
| `TWITTER_API_KEY` / `TWITTER_API_SECRET` | Twitter API credentials | No |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_FROM` | WhatsApp via Twilio | No |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHANNEL_ID` | Telegram bot credentials | No |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Sentry error monitoring DSN | No |
| `RATE_LIMIT_AUTH_PER_MINUTE` | Auth endpoint rate limit (default: 10) | No |
| `RATE_LIMIT_API_PER_MINUTE` | General API rate limit (default: 60) | No |
| `RATE_LIMIT_SEARCH_PER_MINUTE` | Search endpoint rate limit (default: 30) | No |

### Mobile

No runtime env file. Use compile-time flags:

| Flag | Purpose | Required? |
|---|---|---|
| `--dart-define=ENVIRONMENT=prod` | Switch API base URL to production | No (default: dev) |

---

## Testing

### Web

**Unit tests (Vitest):**

```bash
cd web
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests live in `web/tests/unit/`. Coverage areas include: auth (JWT sign/verify), markdown processing, email templates, newsletter digest logic, search normalization, image key resolution, form validation, consent management.

**End-to-end tests (Playwright):**

```bash
cd web
npm run test:e2e:setup   # seed fixtures
npm run test:e2e          # run all E2E tests (headless Chromium)
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:cleanup  # remove test data
```

E2E tests live in `web/tests/e2e/`. Coverage includes: public route health, auth flows, admin CRUD operations, publish book cover upload flow, media navigation.

### Mobile

**Unit tests (flutter_test + mocktail):**

```bash
cd mobile
flutter test                              # run all tests
flutter test test/path/to/test_file.dart  # run a single file
```

Tests live in `mobile/test/`. Coverage areas include: data source models (books, articles, publishers), repository implementations, cubits (newsletter, publish, notifications), API envelope parsing, search response models.

> ⚠️ Widget tests are not yet comprehensively implemented beyond the default `widget_test.dart`.

---

## CI/CD

CI is configured for the **web application only** via GitHub Actions (`.github/workflows/ci.yml`).

| Job | What it does | Trigger |
|---|---|---|
| `quality` | TypeScript check, ESLint, Prettier format check | Push/PR to `main` or `develop` |
| `test` | Unit tests with Vitest + coverage (spins up Postgres 16) | After `quality` |
| `e2e` | Playwright tests on Chromium (spins up Postgres 16, seeds, migrates) | After `test` |
| `build` | `npm run build` (Prisma generate + Next.js build) | After `quality`, `test`, `e2e` |

> ⚠️ No CI pipeline is configured for the mobile app. Flutter builds must be triggered manually or via a separate CI setup (e.g. Codemagic, Bitrise, GitHub Actions with Flutter setup).

---

## Deployment

### Web

**Recommended: Docker + Coolify (or any Docker host)**

1. Build the image:
   ```bash
   cd web
   docker build -t books-platform-web .
   ```
2. Set all required environment variables on the host / Coolify service
3. Run migrations before starting the container:
   ```bash
   npx prisma migrate deploy
   ```
4. The container exposes port `3000` internally. Reverse proxy (Caddy/Nginx via Coolify) handles TLS.

The `Dockerfile` uses a **3-stage multi-stage build** (deps → builder → runner) on `node:20-bookworm-slim`. The runner image uses Next.js `standalone` output mode and runs as a non-root `nextjs` user. `tini` is used as PID 1.

`docker-compose.yml` targets Coolify deployments where the reverse proxy handles host-port binding.

### Mobile

- **Android APK:** `flutter build apk --dart-define=ENVIRONMENT=prod` → `build/app/outputs/flutter-apk/app-release.apk`
- **Android App Bundle:** `flutter build appbundle --dart-define=ENVIRONMENT=prod`
- **iOS:** `flutter build ios --dart-define=ENVIRONMENT=prod` → archive + distribute via Xcode or Transporter

---

## Contributing

### Branch naming (detected from git history)

```
feat/<short-description>   # new feature
fix/<short-description>    # bug fix
chore/<short-description>  # tooling, config, non-functional
refactor/<short-description>
docs/<short-description>
```

### Commit convention (commitlint — Conventional Commits)

```
feat: add TTS player to book detail screen
fix: resolve audio playback state reset on screen exit
chore: update dependencies
```

### Pull request process

1. Branch from `main`
2. Open a PR against `main` or `develop`
3. CI must pass all jobs (quality, tests, e2e, build) before merge
4. PRs should use the `.github/PULL_REQUEST_TEMPLATE.md` template

### After adding `@injectable` classes (mobile)

Always run:
```bash
cd mobile
dart run build_runner build --delete-conflicting-outputs
```
Verify the generated class appears in `lib/core/di/injection_container.config.dart`.

---

## Known Limitations / TODO

| Area | Item |
|---|---|
| Mobile — push notifications | Firebase FCM is commented out in `pubspec.yaml`. Requires adding `google-services.json` (Android), `GoogleService-Info.plist` (iOS), and calling `Firebase.initializeApp()` |
| Mobile — push notifications | Backend endpoint `POST /notifications/mobile/subscribe` is not yet implemented |
| Mobile — article audio | Audio URL format for article audio player is not yet confirmed with the backend (`article_detail_audio_player.dart`) |
| Mobile — file upload | Cover image and manuscript upload in the publish flow are not integrated (blocked on backend S3/UploadThing endpoint) |
| Web — payments | Stripe and Paymob integration code is wired at the API layer; end-to-end checkout flow requires platform account configuration |
| Web — social auto-post | Facebook, Twitter, Instagram auto-post is env-configured but untested in the current deployment |
| Web — WhatsApp | Twilio WhatsApp integration is env-configured but not verified end-to-end |
| Web — Telegram | Telegram bot integration is env-configured but not verified end-to-end |
| CI — mobile | No CI pipeline exists for the Flutter mobile app |

---

## License

No license file detected — treat as **unlicensed / proprietary**. All rights reserved.
