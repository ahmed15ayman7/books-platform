# Session Handoff — 2026-06-29

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Investigated root cause of "Arabic voice not available" error on Article screen (Android only).
- Confirmed through systematic elimination that the issue is **Android-specific** — iOS works correctly on both articles and books.
- Confirmed the error appears **only after tapping Play** (not on widget init), narrowing it to `setLanguage` returning `0` inside `_play()`.
- Confirmed the error occurs **on fresh app launch → article**, ruling out books-widget disposal as the cause.
- Confirmed **waiting 5–10 seconds before tapping Play still fails**, ruling out Android TTS async init race as the cause.
- Read the full flutter_tts v4.2.5 Android Kotlin source (`FlutterTtsPlugin.kt`) and identified that `setLanguage` uses `tts.isLanguageAvailable(locale)` which on some Android OEMs returns `LANG_NOT_SUPPORTED (-2)` even when a matching voice IS installed.
- Identified that `getVoices()` / `tts.voices` is a separate code path that does NOT use `isLanguageAvailable`, making `setVoice()` the correct bypass.
- Evaluated Claude.ai chat analysis (which suggested `setInitHandler` + Completer pattern) — confirmed `setInitHandler` **does not exist** in flutter_tts 4.2.5; that approach was discarded.
- Applied two fixes: AndroidManifest `<queries>` entry and `_trySetVoiceByLanguage()` fallback in the widget.
- `flutter analyze lib/core/widgets/tts_player_widget.dart` → **No issues found**.

---

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `setLanguage('ar-SA')` returns `0` on Android articles despite Arabic voice being installed | High | `tts_player_widget.dart:_play()` | iOS works; books works; fresh launch → article → always fails regardless of wait time |
| 2 | Missing TTS engine visibility declaration for Android 11+ | High | `android/app/src/main/AndroidManifest.xml` | `<queries>` block existed but lacked `TTS_SERVICE` intent — package visibility restriction causes `isLanguageAvailable` to return -2 on API 30+ |

---

## Root Cause (Detailed)

On Android 11+ (API 30), apps must declare which system intents they query in `<queries>`. Without the `android.intent.action.TTS_SERVICE` intent, the TTS engine is invisible to the app under package visibility restrictions. `TextToSpeech.isLanguageAvailable(locale)` internally queries the TTS service; if that service is invisible, it returns `LANG_NOT_SUPPORTED (-2)` for ALL languages — not because the voice is missing, but because the engine cannot be seen.

This explains:
- **Why it's Android-only** — iOS uses `AVSpeechSynthesisVoice(language:)` which is a static local registry lookup, not a service query.
- **Why books works** — unknown; possibly cached state, timing difference, or the books test was done in an app state where the engine was already bound. The AndroidManifest fix should normalize both.
- **Why waiting doesn't help** — not a timing issue; the service is genuinely invisible without the manifest declaration.

Secondary fallback (`_trySetVoiceByLanguage`) addresses OEM devices where `isLanguageAvailable` still misbehaves after the manifest fix, by using `tts.voices` + `setVoice()` which bypasses `isLanguageAvailable` entirely.

---

## Files Changed

| File | Change | Why |
|---|---|---|
| `android/app/src/main/AndroidManifest.xml` | Added `<intent><action android:name="android.intent.action.TTS_SERVICE"/></intent>` inside existing `<queries>` block | Required for Android 11+ (API 30+) TTS engine visibility — without it `isLanguageAvailable` returns -2 for all languages |
| `lib/core/widgets/tts_player_widget.dart` | Added `_trySetVoiceByLanguage(String langCode)` method; added third fallback call in `_play()` after the existing `ar-SA` → `ar` chain fails | Bypasses `isLanguageAvailable` by scanning `tts.voices` directly and using `setVoice()` to set the voice object without going through the broken OEM check |

---

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `flutter_tts-4.2.5/android/.../FlutterTtsPlugin.kt` | Full source: `onInit` lifecycle, `pendingMethodCalls` queue, `setLanguage`, `isLanguageAvailable`, `getVoices`, `setVoice`, `speak`, `ismServiceConnectionUsable` | Confirmed: `setLanguage` returns 0 when `isLanguageAvailable` < 0; `setVoice` does NOT use `isLanguageAvailable`; `pendingMethodCalls` correctly gates calls until `onInit` fires — init timing is not the issue |
| `flutter_tts-4.2.5/lib/flutter_tts.dart` | Available Dart API methods — specifically checked for `setInitHandler` | `setInitHandler` does NOT exist in v4.2.5; confirmed available methods: `setCompletionHandler`, `setErrorHandler`, `setStartHandler`, `getVoices`, `setVoice`, `getLanguages` |

