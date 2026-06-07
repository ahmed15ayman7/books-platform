# Session Handoff — 2026-06-07

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- **Wishlist → Bottom Nav (completed in prior session, carried forward):** `BottomNavTab.wishlist` added to the sealed enum; the wishlist screen was updated to a proper nav-tab destination with `BottomNavWidget(activeTab: BottomNavTab.wishlist)`; the "Favourites" tile was removed from the More bottom-sheet; all 10 screens with `_onTabSelected` switch statements were updated with the new `BottomNavTab.wishlist` case (5 in first pass, 5 more found via `flutter analyze` non-exhaustive switch errors).
- **YouTube URL parsing extended:** `_extractVideoId` now handles `youtube.com/embed/ID`, `youtube.com/v/ID`, `youtube.com/shorts/ID`, `youtu.be/ID`, `?v=ID`, and bare 11-char IDs.
- **`article_detail_model.dart` videoUrl fallback:** three-tier fallback `json['youtubeUrl'] ?? json['videoUrl'] ?? constructed from json['videoId']`.
- **iOS ATS fix:** Added `NSAllowsArbitraryLoadsInWebContent: true` to `mobile/ios/Runner/Info.plist` (required for WKWebView to load YouTube IFrame content over HTTP subresources).
- **YouTube player error fallback (this session):** `ArticleDetailVideoPlayer` now subscribes to `_controller.stream` via a `StreamSubscription<YoutubePlayerValue>`; when `value.hasError` becomes true (including YouTube error 152 which maps to `YoutubeError.unknown`), the player is replaced with `_VideoFallback` — a dark container showing the video thumbnail from `img.youtube.com/vi/ID/hqdefault.jpg` with a play icon overlay and "Watch on YouTube" button that opens the YouTube app/browser via `url_launcher`.
- **Translation keys added:** `"watch_on_youtube"` added to both `en.json` and `ar.json`.

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | YouTube error 152-4 on ALL videos in the in-app player | High | `article_detail_video_player.dart` | User screenshot showing YouTube error UI inside the app |
| 2 | Error 152 is not an official YouTube IFrame API error code — it is an internal YouTube WKWebView error (ephemeral cookie store, missing session context) that cannot be fixed purely from app code | High | iOS WKWebView / `youtube_player_iframe` | All videos fail regardless of embedding setting |

## Root Cause Analysis for Error 152

Error 152 is **not** in the `youtube_player_iframe` `YoutubeError` enum (documented codes are 2, 5, 100, 101, 105, 150). It maps to `YoutubeError.unknown(-1)`. This error surfaces specifically in WKWebView on iOS when:
- WKWebView uses an ephemeral data store (no persistent cookies/session)
- YouTube cannot authenticate the playback request in the embedded context
- The app is running on an iOS Simulator (no hardware video decoder)

