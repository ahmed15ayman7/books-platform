# Phase 4 — Prepare Your Flutter App for iOS Release
### Deep Dive · Flutter 3.44 · iOS 26 SDK · Xcode 26 · June 2026

> An expanded, research-backed deep dive into every preparation step before you build your release IPA — covering the 2026 Xcode 26 mandate, the SwiftPM migration replacing CocoaPods, Privacy Manifests, permission auditing, export compliance, and build validation. Every section updated from official Flutter docs, Apple Developer documentation, and current community knowledge.

| | |
|---|---|
| **Flutter version** | 3.44+ (current stable) |
| **Min Xcode** | Xcode 26 (required since Apr 28, 2026) |
| **Min iOS target** | iOS 13 (Flutter minimum) |
| **Est. time** | 2–4 hours first run |

**Tags:** `XCODE 26 REQUIRED` · `SWIFTPM DEFAULT (3.44)` · `COCOAPODS SUNSET DEC 2026` · `PRIVACY MANIFEST ENFORCED`

---

## 🚨 Breaking Change · April 28, 2026

> Since April 28, 2026, Apple rejects all uploads not built with **Xcode 26** and the **iOS 26 SDK**. This applies to new apps and all updates. Confirm your Xcode version before anything else: `xcodebuild -version`. Your deployment target (iOS 13, 14, etc.) is unaffected — this is a **build toolchain** requirement, not a runtime requirement.

---

## Contents

