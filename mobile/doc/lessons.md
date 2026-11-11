# Lessons

Platform gotchas and shared-widget rules learned the hard way. Check them against the code and package source before you change the related files.

## Text input: always `AppTextField`

- Every input field uses `AppTextField` (`lib/core/widgets/app_text_field.dart`: label, required asterisk, password toggle) inside a `Form`. It was added because several screens had static containers that only looked like inputs.
- Validators: `RegexHelper.requiredValidator`, `emailValidator`, `phoneValidator`, `minLengthValidator`. Their messages are the `validation.*` keys in `en.json`/`ar.json`.

## Text-to-speech (`flutter_tts`)

All TTS goes through the shared `TtsPlayerWidget` (`lib/core/widgets/tts_player_widget.dart`) plus `TtsTextChunker` (`lib/core/helpers/tts_text_chunker.dart`), used by the article and book detail screens. Never create a per-feature TTS copy.


Why TTS exists: Apple rejected build 9 under Guideline 4.2.2 (Minimum Functionality), and TTS is the native feature we added to fix that. Full history: `doc/handoffs/009-ios-appstore-rejection-fix/003-*` and `003.2-*`.

- **Android caps each `speak()` call** at `TextToSpeech.getMaxSpeechInputLength()` (about 4000 characters). Longer text fails, and the error path makes it look like "voice not available". Fix: `TtsTextChunker.split()` cuts at sentence ends (Arabic punctuation included), and the widget speaks the chunks one after another. iOS has no limit and does not implement `getMaxSpeechInputLength` (it throws `MissingPluginException`), so chunking runs on Android only.
- **`awaitSpeakCompletion(true)`:** an awaited `speak()` returns 1 when it finishes normally and 0 on stop, pause or error. The chunk loop relies on this, together with the `_playSession` counter. Don't add `setCompletionHandler`: it fires once per chunk and makes the play button flicker.
- **Voice selection:** call `setLanguage` first; only fall back to `setVoice` when `setLanguage` fails. On Android, `getVoices` returns only `name` and `locale` per voice. An older article-only copy of the widget called `setVoice` first, picked network or uninstalled voices, and always showed the error card. That copy was deleted on 2026-07-02.
- Dart's `replaceAll` has no `$1` backreference: use `replaceAllMapped`.
- Strip image markdown completely, or the alt text is read aloud.
- Speech rate is `speed * 0.5` on both platforms (0.5 = natural speed).
- `pause()` works on iOS only, so the pause button calls `stop()`.
- iOS voice locales: fall back from `ar-SA` to `ar`.
- **Tests:** `test/core/widgets/tts_player_widget_test.dart` mocks the `flutter_tts` MethodChannel. Use `variant: TargetPlatformVariant.only(TargetPlatform.android)`. Setting `debugDefaultTargetPlatformOverride` in setUp/tearDown trips a framework check.
