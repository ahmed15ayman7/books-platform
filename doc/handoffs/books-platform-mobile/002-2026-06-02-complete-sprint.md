# Session Handoff — 2026-06-02

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- **121/122 tasks complete** — only T093 (Firebase config files) remains, hard-blocked on client.
- **Step 0 — Import fixes** (pre-work):
  - Removed `dart:io` from `publish_cubit.dart:1`
  - Removed `api_envelope.dart` + `failure.dart` from `books_remote_data_source_test.dart`
  - Removed `dartz.dart` from `ratings_remote_data_source_test.dart`
- **Step 1 — Build runner + baseline (T088, T106)**:
  - Ran `dart run build_runner build` from `mobile/`; registered `PublishCubit`, `PublishRemoteDataSource`, `StubFileUploadServiceImpl`, `NewsletterCubit`, `NewsletterRemoteDataSource`, `NewsletterRepositoryImpl`
  - Fixed `books_remote_data_source_test.dart` — mocks now use correct generic type params (`get<Book>`, `get<BookStats>`, `get<PaginatedResponse<Book>>`)
  - 19 tests → 26 tests passing by end of session
- **T049 + T051 — Tests now passing**: books and ratings remote data source tests
- **T107 — NewsletterBottomSheet** created at `mobile/lib/features/newsletter/presentation/widgets/newsletter_bottom_sheet.dart`: `BlocProvider<NewsletterCubit>` wrapper, `AppTextField` (max 254 chars, validate on submit), AR/EN locale toggle chips, `BlocListener` for success/error, 60s resend `TextButton` via `Timer`
- **T108 — HomeNewsletterStrip updated**: `mobile/lib/features/books/presentation/pages/home_screen/home_newsletter_strip.dart` rewritten as a tappable banner (`GestureDetector`) that opens `NewsletterBottomSheet` via `BottomSheetHelper.showAppBottomSheet`
- **T109 — Newsletter test** at `test/features/newsletter/data/newsletter_remote_data_source_test.dart`: 3 tests (success, alreadySubscribed:true, source:'mobile' in POST body)
- **T055 — MoreBottomSheet** created at `mobile/lib/features/more/presentation/widgets/more_bottom_sheet.dart` with 8 `ListTile` rows (Wishlist, Recommended, Translated, Notifications, About, Contact, Privacy, Terms); wired via `IconButton(Icons.menu_rounded)` in `home_screen.dart`'s `AppBarWidget.trailing`
- **T089 — PublishScreen refactored** to `BlocConsumer<PublishCubit, PublishState>`; `StatefulWidget` retained only for TextEditingControllers; step driven by cubit; `PublishReviewStep` created for Step 2 (review + content standards checkbox); `_SuccessScreen` shown on `PublishSuccess`; `PublishBookStep` updated with file/cover picker callbacks and formData feedback
- **T089 — AppRouter.publish** updated to `BlocProvider(create: (_) => getIt<PublishCubit>(), child: const PublishScreen())`
- **T090 — publish_cubit_test.dart** at `test/features/publish/presentation/publish_cubit_test.dart`: 4 tests (nextStep increments, prevStep preserves formData, checkEligibility emits correct states, submit calls uploadFile before submitBook) — all pass
- **T094-T101 — Firebase Notifications** (T093 blocked, code complete and commented):
  - `FcmService` at `mobile/lib/features/notifications/services/fcm_service.dart` (`@lazySingleton`): initialize/onMessage/onMessageOpenedApp/getInitialMessage, requestPermission→bool, getToken→String?, _showLocalNotification (flutter_local_notifications), _handleNotificationTap (deep-link routing by `type`/`slug`)
  - `NotificationsRemoteDataSource` at `mobile/lib/features/notifications/data/datasources/notifications_remote_data_source.dart` (`@lazySingleton`): stub, returns `Right(unit)` (Risk #1)
  - `NotificationsRepository` at `mobile/lib/features/notifications/domain/repositories/notifications_repository.dart` (abstract)
  - `NotificationsRepositoryImpl` at `mobile/lib/features/notifications/data/repositories/notifications_repository_impl.dart` (`@LazySingleton(as: NotificationsRepository)`)
  - `NotificationSettingsCubit` at `mobile/lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` — upgraded from basic SharedPreferences to full FcmService flow (requestPermission → getToken → registerFcmToken → save flag)
  - `NotificationSettingsScreen` — upgraded with `_permissionDenied` check via `FirebaseMessaging.instance.getNotificationSettings()` + `TextButton` → `launchUrl('app-settings:')`
  - `main.dart` — Firebase init commented out (blocked T093); `FcmService.initialize()` commented out; first-launch soft pre-prompt dialog (`_NotifPrePromptDialog`) implemented with Allow/Not Now — `FcmService.requestPermission()` call commented out pending T093
  - Ran build_runner; `FcmService`, `NotificationsRemoteDataSource`, `NotificationsRepositoryImpl`, `NotificationSettingsCubit` all confirmed in `injection_container.config.dart`
- **T078 — PublisherBookModel** created at `mobile/lib/features/publishers/data/models/publisher_book_model.dart`; `toEntity()→PublisherBook` (avoids cross-feature import of `Book` from books feature)
- **T066 — Media Rendering**:
  - `ArticleDetailVideoPlayer` at `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart`: YouTube iframe (16:9 AspectRatio), AI disclosure banner for `novel-story` channel
  - `ArticleDetailAudioPlayer` at same folder: just_audio player with play/pause IconButton, Slider seek bar, duration/position Text, speed DropdownButton([1.0, 1.25, 1.5, 2.0])
  - `ArticleDetailBody` updated to render correct player based on `article.channel`
- **Translation keys added** to both `en.json` and `ar.json`: `publish.review_title`, `publish.content_standards`, `publish.eligibility_free/paid`, `publish.success_title`, `publish.submit_another`, `publish.back_to_home`, `publish.cover_label`, `notifications_prompt_title/body/not_now/allow`
- **Final state**: `flutter analyze` → No issues. `flutter test` → 26/26 passing.
- **tasks.md**: 121 marked `[X]`, 1 remaining `[ ]` (T093 — hard blocked)

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `books_remote_data_source_test.dart` used `get<dynamic>` stubs but implementation calls `get<Book>`, `get<BookStats>`, `get<PaginatedResponse<Book>>` — mocktail doesn't match across type params | Medium | `test/features/books/data/books_remote_data_source_test.dart` | `type 'Null' is not a subtype of type 'Future<Either<Failure, Book>>'` at runtime |
| 2 | Prior session mark: T055 and T078 were marked `[X]` in tasks.md but not implemented | Low | `specs/001-books-platform-mobile/tasks.md` | Files/directories not present when checked |

**Fix applied for bug 1**: Changed all `when` stubs to match the exact generic type (`get<Book>`, `get<BookStats>`, `get<PaginatedResponse<Book>>`).
**Fix applied for bug 2**: Implemented T055 and T078 in this session.

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/lib/features/publish/presentation/cubit/publish_cubit.dart` | Removed `dart:io` unused import | flutter analyze warning |
| `mobile/test/features/books/data/books_remote_data_source_test.dart` | Fixed mock type params; removed unused imports | Test failures + analyze warnings |
| `mobile/test/features/ratings/data/ratings_remote_data_source_test.dart` | Removed `dartz` unused import | flutter analyze warning |
| `mobile/lib/features/newsletter/presentation/widgets/newsletter_bottom_sheet.dart` | **NEW** | T107 |
| `mobile/lib/features/books/presentation/pages/home_screen/home_newsletter_strip.dart` | Rewritten as tappable banner | T108 |
| `mobile/test/features/newsletter/data/newsletter_remote_data_source_test.dart` | **NEW** | T109 |
| `mobile/lib/features/more/presentation/widgets/more_bottom_sheet.dart` | **NEW** | T055 |
| `mobile/lib/features/books/presentation/pages/home_screen/home_screen.dart` | Added `Icons.menu_rounded` trailing + More drawer import | T055 |
| `mobile/lib/features/publish/presentation/pages/publish_screen/publish_screen.dart` | Rewritten as `BlocConsumer<PublishCubit>` | T089 |
| `mobile/lib/features/publish/presentation/pages/publish_screen/publish_review_step.dart` | **NEW** | T089 |
| `mobile/lib/features/publish/presentation/pages/publish_screen/publish_book_step.dart` | Added `onPickFile`, `onPickCover`, `formData` params | T089 |
| `mobile/lib/features/publish/presentation/pages/publish_screen/publish_navigation_section.dart` | Made `onPrimary` nullable; added `isLoading` param | T089 |
| `mobile/lib/core/router/app_router.dart` | `AppRoutes.publish` wrapped in `BlocProvider<PublishCubit>` | T089 |
| `mobile/test/features/publish/presentation/publish_cubit_test.dart` | **NEW** | T090 |
| `mobile/lib/features/notifications/services/fcm_service.dart` | **NEW** | T094 |
| `mobile/lib/features/notifications/data/datasources/notifications_remote_data_source.dart` | **NEW** | T095 |
| `mobile/lib/features/notifications/domain/repositories/notifications_repository.dart` | **NEW** | T096 |
| `mobile/lib/features/notifications/data/repositories/notifications_repository_impl.dart` | **NEW** | T097 |
| `mobile/lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` | Upgraded to FcmService + NotificationsRepository | T098 |
| `mobile/lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart` | Added OS permission check + open-settings button | T099 |
| `mobile/lib/main.dart` | Firebase init stub + FCM init stub + soft pre-prompt dialog | T101 |
| `mobile/lib/core/di/injection_container.config.dart` | Regenerated — new DI registrations | build_runner |
| `mobile/lib/features/publishers/data/models/publisher_book_model.dart` | **NEW** | T078 |
| `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_video_player.dart` | **NEW** | T066 |
| `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart` | **NEW** | T066 |
| `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_body.dart` | Added video/audio player conditionals | T066 |
| `mobile/assets/translations/en.json` | Added 8 publish + 4 notification prompt keys | T089, T101 |
| `mobile/assets/translations/ar.json` | Same keys in Arabic | T089, T101 |
| `specs/001-books-platform-mobile/tasks.md` | Marked T049, T051, T066, T078, T081–T090, T094–T109 as `[X]` | progress tracking |

## Pending Tasks

- [ ] **T093** — Hard-blocked. Client must provide Firebase config files:
  - `google-services.json` → `mobile/android/app/`
  - `GoogleService-Info.plist` → `mobile/ios/Runner/`
  - Add `apply plugin: 'com.google.gms.google-services'` to `mobile/android/app/build.gradle`
  - Add Google Services classpath to `mobile/android/build.gradle` `buildscript.dependencies`
  - After files provided: uncomment Firebase init in `main.dart:21-28` and FCM init at `main.dart:32`

## What's Next (ordered)

1. **Client must resolve T093** — provide Firebase project config files (see above). Once done, uncomment the two commented blocks in `main.dart` and run `flutter build apk` to verify Firebase links correctly.
2. **Verify `publish.cover_label` key is used** — the translation key `publish.cover_label` was added to `en.json`/`ar.json`; confirm it's displayed correctly in `PublishBookStep` when no cover is selected.
3. **Wire `eligibility check on email blur`** — `PublishScreen` has `checkEligibility` in cubit but the `PublishAuthorStep` email field has no `onFocusLost` callback wired yet. Add `FocusNode` to `_emailCtrl` in `_PublishScreenState` and call `context.read<PublishCubit>().checkEligibility(_emailCtrl.text)` on focus lost.
4. **Backend: confirm `videoUrl` field name** (Risk #6) — both `article_detail_video_player.dart` and `article_detail_audio_player.dart` have `// TODO: confirm ... (Risk #6/7)` comments. Once confirmed, remove comments.
5. **Production build test** — run `flutter build apk --dart-define=ENVIRONMENT=prod` and verify no compile errors before release.

## Key References

- Task list: `specs/001-books-platform-mobile/tasks.md` (121/122 complete)
- Architecture rules: `mobile/CLAUDE.md` (non-negotiable)
- DI config (generated): `mobile/lib/core/di/injection_container.config.dart`
- Flutter path: `/Users/youssefemadeldin.ai/develop/flutter/bin/flutter`
- Firebase init (blocked): `mobile/lib/main.dart:21-32` (two commented blocks)
- T093 blocker comment in `main.dart`, `fcm_service.dart`, `notifications_remote_data_source.dart`, `notifications_repository_impl.dart`, `notification_settings_cubit.dart`, `notification_settings_screen.dart`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| No questions were asked — implementation followed the handoff spec exactly | — |

## Notes

- **`PublishCubit` is `factoryAsync`** in DI (because `SharedPreferences` is `@singleton Future<SharedPreferences>`). The router uses `getIt<PublishCubit>()` (sync) — this works because after `configureDependencies()` all async singletons are resolved, making subsequent sync calls safe. Same pattern as `WishlistCubit`.
- **`PublisherBook` entity** (`mobile/lib/features/publishers/domain/entities/publisher_book.dart`) already existed from a prior session. `PublisherBookModel.toEntity()` maps to it, avoiding cross-feature `Book` import.
- **`MoreBottomSheet`** lives in `mobile/lib/features/more/presentation/widgets/` — a new `more` feature directory was created. It has no cubit or data layer (pure navigation sheet).
- **Translation key inconsistency**: `home_newsletter_strip.dart` previously used `home.newsletter_title` (nested key) but en.json has `newsletter_title` at the top level. The rewritten `HomeNewsletterStrip` now uses `newsletter_title`.tr() and `newsletter_subtitle`.tr() which are confirmed to exist in en.json (lines 211–212).
- **Test count**: Prior session baseline was 13 tests; now 26 tests. New tests added: 3 books DS tests (fixed), 3 newsletter DS tests, 4 publish cubit tests, 3 search repo tests (these were already added last session and now pass reliably).
- **`FcmService.getToken()`** was changed to return `String?` (vs original void) so `NotificationSettingsCubit.togglePush()` can pass the token to `registerFcmToken()`.
- **`article_detail_video_player.dart`**: Uses a `YoutubePlayerController.fromVideoId` which accepts both `youtu.be/ID` and `?v=ID` URL formats via `_extractVideoId()` helper. Falls back to treating the whole URL as the video ID if parsing fails.
