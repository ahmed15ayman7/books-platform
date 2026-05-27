#!/bin/sh
# Build Next.js inside Docker without putting secrets in Dockerfile ENV substitutions
# (DATABASE_URL passwords often contain $, @, : which break or leak across ENV keys).
set -eu

export DATABASE_URL="${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/build}"

if [ -z "${NEXT_PUBLIC_APP_URL:-}" ]; then
  if [ -n "${SERVICE_FQDN_WEB:-}" ]; then
    export NEXT_PUBLIC_APP_URL="https://${SERVICE_FQDN_WEB}"
  elif [ -n "${COOLIFY_FQDN:-}" ]; then
    export NEXT_PUBLIC_APP_URL="https://${COOLIFY_FQDN}"
  else
    export NEXT_PUBLIC_APP_URL="http://localhost:3000"
  fi
fi

exec npm run build
