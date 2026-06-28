# Session Handoff — 2026-06-28

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Received Apple's third response to the 4.2.2 rejection (same Guideline, same build 9 — see attached reply below in Notes).
- Implemented the full TTS (Text-to-Speech) feature from the plan in `doc/handoffs/010-tts-feature/010-2026-06-28-research-and-plan.md`.
- Added `flutter_tts: ^4.2.0` to `pubspec.yaml` and ran `flutter pub get`.
- Created `lib/core/widgets/tts_player_widget.dart` — shared `StatefulWidget` covering both articles and books.
- Wired TTS into `article_detail_body.dart` (sliver after byline, hidden when `bodyParagraphs.isEmpty`).
- Wired TTS into `book_detail_info_section.dart` (after the expand/collapse TextButton, before BiblioTable).
- Added `"tts": { "listen": ..., "voice_not_available": ... }` to both `en.json` and `ar.json`.
- Debugged and fixed 5 bugs discovered during live testing (see Bugs Found below).
- Verified: English TTS works perfectly. Arabic TTS works perfectly on both iOS and Android when an Arabic voice is installed. If not installed, the widget shows a localized "install Arabic voice" message instead of broken audio.
- `flutter analyze` → **No issues found**.
- **NOT YET DONE**: version bump, iOS build, upload, Apple reply.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `replaceAll(RegExp, r'$1')` — Dart does not support backreference strings; `**bold**` was replaced with literal `$1` | High | `_stripMarkdown` in `tts_player_widget.dart` | TTS reading "$1" aloud |
| 2 | `![صورة](url)` — image regex kept alt text; TTS said "صورة" (picture) mid-sentence | High | `_stripMarkdown` | Live API `/articles/--54501` has inline images |
| 3 | iOS speech rate `1.0` = maximum speed (not natural); rate range differs per platform | High | `_initTts()` | iOS: 0–1 where 0.5 is natural; Android: 0–2 where 1.0 is natural |
| 4 | `pause()` is iOS-only no-op on Android — speech continued when pause button tapped | Medium | `_pause()` | flutter_tts docs confirm Android doesn't support pause |
| 5 | `setLanguage('ar-SA')` fails silently when Arabic voice not installed — engine falls back to English voice, reads Arabic text phonetically as English gibberish | High | `_initTts()` | User confirmed: English perfect, Arabic "strange English words" |

## Files Changed

