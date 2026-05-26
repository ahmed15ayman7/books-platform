# ADR 0001 — Technology Stack

**Date:** May 2026  
**Status:** Accepted

## Context

Building a bilingual (Arabic/English) books platform that needs to serve as a content-first website with e-commerce, admin panel, and mobile API integration (Flutter).

## Decision

**Framework:** Next.js 16 (App Router)  
**Database:** PostgreSQL + Prisma ORM v7  
**Styling:** Tailwind CSS v4 + shadcn/ui  
**i18n:** next-intl  
**Auth:** JWT (jose) — Access + Refresh Token  
**State:** Zustand (client) + TanStack Query (server state)

## Rationale

- Next.js App Router provides SSR/SSG/Server Components which is critical for SEO on a content-heavy platform
- Tailwind v4 + CSS variables gives us a clean Design System that matches the brand
- next-intl is the most mature i18n solution for Next.js App Router with full RTL support
- Prisma v7 with PG adapter works cleanly with Vercel/Neon deployment targets
- JWT provides stateless auth compatible with both web and mobile (Flutter) clients

## Consequences

- Must use `--legacy-peer-deps` during npm install due to some packages not yet updated for React 19
- Prisma v7 no longer supports `url` in schema — connection managed via `prisma.config.ts`
- Tailwind v4 uses CSS-first configuration (no need for a separate JS config for colors — we use CSS variables)
