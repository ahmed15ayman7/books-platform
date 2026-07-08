# Session Handoff — 2026-07-05

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Companion doc: `001-2026-06-14-release-prep-complete.md` in this same folder (prior session, Windows machine, first-ever release build + keystore generation).

## What Was Done

This session set up the Android toolchain from scratch on a **new Mac** (`Youssefs-MacBook-Pro`, Darwin arm64) that never had Android build tooling, and fixed a broken `flutter build apk --dart-define=ENVIRONMENT=prod` command the user reported failing.

- Installed Android Studio (user did this), then wired Flutter to it:
  - `flutter config --android-sdk "$HOME/Library/Android/sdk"`
  - Installed missing `cmdline-tools;latest` via Android Studio SDK Manager → SDK Tools tab (GUI).
  - Ran `flutter doctor --android-licenses` (auto-accepted with `yes |`) — all licenses accepted.
  - `flutter doctor` now shows a clean Android toolchain (SDK 36.1.0, Java 21 bundled with Android Studio at `/Applications/Android Studio.app/Contents/jbr/Contents/Home`).
- Set up an emulator (none existed before):
  - Installed system image `system-images;android-36.1;google_apis_playstore;arm64-v8a` (2.3GB, Android 16 "Baklava", Google Play, arm64 — matches Apple Silicon and the already-installed `android-36.1` platform).
  - Created AVD via `avdmanager create avd -n "Pixel_7_API_36" -k "system-images;android-36.1;google_apis_playstore;arm64-v8a" -d "pixel_7"`.
  - Booted it (`emulator -avd Pixel_7_API_36`) — confirmed visible in `flutter devices` as `emulator-5554`.
- Diagnosed and fixed the user's `flutter build apk --dart-define=ENVIRONMENT=prod` failure, which went through **three distinct root causes** across three build attempts (see Bugs Found).
- Final result: **both** the release APK build and a live debug run on the emulator succeeded.
  - `flutter build apk --dart-define=ENVIRONMENT=prod` → `build/app/outputs/flutter-apk/app-release.apk`, 63.7MB, signed correctly.
  - `flutter run -d emulator-5554` → app launched and ran live; confirmed Easy Localization, Firebase Messaging (`FLTFireBGExecutor`, `FLTFireMsgService`), and TTS engine all initialized correctly at runtime.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `com.google.gms.google-services` plugin resolution failed on first attempt | False alarm — not a real bug | Gradle plugin resolution (network layer) | `Plugin [id: 'com.google.gms.google-services'] was not found` after a 16m21s build; reproduced via lightweight `./gradlew help`, resolved cleanly on retry once `JAVA_HOME` was set correctly for the wrapper bootstrap. Plugin is correctly declared in `settings.gradle.kts` (`version("4.3.15") apply false`) and `google-services.json` exists at `android/app/`. One-off network hiccup on first-time resolution — **not recurring**, no fix needed. |
| 2 | `android/key.properties` + `android/upload-keystore.jks` missing entirely | Build-blocking (root cause) | `android/app/build.gradle.kts:30` | `NullPointerException: null cannot be cast to non-null type kotlin.String` at `keystoreProperties["keyAlias"] as String`. These files are correctly gitignored (`.gitignore:42-45`) and were only ever generated on the prior Windows machine (see `001-...md`) — never existed on this Mac. **Fixed**: user had a backup, restored both files from `~/Downloads/` into `android/`. |
| 3 | `key.properties` `storeFile` path doubled the `android` segment again | Build-blocking | `android/key.properties` line 4 | Same exact bug as `001-...md` bug #1: `storeFile=../android/upload-keystore.jks` (resolves to `android/android/upload-keystore.jks` relative to `android/app/`). The restored backup file still had the old broken value. **Fixed**: corrected to `storeFile=../upload-keystore.jks`. |
| 4 | NDK `28.2.13676358` install race condition | Build-blocking (transient) | Gradle auto-install of NDK during `assembleRelease` / `assembleDebug` | Running `flutter build apk` (release) and `flutter run` (debug, targeting the emulator) **concurrently** caused both Gradle processes to auto-install the same NDK version simultaneously. One process hit the folder mid-download and failed fast with `[CXX1101] NDK ... did not have a source.properties file`. **Fixed**: not a code fix — just don't run release and debug Gradle builds at the same time until all shared SDK components (NDK, Build-Tools, Platforms) are fully installed once. |
| 5 | SDK component install lock contention (Build-Tools 35, Platform 36) | Build-blocking (transient) | Gradle auto-install during `assembleRelease` | Same root cause as #4 — two concurrent Gradle builds both tried to auto-install `build-tools;35.0.0` and `platforms;android-36`; one lost the race and got `Warning: Failed to download package!` → `BUILD FAILED`. **Fixed**: let the debug run finish first (it happened to win and installed everything), then retried the release build alone — succeeded. |

## Files Changed

