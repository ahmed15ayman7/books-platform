# Session Handoff — 2026-07-14

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Continues `010-2026-07-13-notification-permission-flow-fixes.md` in this same folder.
> Branch: `debug/push-notifications-e2e` (still nothing committed — all changes below are
> uncommitted working-tree changes in `/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/mobile`).

## What Was Done

1. **Implemented the fix for bug #3 from the previous handoff** (`FcmService.getToken()` throwing
   uncaught `apns-token-not-set` on iOS) — see `lib/features/notifications/services/fcm_service.dart:75-99`.
   Catches `FirebaseException` with `code == 'apns-token-not-set'`, and only on iOS, falls back to
   awaiting `FirebaseMessaging.instance.onTokenRefresh.first` with a timeout (originally 10s, bumped
   to **25s** after real-device evidence — see Bugs Found #1). `flutter analyze` clean.
2. **Added temporary `[FCM DEBUG]` debugPrint statements** in both `notification_settings_cubit.dart`
   (`togglePush`) and `fcm_service.dart` (`getToken`) to trace exact execution path on real devices —
   these are still in the code, uncommitted, and should be removed once the iOS issue is resolved.
3. **Discovered and fixed a completely separate, critical bug**: the production database was missing
   the entire `fcm_tokens` table — see Bugs Found #2. This, not the mobile code, was the actual reason
   "create book → no notification" was failing every single time, and also fully explains why bug #3's
   fix couldn't be verified working even after being applied (the backend write had nowhere to land).
4. **Verified the `fcm_tokens` table fix works end-to-end on Android**: fresh install → toggle
   notifications → `getToken()` succeeds directly (no APNs concept on Android) → `POST
   /notifications/mobile/subscribe` → `200 OK` → confirmed via direct DB query that real rows exist
   (3 active Android tokens as of session end, ids `cmrk9dmva...`, `cmrk9hnk7...`, `cmrk9w1h6...`).
5. **iOS still fails**, but now with clean, conclusive evidence rather than a guess — see Bugs Found #1.
   `getToken()` throws `apns-token-not-set`, the fallback correctly kicks in, but `onTokenRefresh` does
   not fire within the timeout window on this real device in **debug** build mode, both times tested.
6. **Root-caused why "book created → no notification" was untraceable server-side**: the
   book-create/update auto-trigger (`app/api/v1/admin/books/route.ts:126`,
   `app/api/v1/admin/books/[id]/route.ts:88`) does **not** write to the `notification_logs` table at
   all — confirmed via grep, only the manual broadcast/send endpoints do. So even with the DB fix,
   there is still no visibility into whether a book-create send actually succeeded server-side, short
   of reading raw Coolify/Docker logs. This is now the main open thread for the next session (see
   Pending Tasks).
7. **Set up direct SSH root access to the production server** (`49.13.218.137`, hostname
   `books-platform-vps`) for this Claude session, at the user's explicit request and confirmation.
   See "Server Access" section below — this access likely still exists at the start of the new
   session unless the user has revoked it.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | **(Open)** On iOS real device (debug build via `flutter run`), `onTokenRefresh` does not fire within the fallback timeout after `getToken()` throws `apns-token-not-set` — tested twice, timed out both times at the original 10s. Timeout has been bumped to 25s (uncommitted) but **not yet retested**. | High — iOS push registration still completely non-functional | `lib/features/notifications/services/fcm_service.dart:75-99` | Two consecutive real-device console captures, both showing `getToken() threw ... apns-token-not-set` → `falling back to onTokenRefresh.first` → `TIMED OUT`. Full traces preserved in conversation history if needed. |
| 2 | **(Fixed this session)** Production database (`postgres://...@49.13.218.137:5433/postgres`) was completely missing the `fcm_tokens` table — the table Prisma's `FcmToken` model maps to (`@@map("fcm_tokens")`, `prisma/schema.prisma:721-739`). Confirmed via `prisma migrate diff` (the *only* drift between schema and live DB — no other tables/columns missing). Also confirmed via `_prisma_migrations`: last applied migration was `20260619180557_add_newsletter_preferences`, nothing FCM-related ever deployed. This repo has **no `prisma/migrations/` folder checked in at all** — schema sync isn't happening via versioned migrations here, which is *why* this was never caught. | Was Critical, now Fixed | DB schema, no local migrations folder | Applied the exact `CREATE TABLE`/`CREATE INDEX` SQL Prisma generated, directly via a one-off Postgres connection (see Server/DB Access). Re-ran `prisma migrate diff --exit-code` after → confirmed empty diff (fully in sync). |
| 3 | **(Open, not yet fixed, lower priority)** `sendMobileNotification` in `app/api/v1/admin/books/route.ts:126` and `[id]/route.ts:88` is fire-and-forget with only `.catch((err) => console.error('[FCM book create send failed]', err))` — no success logging at all, and does not write to `notification_logs`. This means there is currently **zero server-side visibility** into whether a book-create notification send succeeded, short of reading raw container logs. | Medium — pure observability gap, not a functional bug per se | `app/api/v1/admin/books/route.ts:126`, `app/api/v1/admin/books/[id]/route.ts:88` | Confirmed via grep — `notificationLog` is only referenced in `admin/settings/notifications/route.ts`, `admin/notifications/mobile/send/route.ts`, `admin/notifications/broadcast/route.ts`, `lib/email/mailer.ts`, `lib/email/newsletter-digest.ts` — **not** in either books route. |
| 4 | **(Open, flagged, not investigated)** The Notification Settings screen has no `BlocListener`/`BlocConsumer` for `NotificationSettingsError` — only a `BlocBuilder` for `NotificationSettingsLoaded` (`lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart:56-73`). This means if `registerFcmToken` ever fails server-side, the toggle silently shows ON with no error shown to the user — this was the mechanism behind "toggle succeeded silently" reported earlier in the session, independent of the DB table bug. | Medium — real UX gap, not yet fixed | `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart` | Confirmed by reading the screen file — no listener wired for the error state at all. |

## Files Changed (uncommitted, on `debug/push-notifications-e2e`)

| File | Change | Why |
|---|---|---|
| `lib/features/notifications/services/fcm_service.dart` | Added `dart:async` import; `getToken()` now catches `apns-token-not-set` on iOS and falls back to `onTokenRefresh.first.timeout(25s)`; added `[FCM DEBUG]` debugPrint traces throughout | Bug #3 fix from previous session + this session's timeout bump + debug tracing |
| `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` | Added `flutter/foundation.dart` import; added `[FCM DEBUG]` debugPrint traces in `togglePush()` at each branch | Debug tracing to diagnose real-device behavior |

**Not a mobile-repo change**, but also uncommitted/unversioned: the production database schema now
has the `fcm_tokens` table (see Bugs Found #2) — this was applied directly via SQL, not through any
migration file in either repo, since this project doesn't use versioned Prisma migrations. **Worth
deciding with the user whether to retroactively create a proper migration file for `web/prisma/` to
document this, even if applied out-of-band.**

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/core/network/dio_factory.dart`, `lib/core/network/api_manager.dart` | Whether `pretty_dio_logger` would show the `/notifications/mobile/subscribe` call | Confirmed yes — single shared `Dio` instance for the whole app, `PrettyDioLogger` attached in debug mode, `NotificationsRemoteDataSource` goes through the same `ApiManager`/`Dio`. Ruled out "logger doesn't cover this call" as an explanation for missing evidence. |
| `lib/features/notifications/data/datasources/notifications_remote_data_source.dart` | Payload shape sent to `/notifications/mobile/subscribe` (`token`, `platform`, `locale`, `topics`) | Matches backend `subscribeSchema` in `web/app/api/v1/notifications/mobile/subscribe/route.ts` exactly — not a payload mismatch bug. |
| `web/app/api/v1/notifications/mobile/subscribe/route.ts` | Whether it fakes success or silently swallows errors | No — returns real `ApiErrors.badRequest`/`ApiErrors.internal()` on failure, proper `db.fcmToken.upsert` on success. Correctly implemented; the table just didn't exist. |
| `web/lib/firebase/messaging.ts` | Whether the backend sends data-only or full notification+data payload | Full `notification: {title, body}` **and** `data: {...}` — not data-only. This ruled out an earlier hypothesis that `_firebaseBackgroundHandler` (which only calls `Firebase.initializeApp()`, never shows a notification) was the cause of missing background-state notifications — OS auto-displays notification-payload pushes regardless of that handler. |
| `web/app/api/v1/admin/books/route.ts` | `published` default on book creation | `z.boolean().default(true)` — a normal admin "create book" does trigger the notification path by default, not blocked by an unset flag. |
| Full `prisma migrate diff` between live prod DB and `web/prisma/schema.prisma` | Any other schema drift beyond `fcm_tokens` | None — `fcm_tokens` was the only gap, confirmed via `--exit-code` returning 0 (empty diff) after the fix was applied. |

## Pending Tasks

- [ ] **Retest iOS with the 25s timeout** — the timeout bump is in place but has not yet been verified on a real device. Run `flutter run` (or `--profile`), toggle notifications on iOS, and check the `[FCM DEBUG]` console lines: does `onTokenRefresh` succeed within 25s now, and if so how long does it actually take?
- [ ] **Test on a TestFlight/Ad Hoc release build**, not just `flutter run`/`--profile`. This matters specifically because debug and profile builds both carry the `aps-environment: development` entitlement (routes through Apple's *sandbox* APNs), while only a properly archived build gets `aps-environment: production`. Timing and reliability may differ meaningfully between the two environments — a debug-mode timeout tuned in isolation may not reflect production reality.
- [ ] **Investigate server-side observability gap (Bugs Found #3)** — decide whether to add logging (console or `notification_logs` writes) to the book create/update `sendMobileNotification` call sites so future "no notification" reports can be diagnosed without needing raw server log access. **This requires a backend code change and a push to `main`** (or whatever branch triggers deploy) — do not push without explicit user confirmation, per their standing instruction this session that backend `main` pushes go live immediately.
- [ ] **Fix the missing `BlocListener` for `NotificationSettingsError`** (Bugs Found #4) in `notification_settings_screen.dart` so registration failures are actually visible to the user instead of silently showing an ON toggle. Not yet discussed with the user whether this is in scope for the next session — ask first.
- [ ] **Once iOS is confirmed working**, remove all `[FCM DEBUG]` debugPrint statements from both `fcm_service.dart` and `notification_settings_cubit.dart` before considering this done.
- [ ] **Decide whether to retroactively document the `fcm_tokens` table creation as a proper Prisma migration** in `web/prisma/`, since it was applied directly via SQL outside any migration file — flagged above, not yet discussed with the user.
- [ ] **Commit strategy** — nothing has been committed on `debug/push-notifications-e2e` across this entire multi-session thread. Once iOS is verified and debug prints are removed, decide with the user how to structure commits (one per fix vs. squashed) and whether/when to push.
- [ ] **Standing `onTokenRefresh` listener** for future token-rotation re-registration — flagged in the previous session's handoff, explicitly deferred by the user ("defer to a follow-up"), still not implemented. Revisit once the current iOS issue is resolved.
- [ ] **Revoke or confirm the temporary SSH access** set up this session (see Server Access below) once no longer needed, or leave it if the user wants it to persist across sessions — their call, not yet discussed explicitly beyond initial setup.

## What's Next (ordered)

1. Retest iOS with the 25s timeout via `flutter run --profile` first (fast, rules out debug-mode Dart overhead) — check the `[FCM DEBUG]` trace for actual timing.
2. If still failing/timing out, use the now-established SSH server access to pull `docker logs` for the `books-platform` web container directly (was in progress at session end — command was about to run `docker ps` to find the exact container name, e.g. something like `web-q9vnuussumtcsfv4bzjxzxoq-...`) to cross-reference server-side timing/errors against the client-side timeout.
3. Once `--profile` result is known, decide whether a TestFlight build test is still needed before considering iOS done (see Pending Tasks — likely yes regardless, since debug/profile both use sandbox APNs).
4. Address the `notification_logs` observability gap (Bugs Found #3) — ask user whether in scope now or deferred, given it requires a backend `main` push.
5. Clean up debug prints and decide on commit/push strategy for the whole branch.

## Key References

- `doc/handoffs/009-ios-appstore-rejection-fix/010-2026-07-13-notification-permission-flow-fixes.md` — immediately prior session, defines bug #3 (the original `apns-token-not-set` bug) that this session's initial fix addressed.
- `doc/handoffs/009-ios-appstore-rejection-fix/004-2026-06-28-push-notifications-start.md` through `009-2026-06-30-gradle-fixed-notif-entry-wired.md` — original FCM implementation history.
- `mobile/CLAUDE.md`, `mobile/.claude/rules/flutter_feature_prompt.md` — architecture rules followed this session.
- `web/prisma/schema.prisma:702-739` — `NotificationLog` and `FcmToken` model definitions.

## Server / DB Access

**Production Postgres** (same VPS as below): `postgres://postgres:<password>@49.13.218.137:5433/postgres`
— the password was shared in this session's chat history in plaintext. **Recommend rotating this
credential** when convenient; not urgent enough to block work, per user's own earlier acknowledgment
of this tradeoff in a prior session too.

**Production server SSH**: root access to `49.13.218.137` (hostname `books-platform-vps`) was set up
this session via a fresh SSH keypair generated specifically for this Claude session, at the user's
explicit request. The public key was appended to `root`'s `~/.ssh/authorized_keys` on the host (added
via Coolify's **Terminal** tab → selecting the plain `localhost` entry, which connects to the host
itself rather than any individual container — the per-app "Terminal" tab and the "localhost -> <container>"
entries in the team-level Terminal page both connect *inside* Docker containers instead, which do not
have the permissions or persistence needed for this). Connection was verified working
(`whoami` → `root`, `hostname` → `books-platform-vps`) at the end of this session, but the next
command (`docker ps` to enumerate containers) was interrupted by the user right as this handoff was
requested — **not yet run**.

The private key lives in this session's scratchpad directory (session-specific, will not persist to a
new session): `coolify_session_key` / `coolify_session_key.pub`. **A new session will need to either
regenerate a new keypair (if the user wants to grant fresh access again) or ask the user whether the
existing `authorized_keys` entry should be reused/removed.** To revoke: remove the
`claude-session-temp-access` line from `root@49.13.218.137:~/.ssh/authorized_keys`.

