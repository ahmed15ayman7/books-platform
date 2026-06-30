# Session Handoff — 2026-06-30

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

---

## What Was Done

- Read handoffs 004–008 to fully load context on the FCM push notification implementation state.
- Fixed Android Gradle plugin version conflict that was blocking all debug/profile builds.
- Fixed `flutter_local_notifications` core library desugaring error that blocked the second build attempt.
- Identified that `NotificationSettingsScreen` had no navigation entry point anywhere in the app (orphaned route).
- Added a "Notification Settings" tile to `MoreBottomSheet` so users can reach the screen.
- Profile APK built successfully: `app-profile.apk` (38.2 MB) — installed and running on device (CPH1911).
- User is currently testing push notifications end-to-end on the physical device.

---

## Bugs Fixed

| # | Bug | Location | Fix Applied |
|---|---|---|---|
| 1 | `com.google.gms.google-services` declared twice — `4.4.2` in `build.gradle.kts` (added in handoff 005 manually) conflicted with `4.3.15` in `settings.gradle.kts` (added by FlutterFire CLI) | `android/build.gradle.kts` line 1–3 | Removed the entire `plugins {}` block from `build.gradle.kts`; `settings.gradle.kts` is the authoritative declaration in Kotlin DSL + `pluginManagement` setup |
| 2 | `flutter_local_notifications` requires core library desugaring but it was not enabled | `android/app/build.gradle.kts` | Added `isCoreLibraryDesugaringEnabled = true` to `compileOptions` and `coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")` to `dependencies {}` |
| 3 | `NotificationSettingsScreen` / `AppRoutes.notificationSettings` was a registered route with no navigation entry point anywhere in the app | `lib/features/more/presentation/widgets/more_bottom_sheet.dart` | Added `_MoreTile` with `Icons.notifications_outlined` + `notifications_title` translation key navigating to `AppRoutes.notificationSettings`, placed above the first `Divider` |

---

## Files Changed

| File | Change | Why |
|---|---|---|
| `android/build.gradle.kts` | Removed `plugins { id("com.google.gms.google-services") version "4.4.2" apply false }` block entirely | Duplicate with `settings.gradle.kts` — caused version conflict at `4.4.2` vs `4.3.15` |
| `android/app/build.gradle.kts` | Added `isCoreLibraryDesugaringEnabled = true` inside `compileOptions {}` | Required by `flutter_local_notifications` |
| `android/app/build.gradle.kts` | Added `dependencies { coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4") }` block at end of file | Required by `flutter_local_notifications` desugaring |
| `lib/features/more/presentation/widgets/more_bottom_sheet.dart` | Added `_MoreTile` for Notification Settings above the first `Divider` | Screen was unreachable — no navigation entry point existed |

---

## Files Audited (no changes needed)

| File | Checked For | Result |
|---|---|---|
| `android/settings.gradle.kts` | Source of `4.3.15` version conflict | ✅ FlutterFire CLI added `id("com.google.gms.google-services") version("4.3.15") apply false` here — this is the correct single declaration point |
| `assets/translations/en.json` | `notifications_title` key | ✅ Present: `"notifications_title": "Notification Settings"` |
| `assets/translations/ar.json` | `notifications_title` key | ✅ Present: `"notifications_title": "إعدادات الإشعارات"` |
| `lib/core/router/app_routes.dart` | `notificationSettings` route constant | ✅ Already registered: `'/notification-settings'` |
| `lib/core/router/app_router.dart` | Route case for `notificationSettings` | ✅ Already wired with `BlocProvider<NotificationSettingsCubit>` |

---

## Pending Tasks

- [ ] **E2E notification test** — user is currently running this. Verify each step:
  1. More menu → "إعدادات الإشعارات" → toggle ON → system permission prompt appears → grant it
  2. Check backend `FcmToken` table for new row with device token
  3. Publish a new book from admin panel
  4. Device receives push notification
  5. Tap notification → `BookDetailScreen` opens for that book (deep link)
- [ ] **iOS build test** — not yet tested with the new Firebase / capability changes. Requires a Mac with Xcode.
- [ ] **Android release APK test** — only profile mode was tested this session. Run `flutter build apk --dart-define=ENVIRONMENT=prod` to confirm release build is clean.

---

## What's Next (ordered)

1. **Confirm E2E test result** — user is testing now. If push is not received, check: (a) backend logs for the `POST /notifications/mobile/subscribe` call, (b) `FcmToken` table for the row, (c) whether prod Firebase Admin credentials are set correctly (see handoff 006 → "Handoff to Backend Developer" section).
2. **Android release build** — `flutter build apk --dart-define=ENVIRONMENT=prod` once E2E is confirmed.
3. **iOS build** — on a Mac, run `flutter build ios --dart-define=ENVIRONMENT=prod` and verify the new Xcode capabilities + Firebase config compile cleanly for App Store distribution.

---

## Key References

- Handoff 005 (full FCM mobile + backend implementation): `doc/handoffs/009-ios-appstore-rejection-fix/005-2026-06-30-firebase-fcm-implementation.md`
- Handoff 006 (Xcode + APNs key + backend env var task): `doc/handoffs/009-ios-appstore-rejection-fix/006-2026-06-30-manual-setup-complete-and-backend-handoff.md`
- Handoff 007 (Xcode capabilities verified in repo): `doc/handoffs/009-ios-appstore-rejection-fix/007-2026-06-30-xcode-capabilities-verified.md`
- Handoff 008 (all infrastructure complete, E2E remaining): `doc/handoffs/009-ios-appstore-rejection-fix/008-2026-06-30-all-unblocked-e2e-remaining.md`
- FCM service (mobile): `lib/features/notifications/services/fcm_service.dart`
- Notification settings screen: `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart`
- More bottom sheet (nav entry point added): `lib/features/more/presentation/widgets/more_bottom_sheet.dart`
- Backend FCM service: `web/server/services/fcm.service.ts`
- Firebase project: `console.firebase.google.com/project/books-platform-9cfbb`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Was the Gradle conflict caused by FlutterFire CLI or handoff 005? | Both — FlutterFire CLI correctly added version `4.3.15` to `settings.gradle.kts`; handoff 005 then manually added a conflicting `plugins {}` block with `4.4.2` to `build.gradle.kts`. The `settings.gradle.kts` declaration is the authoritative one in Kotlin DSL. |
| Where should the Notification Settings entry point live? | In `MoreBottomSheet` — the app has no dedicated settings screen; the More menu is the natural home for app-level settings. |

---

## Notes

### Gradle version: keep `4.3.15` (do not upgrade to `4.4.2`)

The FlutterFire CLI picked `4.3.15` when it ran `flutterfire configure`. It is compatible with the current `com.android.application` version `8.11.1` in `settings.gradle.kts`. There is no need to upgrade to `4.4.2` — the handoff 005 change that introduced it was erroneous. Leave `settings.gradle.kts` as-is.

### Desugar library version

`com.android.tools:desugar_jdk_libs:2.1.4` is the current stable version compatible with AGP 8.x. If a future AGP upgrade requires a newer version, the build will tell you explicitly.

### CPH1911 is an Android device (OPPO)

All testing so far has been on Android only. iOS FCM testing requires a real iOS device — simulator cannot receive APNs/FCM pushes.
