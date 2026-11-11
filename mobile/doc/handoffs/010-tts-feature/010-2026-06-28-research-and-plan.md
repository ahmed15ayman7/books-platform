# Session Handoff — 2026-06-28

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Received Apple's second rejection of Books Platform iOS 2.0.0 (build 9) — same Guideline 4.2.2 (Minimum Functionality). Apple still considers the app "primarily marketing material."
- Read both prior handoff files (009) to understand the submission history.
- Decided on **Text-to-Speech (TTS)** as the feature to implement — a genuinely native feature that cannot exist on booksplatform.net and has a proven track record of resolving 4.2.2 rejections for content apps.
- Ruled out Push Notifications — Firebase config files (`google-services.json`, `GoogleService-Info.plist`) are not available; the entire notifications feature is commented out.
- Used `/hit-api` skill to hit live API endpoints for `/articles/:slug`, `/books/:slug`, and `/media` and verified field structures against the existing models.
- Explored all files in the articles, books, and media features relevant to TTS placement.
- Made all design decisions (see Clarifications & Decisions below).
- Was about to enter `/plan` mode — this handoff was created to let a fresh session do the planning cleanly.

## Bugs Found

None — this session was research and design only.

## Files Changed

None — no code was written.

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/features/notifications/services/fcm_service.dart` | Whether Firebase/push was usable | Entire file commented out — blocked on Firebase config files. Not usable. |
| `lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart` | Existing audio player UI pattern to replicate for TTS | Fully implemented — use as visual/structural template for TTS player bar |
| `lib/features/articles/domain/entities/article_detail.dart` | `bodyParagraphs` field for TTS source | `List<String>` — confirmed present |
| `lib/features/articles/data/models/article_detail_model.dart` | How `content` / `contentEn` fields are mapped | Only `content` (AR) is mapped. `contentEn` is ignored. `bodyParagraphs` comes from `content` field as Markdown. |
| `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart` | Where TTS player slots in | After the expand/collapse TextButton, before `SizedBox(height: 20.h)` + `BookDetailBiblioTable` |
| `lib/features/books/domain/entities/book.dart` | `descriptionAr` / `descriptionEn` availability | `descriptionAr: String` (required, always present), `descriptionEn: String?` (nullable) |
| `lib/features/media_creations/domain/entities/media_item.dart` | Whether media items have body text for TTS | No body text. `videoId` + `youtubeUrl` only. TTS not applicable. |
| `assets/translations/en.json` | Existing key structure | 367 lines, nested namespaces. TTS keys go in a new `"tts"` namespace. |
| `assets/translations/ar.json` | Existing key structure | Same structure as EN. |

## API Findings (from live hits)

| Endpoint | Key finding |
|---|---|
| `GET /articles/--54501` | `content` = Arabic Markdown (~8K chars), **has Markdown**. `contentEn` = English plain text (~10K chars), **no Markdown**, but nullable — not always present. |
| `GET /articles/--54499` | `content` = Arabic Markdown, `contentEn` = **null**. Confirmed `contentEn` is not always present. |
| `GET /articles/--54464` (media video) | `content` = **empty string** (0 chars), `contentEn` = null. Video-only articles have no readable body. |
| `GET /books/the-phone-is-a` | `description` (EN) and `descriptionAr` (AR) **both have Markdown** (`**bold**`, `\n\n`). |
| `GET /books/the-hybrid-state-is` | `description` (EN) and `descriptionAr` (AR) **both plain text**, no Markdown. |
| **Conclusion** | Markdown in book descriptions is **inconsistent per book** — must always strip. Articles `content` always has Markdown — always strip. |

## Pending Tasks

- [ ] Write a full implementation plan in plan mode (the session was about to do this — see "What's Next")
- [ ] Add `flutter_tts: ^4.2.0` (verify latest on pub.dev) to `pubspec.yaml`
- [ ] Create `lib/core/widgets/tts_player_widget.dart` — shared StatefulWidget
- [ ] Modify `lib/features/articles/presentation/pages/article_detail_screen/article_detail_body.dart` — insert TTS player sliver
- [ ] Modify `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart` — insert TTS player widget
- [ ] Add TTS translation keys to `assets/translations/en.json` and `assets/translations/ar.json`
- [ ] Run `flutter analyze` — confirm no issues
- [ ] Increment build number to `2.0.0+10` in `pubspec.yaml` before next App Store submission
- [ ] Build iOS release and upload to App Store Connect

## What's Next (ordered)

1. **Enter plan mode** (`/plan`) and write the full implementation plan — all research is done, this is the only step before coding.
2. After plan approval, implement in this order:
   a. Add `flutter_tts` to `pubspec.yaml` + run `flutter pub get`
   b. Create `lib/core/widgets/tts_player_widget.dart`
   c. Wire TTS player into `article_detail_body.dart`
   d. Wire TTS player into `book_detail_info_section.dart`
   e. Add translation keys to both JSON files
   f. Run `flutter analyze`
3. Run the app on iOS simulator, open an article and a book detail — verify TTS plays in Arabic/English.
4. Increment `pubspec.yaml` version to `2.0.0+10`.
5. Build iOS release: `flutter build ios --dart-define=ENVIRONMENT=prod`
6. Archive + upload via Xcode Organizer / Transporter.
7. Reply to Apple and resubmit (build 10).

## Key References

- Prior rejection handoff: `doc/handoffs/009-ios-appstore-rejection-fix/002-2026-06-26-resubmit-reply-and-upload.md`
- Existing audio player to use as UI template: `lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart`
- Article detail body (where TTS sliver is inserted): `lib/features/articles/presentation/pages/article_detail_screen/article_detail_body.dart`
- Book info section (where TTS widget is inserted): `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart`
- Translation files: `assets/translations/en.json`, `assets/translations/ar.json`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should TTS be Push Notifications or Text-to-Speech? | TTS — Firebase config files are unavailable, push notifications are fully blocked. |
| What surfaces should TTS cover? | Books + Articles only. Media excluded (no body text on media cards). |
| Article TTS language — Arabic or follow app locale? | Always Arabic (`ar-SA`). Backend confirmed all article content is Arabic regardless of app locale. |
| Book TTS language — always Arabic or locale-aware? | Locale-aware: `ar-SA` when app locale is `ar`, `en-US` when locale is `en` (with fallback to AR if `descriptionEn` is null). |
| TTS UI pattern — minimal icon button or player bar? | Option B — player bar, matching `ArticleDetailAudioPlayer` (play/pause, stop, speed 1×/1.25×/1.5×/2×). More visible to Apple reviewer and matches existing codebase pattern. |
| English article fallback when `contentEn` is null? | Not needed — articles are always Arabic. `contentEn` is not used at all. |

## Notes

### TtsPlayerWidget — full spec

**File:** `lib/core/widgets/tts_player_widget.dart`

**Why `core/widgets/`:** Used by both `articles` and `books` features — qualifies as a cross-feature shared widget (same rule as `AppLoadingIndicator`, `EmptyStateWidget`, `ErrorStateWidget`).

**Constructor:**
```dart
const TtsPlayerWidget({
  super.key,
  required this.text,        // pre-stripped plain text
  required this.languageCode, // 'ar-SA' or 'en-US'
});
```

**State:**
- `FlutterTts _tts` — created in `initState`, `stop()` + cleanup in `dispose()`
- `bool _isPlaying = false`
- `double _speed = 1.0`
- Speeds: `[1.0, 1.25, 1.5, 2.0]`

**Markdown stripping:** Private static method `_stripMarkdown(String md)` — regex strips `**`, `*`, `##`, `[text](url)`, backticks, `>` blockquotes, image syntax. Called on `text` before passing to TTS engine.

