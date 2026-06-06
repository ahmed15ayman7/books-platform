# Session Handoff — 2026-06-06

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

---

## What Was Done (Previous Session)

### Articles screen fixes
- **Removed video play-button overlay** from `ArticlesFeaturedCard` and `ArticlesArticleRow` — articles list always shows the cover photo now.
- **"See more / See less"** added to `ArticleDetailBodyContent`: if total content > 250 chars, content is clipped to 200dp with a gradient fade; "اقرأ المزيد" / "اقرأ أقل" toggle expands/collapses. Translation keys added to `ar.json` and `en.json`.
- **"All" tab content bug fixed**: the `/articles` endpoint (no channel filter) returns `books-talk` and `novel-story` video-only articles alongside text articles. Those video articles have `content = null` so users saw "no content". Fix: `ArticlesListCubit._filterContentOnly()` drops any article whose `channel` is not in `{'world-reads', 'harvest', 'ideas'}` when the "all" tab is active.

### Root-cause investigation
- Confirmed via Python HTTP requests that `books-talk` / `novel-story` articles carry `videoId` + `youtubeUrl` but zero `content`.
- Confirmed text articles from all content channels have 2 000–20 000 chars of Markdown content in the `/articles/{slug}` detail endpoint.

---

## New Feature to Build: `media_creations`

### Product brief
| | |
|---|---|
| Screen title (EN) | **Media Creations** |
| Screen title (AR) | **إبداعات الميديا** |
| Flutter feature folder | `lib/features/media_creations/` |
| Channels served | `books-talk`, `novel-story` |
| Bottom nav position | **Between articles and publishers** (4th slot, shifting publishers to 5th) |
| UI direction | Similar to articles feature — channel tab chips + card list — but adapted for video-first content |

---

## API — Confirmed Response Shape

**⚠️ CRITICAL: The new session MUST make live HTTP requests to verify the API before writing any model code. Do not trust this snapshot blindly — re-fetch in the new session.**

### List endpoint

```
GET https://booksplatform.ahmed15ayman7.com/api/v1/media?page=1&limit=12&sort=newest&channel={channel}
```

Channels: `books-talk` | `novel-story`

#### Top-level envelope
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 4,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Per-item shape (both channels identical)
```json
{
  "id": "cmq1aqrew000a07ppovq1r19r",
  "slug": "--54463",
  "title": "عرب لا نراهم | حكايات العرب المنسيين في قلب إسرائيل",
  "excerpt": "",
  "imageUrl": "https://img.youtube.com/vi/-oeGWH9mxZ8/hqdefault.jpg",
  "channel": "books-talk",
  "date": "2026-06-05T00:00:00.000Z",
  "videoId": "-oeGWH9mxZ8",
  "youtubeUrl": "https://youtu.be/-oeGWH9mxZ8",
  "authorFirstName": null,
  "authorLastName": null,
  "isFeatured": false,
  "articleCategory": { "name": "Book Talk", "nameAr": "حديث الكتب", "slug": "book-talk" },
  "products": [],
  "readingTimeMinutes": null
}
```

Key observations:
- `imageUrl` is always the YouTube thumbnail (`https://img.youtube.com/vi/{videoId}/hqdefault.jpg`)
- `videoId` is always present and non-null for both channels
- `youtubeUrl` is always `https://youtu.be/{videoId}`
- `excerpt` is always empty string `""`
- `articleCategory` is `null` for `novel-story` items; an object for `books-talk`
- `readingTimeMinutes` is `null` for all media items
- `authorFirstName` / `authorLastName` are `null`

#### Channel totals (as of 2026-06-06)
| Channel | Total items |
|---|---|
| `books-talk` | 4 |
| `novel-story` | 1 |

### Detail endpoint
**There is NO `/media/{slug}` detail endpoint** — returns HTTP 404.
Use the existing articles detail endpoint instead:
```
GET https://booksplatform.ahmed15ayman7.com/api/v1/articles/{slug}
```
This returns `videoId`, `youtubeUrl`, and empty `content` for media items — confirmed working.

---

## Files That Need to Be Created

```
lib/features/media_creations/
├── data/
│   ├── datasources/
│   │   └── media_remote_data_source_impl.dart    (@lazySingleton)
│   ├── models/
│   │   └── media_item_model.dart                 (fromJson + toEntity)
│   └── repositories/
│       └── media_repository_impl.dart            (@LazySingleton(as: MediaRepository))
├── domain/
│   ├── entities/
│   │   └── media_item.dart                       (pure Dart + Equatable)
│   ├── repositories/
│   │   └── base_media_repository.dart            (abstract)
│   └── (no use_cases — single-cubit, no complex domain logic)
└── presentation/
    ├── cubit/
    │   └── media_list_cubit/
    │       ├── media_list_cubit.dart              (@injectable)
    │       └── media_list_state.dart              (sealed class)
    └── pages/
        └── media_screen/
            ├── media_screen.dart
            ├── media_body.dart
            ├── media_video_card.dart              (primary card widget — video thumbnail + play + title)
            └── media_shimmer.dart
```

No detail screen needed — tapping a media item opens the existing `ArticleDetailScreen` via `ArticleDetailArgs(id: item.slug, title: item.title)`. The detail screen already handles `hasVideo = true` articles correctly (shows `ArticleDetailVideoBadge` + `ArticleDetailVideoPlayer`).

---

## Files That Need to Be Modified