---

## Pending Tasks

- [ ] **Test the Android fix on a real device** — verify Arabic TTS now works on both articles and books after the manifest + fallback changes
- [ ] Bump `pubspec.yaml` version: `2.0.0+9` → `2.0.0+10`
- [ ] `flutter build ios --dart-define=ENVIRONMENT=prod`
- [ ] Archive in Xcode Organizer → upload via Transporter
- [ ] Reply to Apple in App Store Connect (draft in `doc/handoffs/009-ios-appstore-rejection-fix/003-2026-06-28-tts-feature-complete.md` Notes section)
- [ ] Re-submit build 10 via App Store Connect
- [ ] **Optional / strongly recommended:** Push Notifications (research in `doc/handoffs/006-push-notif-research/push-notification-strategy.md`; code scaffolded in `lib/features/notifications/services/fcm_service.dart` but commented out — blocked on Firebase config files)

---

## What's Next (ordered)

1. **Test the Android fix** — build and install on a real Android device, go directly to any article, tap Play. Arabic TTS should now work. If it still fails, inspect logcat for `TTS ->` error tags (the plugin logs `"*******TTS -> mServiceConnection == null*******"` when the service isn't bound).
2. **Test books are unaffected** — verify Arabic and English TTS still work on books screen.
3. If both pass: bump pubspec version to `2.0.0+10`.
4. `flutter build ios --dart-define=ENVIRONMENT=prod`
5. Archive → upload to App Store Connect.
6. Send Apple reply (use draft from handoff 009).
7. Consider Push Notifications before resubmitting (see Option B in handoff 009).

---

## Key References

- Prior session handoff (TTS feature complete + full bug history): `doc/handoffs/009-ios-appstore-rejection-fix/003-2026-06-28-tts-feature-complete.md`
- Push notification research: `doc/handoffs/006-push-notif-research/push-notification-strategy.md`
- Push notification code (commented out): `lib/features/notifications/services/fcm_service.dart`
- TTS widget: `lib/core/widgets/tts_player_widget.dart`
- Android manifest: `android/app/src/main/AndroidManifest.xml`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Does the error appear immediately on arrival at article screen, or only after tapping Play? | Only after tapping Play — confirmed the issue is in `_play()` from `setLanguage` returning 0, not from the error handler firing during init |
| Does the error occur on fresh launch → article (without visiting books first)? | Yes — always fails even on fresh launch, ruling out books widget disposal as the cause |
| Does waiting 5–10 seconds before tapping Play fix it? | No — still fails, ruling out Android TTS async init race as the primary cause |
| Is the issue on iOS, Android, or both? | **Android only** — iOS works correctly on both articles and books |

---

## Notes

### Why `_trySetVoiceByLanguage` works when `setLanguage` doesn't

`setLanguage` in the Kotlin plugin calls `tts.isLanguageAvailable(locale)`. On Android 11+ without the `TTS_SERVICE` query in `<queries>`, this method queries the TTS service through a bound connection that doesn't exist — returning `LANG_NOT_SUPPORTED (-2)`.

`setVoice` iterates `tts.voices` which is a locally cached set populated during `onInit(SUCCESS)` — it does NOT re-query the service. If Arabic voices exist in the cached set, `setVoice` can set them even when `isLanguageAvailable` incorrectly reports no support.

### Voice selection priority in `_trySetVoiceByLanguage`

The method prefers **offline** voices (`network_required == '0'`) over network-required voices. It takes the first offline match and breaks immediately. If no offline voice is found, it falls back to the first network voice. This ensures TTS works without internet while still working on-the-fly when only a network voice is installed.

### The AndroidManifest fix is the primary fix

The `<queries>` entry is the primary fix — it makes the TTS engine visible, which makes `isLanguageAvailable` return the correct result, which makes `setLanguage` return 1 as expected. The `_trySetVoiceByLanguage` fallback is a defense layer for OEM edge cases where `isLanguageAvailable` misbehaves even with the manifest fix.

### Prior work (not changed in this session)

All TTS bugs from sessions 1 and 2 (Markdown stripping, iOS rate normalization, Arabic voice detection, speed control during playback) remain fixed. This session only addressed the Android-specific article failure.