The fix applied is correct for production: detect any player error and show a graceful fallback that opens YouTube externally.

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart` | Added `StreamSubscription<YoutubePlayerValue>` error detection; added `_VideoFallback` widget with YouTube thumbnail + "Watch on YouTube" button; added YouTube Shorts URL support to `_extractVideoId` | Graceful fallback for error 152 and all other player errors |
| `mobile/assets/translations/en.json` | Added `"watch_on_youtube": "Watch on YouTube"` | Translation for fallback button |
| `mobile/assets/translations/ar.json` | Added `"watch_on_youtube": "شاهد على يوتيوب"` | Arabic translation for fallback button |
| `mobile/ios/Runner/Info.plist` | Added `NSAppTransportSecurity` → `NSAllowsArbitraryLoadsInWebContent: true` | Allow WKWebView to load YouTube IFrame mixed content |
| `mobile/lib/features/articles/data/models/article_detail_model.dart` | `videoUrl` now falls back through `youtubeUrl` → `videoUrl` → constructed from `videoId` field | Backend may send only `videoId`; null `videoUrl` caused silent failure |
| `mobile/lib/core/widgets/bottom_nav_widget.dart` | Added `BottomNavTab.wishlist`; updated tabs array to `[home, books, articles, null(flex:2), wishlist, media, publishers]` | Wishlist moved from More drawer to bottom nav |
| `mobile/lib/features/wishlist/presentation/screens/wishlist_screen/wishlist_screen.dart` | Rewritten as proper nav-tab destination with `BottomNavWidget(activeTab: BottomNavTab.wishlist)` | Matches all other nav-tab screens |
| `mobile/lib/features/more/presentation/widgets/more_bottom_sheet.dart` | Removed wishlist `_MoreTile` | Wishlist now lives in bottom nav |
| 10 screens with `_onTabSelected` | Added `case BottomNavTab.wishlist: Navigator.of(context).pushReplacementNamed(AppRoutes.wishlist)` | Exhaustive switch on sealed enum |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `article_detail_body.dart` | How `videoUrl` flows to the player — confirms `hasVideo && videoUrl != null` guard | Clean; video player only shown when both conditions true |
| `article_detail.dart` (entity) | Fields `hasVideo: bool` and `videoUrl: String?` | Confirmed present |
| `ios/Runner/Info.plist` | ATS configuration correctness | Correct; `NSAllowsArbitraryLoadsInWebContent` at root of `NSAppTransportSecurity` dict |

## Pending Tasks

- [ ] **Verify on real iOS device** — Error 152 may persist on iOS Simulator (no hardware video decoder). Must test on a physical iPhone with `flutter run` (full build, not hot reload) to confirm the fallback works or the native player resolves the issue.
- [ ] **Confirm backend video field names** — The original `// TODO: confirm videoUrl field name with backend (Risk #6)` was never formally confirmed. The model now tries `youtubeUrl`, `videoUrl`, and `videoId`. If the backend uses a different key (e.g., `video`, `link`, `youtube`, `mediaUrl`), the `hasVideo` check may still pass but `videoUrl` could still be null. Worth a quick backend API log check.
- [ ] **Check if `_showFallback` initial state should be driven by network** — Currently defaults to false (tries player first). If the backend video URL is null/empty but `hasVideo` is true, the player gets `videoId: ''` which also causes an error → fallback shows. This is acceptable behavior but worth monitoring.

## What's Next (ordered)

1. Do a **full `flutter run`** (not hot reload) — Info.plist changes are not picked up by hot reload; this is required to activate `NSAllowsArbitraryLoadsInWebContent`.
2. Navigate to an article with a video on a **real iOS device** (not Simulator) and verify: either the YouTube player loads correctly, OR the fallback thumbnail + "Watch on YouTube" button appears and successfully opens YouTube externally.
3. If videos STILL fail even on a real device after the full rebuild: log the actual `widget.videoUrl` value being received to confirm whether the backend is sending a valid URL.
4. If needed, add a `debugPrint` in `initState` to confirm `_videoId` is non-null and correct.

## Key References

- Player widget: `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart`
- Model with videoUrl fallback: `mobile/lib/features/articles/data/models/article_detail_model.dart`
- Body that shows the player: `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_body.dart`
- Bottom nav widget: `mobile/lib/core/widgets/bottom_nav_widget.dart`
- Wishlist screen: `mobile/lib/features/wishlist/presentation/screens/wishlist_screen/wishlist_screen.dart`
- Prior handoff (wishlist + media feature): `doc/handoffs/005-media-creations/002-2026-06-06-bottom-nav-ux-fix.md`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Is "Allow embedding" enabled in YouTube Studio? | Yes — user shared screenshot confirming it is checked |
| Does the ATS fix resolve error 152? | No — user confirmed "also this is not work" after Info.plist change |
| Are ALL videos failing, not just one specific video? | Yes — all videos show error 152-4 |

## Notes