| File | Change | Why |
|---|---|---|
| `android/key.properties` | Restored from user's backup (`~/Downloads/key.properties`); fixed `storeFile` path from `../android/upload-keystore.jks` → `../upload-keystore.jks` | Required by `signingConfigs` in `android/app/build.gradle.kts`; gitignored, must exist locally on every machine |
| `android/upload-keystore.jks` | Restored from user's backup (`~/Downloads/upload-keystore.jks`) | Same keystore as prior session (alias `upload`) — preserves Play Store signing identity |
| (machine-level, not repo) `flutter config --android-sdk` | Set to `$HOME/Library/Android/sdk` | Flutter didn't know where Android Studio installed the SDK |
| (machine-level, not repo) Android SDK: `cmdline-tools;latest`, licenses, system image `android-36.1;google_apis_playstore;arm64-v8a`, NDK `28.2.13676358`, `build-tools;35.0.0`, `platforms;android-34/35/36` | Installed | Required for any Android build/run on this fresh Mac |
| (machine-level, not repo) AVD `Pixel_7_API_36` | Created | No emulator existed on this machine before |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `android/app/build.gradle.kts` | `google-services` plugin application, signing config | Correct — plugin applied, signing config wired to `key.properties` as expected |
| `android/settings.gradle.kts` | `google-services` plugin version declaration | Correct — `id("com.google.gms.google-services") version("4.3.15") apply false` |
| `android/app/google-services.json` | Existence | Present, not modified |
| `.gitignore` | Keystore-related entries | Correct — `key.properties`, `*.jks`, `*.keystore` all present (lines 42-45) |
| `pubspec.yaml` | Firebase packages, version | `firebase_core: ^3.11.0` and `firebase_messaging: ^15.2.4` are **active** (not commented out — resolved since prior session). Current version: `3.0.0+14` |
| `android/gradle.properties` | `kotlin.incremental=false` fix from prior session | Still present, not touched |

## Pending Tasks

- [ ] **Back up `android/upload-keystore.jks` + `android/key.properties` again from this Mac** (or confirm the existing `~/Downloads/` backup / password manager / cloud copy is still current and stored somewhere durable, not just Downloads). Losing this keystore permanently blocks future Play Store updates.
- [ ] Confirm whether the release artifact needed is an APK (already built, `flutter-apk/app-release.apk`) or an AAB for Play Store upload (`flutter build appbundle --dart-define=ENVIRONMENT=prod` — not yet run this session).
- [ ] If uploading to Play Console: bump `versionCode` in `pubspec.yaml` (currently `3.0.0+14`) before the next upload, per prior session's standing rule.
- [ ] Consider moving `key.properties` and `upload-keystore.jks` restore into a documented one-time setup step (e.g. a note in `README.md` or a `doc/` setup guide) so a third machine doesn't hit the same "missing keystore" surprise.

## What's Next (ordered)

1. If a Play Store upload is the goal, build the AAB: `flutter build appbundle --dart-define=ENVIRONMENT=prod` (do this **alone**, not concurrently with any emulator run, to avoid the SDK-lock races seen in this session — first build after fresh tool installs may trigger more one-time SDK component downloads).
2. Back up the keystore files from this Mac to a durable location (not just `~/Downloads`).
3. Bump `versionCode` before uploading anything to Play Console.

## Key References

- Prior session (keystore generation, Windows machine): `doc/handoffs/007-android-release-prep/001-2026-06-14-release-prep-complete.md`
- Release APK output: `build/app/outputs/flutter-apk/app-release.apk` (63.7MB)
- Keystore: `android/upload-keystore.jks` (alias `upload`)
- Signing credentials: `android/key.properties`
- Emulator: AVD `Pixel_7_API_36` (Android 16, Google Play, arm64), device id `emulator-5554`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Do you have a backup of `android/upload-keystore.jks` and `android/key.properties` from the prior Windows machine? | Yes — user located them and placed both files in `~/Downloads/`, which were then moved into `android/`. |

## Notes

- Do **not** run a release build (`flutter build apk`/`appbundle`) at the same time as a debug `flutter run` targeting the emulator until all shared Android SDK components (NDK, Build-Tools, Platforms) are confirmed installed. On a fresh toolchain, both processes race to auto-install the same components via `sdkmanager`, and one loses with a misleading "corrupted" or "failed to download" error even though the actual cause is lock contention, not a real corruption or network outage.
- `JAVA_HOME` is not set in this shell environment by default (`/usr/bin/java` and `/usr/libexec/java_home` both report no runtime found). `flutter build`/`flutter run` work fine because Flutter internally detects and passes the Android Studio–bundled JDK (`/Applications/Android Studio.app/Contents/jbr/Contents/Home`) to Gradle. Any **direct** `./gradlew` invocation from a terminal on this machine needs `JAVA_HOME` exported manually first, e.g.:
  ```bash
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
  export PATH="$JAVA_HOME/bin:$PATH"
  ```
- The plaintext keystore password was visible during this session (read from `key.properties` to fix the path). It was not printed to any command that would echo it into a log — a `keytool -storepass` verification command was attempted but blocked by the permission system specifically because it would have materialized the password as a literal CLI argument in the transcript. That verification was skipped; it was not essential since the actual build later succeeded, which functionally confirms the password/alias are correct.