| File | Change | Why |
|---|---|---|
| `pubspec.yaml` | Added `flutter_tts: ^4.2.0` | TTS engine |
| `pubspec.lock` | Updated by `flutter pub get` | Dependency resolution |
| `lib/core/widgets/tts_player_widget.dart` | **NEW FILE** — full TTS player widget | Shared across articles + books |
| `lib/features/articles/presentation/pages/article_detail_screen/article_detail_body.dart` | Added TTS sliver + import | Apple reviewer can tap Listen on any article |
| `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart` | Added TTS widget + import | Apple reviewer can tap Listen on any book |
| `assets/translations/en.json` | Added `"tts": { "listen", "voice_not_available" }` | Localized UI strings |
| `assets/translations/ar.json` | Added `"tts": { "listen", "voice_not_available" }` | Localized UI strings |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/features/articles/data/models/article_detail_model.dart` | How `bodyParagraphs` is built from API; what text TTS actually receives | `_parseBodyParagraphs` returns single-element list containing full `content` field (Arabic Markdown, ~8498 chars) — TTS strips Markdown before speaking |
| `lib/features/books/data/models/book_model.dart` | Field mapping for `descriptionAr` / `descriptionEn` | `descriptionAr` ← `json['descriptionAr']`; `descriptionEn` ← `json['description']` (NOT `json['descriptionEn']`) — both fields contain Markdown, both stripped before speaking |
| `lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart` | UI template to match | Used as visual/structural reference for TTS card |

## API Verification (live hits during session)

| Endpoint | Key finding |
|---|---|
| `GET /articles/--54501` | `content` = Arabic Markdown, 8498 chars, contains `![صورة](url)` inline images — image regex fix was critical |
| `GET /books/alan-pinkerton-americas-legendary` | `descriptionAr` has `**bold**\n\n...` Markdown; `descriptionEn` key in API is `description` (not `descriptionEn`) — model maps correctly |

## Pending Tasks

- [ ] Bump `pubspec.yaml` version: `2.0.0+9` → `2.0.0+10`
- [ ] `flutter build ios --dart-define=ENVIRONMENT=prod`
- [ ] Archive in Xcode Organizer → upload via Transporter or Organizer
- [ ] Reply to Apple in App Store Connect citing TTS feature (see Apple Reply draft in Notes)
- [ ] **Optional / strongly recommended:** Implement Push Notifications as a second native feature to further de-risk 4.2.2 rejection (research already done — see `doc/handoffs/006-push-notif-research/push-notification-strategy.md`)

## What's Next (ordered)

**Option A — Submit build 10 now with TTS only (faster)**
1. Read `doc/handoffs/010-tts-feature/010-2026-06-28-research-and-plan.md` for context.
2. Bump `pubspec.yaml` version to `2.0.0+10`.
3. `flutter build ios --dart-define=ENVIRONMENT=prod`
4. Archive in Xcode → upload.
5. Reply to Apple (use draft in Notes below).
6. Re-submit build 10 via App Store Connect.

**Option B — Add Push Notifications first (stronger submission)**
1. Read `doc/handoffs/006-push-notif-research/push-notification-strategy.md` — full FCM vs OneSignal research is already done.
2. **Blocker:** Firebase config files (`google-services.json`, `GoogleService-Info.plist`) were unavailable in the prior session — check if they are available now. The `firebase_messaging` code is fully commented out in `lib/features/notifications/services/fcm_service.dart`.
3. If config files are available: uncomment and wire up FCM, implement notification permission request on first launch, and confirm backend can send push events.
4. If still unavailable: consider OneSignal (no Firebase project needed — see strategy doc §1 Option B).
5. After push is working, bump to `2.0.0+10`, build, upload, and reply to Apple citing BOTH TTS and Push Notifications.

**Recommendation:** Go with Option B if Firebase config files are now available — two native features is a much stronger resubmission. If still blocked on Firebase, ship Option A immediately (TTS alone has resolved 4.2.2 for content apps historically).

## Key References

- TTS feature research + all design decisions: `doc/handoffs/010-tts-feature/010-2026-06-28-research-and-plan.md`
- Push notification full research: `doc/handoffs/006-push-notif-research/push-notification-strategy.md`
- Push notification code (commented out): `lib/features/notifications/services/fcm_service.dart`
- Prior rejection fix history: `doc/handoffs/009-ios-appstore-rejection-fix/001-2026-06-25-app-store-rejection-fix.md`
- Prior submission reply: `doc/handoffs/009-ios-appstore-rejection-fix/002-2026-06-26-resubmit-reply-and-upload.md`
- iOS release prep guide: `doc/handoffs/008-ios-release-prep/flutter-ios-phase4-deep-dive.md`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should TTS use pause or stop on button press? | Stop — `pause()` is iOS-only no-op on Android; both platforms behave identically with `stop()` since TTS always restarts from beginning anyway |
| Is the `flutter_tts` package supported for both iOS and Android? | Yes — but requires native Arabic voice to be installed on device. Widget now checks availability and shows localized install instructions if missing |
| Should image alt text be kept when stripping Markdown? | No — remove entire image tag. Alt text like "صورة" is meaningless in audio context and sounds like a random word |

## Notes

### Apple's latest reply (June 27, 2026)

```
Guideline 4.2.2 — Design — Minimum Functionality

"We noticed that the app's main functionality is to market your service,
with limited or no user-facing interactive features or functionality."

Review Device: iPad Air 11-inch (M3)
Version reviewed: 2.0.0 (9)
Submission ID: cfdbc13b-79d3-4686-a7be-7379747b7dec
```

This was the same rejection as before — build 9 did not include TTS. Build 10 will include TTS and should be used for resubmission.

---

### Draft Apple reply for build 10

> Thank you for your continued review. We have added significant native functionality in build 10 that is not available on booksplatform.net:
>
> **Text-to-Speech (TTS) — available on every article and every book:**
> - On every article detail page, a "Listen" player bar appears below the byline. Tap play to hear the full article read aloud in Arabic using the device's on-device Arabic voice engine.
> - On every book detail page, a "Listen" player bar appears below the description. Tap play to hear the book description read aloud in Arabic or English depending on the app's language setting.
> - Both use the device's native TTS engine (AVSpeechSynthesizer on iOS) — a capability that cannot exist on the website and requires the native app.
> - Playback speed can be adjusted: 1×, 1.25×, 1.5×, 2×.
>
> This is a genuinely native, interactive feature available to every user on every piece of content in the app. We believe this directly addresses the 4.2.2 feedback. Please let us know if you need any additional information.

---

### TtsPlayerWidget — implementation summary

- **File:** `lib/core/widgets/tts_player_widget.dart`
- **Constructor:** `TtsPlayerWidget({ required String text, required String languageCode })`
- **Language codes used:** Articles → always `ar-SA`; Books → `ar-SA` when locale is `ar`, `en-US` when locale is `en` (with `descriptionAr` fallback if `descriptionEn` is null)
- **Markdown stripping:** `_stripMarkdown()` — images removed entirely, bold/italic unwrapped with `replaceAllMapped`, headings/code/blockquotes stripped, whitespace normalized
- **Speed:** `_toTtsRate(speed)` — multiplies by 0.5 on iOS so 1× = natural speed (0.5 on iOS scale); passes through on Android
- **Language availability:** `setLanguage()` return value checked; falls back from `ar-SA` → `ar`; shows `tts.voice_not_available` message if unavailable
- **No DI changes:** `FlutterTts` instantiated directly in `initState()` — no build_runner run needed
