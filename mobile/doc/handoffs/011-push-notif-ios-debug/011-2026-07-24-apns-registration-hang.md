# Session Handoff — 2026-07-24

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Diagnosed an iOS-only FCM push notification bug: Android works 100%, iOS never obtains an FCM token.
- Added structured debug logging across the full pipeline (client native, client Dart, backend) to trace the issue end to end.
- Committed and pushed the backend debug-logging changes directly to `origin/main` (confirmed auto-deployed via Coolify).
- Set up direct SSH access from this Mac to the production VPS to read backend Docker logs myself, without going through the browser Terminal panel.
- Ran the app on the physical device ("iPhone Yousef", iOS 26.1, real device not simulator) **three separate times**, each time reproducing the identical failure.
- Directly inspected the actual signed binary + embedded provisioning profile (not just the source `.entitlements` file) to rule out an entitlements/provisioning misconfiguration — confirmed clean.
- Ruled out a VPN app ("Planet VPN - PlanetX5") that was found installed on the device — user fully removed it, issue persisted unchanged.
- Ruled out Wi-Fi-specific network blocking — user disabled Wi-Fi (pure cellular) for a test, issue persisted unchanged.
- Verified Apple ID/iCloud signed in, and Date & Time set to automatic (Cairo timezone) — both fine, ruled out as causes.
- Attempted to capture native `apsd` (Apple Push daemon) OS-level logs via `pymobiledevice3` for a deeper look than app-level logging can offer — blocked by broken local Python tooling (see Notes). Pivoted to Xcode's built-in Console app instead (`Window → Devices and Simulators → Open Console`, filtered to `apsd`).
- **Left mid-verification**: the Xcode Console was filtered and open, a fourth test run was in flight, and the user was about to report what (if anything) appeared in that console during the failure window — session was interrupted before that answer came in. User said they'll show the result in the new session.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | iOS FCM token registration hangs permanently — `getToken()` throws `apns-token-not-set`, falls back to `onTokenRefresh.first(25s)`, times out every time | High (blocks all iOS push notifications) | Native APNs handshake, before any Dart/Firebase code runs | Reproduced identically across 3 full test runs (fresh install + 2 re-runs). Native `didRegisterForRemoteNotificationsWithDeviceToken` / `didFailToRegisterForRemoteNotificationsWithError` **never fire** — not a rejection, a silent hang. Backend confirmed (via SSH) to receive zero FCM-related requests each time, consistent with the client never obtaining a token. |