- `url_launcher: ^6.3.2` is already in `pubspec.yaml` — no new dependency added for the fallback.
- The `YoutubePlayerController` does NOT extend `ValueNotifier`/`ChangeNotifier`. Listening requires `StreamSubscription<YoutubePlayerValue>` on `_controller.stream`. Using `addListener` causes a compile error.
- YouTube error code 152 is not in the official IFrame API spec. The package maps it to `YoutubeError.unknown(-1)`. `hasError` returns `true` for any error including `unknown` (since `YoutubeError.none == 0` and `unknown == -1`), so the fallback detection works correctly.
- The `_VideoFallback` thumbnail URL pattern: `https://img.youtube.com/vi/{videoId}/hqdefault.jpg` — always publicly accessible, no auth required.
- **FAB centering math (wishlist nav change):** 8 total flex units `[1,1,1, 2(null), 1,1,1]`; FAB at 50% = center of the `null` slot (which spans 37.5%–62.5%). Confirmed perfect centering.

## Update — 2026-06-07 Later Session

### Implementation Change: In-App Browser Instead of Embedded IFrame

- User chose **Option 2**: keep the media card → article detail flow, but stop rendering YouTube inside the article page via `youtube_player_iframe`.
- `ArticleDetailVideoPlayer` now renders a 16:9 thumbnail launcher and opens the normalized YouTube watch URL with `LaunchMode.inAppBrowserView`.
- If `LaunchMode.inAppBrowserView` fails, it falls back to `LaunchMode.externalApplication`.
- The widget API remains unchanged: `videoUrl` and `showAiDisclosure`.
- `ArticleDetailBody` remains balanced with the new implementation:
  - It still owns page layout and only renders the video widget when `article.hasVideo && article.videoUrl != null`.
  - `ArticleDetailVideoPlayer` owns URL parsing, thumbnail display, and browser launch behavior.
- `youtube_player_iframe` was removed from `mobile/pubspec.yaml`, and `mobile/pubspec.lock` was refreshed with `flutter pub get`.
- A repo scan found no remaining `youtube_player_iframe` / `YoutubePlayer*` references after the change.

### Live API Verification

Python request was run against:

```text
GET https://booksplatform.ahmed15ayman7.com/api/v1/media?page=1&limit=3&sort=newest
GET https://booksplatform.ahmed15ayman7.com/api/v1/articles/--54464
```

Media endpoint response shape:

```text
top-level keys: success, data, pagination
data type: List
pagination keys: page, limit, total, totalPages, hasNextPage, hasPrevPage
```

Sample media item video fields:

```json
{
  "slug": "--54464",
  "imageUrl": "https://img.youtube.com/vi/HoTQhx5QnqE/hqdefault.jpg",
  "channel": "books-talk",
  "videoId": "HoTQhx5QnqE",
  "youtubeUrl": "https://www.youtube.com/watch?v=HoTQhx5QnqE&t"
}
```

Article detail endpoint response shape:

```text
top-level keys: success, data
data type: Map
```

Sample article detail video fields:

```json
{
  "slug": "--54464",
  "channel": "books-talk",
  "videoId": "HoTQhx5QnqE",
  "youtubeUrl": "https://www.youtube.com/watch?v=HoTQhx5QnqE&t",
  "imageUrl": "https://img.youtube.com/vi/HoTQhx5QnqE/hqdefault.jpg",
  "content": ""
}
```

Conclusion:

- Backend sends `videoId` and `youtubeUrl` on both `/media` and `/articles/{slug}` detail responses.
- `ArticleDetailModel` fallback remains correct: `youtubeUrl` → `videoUrl` → constructed URL from `videoId`.
- API `youtubeUrl` may include a dangling `&t`, but `_extractVideoId` reads the `v` query parameter, so it still extracts the correct ID.

### Verification After Option 2

- `flutter pub get` passed.
- `dart format lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart` passed.
- `flutter analyze lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart` passed.
- Full `flutter analyze` still fails only on known unrelated notification router/test issues.
