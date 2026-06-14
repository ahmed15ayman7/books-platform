# Session Handoff — 2026-06-14

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Read the Phase 2 Flutter release prep guide at `D:\Programing\Flutter\001-How Upload App\android\002-flutter-phase2-additions.html` and assessed the full project against its checklist.
- Changed `applicationId` and `namespace` from `com.example.booksplatform` → `com.booksplatform.booksplatform`.
- Added `key.properties`, `*.jks`, and `*.keystore` to `.gitignore` before creating any keystore files.
- Generated upload keystore (`android/upload-keystore.jks`) — RSA 2048-bit, 10,000 days, alias `upload`, CN=Books Platform, C=EG.
- Created `android/key.properties` with credentials pointing to the keystore.
- Rewrote `android/app/build.gradle.kts` to load `key.properties` and use a proper `release` signingConfig with R8 shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`).
- Configured adaptive app icon in `pubspec.yaml`: flat icon = `app_icon_removed_bg_1024.png`, adaptive foreground = `logo-removebg-1024.png` (transparent bg logo), adaptive background = `#FFFFFF`.
- Ran `dart run flutter_launcher_icons` — confirmed `mipmap-anydpi-v26/` folder was created.
- Created `build_release.ps1` — single command to build the production AAB with obfuscation.
- Added `android:allowBackup="false"`, `android:fullBackupContent="false"`, `android:dataExtractionRules="@xml/data_extraction_rules"` to `AndroidManifest.xml`.
- Created `android/app/src/main/res/xml/data_extraction_rules.xml` — excludes all domains from cloud backup and device transfer.
- Fixed Kotlin incremental compilation crash (caused by project on D:\ and Pub cache on C:\) by adding `kotlin.incremental=false` to `android/gradle.properties`.
- Fixed `key.properties` storeFile path: was `../android/upload-keystore.jks` (wrong — doubled the android segment), corrected to `../upload-keystore.jks`.
- Built the release AAB successfully: **43.6 MB** at `build/app/outputs/bundle/release/app-release.aab`.
- Extracted all `.so` native libraries from the AAB and verified 16 KB page alignment using `llvm-readelf` from NDK 28.2 — all 4 libraries pass.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `storeFile` path doubled `android` segment | Build-blocking | `android/key.properties` line 4 | Build error: `android\android\upload-keystore.jks not found` — **already fixed** |
| 2 | Kotlin incremental compiler crashes when project and Pub cache are on different drives | Build-blocking | `android/gradle.properties` | `IllegalArgumentException: this and base files have different roots` — **fixed via `kotlin.incremental=false`** |

## Files Changed

| File | Change | Why |
|---|---|---|
| `.gitignore` | Added `key.properties`, `*.jks`, `*.keystore` | Prevent secrets from being committed |
| `android/app/build.gradle.kts` | New applicationId/namespace, Properties import, release signingConfig, R8 enabled | Core release setup |
| `android/key.properties` | New file — keystore credentials | Required by signing config |
| `android/upload-keystore.jks` | New file — upload keystore | Signs the AAB for Play Store |
| `android/gradle.properties` | Added `kotlin.incremental=false` | Fixes cross-drive Kotlin compiler crash |
| `pubspec.yaml` | Added `adaptive_icon_foreground`, `adaptive_icon_background`, `min_sdk_android` to `flutter_launcher_icons` block; Firebase packages commented out by user | Adaptive icon + Firebase not yet configured |
| `android/app/src/main/AndroidManifest.xml` | Added `allowBackup`, `fullBackupContent`, `dataExtractionRules` attributes to `<application>` | Play Console Data Safety compliance |
| `android/app/src/main/res/xml/data_extraction_rules.xml` | New file | Required by `dataExtractionRules` attribute |
| `build_release.ps1` | New file — production build script | Single command with all required flags |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `android/app/src/main/AndroidManifest.xml` | `android:exported` on all Activities | ✅ MainActivity has `exported="true"` |
| `android/app/src/main/AndroidManifest.xml` | `<queries>` block for intent visibility | ✅ Present (PROCESS_TEXT + https) |
| `android/gradle/wrapper/gradle-wrapper.properties` | Gradle version | ✅ 8.14 |
| `android/settings.gradle.kts` | AGP version | ✅ 8.11.1 (above required 8.5.1) |
| `pubspec.yaml` | Flutter SDK compatibility | ✅ 3.41.9 (well above 3.32+) |
| NDK | 16 KB alignment capability | ✅ 28.2.13676358 |
| `build/aab_inspect/base/lib/arm64-v8a/*.so` | 16 KB LOAD segment alignment | ✅ All 4 `.so` files pass (min 16384 bytes) |

