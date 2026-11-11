# Session Handoff — 2026-07-13

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> This continues the push-notification thread started in `004-2026-06-28-push-notifications-start.md`
> through `009-2026-06-30-gradle-fixed-notif-entry-wired.md` in this same folder — that work
> was "complete" per those docs; this session found and fixed real bugs during actual E2E
> debugging (backend → mobile), on a fresh branch.

## Branch

`debug/push-notifications-e2e` — created off `main` this session, in
`/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/mobile`. **Nothing committed yet** —
all changes below are uncommitted working-tree changes. `web/` repo (backend) was audited
but not modified.

## What Was Done

1. **Full-stack FCM implementation survey** (mobile Flutter + Next.js backend in `/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/web`) — confirmed the pipeline is correctly wired end-to-end: endpoint paths/verbs, request/response shapes, notification channel IDs, Firebase project/bundle IDs all match between mobile and backend. See "Files Audited" below for details.
2. **Ruled out the top suspect from that survey**: production Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) were confirmed present with real values in the Coolify **Production Environment Variables** panel (user provided a screenshot + env dump). Not the blocker. Side note: `NODE_ENV=development` is set on the production Coolify service — flagged as odd but unrelated to push notifications, not investigated further.
3. **Fixed: iOS accidentally triggering the OS permission dialog during splash, Android never prompting at all.**
   - Root cause: `DarwinInitializationSettings()` in `FcmService._initLocalNotifications()` defaults `requestAlertPermission`/`requestBadgePermission`/`requestSoundPermission` to `true`, so `flutter_local_notifications`' own setup silently triggered the native iOS permission dialog during splash (since `FcmService.initialize()` fires unawaited right after `runApp()` in `main.dart`). Android has no equivalent implicit trigger, so it never asked at all.
   - Fix: disabled those three flags (now `false`) so the plugin only ever *displays* notifications, never requests permission as a side effect. Added an explicit, intentional trigger instead: `SplashScreen._navigate()` now fires `NotificationSettingsCubit.togglePush(true)` once, right after navigating away from splash (whichever screen — Language/Onboarding or Home — comes next), guarded by a new `kNotifPermissionRequestedKey` SharedPreferences flag so it only ever fires once per install.
   - Verified working on a real iOS device by the user.
4. **Fixed: Notification Settings toggle showed OFF immediately after the user granted permission.**
   - Root cause: `NotificationSettingsCubit.togglePush()` only persisted `kNotifOptInKey` (what the toggle reads) *after* the backend token-registration network call (`_repository.registerFcmToken`) finished. Previously invisible because manual toggling kept the user on the same screen/cubit instance with a spinner. Once splash started firing this in the background, a user reaching the Notification Settings screen (a fresh cubit instance) before that network call resolved would see the stale/default `false`.
   - Fix: `togglePush` now persists `kNotifOptInKey = true` and emits `NotificationSettingsLoaded(pushEnabled: true)` immediately once OS permission is confirmed granted, decoupled from registration latency — the toggle reflects user consent, not network timing. Token fetch/registration still happens right after, in the background.
   - Also reorganized the method: early-return for the `enabled == false` case, then permission-denied case, then the granted path — same behavior, clearer structure.
   - Verified working on a real iOS device by the user.
5. **Re-enabled and wrote the previously-disabled cubit test.**
   - `test/features/notifications/presentation/notification_settings_cubit_test.dart` was fully commented out (`⚠️ BLOCKED (T093)` — blocked pending Firebase config files, which are now actually present). Rewrote it with 3 passing cases using `mocktail` + `SharedPreferences.setMockInitialValues`, following the existing pattern in `test/features/newsletter/presentation/newsletter_cubit_test.dart` (no `bloc_test` dependency in this project — plain `cubit.stream` + `emitsInOrder`).
   - The key regression test: grants permission, leaves `registerFcmToken` deliberately pending (unresolved `Completer`), and asserts a **second, independent** `SharedPreferences.getInstance()` read (simulating the Notification Settings screen navigating in) already sees `kNotifOptInKey == true` — this is the exact race reproduced.
   - All 3 tests pass; `flutter analyze` clean on all touched files.
