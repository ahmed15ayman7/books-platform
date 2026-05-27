# syntax=docker/dockerfile:1

# Debian slim + OpenSSL for Prisma (PostgreSQL client)
FROM node:20-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates tini \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
ENV NODE_ENV=development
ENV HUSKY=0
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0
ENV NODE_ENV=production

# Coolify injects ARGs per stage; promote build-args to ENV for Next.js + Prisma.
ENV DATABASE_URL=${DATABASE_URL} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    SERVICE_FQDN_WEB=${SERVICE_FQDN_WEB} \
    COOLIFY_FQDN=${COOLIFY_FQDN} \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY} \
    NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY} \
    NEXT_PUBLIC_POSTHOG_HOST=${NEXT_PUBLIC_POSTHOG_HOST} \
    NEXT_PUBLIC_CLARITY_PROJECT_ID=${NEXT_PUBLIC_CLARITY_PROJECT_ID} \
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID=${NEXT_PUBLIC_FACEBOOK_PIXEL_ID} \
    NEXT_PUBLIC_TIKTOK_PIXEL_ID=${NEXT_PUBLIC_TIKTOK_PIXEL_ID} \
    NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN} \
    NEXT_PUBLIC_OG_IMAGE=${NEXT_PUBLIC_OG_IMAGE} \
    NEXT_PUBLIC_SITE_NAME_AR=${NEXT_PUBLIC_SITE_NAME_AR} \
    NEXT_PUBLIC_SITE_NAME_EN=${NEXT_PUBLIC_SITE_NAME_EN} \
    NEXT_PUBLIC_SITE_TAGLINE_AR=${NEXT_PUBLIC_SITE_TAGLINE_AR} \
    NEXT_PUBLIC_SITE_TAGLINE_EN=${NEXT_PUBLIC_SITE_TAGLINE_EN} \
    NEXT_PUBLIC_TWITTER_HANDLE=${NEXT_PUBLIC_TWITTER_HANDLE} \
    NEXT_PUBLIC_FACEBOOK_APP_ID=${NEXT_PUBLIC_FACEBOOK_APP_ID}

RUN set -eux; \
    if [ -z "${DATABASE_URL}" ]; then \
      export DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"; \
    fi; \
    if [ -z "${NEXT_PUBLIC_APP_URL}" ]; then \
      if [ -n "${SERVICE_FQDN_WEB}" ]; then \
        export NEXT_PUBLIC_APP_URL="https://${SERVICE_FQDN_WEB}"; \
      elif [ -n "${COOLIFY_FQDN}" ]; then \
        export NEXT_PUBLIC_APP_URL="https://${COOLIFY_FQDN}"; \
      else \
        export NEXT_PUBLIC_APP_URL="http://localhost:3000"; \
      fi; \
    fi; \
    npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
