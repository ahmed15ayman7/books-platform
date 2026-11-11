# Session Handoff — 2026-06-20

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## Current State

**IPA is built and loaded in Apple Transporter — upload to App Store Connect is in progress (or just completed).**

All code work is done. Everything remaining is App Store Connect UI steps.

---

## What Was Done (this session)

- Read prior handoff (`001-2026-06-20-release-prep-skill.md`) and resumed from where it was interrupted.
- Re-asked the 4 unanswered decisions (signing team, iPad, encryption, data collected) — all answered.
- **Applied all 5 Info.plist / pbxproj fixes:**
  - Added `NSPhotoLibraryUsageDescription` = "Choose a cover image from your photo library to publish a book."
  - Added `LSApplicationQueriesSchemes` = [mailto, tel, http, https]
  - Added `ITSAppUsesNonExemptEncryption` = false
  - Added `LSApplicationCategoryType` = public.app-category.books
  - Changed `TARGETED_DEVICE_FAMILY` from "1,2" (Universal) → "1" (iPhone only) — 3 occurrences in pbxproj
- **Created `ios/Runner/PrivacyInfo.xcprivacy`** and registered it in `project.pbxproj` (PBXFileReference + PBXBuildFile + PBXGroup + PBXResourcesBuildPhase) so it's bundled in the IPA.
- **Changed `DEVELOPMENT_TEAM`** from `6HRTFJ637J` (Youssef's personal Apple ID — no distribution rights) → `PW882S9X59` (Atef Mazhar — has Apple Distribution cert).
- **Changed bundle ID** from `com.joe.booksplatform` → `com.booksplatform.booksplatform` (matches Android `applicationId` in `android/app/build.gradle.kts`) — 3 occurrences in pbxproj.
- User registered App ID `com.booksplatform.booksplatform` and provisioning profile via Xcode (Signing & Capabilities → Automatically manage signing → Atef Mazhar team).
- **`verify.sh` final result: 18/18 PASS, 0 WARN, 0 FAIL.**
- **Built signed IPA successfully:**
  - Archive: `build/ios/archive/Runner.xcarchive` (189MB)
  - IPA: `build/ios/ipa/Books Platform.ipa` (25.3MB)
  - Obfuscation symbols: `build/debug-info/ios/` — **back these up**
- Opened IPA in Apple Transporter — user is delivering/has delivered to App Store Connect.

---

## Files Changed

| File | Change | Why |
|---|---|---|
| `ios/Runner/Info.plist` | Added `NSPhotoLibraryUsageDescription`, `LSApplicationQueriesSchemes`, `ITSAppUsesNonExemptEncryption`, `LSApplicationCategoryType` | Fix 4 missing required/recommended keys for App Store |
| `ios/Runner/Info.plist` | Added `NSMicrophoneUsageDescription`, `NSCameraUsageDescription` | Transporter error 90683 — `image_picker` v1.x compiles in camera+video code paths even though app only calls `pickImage(source: ImageSource.gallery)`; Apple binary scanner requires both keys to be present |
| `ios/Runner/PrivacyInfo.xcprivacy` | **NEW** — Privacy Manifest with UserDefaults/CA92.1, FileTimestamp/C617.1, DiskSpace/7D9E.1; collected data: email, name, phone, user content (all not linked to identity) | Required by Apple for apps using `shared_preferences` |
| `ios/Runner.xcodeproj/project.pbxproj` | `TARGETED_DEVICE_FAMILY` "1,2" → "1"; `DEVELOPMENT_TEAM` `6HRTFJ637J` → `PW882S9X59`; bundle ID `com.joe.booksplatform` → `com.booksplatform.booksplatform`; added PrivacyInfo.xcprivacy to PBXFileReference + PBXBuildFile + PBXGroup + PBXResourcesBuildPhase | Phone-only, correct signing team, matching Android bundle ID, privacy manifest in bundle |

---

## Session Continuation — 2026-06-20 (same day, second upload)

### What happened on first Transporter delivery
- First IPA delivered with 1 error: **error 90683** — `NSMicrophoneUsageDescription` missing.
- Root cause: `image_picker` v1.1.2 compiles camera and video capture code paths into the binary even though the app only calls `pickImage(source: ImageSource.gallery)`. Apple's static binary scanner finds the microphone API reference and requires the key regardless.
- Code confirmed via exploration: only one `image_picker` call exists in the entire codebase — `PublishCubit.pickCoverImage()` using gallery-only, no camera, no video.

### Fix applied
- Added `NSMicrophoneUsageDescription` = "This app does not use the microphone."
- Added `NSCameraUsageDescription` = "This app does not use the camera."
- IPA rebuilt: `build/ios/ipa/Books Platform.ipa` (25.9MB, same version 2.0.0 build 6)
- Re-delivered via Apple Transporter — user clicked Deliver on second attempt.

---

## Pending Tasks — App Store Connect (ordered)

- [ ] **Confirm IPA upload succeeded in Transporter** — green checkmark, no errors.
- [ ] **Create App Store Connect app record** (if not done yet):
  - App Store Connect → My Apps → `+` → New App
  - Name: Books Platform
  - Primary language: Arabic or English (whichever is primary)
  - Bundle ID: `com.booksplatform.booksplatform`
  - SKU: any unique string (e.g. `booksplatform-ios-2025`)
- [ ] **TestFlight smoke test on a real iPhone:**
  - App Store Connect → TestFlight → Internal Testing → add yourself
  - Install via TestFlight app, smoke-test: home, book detail, publish flow, cart, search
- [ ] **Fill App Store metadata:**
  - Screenshots: required sizes are **6.7"** (iPhone 16 Pro Max) and **6.1"** (iPhone 16). Can use Simulator screenshots.
  - Description (up to 4000 chars), What's New, Keywords (100 chars max)
  - Support URL and Privacy Policy URL (required — must be a real URL)
  - Age Rating: complete the questionnaire (likely 4+ or 12+ depending on content)
- [ ] **Submit for review:**
  - Select the uploaded build (version 2.0.0, build 6)
  - Review notes: "Books platform app — reader and publisher experience"
  - Export compliance: select "No" (uses standard HTTPS only, already declared in Info.plist)
  - Advertising Identifier (IDFA): No
  - Click Submit for Review

---

## What's Next (ordered)

1. **Verify Transporter delivery succeeded** — check for green checkmark. If it errored, check the error message and report it.
2. **Create the App Store Connect app record** — use bundle ID `com.booksplatform.booksplatform`.
3. **Wait for build to process** (10–30 min) — App Store Connect emails when done.
4. **Install on real iPhone via TestFlight** and smoke-test.
5. **Fill metadata** — screenshots, description, keywords, URLs.
6. **Submit for review.**

---

## Known Non-Blocking Issues

| Issue | Severity | Notes |
|---|---|---|
| Launch image is Flutter default placeholder | Non-blocking for upload, may get Guideline 4.0 comment | Replace before or shortly after first submission — `ios/Runner/Assets.xcassets/LaunchImage.imageset/` |
| Cart checkout `onPressed: () {}` is a stub | Not an App Store blocker | Reviewers will tap Checkout — it does nothing. Add a "coming soon" snackbar or disable the button before submission if concerned. |

---

## Key Facts

| Item | Value |
|---|---|
| Bundle ID | `com.booksplatform.booksplatform` (matches Android) |
| Version | 2.0.0 (build 6) |
| Signing team | Atef Mazhar — `PW882S9X59` |
| Distribution cert | Apple Distribution: Atef Mazhar (PW882S9X59) |
| Flutter version | 3.41.9 (CocoaPods, not SPM) |
| IPA path | `build/ios/ipa/Books Platform.ipa` (25.3MB) |
| Debug symbols | `build/debug-info/ios/` — keep these |
| Deployment target | iOS 13.0 |
| Device family | iPhone only (TARGETED_DEVICE_FAMILY = "1") |

---

## Clarifications & Decisions (locked — do not re-ask)

| Question | Answer |
|---|---|
| Signing team: proceed as-is or verify in Xcode first? | Proceed as-is → then user fixed via Xcode Signing & Capabilities |
| iPad support: keep Universal or disable? | Disable — iPhone only (TARGETED_DEVICE_FAMILY = "1") |
| Export compliance: HTTPS-only exempt? | Yes — `ITSAppUsesNonExemptEncryption = false` |
| What user data does the app collect? | Email (newsletter, ratings, comments, publish), Name (comments, publish), Phone (publish only), User content (comments, ratings, manuscripts) — all NOT linked to identity, no login/account system |
| Bundle ID to use? | `com.booksplatform.booksplatform` — must match Android |
| How far should the skill take us? | Through a signed IPA — ✅ achieved |

## Key References

- `~/.claude/skills/run-ios-release-prep/verify.sh` — re-run anytime with `--build` to rebuild IPA
- `ios/Runner/Info.plist` — all permission strings and App Store keys
- `ios/Runner/PrivacyInfo.xcprivacy` — privacy manifest
- `ios/Runner.xcodeproj/project.pbxproj` — team, bundle ID, device family
- `flutter-ios-phase4-deep-dive.md` — original iOS release guide (source of truth)
- Prior handoff (now deleted): `doc/handoffs/008-ios-release-prep/001-2026-06-20-release-prep-skill.md`
