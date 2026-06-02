# Implementation Plan: Books Platform Mobile Application

**Branch**: `001-books-platform-mobile` | **Date**: 2026-06-02 | **Spec**: `specs/001-books-platform-mobile/spec.md`

---

## Context

The Books Platform mobile app is a Flutter companion to the web platform. The codebase already has a production-quality architecture (Clean Architecture, GetIt DI, Cubit state management, RTL/LTR localization) and 7 features built against **mock data** (books, articles, publishers, search, cart, publish, onboarding). This plan completes the app by: (1) replacing all mock data with real API calls to `https://booksplatform.net/api/v1`, (2) fixing one architecture violation in SearchCubit, (3) building 10 net-new features (wishlist, ratings/comments, newsletter, push notifications, recommended-for-translation, translated-books, static pages, notification settings, home stats, complete home wiring). The one-sprint delivery constraint demands all 17 modules of the spec be production-ready, with tests for all new domain/data logic.

---

## Summary

This plan wires 7 existing mock-data features to the real REST API and builds 10 new features, transforming the app into a fully functional production mobile app against `https://booksplatform.net/api/v1`. All work extends the existing Clean Architecture without restructuring it, with a targeted fix of the single existing architecture violation (SearchCubit depending directly on a data source). Delivery is one sprint with 18 execution groups (A–R) ordered by dependency.

---

## Technical Context