6. **Found (not yet fixed): `FcmService.getToken()` throws an uncaught exception on iOS, silently breaking backend registration.**
   - Discovered via real-device console output during step 4's verification (see log below). This is the actual next task — see "Pending Tasks."

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | (Fixed) iOS permission dialog fires accidentally during splash; Android never fires at all | High — broke intended first-launch UX consistency | `lib/features/notifications/services/fcm_service.dart` (`_initLocalNotifications`), `lib/main.dart:43` | Reported by user testing on real iOS device |
| 2 | (Fixed) Notification Settings toggle read stale `false` right after granting permission | High — misleading UI state, would confuse users/QA | `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` (`togglePush`) | Reproduced by user on real device; regression test added |
| 3 | **(Open)** `FirebaseMessaging.instance.getToken()` throws `[firebase_messaging/apns-token-not-set]` on iOS when called too soon after permission grant, before Apple's async APNs device-token registration completes. The exception is never caught anywhere in `FcmService.getToken()` or `NotificationSettingsCubit.togglePush()`, so it silently aborts the rest of `togglePush` — **the toggle shows ON (since opt-in is now persisted early per bug #2's fix) but `registerFcmToken` never runs, so no `FcmToken` row is ever created on the backend.** User believes they're subscribed; they are not. | **Critical** — this is a silent, complete failure of the actual notification delivery registration on iOS, the platform this whole session started debugging. | `lib/features/notifications/services/fcm_service.dart:75-81` (`getToken()`), called from `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart:50` (`togglePush`) | Real-device console log (profile mode, iPhone Yousef), full stack trace captured below |

### Bug #3 — full stack trace (for reference, don't need to reproduce)

```
[ERROR:flutter/runtime/dart_vm_initializer.cc(40)] Unhandled Exception: [firebase_messaging/apns-token-not-set] APNS token has not been set yet. Please ensure the APNS token is available by calling `getAPNSToken()`.
#0      MethodChannelFirebaseMessaging._APNSTokenCheck (package:firebase_messaging_platform_interface/src/method_channel/method_channel_messaging.dart:138)
<asynchronous suspension>
#1      MethodChannelFirebaseMessaging.getToken (package:firebase_messaging_platform_interface/src/method_channel/method_channel_messaging.dart:244)
<asynchronous suspension>
#2      FcmService.getToken (package:booksplatform/features/notifications/services/fcm_service.dart:76)
<asynchronous suspension>
#3      NotificationSettingsCubit.togglePush (package:booksplatform/features/notifications/presentation/cubit/notification_settings_cubit.dart:50)
<asynchronous suspension>
```

### Why bug #3 wasn't caught by bug #1/#2's fixes, and why it's more likely now

This race could theoretically always have existed (the manual toggle flow calls the exact same `getToken()` after `requestPermission()`), but a user manually navigating to Settings gave iOS's background APNs registration enough real wall-clock time to finish first. Since bug #1's fix made this fire automatically within ~1-2 seconds of cold app launch (right after splash), the APNs token is now almost never ready in time — making this a near-guaranteed failure on fresh installs, not a rare edge case.

## Fix Direction — Agreed With User (not yet implemented)

Discussed two options with the user; **event-driven was explicitly chosen over blind polling**:

- ❌ Rejected: naive retry loop (`while` + `Future.delayed` polling `getAPNSToken()` until non-null or timeout) — works, but is an arbitrary-interval guess, not idiomatic.
- ✅ **Agreed approach**: catch the specific `FirebaseException` with `code == 'apns-token-not-set'` thrown by `FirebaseMessaging.instance.getToken()`, and *only* in that fallback case, await the **first event on `FirebaseMessaging.instance.onTokenRefresh`** (with a timeout as a safety net, not as the primary wait mechanism) to obtain the token reactively the instant iOS actually finishes APNs registration — no polling interval to guess.
- **Must be scoped to iOS only** (`Platform.isIOS`). Confirmed with user: Android has no APNs concept at all — FCM on Android talks directly to Google's servers, `getToken()` there works immediately after Firebase init regardless of permission state (that permission on Android only gates whether the OS shows a visible banner, not whether the app can obtain a token or receive data pushes). Applying any wait logic on Android would be dead code.
- Also confirmed with user (informational, not a bug): on Android 12 and below there is no runtime notification permission at all — `requestPermission()` returns "authorized" instantly with **no OS dialog** by design. Only Android 13+ (API 33) shows the actual system dialog. Testing on an older Android emulator and seeing no prompt is expected, not a regression.