**UI:** Same card container as `ArticleDetailAudioPlayer` — `AppColors.surface`, `BorderRadius.circular(16.r)`, soft box shadow. Row: play/pause `IconButton`, stop `IconButton` (only when playing or paused), speed `DropdownButton<double>`. No seekbar (flutter_tts does not expose a position stream for synthesized speech).

**Header label:** `'tts.listen'.tr()` — single key, same label for both articles and books.

**Translation keys to add:**
```json
// en.json
"tts": {
  "listen": "Listen"
}

// ar.json
"tts": {
  "listen": "استمع"
}
```

### Article TTS placement in `article_detail_body.dart`

Insert a new `SliverToBoxAdapter` after the byline sliver and before the body content sliver:
```dart
if (article.bodyParagraphs.isNotEmpty)
  SliverToBoxAdapter(
    child: Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 0),
      child: TtsPlayerWidget(
        text: article.bodyParagraphs.join('\n\n'),
        languageCode: 'ar-SA',
      ),
    ),
  ),
```

Hidden (not rendered) when `article.bodyParagraphs.isEmpty` — this covers all video-only media articles.

### Book TTS placement in `book_detail_info_section.dart`

Insert after the expand/collapse `TextButton` and before `SizedBox(height: 20.h)`:
```dart
SizedBox(height: 8.h),
TtsPlayerWidget(
  text: locale == 'ar' ? book.descriptionAr : (book.descriptionEn ?? book.descriptionAr),
  languageCode: locale == 'ar' ? 'ar-SA' : 'en-US',
),
```

`descriptionAr` is a required field — always present — so no empty-check needed.

### No build_runner needed

No `@injectable` or `@lazySingleton` classes are added. `flutter_tts` is instantiated directly inside `TtsPlayerWidget.initState()`. Zero DI changes.

### Version for next submission

`pubspec.yaml` version must be `2.0.0+10` (build 9 was the last upload). Increment at the same time as the final build — not before.

### Apple reply strategy for build 10

When resubmitting, include in the reply to Apple:
- TTS is available on every article (tap the "Listen" play button below the byline)
- TTS is available on every book detail page (tap "Listen" below the description)
- Both use on-device Arabic/English text-to-speech — a native capability unavailable on booksplatform.net