| File | Change needed |
|---|---|
| `lib/core/router/app_routes.dart` | Add `static const String media = '/media';` |
| `lib/core/router/app_router.dart` | Add `case AppRoutes.media` with `BlocProvider(create: (_) => getIt<MediaListCubit>())` wrapping `MediaScreen` |
| `lib/core/widgets/bottom_nav_widget.dart` | Add `media` to `BottomNavTab` enum between `articles` and `publishers`; add the new tab icon/label in the nav bar builder |
| `lib/core/di/injection_container.config.dart` | Auto-generated — run `dart run build_runner build --delete-conflicting-outputs` after adding `@injectable` / `@lazySingleton` classes |
| `assets/translations/ar.json` | Add `"media": { "title": "إبداعات الميديا", "books_talk": "حديث الكتب", "novel_story": "رواية وقصة", "all": "الكل", "empty": "لا محتوى بعد" }` |
| `assets/translations/en.json` | Add `"media": { "title": "Media Creations", "books_talk": "Book Talk", "novel_story": "Novel & Story", "all": "All", "empty": "No content yet" }` |
| Every screen's `_onTabSelected` switch | Add `case BottomNavTab.media:` → `Navigator.of(context).pushReplacementNamed(AppRoutes.media)` |

Screens with `_onTabSelected` that need updating (grep for `BottomNavTab.publishers`):
- `lib/features/articles/presentation/pages/articles_screen/articles_screen.dart`
- `lib/features/articles/presentation/pages/article_detail_screen/article_detail_screen.dart`
- `lib/features/home/presentation/pages/home_screen/home_screen.dart`
- `lib/features/books/presentation/pages/...` (books screens)
- `lib/features/publishers/presentation/pages/...` (publishers screens)

---

## Architecture Notes

- Use `PaginatedResponse<MediaItem>` from `lib/core/network/api_envelope.dart` for pagination — same pattern as articles.
- `MediaItemModel.fromJson` reads `videoId`, `youtubeUrl`, `imageUrl`, `title`, `slug`, `channel`, `date`, `articleCategory`.
- `hasVideo` is always `true` for media items (all have `videoId`). No need to guard — but keep the field on the entity for consistency.
- No `content` / `bodyParagraphs` fields on `MediaItem` entity — media items are video-only.
- Channel tabs in the cubit: `[All (slug=''), books-talk, novel-story]`. "All" calls the API without a channel param.
- `MediaListCubit` channels should be defined similar to `ArticlesListCubit.channels`.
- `YoutubePlayerController` is already available via `youtube_player_iframe` (already in `pubspec.yaml` — used by `ArticleDetailVideoPlayer`). No new dependency needed.
- When user taps a media card → navigate to existing `ArticleDetailScreen` using `ArticleDetailArgs(id: item.slug, title: item.title)`. No new detail screen.

---

## UI Direction

- **Layout**: channel chip strip at top (same as articles) + vertical list of video cards below.
- **Video card**: full-width thumbnail (16:9 `AspectRatio`) with play icon overlay, title below, channel label + date in byline.
- **Play icon**: centered white circle with `Icons.play_arrow_rounded` (same style as the one removed from articles cards).
- **No featured card pattern** (unlike articles) — all items are equal-weight video cards.
- **Consistency**: match `AppColors`, `GoogleFonts.cairo`/`tajawal`, `AppShadows.soft`, `BorderRadius.circular(16.r)` from the rest of the app.
- Run `flutter analyze` before marking done — zero new issues.

---

## Mandatory First Steps in New Session

1. **Re-fetch the API live** — confirm item shape hasn't changed since this snapshot:
   ```
   GET /media?page=1&limit=12&sort=newest&channel=books-talk
   GET /media?page=1&limit=12&sort=newest&channel=novel-story
   ```
2. **Present a plan** to the user before writing any code — user explicitly requested plan-first.
3. **Check `bottom_nav_widget.dart` in full** before editing — understand the exact widget structure.
4. **Check `app_router.dart` in full** — understand existing route patterns before adding the new case.
5. After implementing, run `dart run build_runner build --delete-conflicting-outputs` and `flutter analyze`.

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Why does the "all" tab show no content? | The API returns `books-talk`/`novel-story` video articles mixed in. They have no text body. Fixed by filtering to content channels only in `ArticlesListCubit`. |
| Should video articles appear in the articles screen? | No — they belong in the new "Media Creations" section, not the articles screen. |
| What is the new section called? | "Media Creations" (EN) / "إبداعات الميديا" (AR) |
| Where does it go in the bottom nav? | Between articles (3rd) and publishers (now 5th). Media becomes 4th. |
| Is there a detail screen for media items? | No. Tap → opens existing `ArticleDetailScreen` via `ArticleDetailArgs`. |
| What channels does the media feature serve? | `books-talk` and `novel-story` only. |
| Is there a `/media/{slug}` detail endpoint? | No — 404. Use `/articles/{slug}` instead (already works for these slugs). |

---

## Key References

- Architecture rules: `mobile/CLAUDE.md`
- Articles feature (UI to mirror): `lib/features/articles/`
- Existing video player widget: `lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart`
- Bottom nav widget: `lib/core/widgets/bottom_nav_widget.dart`
- Router: `lib/core/router/app_router.dart` and `lib/core/router/app_routes.dart`
- API envelope / pagination helpers: `lib/core/network/api_envelope.dart`
- Previous articles session: `doc/handoffs/004-articles-markdown/001-2026-06-06-articles-markdown-body.md`
