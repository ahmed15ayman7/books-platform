# Books Platform — Web App

منصة الكتب العالمية — Next.js 16 fullstack application.

## Tech Stack

- **Framework:** Next.js 16.2 (App Router, TypeScript strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM v7
- **Auth:** JWT (Access 15min + Refresh 7d HTTP-only cookie)
- **i18n:** next-intl (Arabic RTL + English LTR)
- **Testing:** Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local Postgres + Redis)
- npm

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Start Database

```bash
docker-compose up -d
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Database

```bash
npm run db:seed
```

### 6. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar`.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (0 warnings allowed) |
| `npm run format` | Prettier format |
| `npm run type-check` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run analyze` | Bundle analyzer |

---

## Project Structure

```
web/
├── app/
│   ├── [locale]/
│   │   ├── (public)/         # Public-facing pages
│   │   ├── (admin)/          # Admin panel (protected)
│   │   └── (ambassador)/     # Ambassador dashboard
│   ├── api/v1/               # API Route Handlers
│   └── globals.css           # Brand design tokens
├── components/
│   ├── ui/                   # shadcn + custom brand components
│   ├── sections/             # Page section components
│   ├── forms/                # RHF + zod forms
│   └── admin/                # Admin-specific components
├── lib/
│   ├── auth/                 # JWT utilities
│   ├── db/                   # Prisma client singleton
│   ├── i18n/                 # next-intl config
│   ├── validation/           # Zod schemas
│   └── utils/                # Helpers, formatters, constants
├── server/
│   ├── services/             # Business logic
│   ├── jobs/                 # Cron jobs
│   └── integrations/         # Resend, web-push, payments
├── prisma/
│   ├── schema.prisma         # Full DB schema (30+ models)
│   └── seed.ts               # Database seed
├── messages/
│   ├── ar.json               # Arabic translations
│   └── en.json               # English translations
└── tests/
    ├── unit/                 # Vitest tests
    ├── integration/          # API tests
    └── e2e/                  # Playwright tests
```

---

## Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-red` | `#B11E2E` | Primary accent (CTAs, headings, icons) |
| `--brand-black` | `#0B0B0B` | Header, Footer, dark sections |
| `--brand-white` | `#FFFFFF` | Content backgrounds, text on dark |

---

## Default Admin Credentials (Dev Only)

```
Email:    admin@booksplatform.net
Password: Admin@123456
```

**⚠️ Change these before any production deployment.**

---

## API Documentation

See [`../api-docs.md`](../api-docs.md) for complete API reference including Flutter integration guide.

## Project Plan

See [`../project-plan.md`](../project-plan.md) for implementation progress and module status.