**Coolify app config** (for reference): the `books-platform` web app is Docker Compose–based, base
directory `/web`, container name pattern `web-q9vnuussumtcsfv4bzjxzxoq-<timestamp>`, domain
`https://booksplatform.net`, `NODE_ENV: production` set in the compose file.

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should the standing `onTokenRefresh` listener (token-rotation re-registration) be in scope for this session? | Deferred to a follow-up (from previous session, reconfirmed applicable here) |
| Which database is the app actually using — "postgresql-database-final-data" or the other Coolify Postgres resource? | User provided the `DATABASE_URL` directly rather than guessing from Coolify resource names; confirmed live via matching a real-time book creation timestamp |
| Is it OK to update the live production database directly? | Yes, explicit approval given |
| Should Claude check whether anything else in the schema is missing from prod first? | Yes, requested explicitly — done via `prisma migrate diff`, confirmed `fcm_tokens` was the only gap |
| Will backend code changes pushed to `main` deploy immediately? | Yes, confirmed by user — must get explicit sign-off before any backend push, not just DB changes |
| How should Claude get direct access to check server-side (Coolify) logs? | User explicitly asked Claude to set up direct SSH access rather than relay copy-pasted logs; this was initially blocked by an auto-mode safety classifier requiring more explicit confirmation, which the user then gave explicitly |
| Which Coolify Terminal option connects to the actual host vs. a container? | Resolved through trial: per-app "Terminal" tab and "localhost -> <container-name>" entries in the team-level Terminal page both connect inside Docker containers (confirmed via `whoami` → `nextjs`, permission denied on home dir); the plain `localhost` entry (no arrow) connects to the actual host (confirmed via `whoami` → `root`, `hostname` → `books-platform-vps`) |

## Notes

- User tests personally on real devices (iPhone for iOS, an Android device — Android console showed
  `CPH1911`) rather than delegating to simulator/emulator testing, consistent with prior sessions.
- User continues to want to be walked through *why*, not just *what* — this session included a fair
  amount of "here's what I got wrong in my original assumption" transparency (specifically: the
  `onTokenRefresh` fallback wasn't actually independent of the APNs delay the way it was originally
  framed) rather than silently patching. Keep this pattern in the new session.
- This session involved handling two separate plaintext production credentials pasted into chat (DB
  password, implicitly the SSH key situation though that's a keypair Claude generated, not a pasted
  secret). Worth a gentle, non-blocking reminder about credential hygiene if it comes up again, same
  as flagged in the previous session's handoff.
- The `docker ps` command to enumerate containers on the VPS was queued up and about to run when this
  session ended — that's the literal next action once server-log investigation resumes.
