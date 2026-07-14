# Session Handoff — 2026-07-14 (part 2)

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Continues `011-2026-07-14-fcm-android-working-ios-timeout-server-access.md` in this same folder
> (same calendar day, direct continuation — that file covered the morning session; this covers the
> afternoon session where Android was fully fixed end-to-end).
> Branch: `debug/push-notifications-e2e` (still nothing committed on this branch — all mobile-repo
> changes below are uncommitted working-tree changes in
> `/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/mobile`). **Backend fixes in this session
> were committed and pushed directly to `main`** (see Files Changed) — this is the one exception to
> "nothing committed," and was done deliberately, isolated from the debug branch's other uncommitted
> work, per explicit user instruction each time.

## What Was Done

1. **Reconnected to production SSH access** from the previous session — the private key had not
   persisted into this new session's scratchpad (expected, session-specific), but the *previous*
   session's scratchpad directory still existed on disk at
   `/private/tmp/claude-501/.../5cb74783-b727-4115-9bd0-df7fb7f5cc46/scratchpad/coolify_session_key`,
   and the corresponding public key was still in the server's `authorized_keys` (never revoked).
   Connection verified working (`whoami` → `root`, `hostname` → `books-platform-vps`).
2. **Retested iOS with the 25s `onTokenRefresh` timeout** (from previous session's fix) via
   `flutter run --profile` on the real device. **Still timed out** — third consecutive failure
   (2× at 10s in debug mode previously, now 1× at 25s in profile mode). Ruled out server-side cause
   (zero FCM/subscribe activity in server logs during/after the test) and ruled out OS-level
   permission issues (device Settings → Notifications → Allow Notifications: ON; Background App
   Refresh: ON for the app). This narrows the iOS issue specifically to sandbox APNs unreliability —
   see Bugs Found #1 (carried over, still open).
3. **User redirected focus to Android**, reporting that despite the "confirmed working" status from
   the previous session (which only verified token registration — the subscribe API call), **no
   push notification was ever actually received on the device when a book was published.** This
   triggered a full re-investigation of the send path, which the previous session's Bugs Found #3
   had already flagged as a visibility gap but not fully diagnosed.
4. **Added server-side `[FCM DEBUG]` tracing** (per explicit user request — "we added debug prints
   to Flutter but never to the backend, that's why we can't see anything") to
   `web/app/api/v1/admin/books/route.ts`, `web/app/api/v1/admin/books/[id]/route.ts`, and
   `web/server/services/fcm.service.ts`. Committed directly to `main` as `ec85507` and deployed
   (Coolify auto-deploys on push to `main` — confirmed by user). This was step 1 and, on its own,
   **did not surface anything** — see Bugs Found #2 for why.
5. **Discovered the real root cause**: the admin **web dashboard** (the actual UI the user uses to
   publish books) does not call the REST API route at `app/api/v1/admin/books/route.ts` at all. It
   calls Server Actions `createBook`/`updateBook` in
   `app/[locale]/(admin)/admin/books/[id]/edit/actions.ts`, confirmed via
   `book-edit-form.tsx:8,237,257`. **That file had zero reference to `sendMobileNotification`
   anywhere** — the notification send was never being attempted from the code path actually used in
   production, regardless of the `published` flag. This is why the previous session's "book create →
   no notification" investigation and this session's initial debug-logging deploy both showed
   nothing: the instrumented code path was simply never executed.
6. **Fixed this** by porting the same `sendMobileNotification` logic (with `[FCM DEBUG]` tracing)
   into both `createBook` and `updateBook` in `actions.ts`, mirroring the REST route's conditions
   (`book.published` for create; the existing `shouldBoostPosition` computation for update — already
   present in that file for position-boosting logic, reused as the "just got published" signal).
   Committed directly to `main` as `15903c3`, deployed.
7. **After deploy, a live test surfaced a second, unrelated, deeper bug**: `sendFcmToTokens` threw
   `Error: Failed to parse private key: Error: error:1E08010C:DECODER routines::unsupported`, with
   `errorInfo.code: 'app/invalid-credential'`. This is Firebase Admin SDK's standard error for a
   malformed PEM private key — **the `FIREBASE_PRIVATE_KEY` environment variable stored in Coolify
   was corrupted**, almost certainly from how it was originally pasted into Coolify's env var UI
   (escaping/newline mangling). This had presumably been broken since the credential was first set —
   meaning **no FCM send had ever actually succeeded**, on any platform, at any point in this
   project's history, until fixed in this session.
8. **Fixed the credential**: validated a fresh Firebase service account JSON at
   `/Users/youssefemadeldin.ai/Downloads/books-platform-9cfbb-firebase-adminsdk-fbsvc-888927ae82.json`
   (confirmed valid PEM structure locally via Python, without printing the key value). Located
   Coolify's actual on-disk env file for this app at
   `/data/coolify/applications/q9vnuussumtcsfv4bzjxzxoq/.env` (confirmed this is a **generated
   artifact**, rewritten from Coolify's internal database on every UI-triggered deploy — timestamp
   matched the last deploy exactly). Generated the correctly-escaped single-line value locally,
   transferred it to the server via `scp` (file-based, never as a shell argument, to avoid shell
   history exposure), and replaced the `FIREBASE_PRIVATE_KEY=` line via a Python script reading from
   that file (again avoiding printing the secret to any transcript or shell history). Recreated the
   container via `docker compose -p q9vnuussumtcsfv4bzjxzxoq up -d --force-recreate` to pick up the
   corrected env (a plain `docker restart` would not have reloaded env vars).
9. **Verified end-to-end on Android, live in production**: published a test book →
   `[FCM DEBUG] createBook — published=true` → token lookup found 3 registered tokens →
   `sendFcmToTokens` result `successCount: 1, failureCount: 2` → the 2 failing tokens were correctly
   identified as stale/invalid by Firebase and auto-deactivated (`isActive: false`) by the existing
   `fcm.service.ts` logic → **user confirmed receiving the actual push notification on their Android
   device.** This is the first confirmed successful FCM send in the project's history.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | **(Open, carried over from `011-...md`)** On iOS real device, `onTokenRefresh` does not fire within 25s after `getToken()` throws `apns-token-not-set` — retested this session in `--profile` mode, still timed out. Server-side and OS-permission causes both ruled out this session. Points at sandbox-APNs unreliability, which only a TestFlight build (production APNs entitlement) can confirm/deny. | High — iOS push still completely non-functional | `lib/features/notifications/services/fcm_service.dart:75-103` | Clean instrumented trace: `getToken() threw apns-token-not-set` → `falling back to onTokenRefresh.first (25s timeout)` → `onTokenRefresh fallback TIMED OUT after 25s` → `getToken() returned: null`. Zero server-side FCM/subscribe activity during the test window (confirmed via `docker logs`). Device Notification permission and Background App Refresh both confirmed ON via screenshots. |
| 2 | **(Fixed this session)** Admin dashboard's book create/edit form (`book-edit-form.tsx`) calls Server Actions `createBook`/`updateBook` in `app/[locale]/(admin)/admin/books/[id]/edit/actions.ts` — **not** the REST API route `app/api/v1/admin/books/route.ts`, which was the only place `sendMobileNotification` was ever called. The Server Actions had zero FCM logic. This meant no notification was ever attempted from the actual UI the user uses, regardless of `published` state, silently, for the entire project history. | Was Critical, now Fixed | `web/app/[locale]/(admin)/admin/books/[id]/edit/actions.ts` (fix); `web/app/api/v1/admin/books/route.ts` (the now-effectively-dead code path that was originally instrumented/assumed to be the live one) | Confirmed via `grep -rn "createBook\|updateBook"` across the admin books UI — only `book-edit-form.tsx` imports/calls them, at lines 8, 237, 257. Confirmed via direct production log tailing during a real publish through the UI: zero `[FCM DEBUG]` output at all from the REST route, even after deploying debug logging to it. |
| 3 | **(Fixed this session)** `FIREBASE_PRIVATE_KEY` in Coolify's stored env config for the `books-platform` web app was a corrupted/malformed PEM value. Firebase Admin SDK could not authenticate at all — `sendFcmToTokens` threw `FirebaseAppError: app/invalid-credential — Failed to parse private key: Error: error:1E08010C:DECODER routines::unsupported` on every call, unconditionally, regardless of which code path invoked it. This had presumably been broken since the credential was first configured — meaning **zero FCM sends had ever succeeded**, on either platform, before this session, independent of bug #2 above. | Was Critical, now Fixed | Coolify env var storage (source of truth: internal DB, not directly inspected); generated artifact at `/data/coolify/applications/q9vnuussumtcsfv4bzjxzxoq/.env` on the VPS | `errorInfo.code: 'app/invalid-credential'` in production logs, captured live during a test send immediately after bug #2's fix was deployed. Root Firebase service account JSON validated locally as structurally correct (proper PEM markers, 28 newlines, matches expected RSA-2048 PKCS8 length) — confirming the corruption happened specifically in how the value was entered into Coolify, not in the source credential file. |
| 4 | **(Open, not yet fixed)** `notification_logs` observability gap from previous handoff — now partially superseded by the `[FCM DEBUG]` console tracing added this session, but that tracing is still only visible via raw `docker logs`, not queryable/persisted anywhere. Worth reconsidering whether to also write these attempts to the `notification_logs` table now that the send path is confirmed working, so future issues are diagnosable without SSH access. | Low-Medium — nice-to-have now that the critical bugs are fixed | `web/server/services/fcm.service.ts`, `web/app/[locale]/(admin)/admin/books/[id]/edit/actions.ts` | Not re-investigated this session beyond adding console logging; carried over from `011-...md` Bugs Found #3. |
| 5 | **(Open, flagged previously, not investigated this session)** Notification Settings screen has no `BlocListener`/`BlocConsumer` for `NotificationSettingsError` — silent failure on the client if `registerFcmToken` ever fails server-side. Carried over unchanged from `011-...md` Bugs Found #4. | Medium — real UX gap | `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart:56-73` | Unchanged from previous session's finding. |

## Files Changed

| File | Change | Why | Committed? |
|---|---|---|---|
| `web/app/[locale]/(admin)/admin/books/[id]/edit/actions.ts` | Added `sendMobileNotification` call + `[FCM DEBUG]` tracing to both `createBook` (on `book.published`) and `updateBook` (on `shouldBoostPosition`) | **The actual fix** — this is the code path the admin UI really uses | Yes — commit `15903c3` on `main`, pushed and deployed |
| `web/app/api/v1/admin/books/route.ts` | Added `[FCM DEBUG]` tracing around the existing `sendMobileNotification` call (create path) | First debug-logging pass, before the real bug (#2 above) was found. This route now appears to be a dead/unused code path for book creation — **worth confirming with the user whether anything else still calls it**, or whether it should be removed/redirected to call the same logic as `actions.ts` for consistency | Yes — commit `ec85507` on `main`, pushed and deployed (superseded in importance by the actions.ts fix, but harmless to leave in place) |
| `web/app/api/v1/admin/books/[id]/route.ts` | Added `[FCM DEBUG]` tracing around the existing `sendMobileNotification` call (update path) | Same as above | Yes — commit `ec85507` on `main` |
| `web/server/services/fcm.service.ts` | Added `[FCM DEBUG]` tracing: token lookup count, raw `sendFcmToTokens` result, invalid-token deactivation | Core visibility fix — this is what actually let us see the private-key error and then the final success | Yes — commit `ec85507` on `main` |
| `lib/features/notifications/services/fcm_service.dart` | Added explicit, proactive Android notification channel creation (`books_platform_channel`) inside `_initLocalNotifications()`, using `AndroidNotificationChannel` + `createNotificationChannel()` | **Investigated as a hypothesis this session** — Android 8+ silently drops FCM notifications targeting a channel that doesn't already exist on-device, and the channel was previously only created lazily on first foreground `.show()` call. **Not yet confirmed necessary** — the actual Android fix that got verified working was the backend credential/wiring fix (bugs #2 and #3); this client-side channel fix has not been separately tested against a background/killed-app notification. Still uncommitted on `debug/push-notifications-e2e`. | No — uncommitted on `debug/push-notifications-e2e` |
| `[NOT a code file]` Coolify env config for `books-platform` web app | `FIREBASE_PRIVATE_KEY` value replaced with a correctly re-escaped value derived from `/Users/youssefemadeldin.ai/Downloads/books-platform-9cfbb-firebase-adminsdk-fbsvc-888927ae82.json` | Fixes bug #3 | Applied directly via SSH to the on-disk `.env` + container recreate. **Not yet reflected in Coolify's UI/database** — see Pending Tasks, this is the single most important follow-up item |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `book-edit-form.tsx` | Which server functions the admin book form actually calls | Confirmed `createBook`/`updateBook` from `./actions`, not the REST API route — this is what led to finding bug #2 |
| `/Users/youssefemadeldin.ai/Downloads/books-platform-9cfbb-firebase-adminsdk-fbsvc-888927ae82.json` | Whether the *source* service account JSON was itself corrupted (vs. corruption happening during entry into Coolify) | Valid — correct PEM `BEGIN`/`END` markers, 28 newlines, 1704-char length consistent with a standard RSA-2048 PKCS8 key. Confirms the corruption was introduced specifically when pasting into Coolify, not in the credential file itself |
| `/data/coolify/applications/q9vnuussumtcsfv4bzjxzxoq/docker-compose.yaml` | Whether the compose file references `.env` via `env_file` (needed to know if editing `.env` + recreating the container would actually apply the fix) | Confirmed — `env_file:` directive present, pointing at the `.env` file in the same directory |

## Pending Tasks

- [ ] **Update `FIREBASE_PRIVATE_KEY` in the Coolify UI itself** (not just the on-disk `.env` file) using the same corrected value derived from `books-platform-9cfbb-firebase-adminsdk-fbsvc-888927ae82.json`. **This is the most important follow-up** — the on-disk `.env` is a generated artifact that Coolify rewrites from its own database on every UI-triggered deploy. If this isn't also fixed in the Coolify dashboard, the **next deploy triggered from the Coolify UI will silently revert the credential to the corrupted value**, and FCM sends will start failing again with the exact same `app/invalid-credential` error. Flagged clearly to the user in-session but not yet confirmed done.
- [ ] **Decide what to do with the two now-instrumented-but-effectively-dead REST API routes** (`app/api/v1/admin/books/route.ts` and `[id]/route.ts`) — confirm whether anything else in the system (a script, an external integration, a different admin surface) actually calls them. If not, consider either removing the now-redundant `sendMobileNotification` logic from them (to avoid double-sends if a caller does exist and hits both paths somehow) or documenting why both exist.
- [ ] **Re-test iOS via TestFlight/Ad Hoc build** (carried over from `011-...md`) — this remains the only untested path for the iOS `onTokenRefresh` timeout issue. Debug and profile builds both use sandbox APNs; only a properly signed archive gets production APNs.
- [ ] **Verify the Android notification-channel fix in `fcm_service.dart`** — it was written as a hypothesis this session (Android 8+ can silently drop notifications on a channel that's never been created) but the actual verified fix that got the live notification through was the backend credential/wiring fix. Test specifically: kill the app fully (not backgrounded — force-stopped or freshly installed with the app never opened once in foreground), publish a book, confirm the notification still displays. If it fails in that specific scenario, the channel fix is still needed and should be committed; if it works fine even on a codebase without the channel fix, the channel change may be unnecessary defensive code — decide with the user either way.
- [ ] **Consider persisting `[FCM DEBUG]` results to `notification_logs`** now that the send path is confirmed working, instead of leaving it as console-only tracing (Bugs Found #4) — ask user if in scope.
- [ ] **Fix the missing `BlocListener` for `NotificationSettingsError`** (Bugs Found #5, carried over, still not discussed with user whether in scope).
- [ ] **Remove all `[FCM DEBUG]` debugPrint statements from the Flutter side** (`fcm_service.dart`, `notification_settings_cubit.dart`) once iOS is also resolved — the backend `[FCM DEBUG]` console.log statements are lower-priority to remove since they're genuinely useful ongoing observability, but worth asking the user if they want them gated behind an env check or kept permanently.
- [ ] **Commit strategy for `debug/push-notifications-e2e`** — still nothing committed on this branch (mobile-side changes only; the backend fixes were deliberately committed straight to `main` this session, separately). Once iOS is resolved and debug prints are cleaned up, decide commit granularity and whether/when to merge this branch.
- [ ] **Revoke or confirm the SSH access** — still open from previous session, not re-raised this session. The same keypair from two sessions ago is still active and was reused again this session without issue.
- [ ] **Rotate the production Postgres password** — still open from previous sessions, shared in plaintext chat history originally; not urgent per user's prior acknowledgment, but still outstanding.

## What's Next (ordered)

1. **Update the Coolify UI's `FIREBASE_PRIVATE_KEY` env var directly** — highest priority, prevents the fix from silently reverting on the next deploy. This is a manual UI action; the new session should confirm with the user whether this has been done, and if not, walk them through it (Firebase Console → Service Accounts → download/locate the JSON → copy `private_key` field → paste into Coolify → redeploy → verify via a real test send afterward that it still works).
2. Confirm whether the REST API book routes (`app/api/v1/admin/books/route.ts`, `[id]/route.ts`) have any real caller, and decide their fate.
3. Test the Android notification-channel fix specifically against a force-stopped/never-foregrounded app state to confirm whether it's actually load-bearing or was solved entirely by the backend fixes.
4. Move to TestFlight testing for iOS — the last remaining open thread on push notifications overall.
5. Once both platforms are confirmed fully working, circle back to cleanup: debug print removal, `debug/push-notifications-e2e` commit strategy, and the `notification_logs` persistence question.

## Key References

- `doc/handoffs/009-ios-appstore-rejection-fix/011-2026-07-14-fcm-android-working-ios-timeout-server-access.md` — immediately prior session (same day), defines the iOS timeout bug (still open) and the `fcm_tokens` missing-table bug (fixed that session, unrelated to this session's bugs).
- `doc/handoffs/009-ios-appstore-rejection-fix/004-...` through `010-...` — full FCM implementation and debugging history.
- `mobile/CLAUDE.md`, `mobile/.claude/rules/flutter_feature_prompt.md` — architecture rules followed this session (Flutter side).
- `web/prisma/schema.prisma:702-739` — `NotificationLog` and `FcmToken` model definitions (relevant if pursuing the `notification_logs` persistence pending task).

## Server / DB Access

**Production Postgres**: unchanged from previous session — `postgres://postgres:<password>@49.13.218.137:5433/postgres`. Password still shared in plaintext in earlier session history; rotation still recommended, still not urgent per user.

**Production server SSH**: same keypair from the previous session (`011-...md`) was reused successfully this session — it had never been revoked, and the previous session's scratchpad directory (`/private/tmp/claude-501/.../5cb74783-b727-4115-9bd0-df7fb7f5cc46/scratchpad/`) still existed on this machine, so the private key was still readable. **A new session should check whether that scratchpad directory still exists before assuming it needs to regenerate a keypair.** If it's gone, a fresh keypair will need to be generated and the public key added again via Coolify's Terminal → plain `localhost` entry (connects to the host, not a container — confirmed in the previous session).

**Coolify app config**: `books-platform` web app, Docker Compose–based, on-disk config at
`/data/coolify/applications/q9vnuussumtcsfv4bzjxzxoq/` (contains `.env`, `docker-compose.yaml`,
`README.md`). Container naming pattern `web-q9vnuussumtcsfv4bzjxzxoq-<timestamp>` — a new container
name appears after every deploy triggered from the Coolify UI (confirmed twice this session by
polling `docker ps` after pushing to `main`). To recreate the container after manually editing the
on-disk `.env` (e.g., for an emergency credential fix outside the UI), use:
`cd /data/coolify/applications/q9vnuussumtcsfv4bzjxzxoq && docker compose -p q9vnuussumtcsfv4bzjxzxoq up -d --force-recreate`
— a plain `docker restart` does **not** reload environment variables from a changed `.env` file.

**Production Postgres tables used this session**: `products` (snake_case columns — `name_en`,
`name_ar`, `published`, `created_at`, not the Prisma camelCase model names), `fcm_tokens`
(`platform`, `is_active`, `created_at`). Both confirmed via `\dt` — table names differ from Prisma
model names due to `@@map(...)`.

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should Claude retest iOS first or check server logs first, now that SSH access is confirmed working again? | Retest iOS first (chosen from a multiple-choice prompt) |
| After iOS still timed out at 25s with device settings confirmed correct, what next — check server logs, inspect device push registration state, or stop for the day? | Check server logs now |
| Given server-side and device-settings are both ruled out for iOS, what next — check device Notification settings, build via TestFlight, or stop? | Check device Notification settings (quick) — this was done, both settings confirmed correct, leaving TestFlight as the only remaining untested path (not yet started) |
| On Android, what exactly happens when a book is created/published — no notification ever, inconsistent, or unknown? | Toggle is ON, but no notification ever arrives (this was the key clarifying answer that redirected the whole session toward the backend investigation) |
| Should Claude read a raw DB value (`printenv` of `FIREBASE_*` vars) over SSH? | Initially denied by the auto-mode safety classifier as out of scope of prior consent; user then explicitly authorized it directly ("implement now") |
| Should Claude run a direct SQL query against the production database to check a book's `published` flag? | Initially denied by the classifier (out of scope of prior consent); user then explicitly authorized it ("you are allowd to heck the most recently created book row and its published flag") |
| Should Claude add debug logging to the backend, not just Flutter? | Yes, explicitly and emphatically requested by the user after seeing empty server logs — this led directly to finding bug #2 |
| Given a corrupted `FIREBASE_PRIVATE_KEY`, which of two files in `~/Downloads` was the right one to use — the Firebase Admin SDK JSON or the `AuthKey_*.p8` file? | The `.json` file (`books-platform-9cfbb-firebase-adminsdk-fbsvc-888927ae82.json`) — the `.p8` file is an unrelated Apple APNs auth key, not consumed by this Node backend |
| How should the corrected `FIREBASE_PRIVATE_KEY` be applied — Claude writes it to a file for the user to paste into Coolify's UI themselves, or Claude applies it directly over SSH? | Directly via SSH (chosen from a multiple-choice prompt) — done via file transfer (`scp` + a Python script reading from a file) specifically to avoid the secret ever appearing in shell command arguments, shell history, or this conversation's transcript |

## Notes

- **This was a genuinely satisfying debugging arc**: three independent, stacked bugs (dead code path
  → missing observability → corrupted credential) that each individually looked like they could be
  "the" bug, but only made sense once all three were found and fixed in sequence. The new session
  should not assume Android is "simple" or "already solved" going in — it took an entire session to
  actually get to a real, verified, working end-to-end send, despite two prior sessions believing
  Android was "confirmed working" (they had only verified token *registration*, never an actual send).
- **Sensitive credential handling this session**: the auto-mode safety classifier correctly blocked
  two attempts to read/print credential-adjacent data (`printenv FIREBASE_*` with values, and a raw
  SQL query) until the user gave direct, explicit, in-the-moment authorization each time. This is
  working as intended and the pattern should continue in future sessions — don't assume broad
  "you have SSH access" consent extends to printing secret values or querying production data without
  a fresh, specific ask.
- **One raw FCM device registration token pair was printed into this session's transcript** (as part
  of the `invalidTokens` array in a debug log pull, to diagnose the successCount/failureCount split).
  These are per-device push tokens, not account credentials — low security exposure (worst case,
  someone could push notifications to that specific already-stale device via this Firebase project),
  and both tokens shown were immediately auto-deactivated by the existing code as part of normal
  operation. Not rotated or treated as an incident, but worth being more careful about in future log
  pulls — prefer grepping for counts/codes rather than full token arrays where the specific token
  value isn't needed for diagnosis.
- User's communication style this session was notably more frustrated/direct than previous sessions
  (see raw quotes in conversation: demanding backend debug logging, demanding SSH be used directly
  rather than asked about). The underlying asks were all reasonable and led directly to correctly
  diagnosing real bugs — worth continuing to move fast and act on direct instructions in future
  sessions with this user rather than over-clarifying, while still pausing for genuinely irreversible
  or credential-sensitive actions as happened successfully this session.
- Same as previous sessions: user tests personally on real devices, wants to be walked through *why*
  not just *what*, and this session continued that pattern (explaining the three-bug chain, not just
  announcing "fixed").