| Field | Value |
|---|---|
| Platform | Flutter (Dart 3.11+), targeting iOS (App Store) + Android (Google Play) |
| Architecture | Clean Architecture: Presentation (Cubits/Screens) → Domain (Entities/Repos) → Data (DataSources/Models) |
| State Management | flutter_bloc ^9.1.1 (Cubits only — no Blocs) |
| DI | GetIt ^9.2.1 + injectable ^3.0.0 (build_runner generated) |
| Networking | Dio ^5.9.2 via ApiManager (Either<Failure, T>) |
| Local Storage | flutter_secure_storage (tokens), shared_preferences (wishlist, cart, flags) |
| Navigation | Named routes via AppRouter.generateRoute |
| Localization | easy_localization ^3.0.3 (ar.json / en.json, 187 keys currently) |
| Design System | AppColors (#B11E2E primary), AppTextStyles (Cairo/Tajawal/Inter), ScreenUtil 390×844 |
| New packages to add | file_picker ^8.x, image_picker ^1.x, youtube_player_iframe ^5.x, just_audio ^0.9.x, firebase_messaging ^15.x, flutter_local_notifications ^18.x, firebase_core ^3.x |
| Code generation | injectable_generator + build_runner (run after every DI annotation change) |
| Test framework | flutter_test (bloc_test for cubits) |

---

## Constitution Check

**Principle 1 — Clean Architecture (NON-NEGOTIABLE):**
- ⚠️ VIOLATION (existing): `SearchCubit` directly injects `PublishersRemoteDataSourceImpl` — bypasses domain layer entirely. **Fixed in Group E.**
- ⚠️ VIOLATION (existing): `PublishScreen` is a pure `StatefulWidget` with no cubit — business logic inside UI. **Fixed in Group J.**
- ⚠️ VIOLATION (potential): `BooksRemoteDataSource.getTopPublishers()` calls the publishers API path — cross-feature data layer dependency. **Fixed in Group L (HomeContentCubit injects both repos).**
- All new features strictly follow: domain returns entities, data sources return `Either<Failure, T>`, no try/catch outside ApiManager.

**Principle 2 — State Management:**
- Compliant in all existing features. All new BlocProviders go into `AppRouter.generateRoute`.
- BookDetail route needs `MultiBlocProvider` (BookDetailCubit + WishlistCubit + RatingsCubit + CommentsCubit) — handled in Group P.

**Principle 3 — Test-First:**
- No tests exist currently. Group R adds unit tests for all new domain/data logic.
- Tests are added per feature group as each feature is built.

**Principle 4 — Minimal Safe Changes:**
- `ApiManager._extractMessage` is a 3-line targeted fix.
- Entity updates are strictly additive (new nullable fields + backward-compat getters).
- No renaming of existing public methods or properties used by existing UI.

**Principle 5 — Security:**
- FCM tokens stored via `SecureStorageHelper` — never logged.
- Submission honeypot field (`website: ''`) sent in request body, never shown in UI.
- No secrets hardcoded; base URLs come from `--dart-define=ENVIRONMENT=...`.

**Flutter Rules Compliance:**
- `PublishScreen` refactor wraps all steps in `SingleChildScrollView`.
- All new screens have `SafeArea` at Scaffold body level.
- Pinned bottom buttons use `Scaffold.bottomNavigationBar`.
- All padding uses `EdgeInsetsDirectional`, all alignment uses `AlignmentDirectional`.
- `AspectRatio(2/3)` for all book cover images.

---

## Project Structure — New Files to Create

```
mobile/lib/
├── core/
│   ├── constants/
│   │   ├── api_constants.dart            [MODIFY] real URLs
│   │   └── app_constants.dart            [MODIFY] kWishlistKey, kCartKey, kNotifOptInKey
│   ├── network/
│   │   ├── api_envelope.dart             [CREATE] ApiEnvelope<T>, PaginatedResponse<T>, PaginationMeta
│   │   └── api_manager.dart              [MODIFY] fix _extractMessage
│   ├── router/
│   │   ├── app_routes.dart               [MODIFY] +10 route constants
│   │   ├── app_router.dart               [MODIFY] +10 route cases, BookDetail → MultiBlocProvider
│   │   └── args/
│   │       └── static_page_args.dart     [CREATE]
│   └── storage/
│       ├── wishlist_storage.dart         [CREATE] SharedPreferences CRUD for slug list
│       └── cart_storage.dart             [CREATE] SharedPreferences CRUD for cart items
│
├── features/
│   ├── books/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── book.dart             [MODIFY] +slug, imageUrl, purchaseOption, referralLink, averageRating, ratingsCount, descriptionEn
│   │   │   │   └── book_stats.dart       [CREATE]
│   │   │   ├── enums/
│   │   │   │   └── purchase_option.dart  [CREATE] direct | referral | notAvailable
│   │   │   └── repositories/
│   │   │       └── books_repository.dart [MODIFY] +getStats, getTranslatedBooks, getRecommendedForTranslation
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── book_model.dart        [CREATE] fromJson → Book entity
│   │   │   │   ├── category_model.dart    [CREATE]
│   │   │   │   └── book_stats_model.dart  [CREATE]
│   │   │   ├── data_sources/
│   │   │   │   └── books_remote_data_source.dart [MODIFY] replace all mock
│   │   │   └── repositories/
│   │   │       └── books_repository_impl.dart [MODIFY] +new method implementations
│   │   └── presentation/
│   │       ├── cubit/
│   │       │   └── home_content_cubit.dart [MODIFY] +stats, parallel Future.wait load
│   │       └── screens/
│   │           ├── translated_books_screen/ [CREATE]
│   │           └── recommended_books_screen/ [CREATE]
│   │
│   ├── articles/
│   │   ├── domain/entities/
│   │   │   ├── article.dart              [MODIFY] +slug, authorFirstName/LastName, readingTime; 6 channels
│   │   │   └── article_detail.dart       [MODIFY] +slug, author fields
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── article_model.dart    [CREATE]
│   │   │   │   └── article_detail_model.dart [CREATE]
│   │   │   └── data_sources/
│   │   │       └── articles_remote_data_source.dart [MODIFY] replace stub
│   │   └── presentation/cubit/
│   │       └── articles_list_cubit.dart  [MODIFY] 6 real channels, real API
│   │
│   ├── publishers/
│   │   ├── domain/entities/
│   │   │   └── publisher.dart            [MODIFY] +slug, title, imageUrl, excerpt, countries[]
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── publisher_model.dart  [CREATE]
│   │   │   │   └── publisher_book_model.dart [CREATE]
│   │   │   └── data_sources/
│   │   │       └── publishers_remote_data_source.dart [MODIFY] replace mock
│   │   └── data/repositories/
│   │       └── publishers_repository_impl.dart [MODIFY]
│   │
│   ├── search/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── search_suggestion.dart [CREATE]
│   │   │   │   └── search_response.dart  [CREATE]
│   │   │   └── repositories/
│   │   │       └── search_repository.dart [CREATE]
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   └── search_result_model.dart [CREATE]
│   │   │   ├── data_sources/
│   │   │   │   └── search_remote_data_source.dart [CREATE]
│   │   │   └── repositories/
│   │   │       └── search_repository_impl.dart [CREATE]
│   │   └── presentation/cubit/
│   │       └── search_cubit.dart         [MODIFY] fix arch violation, inject SearchRepository
│   │
│   ├── wishlist/                         [CREATE — entire feature]
│   │   ├── domain/
│   │   │   ├── entities/wishlist_item.dart
│   │   │   └── repositories/wishlist_repository.dart
│   │   ├── data/repositories/
│   │   │   └── wishlist_repository_impl.dart
│   │   └── presentation/
│   │       ├── cubit/
│   │       │   ├── wishlist_cubit.dart
│   │       │   └── wishlist_state.dart
│   │       └── screens/wishlist_screen/
│   │           ├── wishlist_screen.dart
│   │           └── widgets/
│   │               ├── wishlist_item_card.dart
│   │               └── wishlist_empty_state.dart
│   │
│   ├── ratings/                          [CREATE — entire feature]
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── rating.dart
│   │   │   │   └── comment.dart
│   │   │   └── repositories/ratings_repository.dart
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── rating_model.dart
│   │   │   │   └── comment_model.dart
│   │   │   ├── data_sources/ratings_remote_data_source.dart
│   │   │   └── repositories/ratings_repository_impl.dart
│   │   └── presentation/
│   │       ├── cubit/
│   │       │   ├── ratings_cubit.dart + ratings_state.dart
│   │       │   └── comments_cubit.dart + comments_state.dart
│   │       └── widgets/
│   │           ├── star_rating_bar.dart
│   │           ├── rating_summary_widget.dart
│   │           ├── comment_card.dart
│   │           ├── comment_form.dart
│   │           └── rating_form.dart
│   │
│   ├── newsletter/                       [CREATE — entire feature]
│   │   ├── domain/repositories/newsletter_repository.dart
│   │   ├── data/
│   │   │   ├── data_sources/newsletter_remote_data_source.dart
│   │   │   └── repositories/newsletter_repository_impl.dart
│   │   └── presentation/
│   │       ├── cubit/newsletter_cubit.dart + newsletter_state.dart
│   │       └── widgets/newsletter_bottom_sheet.dart
│   │
│   ├── notifications/                    [CREATE — entire feature]
│   │   ├── domain/repositories/notifications_repository.dart
│   │   ├── data/
│   │   │   ├── data_sources/notifications_remote_data_source.dart
│   │   │   └── repositories/notifications_repository_impl.dart
│   │   ├── services/fcm_service.dart
│   │   └── presentation/
│   │       ├── cubit/notification_settings_cubit.dart + state
│   │       └── screens/notification_settings_screen/
│   │           └── notification_settings_screen.dart
│   │
│   ├── static_pages/                     [CREATE — entire feature]
│   │   ├── domain/
│   │   │   ├── entities/static_page.dart
│   │   │   └── repositories/static_pages_repository.dart
│   │   ├── data/
│   │   │   ├── models/static_page_model.dart
│   │   │   ├── data_sources/static_pages_remote_data_source.dart
│   │   │   └── repositories/static_pages_repository_impl.dart
│   │   └── presentation/
│   │       ├── cubit/static_page_cubit.dart + state
│   │       └── screens/static_page_screen/
│   │           ├── static_page_screen.dart
│   │           └── widgets/static_page_body.dart
│   │
│   ├── publish/
│   │   ├── domain/
│   │   │   ├── entities/submission.dart  [CREATE]
│   │   │   └── repositories/publish_repository.dart [CREATE]
│   │   ├── data/
│   │   │   ├── models/submission_model.dart [CREATE]
│   │   │   ├── data_sources/publish_remote_data_source.dart [CREATE]
│   │   │   └── repositories/publish_repository_impl.dart [CREATE]
│   │   ├── services/file_upload_service.dart [CREATE] (stub impl)
│   │   └── presentation/
│   │       ├── cubit/
│   │       │   ├── publish_cubit.dart    [CREATE]
│   │       │   └── publish_state.dart    [CREATE]
│   │       └── screens/publish_screen/   [MODIFY — StatefulWidget → BlocConsumer]
│   │
│   └── cart/presentation/cubit/
│       └── cart_cubit.dart              [MODIFY] +CartStorage persistence
│
├── assets/static/                        [CREATE directory if static pages have no backend endpoint]
│   ├── about.md
│   ├── team.md
│   ├── contact.md
│   ├── privacy.md
│   └── terms.md
│
└── assets/translations/
    ├── ar.json                           [MODIFY] +~50 keys for new features
    └── en.json                           [MODIFY] +~50 keys for new features
```

---

## Phase 0: Research — Resolved Decisions

### a) `api_envelope.dart` handling
Create `lib/core/network/api_envelope.dart` with three classes: `ApiEnvelope<T>` (success, data, error), `PaginatedResponse<T>` (data list + PaginationMeta), `PaginationMeta` (page, limit, total, totalPages, hasNextPage). Data sources call `ApiManager.get/post(...)`, receive `Either<Failure, Map>`, fold Right branch through `ApiEnvelope.fromJson` or `PaginatedResponse.fromJson`. Left propagates unchanged. Parsing stays in data layer, not in ApiManager.

### b) `_extractMessage` fix
Single targeted change: `data['message'] as String? ?? (data['error'] as Map?)?.cast<String, dynamic>()['message'] as String? ?? 'An error occurred'`. No other ApiManager changes.

### c) Real backend URLs
- dev: `http://localhost:3000/api/v1`
- prod: `https://booksplatform.net/api/v1`
The `String.fromEnvironment` switch already exists — only the URL strings change.

### d) Cart persistence
SharedPreferences with JSON-encoded list. `CartCubit` loads on init from `CartStorage.getItems()`, saves after every mutation. Stored fields per item: `{slug, quantity, titleAr, titleEn, price, imageUrl}` — enough to display without a network call. `Book.toJson()` is NOT added to the domain entity; serialization happens in a private `_serializeItems` helper in `CartCubit` only.

### e) Wishlist storage
SharedPreferences storing a JSON array of slug strings only. When Wishlist screen needs full book data, it fetches by slug from the Books API. This keeps stored data minimal and avoids a new database dependency.

### f) Push notifications
Implement full FCM client side (firebase_messaging + flutter_local_notifications). Backend endpoint `POST /notifications/mobile/subscribe` does NOT exist yet — stub the registration call, flag as Risk #1. iOS requires APNs key upload to Firebase Console (Risk #8).

### g) File upload for submissions
Backend has no upload endpoint. Plan `FileUploadService` interface + `StubFileUploadServiceImpl` that returns a placeholder URL with a TODO comment. Blocked on backend team providing either a pre-signed S3 URL endpoint or UploadThing integration (Risk #2).

### h) SearchCubit architecture fix
Full clean arch chain: `SearchRemoteDataSource` → `SearchRepositoryImpl` → `SearchRepository` (abstract) → `SearchCubit`. Remove `PublishersRemoteDataSourceImpl` injection entirely. Search results from `GET /search` (books + articles + publishers in one call).

### i) Cart "Complete on Web" URL
`url_launcher` opens `https://booksplatform.net/books/{slug}` for direct purchase books. Referral books use their `referralLink` field. Unavailable books show disabled state.

### j) YouTube player package
`youtube_player_iframe` (WebView-based, cross-platform). Used in Watch Your Book / Novel & Story article detail screens. Video ID extracted from article's `videoUrl` field (confirm field name with backend — flagged in Risk #6).

### k) Audio player package
`just_audio` — better audio focus, background playback, and streaming URL support than `audioplayers`. Used in Book Talk podcast article detail screens.

### l) Missing translation keys
Add all keys in batch in Group Q. Follow existing naming convention (`feature_key_name` snake_case). No existing keys removed.

### m) Article entity update
Add `slug`, `authorFirstName`, `authorLastName`, `readingTime`. Keep `readMinutes` as a getter alias (`return readingTime`). Update channel keys to 6 new values. Existing UI using `readMinutes` continues to work.

### n) Book entity update
Add `slug`, `imageUrl`, `purchaseOption` (new enum), `referralLink`, `averageRating`, `ratingsCount`, `descriptionEn`. All new fields are nullable or have defaults. `coverColors` kept for gradient placeholder when `imageUrl` is null.

### o) Publisher entity update
Add `slug`, `title` (primary field), `imageUrl`, `excerpt`, `countries: List<String>`. Add getter `name → title` for backward compat. Old `countryAr/countryEn/countryFlag` become nullable, populated from `countries[0]` when available.

### p) `PaginatedResponse<T>` modeling
Generic class in `api_envelope.dart` with `data: List<T>`, `pagination: PaginationMeta`. Static factory iterates `json['data']` as a list, applying `fromJsonT` to each element. Paginated cubits hold `currentPage`, `hasNextPage`, and an append list for infinite scroll.

---

## Phase 1: Data Model

### New/Updated Entities

**Book** — add: `slug: String`, `imageUrl: String?`, `purchaseOption: PurchaseOption` (enum), `referralLink: String?`, `averageRating: double?`, `ratingsCount: int?`, `descriptionEn: String?`

**Article** — add: `slug: String`, `authorFirstName: String`, `authorLastName: String`, `readingTime: int`; getter `readMinutes → readingTime`; channel keys updated to 6 values

**Publisher** — add: `slug: String`, `title: String`, `imageUrl: String?`, `excerpt: String?`, `countries: List<String>`; getter `name → title`

**PurchaseOption** (new enum): `direct`, `referral`, `notAvailable`; parse helper from `'DIRECT'|'REFERRAL'|other`

**BookStats** (new): `totalBooks`, `totalPublishers`, `totalTranslatedBooks`, `totalCountries` — all int

**Rating** (new): `id`, `productId`, `stars`, `average: double`, `count: int`, `distribution: Map<int,int>`

**Comment** (new): `id`, `authorName`, `content`, `date: DateTime`, `parentId?`, `productId?`, `articleId?`

**SearchSuggestion** (new): `type: String`, `label: String`, `slug: String`

**SearchResponse** (new): `books: List<Book>`, `articles: List<Article>`, `publishers: List<Publisher>`, `totalResults: int`

**WishlistItem** (new): `bookSlug: String` — only the slug stored locally; full book fetched on demand

**Submission** (new): `id`, `status`, `isFirstFree: bool`, `requiresPayment: bool`, `paymentStatus?`

**EligibilityResult** (new): `isEligibleForFree: bool`, `submissionsCount: int`

**StaticPage** (new): `slug`, `title`, `content` (HTML or markdown)

### Repository Additions

**BooksRepository** — add: `getStats()`, `getTranslatedBooks({page, limit})`, `getRecommendedForTranslation({page, limit})`

**SearchRepository** (new): `search(query, {type, page, limit, locale})` → `SearchResponse`, `getSuggestions(query, {limit})` → `List<SearchSuggestion>`

**WishlistRepository** (new): `getWishlist()` → `List<String>`, `addToWishlist(slug)`, `removeFromWishlist(slug)`, `isInWishlist(slug)` → `bool`, `clearWishlist()`

**RatingsRepository** (new): `getRatings(productId)`, `submitRating(productId, email, stars)`, `getComments(productId, {page, limit})`, `submitComment({authorName, email, content, productId?, articleId?, parentId?})`

**NewsletterRepository** (new): `subscribe(email, {locale, source})` → `NewsletterResult(message, alreadySubscribed)`

**NotificationsRepository** (new): `registerFcmToken(token, locale)` [STUB — blocked on backend], `getNotificationSettings()`

**PublishRepository** (new): `checkEligibility(email)` → `EligibilityResult`, `submitBook(SubmissionRequest)` → `Submission`

**StaticPagesRepository** (new): `getPage(slug)` → `StaticPage`

### Cubit States

**WishlistCubit**: Initial → Loading → Loaded(slugs) → Error(message); methods: load(), toggle(slug), clear()

**RatingsCubit**: Initial → Loading → Loaded(rating) → Submitting → Submitted → Error; methods: load(productId), submitRating(productId, email, stars)

**CommentsCubit**: Initial → Loading → Loaded(comments, hasNextPage, page) → LoadingMore → Submitting → Submitted → Error; methods: load(productId), loadMore(), submitComment(...)

**NewsletterCubit**: Initial → Loading → Success(message, alreadySubscribed) → Error; method: subscribe(email, locale)

**PublishCubit**: Initial → Step(step, formData) → CheckingEligibility → EligibilityLoaded(isEligibleForFree) → Uploading(progress) → Submitting → Success(submission) → Error; methods: checkEligibility(email), nextStep(), prevStep(), updateField(key, value), pickFile(), pickCoverImage(), submit()

**NotificationSettingsCubit**: Initial → Loaded(pushEnabled, fcmToken?) → Updating → Error; methods: load(), togglePush(enabled)

**StaticPageCubit**: Initial → Loading → Loaded(page) → Error; method: load(slug)

---

## Sprint Execution Plan

### Group A — Infrastructure (no dependencies)

**A1** `lib/core/constants/api_constants.dart` — Replace placeholder URLs with real: dev=`http://localhost:3000/api/v1`, prod=`https://booksplatform.net/api/v1`

**A2** `lib/core/constants/app_constants.dart` — Add `kWishlistKey = 'wishlist_slugs'`, `kCartKey = 'cart_items'`, `kNotifOptInKey = 'notif_opt_in'`

**A3** `lib/core/network/api_manager.dart` — Fix `_extractMessage`: check `data['message']` first, then `(data['error'] as Map?)['message']`, then fallback string. 3-line change only.

**A4** `lib/core/network/api_envelope.dart` — Create `PaginationMeta`, `PaginatedResponse<T>`, `ApiError`, `ApiEnvelope<T>` with `fromJson` factories. All are plain Dart data classes with Equatable. No annotations.

**A5** `mobile/pubspec.yaml` — Add: `file_picker: ^8.1.7`, `image_picker: ^1.1.2`, `youtube_player_iframe: ^5.2.0`, `just_audio: ^0.9.40`, `firebase_messaging: ^15.2.4`, `flutter_local_notifications: ^18.0.1`, `firebase_core: ^3.11.0`. Run `flutter pub get`.

**A6** `lib/core/storage/wishlist_storage.dart` — `@lazySingleton`. Injects `SharedPreferences` via registered module. Methods: `getSlugs()`, `saveSlugs(List<String>)`, `addSlug(String)`, `removeSlug(String)`, `contains(String)`, `clear()`. All read/write `kWishlistKey`.

**A7** `lib/core/storage/cart_storage.dart` — `@lazySingleton`. Methods: `getItems()` → `List<Map<String,dynamic>>`, `saveItems(List<Map>)`, `clear()`. All read/write `kCartKey`.

**A8** Register `SharedPreferences` in DI if not already: add `@singleton Future<SharedPreferences> get prefs => SharedPreferences.getInstance()` in `RegisterModule`. Run `dart run build_runner build --delete-conflicting-outputs`.

---

### Group B — Books Data Layer (depends on A1, A4)

**B1** `lib/features/books/domain/enums/purchase_option.dart` — Create enum `PurchaseOption { direct, referral, notAvailable }` with `static PurchaseOption fromString(String? v)` helper.

**B2** `lib/features/books/domain/entities/book.dart` — Add fields: `slug`, `imageUrl`, `purchaseOption`, `referralLink`, `averageRating`, `ratingsCount`, `descriptionEn`. All nullable/defaulted for backward compat. Update Equatable props.

**B3** `lib/features/books/domain/entities/book_stats.dart` — 4-int entity.

**B4** `lib/features/books/data/models/book_model.dart` — `BookModel.fromJson`: `nameAr→titleAr`, `nameEn→titleEn`, `translationStatus→TranslationStatus.fromString`, `purchaseOption→PurchaseOption.fromString`, `categories[0].slug→categorySlug`. `toEntity()` returns updated `Book`.

**B5** `lib/features/books/data/models/category_model.dart` — `CategoryModel.fromJson` with `linkedCount→bookCount`, `name→nameEn`. `toEntity()` returns `Category`.

**B6** `lib/features/books/data/models/book_stats_model.dart` — Direct field mapping. `toEntity()` returns `BookStats`.

**B7** `lib/features/books/domain/repositories/books_repository.dart` — Add abstract methods `getStats()`, `getTranslatedBooks({page,limit})`, `getRecommendedForTranslation({page,limit})`.

**B8** `lib/features/books/data/data_sources/books_remote_data_source.dart` — Replace ALL mock data with real `ApiManager` calls:
- `getFeaturedBooks()` → `GET /books?status=TRANSLATED&sort=newest&limit=10` via `PaginatedResponse<BookModel>`
- `getBooks({category, status, sort, page, limit})` → `GET /books` with query params
- `getBookBySlug(slug, {locale})` → `GET /books/{slug}?locale={locale}` via `ApiEnvelope<BookModel>`
- `getCategories()` → `GET /books/categories`
- `getSimilarBooks(slug, catSlug)` → `GET /books/{slug}/similar?limit=6`
- `getStats()` → `GET /books/stats`
- `getTranslatedBooks({page,limit})` → `GET /books?status=TRANSLATED&page=&limit=`
- `getRecommendedForTranslation({page,limit})` → `GET /books?status=NOMINATED&page=&limit=`
- Follow the fold pattern from existing repositories (see `BooksRepositoryImpl`)

**B9** `lib/features/books/data/repositories/books_repository_impl.dart` — Add implementations for `getStats`, `getTranslatedBooks`, `getRecommendedForTranslation` following existing fold pattern.

---

### Group C — Articles Data Layer (depends on A1, A4)

**C1** `lib/features/articles/domain/entities/article.dart` — Add `slug`, `authorFirstName`, `authorLastName`, `readingTime`; getter `readMinutes→readingTime`; update channel key documentation.

**C2** `lib/features/articles/domain/entities/article_detail.dart` — Add `slug`, `authorFirstName`, `authorLastName`, `videoUrl?`.

**C3** `lib/features/articles/data/models/article_model.dart` — `fromJson` maps `readingTime→readingTime`, `imageUrl` (used as cover). `toEntity()` returns `Article`.

**C4** `lib/features/articles/data/models/article_detail_model.dart` — `fromJson` includes nested `relatedArticles: List<ArticleModel>`, `pullQuote?`, `videoUrl?`. `toEntity()` returns `ArticleDetail`.

**C5** `lib/features/articles/data/data_sources/articles_remote_data_source.dart` — Replace all stub/hardcoded with real calls:
- `getArticles({channel, page, limit, sort, locale})` → `GET /articles` with params
- `getArticleDetail(slug, {locale})` → `GET /articles/{slug}?locale={locale}`
- `getRelatedArticles(slug, {limit})` → `GET /articles/{slug}/related?limit={limit}`
- `getChannels()` → hardcoded list of 6 `ArticleChannel` objects (no endpoint; keys: `harvest`, `ideas`, `world-reads`, `books-talk`, `watch-your-book`, `novel-story`)

**C6** `lib/features/articles/domain/repositories/articles_repository.dart` — Add `getArticles({channel, page, limit, sort, locale})` abstract method.

**C7** `lib/features/articles/data/repositories/articles_repository_impl.dart` — Add `getArticles` delegation.

**C8** `lib/features/articles/presentation/cubit/articles_list_cubit.dart` — Update 6 channel keys, change from in-memory mock to real API calls via `ArticlesRepository.getArticles`. Add `loadMore()` following `CatalogCubit` pagination pattern.

---

### Group D — Publishers Data Layer (depends on A1, A4)

**D1** `lib/features/publishers/domain/entities/publisher.dart` — Add `slug`, `title`, `imageUrl?`, `excerpt?`, `countries: List<String>`; getter `name→title`; keep old country fields nullable.

**D2** `lib/features/publishers/data/models/publisher_model.dart` — `fromJson`: `title→title`, `booksCount→bookCount`, `countries→countries`. `toEntity()` returns updated `Publisher`.

**D3** `lib/features/publishers/data/models/publisher_book_model.dart` — `fromJson` for publisher's book list endpoint response. `toEntity()` returns `PublisherBook`.

**D4** `lib/features/publishers/data/data_sources/publishers_remote_data_source.dart` — Replace all 7 hardcoded publishers with real calls:
- `getPublishers({country, page, limit, search, locale})` → `GET /publishers` with params
- `getPublisherBySlug(slug)` → `GET /publishers/{slug}`
- `getPublisherBooks(slug, {page, limit})` → `GET /publishers/{slug}/books`
- `getCountries()` → calls `getPublishers(limit: 100)`, extracts unique country strings from `countries` arrays, returns sorted list. Cache result in a private `_cachedCountries` list field.

**D5** `lib/features/publishers/data/repositories/publishers_repository_impl.dart` — Update all method implementations to call real data source.

---

### Group E — Search Architecture Fix + API (depends on A1, A4, B2, C1, D1)

**E1** `lib/features/search/domain/entities/search_suggestion.dart` — `(type, label, slug)` Equatable.

**E2** `lib/features/search/domain/entities/search_response.dart` — `(books: List<Book>, articles: List<Article>, publishers: List<Publisher>, totalResults: int)` Equatable.

**E3** `lib/features/search/domain/repositories/search_repository.dart` — Abstract `SearchRepository` with `search(...)` and `getSuggestions(...)`.

**E4** `lib/features/search/data/models/search_result_model.dart` — `SearchResponseModel.fromJson` parses `json['data']['books']`, `json['data']['articles']`, `json['data']['publishers']` using `BookModel`, `ArticleModel`, `PublisherModel`. `toEntity()` returns `SearchResponse`.

**E5** `lib/features/search/data/data_sources/search_remote_data_source.dart` — `@lazySingleton`. `search(...)` → `GET /search?q=&type=&page=&limit=&locale=`. `getSuggestions(...)` → `GET /search/suggestions?q=&limit=`.

**E6** `lib/features/search/data/repositories/search_repository_impl.dart` — `@LazySingleton(as: SearchRepository)`.

**E7** `lib/features/search/presentation/cubit/search_cubit.dart` — Remove `PublishersRemoteDataSourceImpl` injection. Inject `SearchRepository`. Keep 300ms debounce with `Timer`. Add `suggestions` field to Success state. Follow `CatalogCubit` pagination pattern for `loadMore()`.

---

### Group F — Wishlist Feature (depends on A2, A6)

**F1** `lib/features/wishlist/domain/entities/wishlist_item.dart` — `(bookSlug: String)` Equatable.

**F2** `lib/features/wishlist/domain/repositories/wishlist_repository.dart` — Abstract interface (6 methods per Phase 1 definition).

**F3** `lib/features/wishlist/data/repositories/wishlist_repository_impl.dart` — `@LazySingleton(as: WishlistRepository)`. Delegates all to `WishlistStorage`. Wraps SharedPreferences access in try/catch → `Left(CacheFailure(...))`. No network calls.

**F4** `lib/features/wishlist/presentation/cubit/wishlist_cubit.dart` + `wishlist_state.dart` — `@injectable`. States per Phase 1. `toggle(slug)` checks current loaded state, calls add or remove, reloads.

**F5** `lib/features/wishlist/presentation/screens/wishlist_screen/wishlist_screen.dart` — `BlocBuilder<WishlistCubit>`. Shows `WishlistItemCard` list or `EmptyStateWidget`. `SafeArea`. No BottomNav (pushed as detail).

**F6** `wishlist_item_card.dart` — `Dismissible` with swipe-to-remove. Taps navigate to `AppRoutes.bookDetail` with `BookDetailArgs(slug, titleAr)`. Uses `BookCoverWidget` (existing).

**F7** Book detail screen integration — Modify `AppRouter.generateRoute` for `bookDetail` case: change to `MultiBlocProvider` adding `WishlistCubit`. Add heart icon button to `book_detail_screen.dart` driven by `BlocBuilder<WishlistCubit>` checking if slug is in loaded slugs.

---

### Group G — Ratings & Comments Feature (depends on A1, A4)

**G1-G2** Domain entities `rating.dart`, `comment.dart` per Phase 1 definitions.

**G3** `lib/features/ratings/domain/repositories/ratings_repository.dart` — Abstract interface (4 methods).

**G4** `rating_model.dart` — `fromJson` parses `{average, count, distribution: [{stars,count}]}`. Converts distribution array to `Map<int,int>`. `toEntity()` returns `Rating`.

**G5** `comment_model.dart` — `fromJson` with `DateTime.parse(json['createdAt'])`. `toEntity()` returns `Comment`.

**G6** `ratings_remote_data_source.dart` — `@lazySingleton`. `submitComment` always includes honeypot `website: ''` in request body. `submitRating` uses upsert endpoint (one POST handles create and update by email+productId).

**G7** `ratings_repository_impl.dart` — `@LazySingleton(as: RatingsRepository)`.

**G8** `ratings_cubit.dart` + `comments_cubit.dart` — `@injectable`. `CommentsCubit.loadMore()` increments page, appends to list. On submit success, reload page 1.

**G9-G13** Widgets: `star_rating_bar.dart` (interactive + read-only modes), `rating_summary_widget.dart` (avg + distribution bars), `comment_card.dart` (author + date via `DateFormatterHelper`), `comment_form.dart` (uses `AppTextField` + `RegexHelper`), `rating_form.dart`.

**G14** Book detail integration — `MultiBlocProvider` in AppRouter for bookDetail adds `RatingsCubit` + `CommentsCubit`. Add rating + comments sections to `book_detail_body.dart`.

---

### Group H — Cart Persistence (depends on A7)

**H1** `lib/features/cart/presentation/cubit/cart_cubit.dart` — Inject `CartStorage`. Add `_loadFromStorage()` called after `super(CartState([]))`. After every mutation (add/remove/update/clear): call `cartStorage.saveItems(_serializeItems(state.items))`. `_serializeItems` builds `List<Map>` with only presentation fields: `{slug, quantity, titleAr, titleEn, price, imageUrl}`. `_cartItemFromMap` reconstructs minimal `CartItem` on load (no full Book entity needed for display).

---

### Group I — Newsletter Feature (depends on A1, A4)

**I1-I4** Full feature chain: `newsletter_repository.dart` → `newsletter_remote_data_source.dart` (@lazySingleton, `POST /newsletter/subscribe`) → `newsletter_repository_impl.dart` → `newsletter_cubit.dart` (@injectable).

**I5** `newsletter_bottom_sheet.dart` — Email `AppTextField` + locale selector (AR/EN toggle chips) + subscribe button. `BlocProvider<NewsletterCubit>` wraps the sheet content (not in AppRouter since it's a sheet). `BlocListener` on Success: `SnackBarHelper.showSuccess` + dismiss; on Error: `SnackBarHelper.showError`.

**I6** Integrate into home screen: add newsletter banner card after stats section. Tap opens `BottomSheetHelper.showAppBottomSheet(context, child: NewsletterBottomSheet())`.

---

### Group J — Publish Feature Complete (depends on A1, A4, A5)

**J1** Domain: `submission.dart`, `publish_repository.dart` (checkEligibility + submitBook), `EligibilityResult`, `SubmissionRequest` value object with all form fields.

**J2** `publish_remote_data_source.dart` — `checkEligibility(email)` → `GET /submissions/check-eligibility?email={email}`. `submitBook(req)` → `POST /submissions` with all fields + `website: ''`.

**J3** `publish_repository_impl.dart` — `@LazySingleton(as: PublishRepository)`.

**J4** `file_upload_service.dart` — Abstract interface + `StubFileUploadServiceImpl` @lazySingleton returning placeholder URL string with `// TODO: integrate UploadThing or S3` comment.

**J5** `publish_cubit.dart` + `publish_state.dart` — `@injectable`. Inject `PublishRepository` + `FileUploadService`. `checkEligibility` fires on email field blur (step 0). `pickFile()` uses `file_picker`. `pickCoverImage()` uses `image_picker`. `submit()` flow: upload PDF → upload cover → call `submitBook` with URLs. Validate step fields before `nextStep()` progression.

**J6** `publish_screen/` — Replace `StatefulWidget` with `BlocConsumer<PublishCubit, PublishState>`. Step 0: author fields. Step 1: book fields + file picker buttons with preview. Step 2: read-only summary + eligibility notice + content standards checkbox + submit/web-redirect button. Wrap each step in `SingleChildScrollView`. Progress stepper at top. Back/Next in `Scaffold.bottomNavigationBar`.

---

### Group K — Push Notifications (depends on A2, A5, K-firebase-setup)

**K1** Developer task (not code): Add `google-services.json` (Android) + `GoogleService-Info.plist` (iOS) from Firebase Console. Add `apply plugin: 'com.google.gms.google-services'` to `android/app/build.gradle`.

**K2** `lib/features/notifications/services/fcm_service.dart` — `@lazySingleton`. `initialize()`: sets up `FirebaseMessaging.onMessage` → show local notification; `onMessageOpenedApp` → route to screen; `getInitialMessage()` → handle cold-start tap. `requestPermission()` → `FirebaseMessaging.instance.requestPermission()`. `getToken()` → `getToken()`, store via `SecureStorageHelper.saveString('fcm_token', token)`. `_handleNotificationTap(msg)` → parse `msg.data['type']` + `msg.data['slug']`, navigate via navigator key.

**K3** `notifications_remote_data_source.dart` — `@lazySingleton`. `registerFcmToken(token, locale)` → `POST /notifications/mobile/subscribe` — **STUB: returns `Right(unit)` immediately with TODO comment**.

**K4** `notifications_repository_impl.dart` — `@LazySingleton(as: NotificationsRepository)`.

**K5** `notification_settings_cubit.dart` — `load()`: reads `kNotifOptInKey` from SharedPreferences. `togglePush(true)`: calls `FcmService.requestPermission()` → if granted → `getToken()` → `registerFcmToken` → save flag. `togglePush(false)`: saves flag = false.

**K6** `notification_settings_screen.dart` — Switch widget driven by `NotificationSettingsCubit`. Platform-aware: when permission denied at OS level, show "Open Settings" button using `url_launcher` to open app settings.

**K7** `lib/main.dart` — Add `await Firebase.initializeApp()` after `WidgetsFlutterBinding.ensureInitialized()`. After `configureDependencies()`: `getIt<FcmService>().initialize()`.

---

### Group L — Home Screen Complete (depends on B8, B9, I5)

**L1** `home_content_cubit.dart` — Add `stats: BookStats?` to `HomeContentLoaded` state. Refactor `load()` to use `Future.wait([getStats(), getFeaturedBooks(), getCategories(), getTranslatedBooks(), getRecommendedForTranslation(), getTopPublishers()])` for parallel API calls. Partial failure: each section result stored independently — a single section failure does not block others. Move `getTopPublishers` to use `PublishersRepository.getPublishers(limit:5)` (fixes cross-feature data source dependency, Risk #4).

**L2** `home_screen/` widgets — Wire all 9 sections:
1. Stats counter → `BookStatsWidget` with animated count-up from 0 to real values
2. Hero carousel → from `featuredBooks` with auto-advance (5s), dot indicator, full-width cards
3. Categories row → from `categories` with tappable chips → `CategoryBooksScreen`
4. Latest books grid → 2-column, up to 12, "See All" → `CatalogScreen`
5. Translated books → horizontal scroll, "See All" → `AppRoutes.translatedBooks`
6. Recommended for translation → horizontal scroll, "See All" → `AppRoutes.recommendedBooks`
7. Publisher spotlight → sponsored first, "See All" → `PublishersScreen`
8. Newsletter strip → tap opens `NewsletterBottomSheet` via `BottomSheetHelper`
9. Channels strip → 6 channel cards navigating to `ArticlesScreen` with pre-selected channel
- Each section uses existing `SectionHeaderWidget`
- `HomeShimmer` updated to cover all new sections

---

### Group M — Translated & Recommended Screens (depends on B8, B9)

**M1** `translated_books_screen.dart` — Reuses `CatalogCubit` pre-initialized with `status=TRANSLATED`. 2-column `GridView.builder` with `ScrollController` for infinite scroll. `AppBarWidget` with `tr('translated_books_title')`. Filter/sort bar reused. `AppRouter` case: `BlocProvider<CatalogCubit>(create: (_) => getIt<CatalogCubit>()..loadWithFilter(status: TranslationStatus.translated))`.

**M2** `recommended_books_screen.dart` — Same structure, `status=NOMINATED`, title `tr('recommended_for_translation_title')`. Adds `tr('translation_rights_notice')` banner at top of screen.

---

### Group N — Static Pages (depends on A1)

**N1-N4** Full feature chain: `static_page.dart` entity → `static_pages_repository.dart` → `static_pages_remote_data_source.dart` (tries backend first, falls back to `assets/static/{slug}.md` — Risk #3) → `static_pages_repository_impl.dart` → `static_page_cubit.dart`.

**N5** `static_page_screen.dart` — Receives `StaticPageArgs(slug, title)`. `AppBarWidget` with args title. `BlocBuilder` renders `SingleChildScrollView` with styled body text. Contact page special case: adds email link via `url_launcher`.

**N6** Create fallback assets in `assets/static/`: `about.md`, `team.md`, `contact.md`, `privacy.md`, `terms.md` with placeholder content. Register in `pubspec.yaml` assets.

---

### Group O — Notification Settings (covered in K5, K6)
No additional files. Route added in Group P.

---

### Group P — Routes & Navigation Completeness

**P1** `lib/core/router/app_routes.dart` — Add:
```dart
static const wishlist = '/wishlist';
static const translatedBooks = '/translated-books';
static const recommendedBooks = '/recommended-books';
static const notificationSettings = '/notification-settings';
static const staticPage = '/static-page';
static const aboutUs = '/about-us';
static const contactUs = '/contact-us';
static const privacyPolicy = '/privacy-policy';
static const termsOfUse = '/terms-of-use';
```

**P2** `lib/core/router/args/static_page_args.dart` — `StaticPageArgs(slug: String, title: String)`.

**P3** `lib/core/router/app_router.dart` — Add all new route cases. Change existing `bookDetail` case to `MultiBlocProvider` with `BookDetailCubit`, `WishlistCubit`, `RatingsCubit`, `CommentsCubit`. Change `articleDetail` case to `MultiBlocProvider` with `ArticleDetailCubit`, `CommentsCubit`. Add `publish` case with `BlocProvider<PublishCubit>`.

**P4** Update "More" drawer navigation — Ensure `BottomNavWidget` / More drawer links to all new screens: Wishlist, Recommended for Translation, Translated Books, Notification Settings, About Us, Contact Us, Privacy Policy, Terms of Use.

---

### Group Q — Translation Keys (~50 new keys)

**Q1** `assets/translations/en.json` — Add keys (sample, not exhaustive):

```json
"wishlist_title": "My Wishlist",
"wishlist_empty_title": "Your wishlist is empty",
"wishlist_empty_subtitle": "Save books you love by tapping the ♥ on any book",
"wishlist_added": "Added to Wishlist",
"wishlist_removed": "Removed from Wishlist",
"wishlist_disclosure": "Your wishlist is stored on this device only. Reinstalling the app will clear your wishlist.",
"ratings_title": "Ratings & Reviews",
"ratings_write_review": "Write a Review",
"ratings_submit": "Submit Rating",
"ratings_success": "Thank you for your rating.",
"comments_title": "Reader Comments",
"comments_write": "Add a Comment",
"comments_author_name": "Display Name",
"comments_email": "Email Address",
"comments_content": "Your comment...",
"comments_submit": "Submit Comment",
"comments_success": "Your comment has been submitted and is awaiting review.",
"comments_load_more": "Load More Comments",
"newsletter_title": "Stay Updated",
"newsletter_subtitle": "Get new books and articles in your inbox",
"newsletter_subscribe": "Subscribe",
"newsletter_success": "A confirmation email has been sent to {email}. Please confirm your subscription.",
"newsletter_already_subscribed": "This email is already subscribed.",
"notifications_title": "Notification Settings",
"notifications_push_label": "Push Notifications",
"notifications_push_subtitle": "Stay updated on new books and articles",
"notifications_enabled": "Notifications enabled",
"notifications_disabled": "Notifications disabled",
"translated_books_title": "Translated Books",
"recommended_for_translation_title": "Books Recommended for Translation",
"translation_rights_notice": "Translation rights availability must be confirmed directly with the publisher.",
"publish_step_author": "Author Info",
"publish_step_book": "Book Info",
"publish_step_confirm": "Review & Submit",
"publish_eligibility_free": "Your first submission is free.",
"publish_eligibility_paid": "A fee applies to this submission. Payment must be completed on the web platform.",
"publish_pick_file": "Choose Manuscript (PDF)",
"publish_pick_cover": "Choose Cover Image",
"publish_ip_statement": "Your work remains your intellectual property. The platform serves only as a visibility channel.",
"publish_content_standards": "I confirm that this submission complies with the platform's content standards.",
"publish_submit_free": "Submit My Work",
"publish_submit_paid": "Continue to Web for Payment",
"publish_success_title": "Your work has been submitted!",
"publish_success_message": "Our editorial team will review your submission and email you with their decision.",
"about_us_title": "About Us",
"contact_us_title": "Contact Us",
"privacy_policy_title": "Privacy Policy",
"terms_of_use_title": "Terms of Use",
"team_title": "Our Team",
"channel_harvest": "Book Harvest",
"channel_ideas": "Essence of Ideas",
"channel_world_reads": "World Reads",
"channel_books_talk": "Book Talk",
"channel_watch_your_book": "Watch Your Book",
"channel_novel_story": "Novel & Story"
```

**Q2** `assets/translations/ar.json` — Same keys with Arabic translations.

---

### Group R — Tests

**R1** `test/core/network/api_envelope_test.dart` — Test `ApiEnvelope.fromJson` success/error paths. Test `PaginatedResponse.fromJson` pagination meta.

**R2** `test/features/books/data/books_remote_data_source_test.dart` — Mock `ApiManager`. Test `getBookBySlug` success → correct `Book` entity. Test `getStats` → `BookStats`. Test `getBooks` with filters → correct query params.

**R3** `test/features/search/data/search_repository_impl_test.dart` — Verify `SearchCubit` no longer imports `PublishersRemoteDataSourceImpl`. Test architecture: no cross-feature data source dependency.

**R4** `test/features/wishlist/domain/wishlist_repository_impl_test.dart` — Mock `WishlistStorage`. Test add/remove/get/toggle operations.

**R5** `test/features/ratings/data/ratings_remote_data_source_test.dart` — Test `submitRating` body includes correct fields. Test `submitComment` body always includes `website: ''`. Test `getRatings` parses distribution map.

**R6** `test/features/newsletter/data/newsletter_remote_data_source_test.dart` — Test success + `alreadySubscribed` cases.

**R7** `test/features/publish/presentation/publish_cubit_test.dart` — Test step navigation. Test `checkEligibility` states. Test `submit()` calls upload service before repository.

---

## Contracts — API Integration Summary

| Feature | Method | Endpoint | Body/Query | Response shape |
|---|---|---|---|---|
| Book list | GET | `/books` | `page,limit,category,language,status,sort,q` | `{success,data:[Book...],pagination}` |
| Book detail | GET | `/books/:slug` | `?locale` | `{success,data:Book}` |
| Book similar | GET | `/books/:slug/similar` | `?limit=6` | `{success,data:[Book...]}` |
| Categories | GET | `/books/categories` | — | `{success,data:[Cat...]}` |
| Stats | GET | `/books/stats` | — | `{success,data:{totalBooks,...}}` |
| Publishers | GET | `/publishers` | `page,limit,country,search,locale` | `{success,data:[Pub...],pagination}` |
| Publisher detail | GET | `/publishers/:slug` | — | `{success,data:Publisher}` |
| Publisher books | GET | `/publishers/:slug/books` | `page,limit` | `{success,data:[Book...],pagination}` |
| Articles | GET | `/articles` | `channel,page,limit,sort,locale` | `{success,data:[Article...],pagination}` |
| Article detail | GET | `/articles/:slug` | `?locale` | `{success,data:ArticleDetail}` |
| Related articles | GET | `/articles/:slug/related` | `?limit=3` | `{success,data:[Article...]}` |
| Search | GET | `/search` | `q,type,page,limit,locale` | `{success,data:{books[],articles[],publishers[],totalResults}}` |
| Suggestions | GET | `/search/suggestions` | `q,limit=5` | `{success,data:[{type,label,slug}]}` |
| Ratings | GET | `/ratings` | `?productId` | `{success,data:{average,count,distribution}}` |
| Submit rating | POST | `/ratings` | `{productId,email,stars}` | `{success,data:{message}}` |
| Comments | GET | `/comments` | `?productId,page,limit` | `{success,data:[Comment...],pagination}` |
| Submit comment | POST | `/comments` | `{authorName,email,content,productId?,articleId?,website:''}` | `{success,data:{message}}` |
| Newsletter | POST | `/newsletter/subscribe` | `{email,locale,source:'mobile'}` | `{success,data:{message,alreadySubscribed?}}` |
| Eligibility | GET | `/submissions/check-eligibility` | `?email` | `{success,data:{isEligibleForFree,submissionsCount}}` |
| Submit book | POST | `/submissions` | `{authorName,...,fileUrl,coverUrl,website:''}` | `{success,data:{submission,requiresPayment}}` |
| FCM register | POST | `/notifications/mobile/subscribe` | `{token,locale,platform}` | **BLOCKED — endpoint does not exist** |

---

## Known Risks & Blockers

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| 1 | **CRITICAL**: FCM backend endpoint missing | Push notifications non-functional end-to-end | Stub client call; implement full client side; flag for backend team |
| 2 | **CRITICAL**: File upload service undefined | Publish submission unusable in production | Stub with placeholder URL; document exact integration requirement |
| 3 | Static pages may have no backend endpoint | Static content unavailable | Fallback to bundled `assets/static/` markdown files |
| 4 | `getTopPublishers` cross-feature data source dependency | Architecture violation | Fixed: HomeContentCubit injects PublishersRepository directly |
| 5 | `getCountries()` has no dedicated API endpoint | Country filter requires 100-publisher load | Cache in cubit state after first load; flag for backend /publishers/countries endpoint |
| 6 | Article `videoUrl` field existence unconfirmed | YouTube embeds may not work | Review backend article detail response schema before building media screens |
| 7 | Audio URL format for Book Talk / Novel & Story unknown | Audio player integration blocked | Confirm with backend whether direct MP3 URL, SoundCloud embed, or other |
| 8 | iOS APNs certificate for FCM | iOS push notifications blocked | Apple Developer account access required; one-time Firebase Console setup |
| 9 | Entity updates break existing mock constructors | Build failures | All new fields nullable or defaulted; run `flutter analyze` after every entity change |
| 10 | Build runner conflict after mass DI changes | Generated config stale/broken | Always use `--delete-conflicting-outputs`; never run incremental |

---

## Verification Plan

### After Each Group
- Run `flutter analyze` — zero errors, zero warnings
- Run `dart run build_runner build --delete-conflicting-outputs` after any DI annotation change
- Run `flutter test` — all tests pass

### End-to-End Per Feature
| Feature | Verification action |
|---|---|
| API wiring (B,C,D) | Launch app → home shows real books/articles/publishers from `booksplatform.net` |
| Search (E) | Type 3 chars → suggestions from API appear; submit → tabbed results |
| Wishlist (F) | Save book → heart fills → restart app → book still in wishlist → remove → heart empties |
| Ratings (G) | Book detail → ratings summary loads → submit 4 stars → aggregate updates → comment submitted → awaiting review msg |
| Cart persistence (H) | Add items → kill app → reopen → cart items present |
| Newsletter (I) | Tap banner → bottom sheet → valid email → success message; duplicate email → already subscribed |
| Publish (J) | Complete 3-step form → PDF file selected → cover chosen → eligibility check shows green/amber → submit → success screen |
| Push (K) | Grant permission → FCM token stored → foreground notification → local notification shown → tap → routes to correct screen |
| Home complete (L) | All 9 sections render with real data; stats animate from 0 |
| Translated/Recommended (M) | "See All" navigates → filtered list; scroll → next page loads |
| Static pages (N) | All 5 pages open; Contact email link opens mail client |
| Routes (P) | All new routes navigate without hitting unknown fallback |

---

## Files Reused (Reference Implementations)

- `lib/features/books/data/repositories/books_repository_impl.dart` — fold pattern for all new repository impls
- `lib/features/books/presentation/cubit/catalog_cubit.dart` — pagination + filter pattern for all new list cubits
- `lib/features/publishers/presentation/cubit/publisher_detail_cubit.dart` — multi-repo injection pattern
- `lib/core/widgets/empty_state_widget.dart` — reused in wishlist, search, catalog empty states
- `lib/core/widgets/error_state_widget.dart` — reused in all new screen error states
- `lib/core/helpers/snack_bar_helper.dart` — used in all action cubits for feedback
- `lib/core/helpers/bottom_sheet_helper.dart` — used for newsletter sheet and filter sheets
- `lib/core/helpers/regex_helper.dart` — used in comment form, newsletter, and publish form validation
- `lib/core/widgets/app_text_field.dart` — used in all new forms (comment, rating, newsletter, publish)
- `lib/features/books/presentation/widgets/book_card_widget.dart` — reused in wishlist item cards

---

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected |
|---|---|---|
| `MultiBlocProvider` on BookDetail route | Book detail needs 4 cubits (detail + wishlist + ratings + comments) simultaneously | Single cubit would require merging unrelated state machines, causing state collisions (violates Principle 2) |
| `FileUploadService` interface with stub impl | File upload service provider not yet determined | Hardcoding to UploadThing would lock the implementation before the service is chosen |
| `FcmService` as a separate `@lazySingleton` service (not a repository) | FCM lifecycle (message handlers, permission requests) doesn't fit repository pattern | No simpler abstraction — FCM requires initialization before use and event stream subscriptions |