### Flagged but not yet agreed to be in scope

While discussing the fix, identified that `FcmService` currently has **no listener at all** on `FirebaseMessaging.instance.onTokenRefresh` for the general case — meaning if FCM ever rotates the token later in the app's lifetime (periodic rotation, app restored on a new device, etc.), nothing re-registers the new token with the backend, and that device silently goes stale. Suggested wiring a **standing** `onTokenRefresh` listener in `FcmService.initialize()` (not just the one-shot fallback for bug #3) to catch this class of problem for good, since the fix for bug #3 already requires touching this exact stream. **User has not yet confirmed whether this is in scope for the next session — ask before implementing.**

## Files Changed (uncommitted, on `debug/push-notifications-e2e`)

| File | Change | Why |
|---|---|---|
| `lib/core/constants/app_constants.dart` | Added `kNotifPermissionRequestedKey = 'notif_permission_requested'` | Guard flag so the automatic first-launch permission trigger fires only once ever |
| `lib/features/notifications/services/fcm_service.dart` | `DarwinInitializationSettings` now sets `requestAlertPermission`/`requestBadgePermission`/`requestSoundPermission` to `false` | Stop the plugin from silently triggering the iOS permission dialog as an init side effect |
| `lib/features/onboarding/presentation/pages/splash_screen.dart` | Added `_requestNotificationPermissionOnce()`, called from `_navigate()` right after `pushReplacementNamed` | Intentional, consistent, once-only trigger for the real permission request on both platforms |
| `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` | `togglePush()` restructured: persists `kNotifOptInKey = true` and emits `Loaded(true)` immediately after permission grant, before token registration | Fix toggle-shows-stale-off race |
| `test/features/notifications/presentation/notification_settings_cubit_test.dart` | Rewrote from fully-disabled placeholder to 3 passing tests | Regression coverage for the toggle-timing fix; re-enabled per its own "re-enable when Firebase is wired up" comment, which is now true |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/features/notifications/data/datasources/notifications_remote_data_source.dart` | Endpoint path/verb/body shape vs backend | Matches `app/api/v1/notifications/mobile/subscribe/route.ts` exactly |
| `web/app/api/v1/notifications/mobile/subscribe/route.ts` | POST/DELETE handling, zod schema | Correct, matches mobile payload |
| `web/lib/firebase/admin.ts`, `web/lib/firebase/messaging.ts`, `web/server/services/fcm.service.ts` | Firebase Admin SDK wiring, send logic | Correct. Sends are always direct-to-token (`sendEachForMulticast`), never by FCM topic — mobile's `subscribeToTopic('new-books')` calls are vestigial/unused by the backend (harmless, just dead weight, not a bug) |
| `web/app/api/v1/admin/books/route.ts`, `web/app/api/v1/admin/books/[id]/route.ts` | Auto-trigger on book publish | Fires `sendMobileNotification` correctly on publish, but does **not** check `isFirebaseConfigured()` or the `site_notifications` admin setting first (only the manual broadcast endpoint does) — minor admin-UX inconsistency, not a delivery bug, not fixed this session |
| `mobile/ios/Runner/Info.plist`, `Runner.entitlements`, `GoogleService-Info.plist` | Background modes, APNs entitlement, project ID match | `UIBackgroundModes` has `remote-notification` ✅. `aps-environment` is `development` in committed entitlements — expected to auto-switch to `production` at Xcode archive time, not independently re-verified this session |
| `mobile/android/app/google-services.json`, `build.gradle.kts` | Package ID match, desugaring config | Matches, correct |
| Coolify Production Environment Variables (user-provided) | `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` presence | **Confirmed present with real values** — this was the top suspect from the initial survey; ruled out |
| `NotificationsRepository.unregisterFcmToken` | Whether it's ever called | Confirmed still dead code — toggling OFF only flips the local pref, never calls the backend `DELETE`. Known from initial survey, **not fixed this session**, not currently blocking anything critical |

## Pending Tasks

- [ ] **Fix bug #3** — `FcmService.getToken()`: catch `FirebaseException` with `code == 'apns-token-not-set'`, fall back to awaiting `FirebaseMessaging.instance.onTokenRefresh.first` with a timeout, scoped to `Platform.isIOS` only. This is the primary task for the new session.
- [ ] Ask the user whether to also add a standing `onTokenRefresh` listener in `FcmService.initialize()` for future token-rotation re-registration (flagged, not yet agreed).
- [ ] After the fix, verify on the same real iOS device: fresh install (or reset permission via iOS Settings → delete app data), confirm no unhandled exception appears in console, confirm a real `FcmToken` row gets created/updated on the backend this time.
- [ ] Write a unit/widget-level test if feasible for the `apns-token-not-set` fallback path (mocking `FcmService`'s internal `FirebaseMessaging` calls is harder since `FcmService` wraps the plugin directly rather than through an injected interface — may need to test at the `FcmService` level with a fake `FirebaseMessaging` if the plugin's testing utilities support it, or accept this is better covered by real-device verification given plugin-level mocking limits. Decide pragmatically, don't force a test that fights the plugin's API.)
- [ ] Once bug #3 is fixed and verified, consider whether to also address the two minor known gaps noted in "Files Audited" (unused `unregisterFcmToken`, missing `isFirebaseConfigured()`/setting check on auto-publish triggers) — not blocking, user's call on priority.
- [ ] Nothing has been committed on `debug/push-notifications-e2e` yet — decide with the user when/how to commit (one commit per fix vs. squashed) once bug #3 is resolved and the whole branch is verified working end-to-end.

## What's Next (ordered)

1. **Start the new session in plan mode** (explicitly requested by the user) to design the `onTokenRefresh` fallback implementation in `FcmService.getToken()`.
2. Confirm with the user during planning whether the standing token-rotation listener is in scope for this same session or deferred.
3. Implement, run `flutter analyze`, and (if a clean test approach exists) add a test.
4. Have the user re-verify on the real iOS device (`iPhone Yousef`) — same device/setup used throughout this session.
5. Decide on commit strategy for the whole branch.

## Key References

- `doc/handoffs/009-ios-appstore-rejection-fix/004-2026-06-28-push-notifications-start.md` through `009-2026-06-30-gradle-fixed-notif-entry-wired.md` — original FCM implementation history this session's bugs were found within.
- `mobile/CLAUDE.md`, `mobile/.claude/rules/flutter_feature_prompt.md` — architecture rules followed this session (action/query cubit split, DI scopes, etc.)

## Clarifications & Decisions

| Question | Answer |
|---|---|
| How do you want to run the live E2E test — simulator, physical device, or backend-only first? | User tested on a real physical iOS device directly, bypassing the offered options |
| Splash routes to either Language/Onboarding (first install) or Home (later launches) — when exactly should the permission prompt fire? | Right after splash, whichever screen comes next (not gated to "only once reaching Home") |
| Is a persisted "already asked once" flag tied to local storage the right re-trigger rule? | Not explicitly answered (question errored out before being asked again), but implemented as the only sensible approach and not objected to since |
| Is the retry-loop ("wait and poll for APNs token") the correct/idiomatic solution, considering Android too? | No — user wanted deeper critical thinking per the project's "Team mindset" guidance. Agreed: event-driven `onTokenRefresh` fallback instead of blind polling; fix scoped to iOS only since Android has no APNs concept; standing token-rotation listener flagged as a separate, not-yet-agreed improvement |
| Where should the fix be implemented? | New session, explicitly starting in plan mode |

## Notes

- The user is new to FCM/push notifications (self-described "junior" on this topic) and has explicitly asked to be walked through *why*, not just *what*, at each step — continue explaining mechanisms (e.g. why iOS needs APNs, why Android differs) before jumping to implementation in the new session.
- User's working style this session: confirm understanding verbally before allowing implementation to proceed, prefers plan mode for anything non-trivial, tests fixes personally on a real device rather than delegating to simulator-based verification.
- Coolify production env vars (DB password, JWT secrets, R2 keys, SMTP password, Firebase private key) were pasted into this session in plaintext by the user for the credential-check — none of those values are reproduced in this handoff doc or were committed to the repo. Worth a gentle reminder to the user about rotating/handling secrets more carefully if it comes up again, but not urgent enough to interrupt the technical work.