## Pending Tasks

- [ ] Back up `android/upload-keystore.jks` and `android/key.properties` to a location outside the repo (USB, password manager, cloud). **Critical — losing the keystore means you can never update the Play Store listing.**
- [ ] Back up `build/app/outputs/symbols/` (3 files: `app.android-arm.symbols`, `app.android-arm64.symbols`, `app.android-x64.symbols`) — needed to read crash stack traces from obfuscated production builds.
- [ ] Upload `build/app/outputs/bundle/release/app-release.aab` to Play Console → Internal Testing track first.
- [ ] Configure Firebase (the packages are currently commented out in `pubspec.yaml`) — add `google-services.json`, uncomment `firebase_core` and `firebase_messaging`, call `Firebase.initializeApp()`.
- [ ] Add `mailto` intent to `<queries>` block in `AndroidManifest.xml` if the app sends emails via `url_launcher`.
- [ ] Increment `versionCode` in `pubspec.yaml` (`version: 1.0.0+2`) before each new Play Store upload — the current `+1` will be consumed by the first upload.

## What's Next (ordered)

1. **Back up the keystore** — before doing anything else.
2. **Upload to Play Console Internal Testing** — use the AAB at `build\app\outputs\bundle\release\app-release.aab`. Upload symbol files from `build\app\outputs\symbols\` to Play Console → Android Vitals for automatic crash deobfuscation.
3. **Configure Firebase** — when ready, add `google-services.json` to `android/app/`, uncomment the two Firebase lines in `pubspec.yaml`, call `await Firebase.initializeApp()` in `main.dart`, run `flutter pub get`, rebuild.
4. **Check `url_launcher` usage** — if the app opens email links, add `mailto` to the `<queries>` block in `AndroidManifest.xml`.
5. **Future releases** — always build with `.\build_release.ps1` and bump `versionCode` (+1 each upload) in `pubspec.yaml` before building.

## Key References

- Release prep guide: `D:\Programing\Flutter\001-How Upload App\android\002-flutter-phase2-additions.html`
- Production build command: `.\build_release.ps1` (project root)
- AAB output: `build\app\outputs\bundle\release\app-release.aab`
- Symbol files: `build\app\outputs\symbols\`
- Keystore: `android\upload-keystore.jks`
- Signing credentials: `android\key.properties`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| What should the production `applicationId` be? | `com.booksplatform.booksplatform` |
| What alias for the keystore key? | `upload` |
| What store/key password? | User provided — stored in `android/key.properties` (not repeated here) |
| What does `app_icon_removed_bg_1024.png` look like? | Dark background with white "B" + red bookmark logo — used as flat/legacy icon |
| What is `logo-removebg-1024.png`? | Full horizontal brand logo (BOOKS PLATFORM / INTERNATIONAL BOOKS PLATFORM) on transparent background — used as adaptive icon foreground on white background |

## Notes

- Firebase (`firebase_messaging`, `firebase_core`) is **commented out** in `pubspec.yaml`. The app will not compile with Firebase until `google-services.json` is added and the packages are uncommented. This is intentional — user left it as a TODO.
- The `kotlin.incremental=false` fix is permanent and safe — it slightly slows Kotlin compilation but is the correct fix for cross-drive builds on Windows. It can be removed if the project and Pub cache are ever on the same drive.
- AAB size is 43.6 MB — within the acceptable range (25–60 MB). The actual user download will be ~20–30% smaller due to Play Dynamic Delivery.
- The `mipmap-anydpi-v26/` folder now exists, confirming adaptive icons are generated.
- versionCode is currently `1` (from `version: 1.0.0+1` in pubspec.yaml). The first Play Store upload consumes this. All subsequent uploads need a higher number.