1. [Pre-Build Checks — Do These First](#section-01--pre-build-checks--do-these-first)
2. [Xcode Runner Target Configuration](#section-02--xcode-runner-target-configuration)
3. [Swift Package Manager vs CocoaPods — 2026 Reality](#section-03--swift-package-manager-vs-cocoapods--2026-reality)
4. [Info.plist — Permission Strings Audit](#section-04--infoplist--permission-strings-audit)
5. [Privacy Manifest (PrivacyInfo.xcprivacy)](#section-05--privacy-manifest-privacyinfoxcprivacy)
6. [App Icon, Launch Screen & Asset Audit](#section-06--app-icon-launch-screen--asset-audit)
7. [Export Compliance (Encryption Declaration)](#section-07--export-compliance-encryption-declaration)
8. [Build the Release IPA](#section-08--build-the-release-ipa)
9. [Validate Before Uploading](#section-09--validate-before-uploading)
10. [Phase 4 Checklist](#phase-4-checklist--everything-before-you-upload)

---

## SECTION 01 — Pre-Build Checks — Do These First
⏱ *15 min*

Before touching Xcode or running any build command, run these diagnostics. They surface blocking issues before you've spent time on configuration.

### Step 1 — Confirm Xcode 26 is installed and selected

Apple mandates Xcode 26 for all uploads since April 28, 2026. Check your version and confirm the command-line tools point to the right installation:

```bash
# Check Xcode version — must be 26.x or later
xcodebuild -version

# Check active developer directory (critical on multi-Xcode installs)
xcode-select -p

# Switch active toolchain if needed
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Accept license (needed after any Xcode update)
sudo xcodebuild -license accept
```

### Step 2 — Run `flutter doctor -v` and fix all iOS issues

Every iOS checkmark must be green. Pay attention to the CocoaPods warning — as of Flutter 3.44, CocoaPods is no longer required for most projects (see SwiftPM section), but if your project still uses it, it must be installed and functional.

```bash
flutter doctor -v

# Upgrade to current stable first
flutter upgrade
flutter --version
```

### Step 3 — Verify the app compiles for iOS without code signing

Run a release build compile check *before* fighting App Store Connect metadata. This flag compiles the full release binary without applying signing — it confirms your Dart and native code actually builds:

```bash
flutter clean
flutter pub get
flutter build ios --release --no-codesign
```

> 💡 **Why `--no-codesign` first?**  
> This separates compilation errors from signing errors. Most compile failures (missing Info.plist keys, broken plugins, incompatible deployment targets) surface here before you touch certificates or provisioning profiles.

### Step 4 — Confirm your Bundle ID everywhere it needs to match

The Bundle ID must be identical across: Apple Developer Portal (App ID), App Store Connect (app record), Xcode Runner target, and any third-party services (Firebase, push notifications, deep links). Grep for it in your Xcode project to verify consistency:

```bash
grep -R "PRODUCT_BUNDLE_IDENTIFIER" ios/Runner.xcodeproj/project.pbxproj
```

> ⚠️ **Bundle ID cannot be changed after first submission**  
> Once your first binary is submitted to App Store Connect, the Bundle ID locks permanently. Using `com.example.myapp` (Flutter's default placeholder) will break push notifications, deep links, Firebase, and Sign in with Apple. Set the correct production Bundle ID now.

---

## SECTION 02 — Xcode Runner Target Configuration
⏱ *20 min*

> 🍎 **Always open the `.xcworkspace`, never the `.xcodeproj`**  
> Opening `Runner.xcodeproj` directly misses CocoaPods and SwiftPM dependency integration. Always open `ios/Runner.xcworkspace` in Xcode or from the terminal:
> ```bash
> open ios/Runner.xcworkspace
> ```

### Identity Settings (Runner → General → Identity)

#### Step 1 — Display Name, Bundle Identifier, Version, and Build

In Xcode, select **Runner** in the project navigator → **Runner** target → **General** tab. The fields to set:

- **Display Name** — the label users see under the icon on their home screen
- **Bundle Identifier** — your `com.company.app`, must match Apple Developer Portal
- **Version** — user-facing semver (e.g. `1.0.0`), maps to `CFBundleShortVersionString`
- **Build** — internal increment (e.g. `1`), maps to `CFBundleVersion`; must be unique per upload

```yaml
# pubspec.yaml
# version: name+build — Flutter maps this to Xcode Identity fields
version: 1.0.0+1

# Override at build time if needed:
# flutter build ipa --build-name=1.0.0 --build-number=3
```

#### Step 2 — Deployment Target — minimum iOS version your app supports

Set in Xcode → Runner target → General → Minimum Deployments. Flutter 3.44 supports iOS 13 and later. Your plugins may require a higher minimum. Check each plugin's documentation. Also update the Podfile (if still in use) to match:

```ruby
# ios/Podfile
platform :ios, '13.0'  # Match Xcode deployment target
```

> ⚠️ **SwiftPM requires iOS 15.0+ for many modern packages**  
> If you migrate to Swift Package Manager (now default in Flutter 3.44), many packages including Firebase and maps libraries require iOS 15.0 as the minimum deployment target. If your project targets iOS 12 or 13, you may need to raise it to iOS 15 after migrating.

#### Step 3 — App Category — set or upload will fail validation

In Xcode → Runner target → General → App Category. Select the primary category. Leaving it as "None" causes App Store Connect to reject the binary during processing. If you're unsure, pick the closest match — you can change it in App Store Connect metadata later without re-uploading a binary.

#### Step 4 — Decide iPad support and make it deliberate

Flutter apps are Universal (iPhone + iPad) by default. Apple reviewers **will** test on iPad. If your UI is phone-first and isn't responsive, you have two options:

> 💡 **Option A: Make it responsive (recommended)**  
> Use `LayoutBuilder`, `MediaQuery`, or `AdaptiveScaffold` to adapt the layout. Widens your audience and prevents a common rejection reason (Guideline 2.1 — App Completeness).

> 🍎 **Option B: Explicitly disable iPad**  
> Xcode → Runner → General → Deployment Info → uncheck iPad. Fine for phone-only utilities. You will still need to provide iPhone screenshots — Apple won't ask for iPad screenshots for iPhone-only apps.

#### Step 5 — Capabilities — add only what your app genuinely uses

In Xcode → Runner → Signing & Capabilities, click "+ Capability" for each capability your app needs. Unused capabilities cause rejections. Common Flutter app capabilities:

- **Push Notifications** — required for FCM, OneSignal, etc.
- **Associated Domains** — required for Universal Links and Sign in with Apple
- **Sign in with Apple** — required if you offer Sign in with Apple
- **In-App Purchase** — required for subscriptions/paid content
- **Background Modes** — only add if your app genuinely runs in background

> ⚠️ **Background Modes: add only what you use — and be ready to prove it**  
> If you add a Background Mode (audio, location, fetch) that your app doesn't actively use, Apple will reject you under Guideline 2.5.4. Plugins sometimes add these silently. Audit `ios/Runner/Info.plist` for the `UIBackgroundModes` array and remove any entries not actively used by your app.

---

## SECTION 03 — Swift Package Manager vs CocoaPods — 2026 Reality
⏱ *30–60 min if migrating*

> ⚡ **New in Flutter 3.44: SwiftPM is now the default**  
> As of Flutter 3.44 (May 2026), Swift Package Manager replaces CocoaPods as the default dependency manager for iOS. Running `flutter pub get` on Flutter 3.44+ automatically updates your Xcode project to use SwiftPM. CocoaPods remains as a fallback for plugins that haven't migrated yet.

### The CocoaPods Sunset Timeline

| Date | Event |
|------|-------|
| **Aug 2024** | Flutter 3.24 — SwiftPM support added as opt-in |
| **Oct 2025** | CocoaPods enters maintenance mode — no new features, security fixes only |
| **May 2026 ← Now** | Flutter 3.44 — SwiftPM is now default. Flutter falls back to CocoaPods for plugins without SwiftPM support. 61% of top 100 iOS plugins have migrated. |
| **Oct 2026** | Firebase stops publishing to CocoaPods — last Firebase versions on CocoaPods will be published before this date |
| **Dec 2, 2026** | CocoaPods registry becomes permanently read-only — no new pods, no updates. Projects not on SwiftPM cannot update dependencies after this date. |

### What To Do Now

#### Step 1 — Check if SwiftPM is already active in your Flutter 3.44 project

After upgrading to Flutter 3.44 and running `flutter pub get`, open Xcode and look for `FlutterGeneratedPluginSwiftPackage` under Package Dependencies. Its presence confirms SwiftPM is active.

```bash
# In Xcode: Runner project → Package Dependencies tab
# Look for: FlutterGeneratedPluginSwiftPackage

# Check which plugins still need CocoaPods fallback:
flutter build ios --no-codesign 2>&1 | grep -i "swiftpm\|cocoaPods\|warning"
```

#### Step 2 — Identify plugins not yet on SwiftPM

Flutter will print a warning listing plugins that don't support SwiftPM yet. It falls back to CocoaPods for those automatically, so your build still works — but you'll need CocoaPods installed for those packages. Check each plugin's GitHub for a `Package.swift` file.

> ⚠️ **These warnings will become build errors in a future Flutter release**  
> The fallback is temporary. If a plugin you depend on never migrates to SwiftPM, you'll need to find an alternative package before CocoaPods support is removed from Flutter entirely.

#### Step 3 — If SwiftPM causes issues, temporarily disable it

You can opt out per-project while debugging:

```yaml
# pubspec.yaml
flutter:
  config:
    enable-swift-package-manager: false

# Or disable globally on your machine:
# flutter config --no-enable-swift-package-manager
```

> ⚠️ **Opting out is temporary — don't ship a release on this basis**  
> CocoaPods is being removed. If you opt out to ship a release, file the issue and resolve the incompatibility before your next update. The December 2026 deadline is firm.

#### Step 4 — If pod install still runs (hybrid mode), make sure it succeeds

Flutter 3.44 intelligently runs both SPM and CocoaPods in parallel for projects with mixed dependencies. If pod install fails, fix it before attempting a release build:

```bash
# If you still have a Podfile (hybrid mode):
cd ios
pod install --repo-update
cd ..

# Common fix — clear CocoaPods cache:
pod cache clean --all
pod deintegrate
pod install
```

---

## SECTION 04 — Info.plist — Permission Strings Audit
⏱ *20–40 min*

Apple's automated scanner checks your binary for any API references to protected resources. If a usage description key is absent, your upload is auto-rejected **before a human reviews it**. This applies to any code in your app or any of its plugins — even APIs you never call directly in Dart.

> 💡 **Flutter plugins add API references even when you don't call the permission**  
> Packages like `permission_handler`, `firebase_core`, `image_picker`, and many others reference protected APIs in their compiled native code. Apple's scanner finds the reference regardless of whether you ever invoke it. Audit every plugin in your `pubspec.lock` for required Info.plist keys.

> ⚠️ **Apple scans the binary, not your Dart code — the two-pass permission audit (Transporter error 90683)**  
> Apple's Transporter runs **static binary analysis** on the compiled IPA — not on your Dart source. Any Flutter package that has native iOS code can reference protected APIs (camera, microphone, location, contacts, etc.) in its compiled binary, even if your Dart code never calls those APIs at runtime. Missing the corresponding `NS*UsageDescription` key causes Transporter error 90683 regardless of whether the feature is visible in your UI.  
>
> **The two-pass audit — always run both:**  
> — **Pass 1 (Dart-level):** grep your `lib/` for explicit API calls — `ImageSource.camera`, `Geolocator`, `Permission.microphone`, etc. Keys triggered here need specific, user-facing descriptions.  
> — **Pass 2 (Binary-level):** scan `pubspec.yaml` for every package with native iOS code. Look up or test what protected APIs each package's native binary references — these keys are also required, even if the Dart code never calls them. Honest strings are accepted for features that don't exist in the UI: *"This app does not use the microphone."*  
>
> *Example:* `image_picker` compiles camera capture and video recording code paths into the binary unconditionally. Even if your Dart code only calls `pickImage(source: ImageSource.gallery)`, both `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` are required.  
>
> **How to write accurate strings:** explore first — if code can answer what the feature does, derive the string from code. If only the developer knows (e.g. does an analytics SDK collect location?), ask and help them formulate the right string.

### Required Permission Keys Reference

| Key (Info.plist) | Status | Required when… | Common Flutter plugins |
|---|---|---|---|
| `NSCameraUsageDescription` | **Required if used** | Any camera API access — **also required by `image_picker` regardless of `ImageSource` (binary scan)** | image_picker, camera, qr_code_scanner |
| `NSPhotoLibraryUsageDescription` | **Required if used** | Reading from photo library | image_picker, photo_manager |
| `NSPhotoLibraryAddUsageDescription` | Conditional | Writing/saving to photo library | gallery_saver, image_gallery_saver |
| `NSMicrophoneUsageDescription` | **Required if used** | Audio recording, video with audio — **also required by `image_picker` regardless of `ImageSource` (binary scan)** | image_picker, record, audio_waveforms, camera (video) |
| `NSLocationWhenInUseUsageDescription` | **Required if used** | Any location access | geolocator, google_maps_flutter, location |
| `NSLocationAlwaysUsageDescription` | Conditional | Background location | geolocator (always), background_location |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Conditional | Required alongside Always on iOS 11+ | Same as above |
| `NSContactsUsageDescription` | **Required if used** | Contacts access | contacts_service, flutter_contacts |
| `NSCalendarsUsageDescription` | **Required if used** | Calendar read/write | add_2_calendar, device_calendar |
| `NSFaceIDUsageDescription` | **Required if used** | Face ID / biometrics | local_auth |
| `NSBluetoothAlwaysUsageDescription` | Conditional | Bluetooth LE | flutter_bluetooth_serial, flutter_blue_plus |
| `NSSpeechRecognitionUsageDescription` | Conditional | On-device speech recognition | speech_to_text |
| `NSHealthShareUsageDescription` | Conditional | HealthKit data access | health, flutter_health_fit |
| `NSUserTrackingUsageDescription` | Conditional | ATT — cross-app tracking (AdMob, Meta) | app_tracking_transparency, google_mobile_ads |
| `NSMotionUsageDescription` | Conditional | Accelerometer / motion data | sensors_plus (some usage paths) |
| `NSRemindersUsageDescription` | Conditional | Reminders app access | device_calendar (reminders support) |

### Example Info.plist entries

```xml
<!-- ios/Runner/Info.plist -->

<!-- Camera -->
<key>NSCameraUsageDescription</key>
<string>Used to scan QR codes and capture photos for your reports.</string>

<!-- Photo Library -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Allows you to select images from your library to attach to orders.</string>

<!-- Microphone -->
<key>NSMicrophoneUsageDescription</key>
<string>Used to record voice notes inside tasks.</string>

<!-- Location when in use -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Shows nearby stores while you are using the app.</string>

<!-- Face ID -->
<key>NSFaceIDUsageDescription</key>
<string>Used to unlock your account quickly with Face ID.</string>

<!-- ATT (if using AdMob) -->
<key>NSUserTrackingUsageDescription</key>
<string>We use this to show you more relevant ads.</string>
```

> 💡 **Write specific, user-facing descriptions — vague strings get flagged**  
> Apple reviewers check that descriptions explain the *specific user benefit* of the permission. "We need access to your camera" is too vague. "Used to scan your prescription barcode during checkout" is specific. Specific descriptions pass faster and build user trust.

> ⚠️ **Don't add permissions your app doesn't use — Apple asks why**  
> If Apple's review team spots a permission declared in Info.plist that doesn't map to any observable feature, they may ask you to justify it. Only declare permissions for APIs your app or its active plugins actually invoke.

---

## SECTION 05 — Privacy Manifest (PrivacyInfo.xcprivacy)
⏱ *30–60 min*

Since May 1, 2024, Apple requires apps using **Required Reason APIs** to declare their use in a `PrivacyInfo.xcprivacy` file. This is separate from Info.plist — it covers a different set of APIs. Flutter's engine includes its own manifest, but your app and its plugins may need additional declarations.

### What PrivacyInfo.xcprivacy must declare

**1. Required Reason APIs** — specific APIs that require a disclosed reason for use. The four most common categories:

- `NSPrivacyAccessedAPICategoryUserDefaults` — reading/writing UserDefaults (`shared_preferences`, many SDKs)
- `NSPrivacyAccessedAPICategoryDiskSpace` — checking available disk space
- `NSPrivacyAccessedAPICategoryFileTimestamp` — reading file creation/modification timestamps
- `NSPrivacyAccessedAPICategorySystemBootTime` — reading system boot time

**2. Collected Data Types** — all data your app and its SDKs collect (name, email, usage data, etc.)

**3. Tracking Domains** — domains used for tracking/analytics

### Step 1 — Create PrivacyInfo.xcprivacy in Xcode

In Xcode: **File → New File** → scroll to Resource section → select "App Privacy" → click Next → check the Runner target → click Create. The file is created at `ios/Runner/PrivacyInfo.xcprivacy`. It must be added to your target's bundle resources.

### Step 2 — Declare Required Reason APIs for shared_preferences and common SDKs

Most Flutter apps use `shared_preferences`, which accesses UserDefaults. Many analytics SDKs access disk space and file timestamps. A minimal Privacy Manifest for a typical Flutter app:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <!-- UserDefaults — used by shared_preferences -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>CA92.1</string> <!-- app functionality -->
      </array>
    </dict>
    <!-- Disk Space — used by Firebase Analytics etc. -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>7D9E.1</string> <!-- prevent disk writes failing -->
      </array>
    </dict>
    <!-- System Boot Time — used by crash reporters -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>35F9.1</string> <!-- measure time on device -->
      </array>
    </dict>
  </array>

  <!-- Set to true only if your app does cross-app tracking -->
  <key>NSPrivacyTracking</key>
  <false/>

  <!-- Declare data types your app/SDKs collect -->
  <key>NSPrivacyCollectedDataTypes</key>
  <array/> <!-- populate based on your SDKs -->
</dict>
</plist>
```

### Step 3 — Run Xcode's Privacy Report to audit automatically

Xcode 15+ can generate a Privacy Report from any archive. In **Xcode Organizer → select your archive → Generate Privacy Report**. This scans the entire binary including all frameworks and plugins and lists every Required Reason API found. Use it as your final audit step.

> 💡 **Check your third-party SDKs' own Privacy Manifests**  
> Firebase, Sentry, Google Analytics, and other SDKs provide their own `PrivacyInfo.xcprivacy` files in their packages. These are bundled automatically when the SDK is installed. Your app's manifest only needs to cover APIs your own code accesses directly — but verify SDK manifests exist before submitting.

---

## SECTION 06 — App Icon, Launch Screen & Asset Audit
⏱ *30 min*

### Step 1 — App icon: 1024×1024 px, PNG, no alpha, no transparency

The App Store icon is embedded in your IPA from `ios/Runner/Assets.xcassets/AppIcon.appiconset`. It must be exactly 1024×1024 px, PNG format, with no alpha channel (no transparency), and no rounded corners (Apple applies rounding). An icon with alpha causes an upload error before review:

```bash
# Check for alpha channel using ImageMagick
identify -verbose ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png \
  | grep -i "alpha\|matte\|type"

# Expected: "Type: TrueColor" (no Alpha)
# Bad: "Type: TrueColorAlpha" → strip it:
convert ios/.../Icon-App-1024x1024@1x.png \
  -alpha off ios/.../Icon-App-1024x1024@1x.png
```

### Step 2 — Generate all required icon sizes with flutter_launcher_icons

Xcode requires icons at multiple resolutions. The easiest way to generate all sizes from one source image is the `flutter_launcher_icons` package:

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: ^0.14.0

flutter_launcher_icons:
  ios: true
  image_path: "assets/icon/icon.png"  # 1024x1024 no-alpha PNG
```

```bash
dart run flutter_launcher_icons
```

### Step 3 — Replace the launch screen placeholder

In Xcode, select `Assets.xcassets` in the Runner folder → update `LaunchImage` with your actual launch image. The launch screen should be simple and fast — a static branding moment, not a fake progress screen. Do not use the launch screen to run app initialization logic; any actual loading should happen after the launch screen has dismissed.

### Step 4 — Remove the debug banner

Screenshots submitted with the Flutter debug banner visible are rejected. Ensure your app's root widget has this set:

```dart
// main.dart
MaterialApp(
  debugShowCheckedModeBanner: false, // required for screenshots
  // ...
)
```

---

## SECTION 07 — Export Compliance (Encryption Declaration)
⏱ *10 min*

App Store Connect asks about encryption during submission. Almost every Flutter app uses encryption (HTTPS, TLS, authentication) and must answer this questionnaire. Getting it wrong blocks submission or triggers a legal compliance hold.

> 🍎 **Most Flutter apps qualify for the HTTPS exemption**  
> If your app only uses encryption via standard HTTPS/TLS (networking, Firebase, etc.) and does not implement custom cryptographic algorithms, it qualifies for **Exempt encryption** under US export regulations. You answer "Yes, my app uses encryption" → "Yes, it uses exempt encryption" → no documentation needed.

### Skip the dialog permanently with Info.plist

Add this key to `ios/Runner/Info.plist` to declare the exemption directly in your binary — App Store Connect will stop prompting for every build:

```xml
<!-- ios/Runner/Info.plist -->
<!-- Declare HTTPS-only encryption exemption -->
<!-- Only add this if your app uses ONLY standard HTTPS/TLS -->
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

> ⚠️ **Do NOT set this to `false` if your app implements custom cryptography**  
> If your app uses custom encryption, end-to-end encryption, VPN, password managers, or crypto/blockchain features, you must answer the full questionnaire and potentially provide an Encryption Registration Number (ERN) from the US Bureau of Industry and Security. Setting `ITSAppUsesNonExemptEncryption = false` incorrectly is a legal compliance issue, not just an Apple rejection.

---

## SECTION 08 — Build the Release IPA
⏱ *10–20 min build time*

### Step 1 — Full clean build sequence

Always start from a clean state for a release build. This prevents stale Dart and native artifacts from causing subtle issues in the archive:

```bash
# 1. Clean everything
flutter clean

# 2. Fetch all dependencies fresh
flutter pub get

# 3. Run your tests before building
flutter test

# 4. Build the release IPA
flutter build ipa --release

# Output:
#  Archive: build/ios/archive/Runner.xcarchive
#  IPA:     build/ios/ipa/Runner.ipa
```

### Step 2 — Add obfuscation (recommended for production)

Obfuscation renames Dart symbols in the compiled binary, making reverse engineering significantly harder. It's a one-line addition but requires saving the debug symbols separately — without them, crash stack traces become unreadable:

```bash
flutter build ipa --release \
  --obfuscate \
  --split-debug-info=build/debug-info/ios

# Store build/debug-info/ios/ securely — you'll need it
# to decode crash reports from production.
# Never commit these files to git.
```

> ⚠️ **Don't enable obfuscation for the first time on a rushed release**  
> Obfuscation changes how crash reporters (Firebase Crashlytics, Sentry) symbolicate stack traces. Test that your crash reporting pipeline correctly desymbolcates obfuscated crashes before shipping to production. A broken crash reporter for a production app is very expensive.

### Step 3 — Using ExportOptions.plist for repeatable CI builds

After your first successful Xcode archive export, Xcode saves an `ExportOptions.plist`. Use it for future builds to avoid re-clicking through the Distribute dialog:

```bash
# Use a saved ExportOptions.plist for CI/CD:
flutter build ipa \
  --export-options-plist=ios/ExportOptions.plist
```

### Step 4 — Remove ENABLE_BITCODE if present (older projects)

Apple deprecated Bitcode and removed it entirely from Xcode. Flutter has disabled it by default, but older Flutter projects migrated from before the deprecation may still have the setting. Check and remove it:

```bash
# Check if ENABLE_BITCODE=YES is still set
grep -r "ENABLE_BITCODE" ios/Runner.xcodeproj/project.pbxproj

# If it appears as YES, open Xcode:
# Runner target → Build Settings → search "Bitcode" → set to NO
```

---

## SECTION 09 — Validate Before Uploading
⏱ *15 min*

Validating the archive before uploading catches issues before they reach Apple's server, and avoids wasting a build number on a rejected binary.

### Step 1 — Use Xcode Organizer Validate before Distribute

In Xcode → **Window → Organizer → Archives** → select your build → click **Distribute App** → select App Store Connect → choose **Validate App** (not Upload). This runs Apple's own validation checks locally. Fix every error and warning before uploading. Common items caught: missing entitlements, incorrect bundle ID, unsupported SDK warnings.

### Step 2 — Test the release build on a real device via TestFlight before submitting

The release binary behaves differently from debug. Key things that only appear in release mode:

- Permission dialogs (camera, location, etc.) — won't appear if Info.plist strings are wrong
- Deep links and Universal Links — require proper entitlements and associated domain config
- Push notification token registration
- In-app purchases — Sandbox environment behavior
- iPad layout — always test on a real iPad if your app is Universal

### Step 3 — Increment build number before every upload attempt

App Store Connect rejects any upload with a build number already used, even for rejected builds that never went live. Keep a simple log or use CI build numbers to avoid duplicates:

```bash
# Each upload needs a higher build number than the previous:
flutter build ipa --release \
  --build-name=1.0.0 \
  --build-number=4  # increment this every time
```

---

## Phase 4 Checklist — Everything before you upload

| # | Check | Detail |
|---|---|---|
| ✅ 1 | **Xcode 26 installed and selected** | Required since April 28, 2026. Verify with `xcodebuild -version`. |
| ✅ 2 | **`flutter doctor -v` — all iOS green** | Including Xcode and CocoaPods/SwiftPM checkmarks. |
| ✅ 3 | **Bundle ID is correct and unique** | Set in Xcode, registered in Apple Developer Portal, matches App Store Connect. |
| ✅ 4 | **Version + Build Number set** | Version is user-facing semver. Build is a unique integer — never reuse. |
| ✅ 5 | **SwiftPM status checked** | Flutter 3.44+ uses SwiftPM by default. Know which plugins fall back to CocoaPods. |
| ✅ 6 | **All Info.plist permission strings present** | Run the two-pass audit: (1) grep `lib/` for Dart-level API calls; (2) audit all packages in `pubspec.yaml` for native iOS binary references. Both determine required keys. Explore code to write accurate strings; ask the dev for anything only they can answer. |
| ✅ 7 | **UIBackgroundModes audited** | Remove entries for modes your app doesn't genuinely use. Plugins add these silently. |
| ✅ 8 | **PrivacyInfo.xcprivacy created** | Declares Required Reason APIs (UserDefaults, DiskSpace, etc.). Run Xcode Privacy Report to verify. |
| ✅ 9 | **App icon: 1024×1024, no alpha** | PNG, solid background, no transparency. Strip alpha if present. |
| ✅ 10 | **ITSAppUsesNonExemptEncryption declared** | Set to `false` in Info.plist if HTTPS-only. Stops App Store Connect prompting every build. |
| ✅ 11 | **Debug banner disabled** | `debugShowCheckedModeBanner: false` in your MaterialApp/CupertinoApp. |
| ✅ 12 | **Tested in release mode on real device** | `flutter run --release` on a physical iPhone, not just Simulator. |

---

## Sources

- [docs.flutter.dev/deployment/ios](https://docs.flutter.dev/deployment/ios) — updated May 2026
- [developer.apple.com/news/upcoming-requirements](https://developer.apple.com/news/upcoming-requirements)
- [docs.flutter.dev/packages-and-plugins/swift-package-manager](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers)
- [developer.apple.com — Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
- [firebase.google.com/docs/ios/cocoapods-deprecation](https://firebase.google.com/docs/ios/cocoapods-deprecation)
- Flutter 3.44 release notes

---

*This guide reflects requirements as of June 2026. Apple's SDK requirements and Flutter's tooling evolve annually — verify against official sources before each submission.*