**Ruled out so far (do not re-check these):**
- Entitlements/provisioning profile mismatch — verified via `codesign -d --entitlements :- Runner.app` and direct `embedded.mobileprovision` inspection: `aps-environment: development` present in both, correct team (`PW882S9X59`), correct bundle id, profile not expired (2027-06-30).
- VPN interference (Planet VPN app) — removed entirely, no change.
- Current Wi-Fi network blocking APNs — disabled Wi-Fi, pure cellular, no change.
- Apple ID/iCloud not signed in — confirmed signed in.
- Device clock/timezone skew (would break TLS handshake with Apple's servers) — confirmed "Set Automatically" is ON, Cairo timezone.
- Firebase Admin APNs Auth Key/cert in Firebase Console — clarified this only affects *sending*, not device *registration*, so it's irrelevant to this specific symptom.
- Simulator vs. physical device — this is a real physical device throughout.

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/ios/Runner/AppDelegate.swift` | Added overrides for `didRegisterForRemoteNotificationsWithDeviceToken` / `didFailToRegisterForRemoteNotificationsWithError` with `[FCM DEBUG][Native]` print statements, calling `super` in both | The Dart-side FCM flow had zero visibility into whether the native APNs handshake itself ever completes or fails — this was the single biggest blind spot. **Still uncommitted** (user wants mobile changes kept uncommitted, not committed yet). |
| `mobile/lib/features/notifications/services/fcm_service.dart` | Added debug prints in `requestPermission()`: raw `authorizationStatus`, and whether `getAPNSToken()` is null right after permission grant (was silently swallowed before) | Same reason — closing a logging gap identified during pipeline review. **Still uncommitted.** |
| `web/app/api/v1/notifications/mobile/subscribe/route.ts` | Added success-path debug log (previously only the error path was logged) | Full pipeline visibility once a token is eventually obtained |
| `web/lib/firebase/admin.ts` | Added a warning log when Firebase Admin env vars are missing (was silently returning `null`) | Same |
| `web/lib/firebase/messaging.ts` | Added per-response FCM error code/message logging in `sendFcmToTokens` (was only counting failures, not logging why) | Same |

**Important:** the 3 web files above are **committed and pushed directly to `origin/main`** (commit `3713a13c8cb24e93276ddae99c51a68073635f6d`), confirmed live in production via SSH (`docker inspect` showed the container running that exact image tag). The 2 mobile files are **intentionally left uncommitted** in the working directory on branch `release/v3.0.0+17` — do not commit them unless the user asks.

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `mobile/ios/Runner/Runner.entitlements` | `aps-environment` value | `development` — correct |
| `mobile/ios/Runner/Info.plist` | `FirebaseAppDelegateProxyEnabled`, `UIBackgroundModes` | No override key present (swizzling enabled by default, correct); `remote-notification` background mode present |
| `mobile/ios/Runner.xcodeproj/project.pbxproj` | Code signing consistency across Debug/Profile/Release | `CODE_SIGN_STYLE = Automatic`, same `DEVELOPMENT_TEAM`, same entitlements file across all 3 configs — consistent |
| `mobile/lib/main.dart` | FCM init ordering | `FcmService.initialize()` correctly fired `unawaited` after `runApp()`, by design (avoids black-screen block on iOS) |
| `mobile/lib/features/onboarding/presentation/pages/splash_screen.dart` | Where `togglePush(true)` gets auto-triggered | Fires once-ever via `kNotifPermissionRequestedKey`, right after first navigation off splash — confirmed as the trigger source seen in logs |
| Backend `web/lib/firebase/messaging.ts`, `web/server/services/fcm.service.ts` | Existing logging coverage before this session's additions | Reasonable baseline, just needed per-response error detail added (see Files Changed) |

## Pending Tasks

- [ ] **Get the user's report of what appeared in the Xcode Console (filtered to `apsd`) during the last test run's 25-second failure window** — this is the single most important next data point. Console window was already open and filtered when the session ended.
- [ ] Based on that apsd output: if it shows a concrete error (DNS failure, connection blocked, TLS/cert error), diagnose from there directly.
- [ ] If apsd is still completely silent (matching the app-level silence), next escalation ideas (not yet tried):
  - Test on a **different physical device** entirely, to isolate device-specific state vs. a fleet-wide/project-wide issue.
  - Test with a **different Apple ID** signed in, or from an entirely different network (e.g., a friend's hotspot), to rule out an Apple-account-level or ISP-level block.
  - Check **Settings → Screen Time → Content & Privacy Restrictions** for anything subtle.
  - Check **Settings → Notifications → [App Name]** directly — confirm "Allow Notifications" truly shows on at the OS level (should be consistent with `authorizationStatus=authorized` already seen, but worth eyeballing).
  - As a blunt-force test: **Settings → General → Transfer or Reset iPhone → Reset → Reset Network Settings** — clears any lingering low-level network/DNS/proxy config not visible through the VPN settings screen.
- [ ] Once root cause is found and fixed, re-verify the full pipeline end-to-end (client obtains token → `registerFcmToken` call reaches backend → backend logs show `[FCM DEBUG] POST /notifications/mobile/subscribe — token registered` in the container logs).
- [ ] Decide when/whether to commit the two mobile debug-logging files (`AppDelegate.swift`, `fcm_service.dart`) — currently intentionally left uncommitted per user's explicit instruction.

## What's Next (ordered)

1. Read the user's report/screenshot of the Xcode Console `apsd`-filtered output from the last test.
2. Diagnose from that concrete evidence rather than continuing to guess blind.
3. Apply the actual fix once identified.
4. Re-run the full test (client + backend log check via SSH) to confirm the fix works end-to-end.
5. Ask the user whether to commit the mobile debug-logging changes now, revert them, or leave them uncommitted further.

## Key References

- `mobile/CLAUDE.md`, `mobile/.claude/rules/flutter_scaffold_prompt.md`, `mobile/.claude/rules/flutter_feature_prompt.md` — architecture rules for this repo.
- SSH access to production VPS already set up: key at `~/.ssh/claude_books_platform` (passphrase-less ed25519, dedicated to this debugging task), host `49.13.218.137`, user `root`, port 22. Backend container name: `web-q9vnuussumtcsfv4bzjxzxoq-130936095621` (Coolify-managed). Command pattern: `ssh -i ~/.ssh/claude_books_platform root@49.13.218.137 "docker logs --since 10m web-q9vnuussumtcsfv4bzjxzxoq-130936095621 2>&1 | grep -i fcm"`.
- This is a **single monorepo** at `/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform` — `mobile/` and `web/` are folders in the same repo, not separate repos. Current branch: `release/v3.0.0+17`. Main branch: `main`.
- Device under test: "iPhone Yousef", iOS 26.1 (23B85), physical iPhone 11 (iPhone12,1), UDID `00008030-000655020E86802E`.
- Flutter run log convention used this session: redirect to `/private/tmp/claude-501/.../scratchpad/flutter_run.log` in background, then `Monitor` tool tailing it filtered to `FCM DEBUG|Native|Exception|error:|Lost connection|...` — this scratchpad path is session-specific and won't survive into the new session; recreate as needed.

## Clarifications & Decisions

| Question | Answer |
|---|---|
| PR vs. direct push for backend debug-logging commit to `main`? | User first chose "Open a PR", then explicitly said to discard that worktree and use direct push instead. Backend changes were pushed straight to `origin/main`. |
| Keep mobile changes uncommitted while committing backend changes? | Yes — explicit, still in effect. Do not commit `mobile/` files without asking again. |
| Is the iPhone on Wi-Fi or cellular during testing? | User confirmed Wi-Fi was disabled (pure cellular) for at least one test — issue persisted. |
| VPN/config profile check | Found "Planet VPN - PlanetX5" installed (Device VPN, listed but showing "Not Connected"). User deleted the VPN app entirely. Issue persisted afterward — VPN ruled out. |
| Date & Time automatic? Apple ID signed in? | Both confirmed fine (screenshots reviewed directly). |
| OK to install `pymobiledevice3` via pip to read device syslog? | Yes, user approved — but installation hit unrelated environment breakage (see Notes) and was abandoned in favor of Xcode's built-in Console app. |

## Notes

- Local Python tooling on this Mac is broken in two independent ways, discovered while trying to install `pymobiledevice3`:
  1. Homebrew's `python@3.12` and `python@3.14` both fail on `import pyexpat` — a dylib linkage mismatch where the interpreter resolves to macOS's system `/usr/lib/libexpat.1.dylib` (older, missing symbol `_XML_SetAllocTrackerActivationThreshold`) instead of Homebrew's own `expat`. This breaks `pip` itself for both those interpreters. Not fixed (out of scope) — would need `brew reinstall expat python@3.12 python@3.14` or similar, unrelated to books-platform.
  2. The only working Python (`/usr/bin/python3`, actually Xcode's bundled Python 3.9.6 with pip 21.2.4) can install `pymobiledevice3` fine, but the installed `pymobiledevice3==10.1.0` imports `typer._click.core`, which doesn't exist in the `typer==0.23.2` its own metadata constrains it to for Python < 3.10 (`typer<0.24.0,>=0.23.2; python_version < "3.10"`). This looks like a genuine upstream packaging bug in that pymobiledevice3 release for older Python. `typer>=0.25` isn't installable on Python 3.9 (its wheels require Python ≥3.10). Dead end — abandoned in favor of Xcode's GUI Console instead of fighting this further.
  - The `pymobiledevice3` package and its ~90 dependencies are still installed at `~/Library/Python/3.9/lib/python/site-packages` — harmless clutter, not cleaned up. Fine to leave, or remove with `/usr/bin/python3 -m pip uninstall pymobiledevice3` if the user wants tidiness.
- The Xcode Console approach (no extra tooling, GUI-only) worked cleanly: `Window → Devices and Simulators → select device → Open Console`, then filter by typing `apsd` in the search box. This is the path to use going forward for any further native-log inspection — no need to revisit the Python route.
- A `flutter run` background process got stuck once mid-session (hung ~60s+ past normal on "Installing and launching...", log showed "The Dart VM Service was not discovered after 60 seconds") — root cause looked like an unattended macOS "Xcode automation" permission dialog that nothing could click. Had to `kill` the stale process and relaunch. If this happens again, check for and manually approve any "Terminal/Claude wants to control Xcode" system permission popup.
- All communication in this session was in English per explicit user instruction, despite the user writing partly in Arabic/mixed Arabic-English (Egyptian Arabic). Continue responding in English unless told otherwise.
