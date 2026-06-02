# Tasks: Books Platform Mobile Application

**Feature**: `001-books-platform-mobile` | **Branch**: `001-books-platform-mobile` | **Date**: 2026-06-02

**Input**: `specs/001-books-platform-mobile/plan.md`, `spec.md`, `data-model.md`, `research.md`

**Architecture**: Clean Architecture (Presentation → Domain → Data), GetIt + injectable, flutter_bloc Cubits, `mobile/lib/` root

**Format**: `- [ ] [TaskID] [P?] [StoryLabel?] Description — file path`
- `[P]` = parallelizable (different files, no cross-dependency)
- `[US#]` = user story label (Phases 3+); Setup/Foundational phases have no story label

---

## Phase 1: Setup

**Purpose**: Baseline validation before any changes begin.

- [X] T001 Run `flutter analyze` from `mobile/` directory and record baseline errors — confirm project compiles; note existing violations to distinguish from new ones introduced during implementation

**Checkpoint**: Baseline captured. Implementation can begin.

---

## Phase 2: Foundational — Group A: Infrastructure

**Purpose**: Core infrastructure required before ANY feature can be implemented.

**⚠️ CRITICAL**: No user story work can begin until T002–T010 are complete.

- [X] T002 [P] Replace placeholder API URLs in `mobile/lib/core/constants/api_constants.dart` — set dev=`http://localhost:3000/api/v1`, prod=`https://booksplatform.net/api/v1` using existing `String.fromEnvironment` switch
- [X] T003 [P] Add three storage key constants to `mobile/lib/core/constants/app_constants.dart` — `kWishlistKey = 'wishlist_slugs'`, `kCartKey = 'cart_items'`, `kNotifOptInKey = 'notif_opt_in'`
- [X] T004 [P] Fix `_extractMessage` in `mobile/lib/core/network/api_manager.dart` — 3-line targeted change only: check `data['message'] as String?` first, then `(data['error'] as Map?)?.cast<String,dynamic>()['message'] as String?`, then fallback string
- [X] T005 [P] Create `mobile/lib/core/network/api_envelope.dart` — implement `PaginationMeta` (page, limit, total, totalPages, hasNextPage), `PaginatedResponse<T>` with `fromJson(json, fromJsonT)` factory iterating `json['data']` list, `ApiError` (code?, message), `ApiEnvelope<T>` with `fromJson(json, fromData)` factory reading `json['data']`; all plain Dart + Equatable, no DI annotations
- [X] T006 [P] Add 7 new packages to `mobile/pubspec.yaml` under `dependencies`: `file_picker: ^8.1.7`, `image_picker: ^1.1.2`, `youtube_player_iframe: ^5.2.0`, `just_audio: ^0.9.40`, `firebase_messaging: ^15.2.4`, `flutter_local_notifications: ^18.0.1`, `firebase_core: ^3.11.0`; run `flutter pub get`
- [X] T007 [P] Create `mobile/lib/core/storage/wishlist_storage.dart` — `@lazySingleton` class injecting `SharedPreferences`; methods: `getSlugs()→List<String>`, `saveSlugs(List<String>)`, `addSlug(String)`, `removeSlug(String)`, `contains(String)→bool`, `clear()`; all read/write `AppConstants.kWishlistKey`
- [X] T008 [P] Create `mobile/lib/core/storage/cart_storage.dart` — `@lazySingleton` class injecting `SharedPreferences`; methods: `getItems()→List<Map<String,dynamic>>`, `saveItems(List<Map<String,dynamic>>)`, `clear()`; all read/write `AppConstants.kCartKey`
- [X] T009 Register `SharedPreferences` in `mobile/lib/core/di/register_module.dart` — add `@singleton Future<SharedPreferences> get prefs => SharedPreferences.getInstance()` to the `@module` class if not already present
- [X] T010 Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `WishlistStorage`, `CartStorage` registrations appear in `mobile/lib/core/di/injection_container.config.dart`

**Checkpoint**: Infrastructure complete. All 10 user story phases can now begin in dependency order.

---

## Phase 3: User Story 1 — Core Content Discovery: Browse Books, Read Details, Save to Wishlist (Priority: P1) 🎯 MVP

**Goal**: Deliver the complete core reader loop — real book data from API, wishlist toggle on book detail, star rating submission, and a fully wired homepage.

**Independent Test**: Install app on fresh device. Home loads real books from `booksplatform.net`. Open catalog, filter by category, tap a book. Tap heart → "Added to Wishlist" toast. Restart app → book still in wishlist. Submit 4 stars → "Thank you for your rating" replaces input. All 9 home sections render with live data.

**Acceptance Criteria** (from spec FR-007, FR-008, FR-017–FR-022, FR-046–FR-052, SC-001, SC-002):
- Hero carousel auto-advances every 5s; dot indicator only for 2+ slides
- Stats tiles show live data; show `–` on error, never zero when data exists
- Heart icon on book detail reflects actual saved state; toast on toggle
- One rating per book per device session; becomes read-only after submission
- Comments show only Admin-approved entries; submitted comment shows "awaiting review"
- Wishlist disclosure shown in wishlist screen; device-local only

### Group B — Books Data Layer

- [X] T011 [P] Create `mobile/lib/features/books/domain/enums/purchase_option.dart` — `enum PurchaseOption { direct, referral, notAvailable }` with `static PurchaseOption fromString(String? v)` returning `direct` for `'DIRECT'`, `referral` for `'REFERRAL'`, `notAvailable` otherwise
- [X] T012 [US1] Update `mobile/lib/features/books/domain/entities/book.dart` — additive only: add nullable fields `slug: String`, `imageUrl: String?`, `purchaseOption: PurchaseOption` (default `notAvailable`), `referralLink: String?`, `averageRating: double?`, `ratingsCount: int?`, `descriptionEn: String?`; update Equatable `props`; no existing fields renamed or removed
- [X] T013 [P] [US1] Create `mobile/lib/features/books/domain/entities/book_stats.dart` — four-field Equatable entity: `totalBooks: int`, `totalPublishers: int`, `totalTranslatedBooks: int`, `totalCountries: int`
- [X] T014 [US1] Create `mobile/lib/features/books/data/models/book_model.dart` — `BookModel.fromJson(Map<String,dynamic>)`: map `nameAr→titleAr`, `nameEn→titleEn`, `translationStatus→TranslationStatus.fromString`, `purchaseOption→PurchaseOption.fromString`, first `categories[0].slug→categorySlug`; implement `toEntity()→Book` returning updated entity with all new fields
- [X] T015 [P] [US1] Create `mobile/lib/features/books/data/models/category_model.dart` — `CategoryModel.fromJson`: map `linkedCount→bookCount`, `name→nameEn`; `toEntity()→Category`
- [X] T016 [P] [US1] Create `mobile/lib/features/books/data/models/book_stats_model.dart` — direct field mapping from JSON; `toEntity()→BookStats`
- [X] T017 [US1] Add three abstract methods to `mobile/lib/features/books/domain/repositories/books_repository.dart`: `getStats()→Future<Either<Failure,BookStats>>`, `getTranslatedBooks({int page, int limit})→Future<Either<Failure,PaginatedResponse<Book>>>`, `getRecommendedForTranslation({int page, int limit})→Future<Either<Failure,PaginatedResponse<Book>>>`
- [X] T018 [US1] Replace ALL mock data in `mobile/lib/features/books/data/data_sources/books_remote_data_source.dart` with real `ApiManager` calls: `getFeaturedBooks()→GET /books?status=TRANSLATED&sort=newest&limit=10` via `PaginatedResponse<BookModel>`; `getBooks({category,status,sort,page,limit})→GET /books`; `getBookBySlug(slug,{locale})→GET /books/{slug}?locale={locale}` via `ApiEnvelope<BookModel>`; `getCategories()→GET /books/categories`; `getSimilarBooks(slug,catSlug)→GET /books/{slug}/similar?limit=6`; `getStats()→GET /books/stats`; `getTranslatedBooks→GET /books?status=TRANSLATED`; `getRecommendedForTranslation→GET /books?status=NOMINATED`; use `ApiEnvelope`/`PaginatedResponse` fromJson factories on the Right branch
- [X] T019 [US1] Add `getStats`, `getTranslatedBooks`, `getRecommendedForTranslation` implementations to `mobile/lib/features/books/data/repositories/books_repository_impl.dart` — follow existing fold pattern from same file

### Group F — Wishlist Feature

- [X] T020 [P] [US1] Create `mobile/lib/features/wishlist/domain/entities/wishlist_item.dart` — single-field Equatable entity: `bookSlug: String`
- [X] T021 [P] [US1] Create `mobile/lib/features/wishlist/domain/repositories/wishlist_repository.dart` — abstract interface with 5 methods: `getWishlist()→Future<Either<Failure,List<String>>>`, `addToWishlist(String slug)`, `removeFromWishlist(String slug)`, `isInWishlist(String slug)→Future<Either<Failure,bool>>`, `clearWishlist()`
- [X] T022 [US1] Create `mobile/lib/features/wishlist/data/repositories/wishlist_repository_impl.dart` — `@LazySingleton(as: WishlistRepository)`; inject `WishlistStorage`; delegate all methods; wrap SharedPreferences exceptions in `Left(CacheFailure(...))`; no network calls
- [X] T023 [US1] Create `mobile/lib/features/wishlist/presentation/cubit/wishlist_cubit.dart` and `wishlist_state.dart` — `@injectable`; sealed states: `WishlistInitial`, `WishlistLoading`, `WishlistLoaded(List<String> slugs)`, `WishlistError(String message)`; methods: `load()`, `toggle(String slug)` (checks loaded state, calls add or remove, reloads), `clear()`
- [X] T024 [US1] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `WishlistRepositoryImpl` and `WishlistCubit` registrations in `injection_container.config.dart`
- [X] T025 [US1] Create `mobile/lib/features/wishlist/presentation/screens/wishlist_screen/wishlist_screen.dart` — `BlocBuilder<WishlistCubit,WishlistState>`; `Scaffold` with `AppBarWidget`; `SafeArea`; on `WishlistLoaded`: shows list of `WishlistItemCard`; on empty list: shows `EmptyStateWidget` with `wishlist_empty_title` and `wishlist_empty_subtitle` keys; wishlist disclosure (`wishlist_disclosure` key) as `ListTile` footer; no bottom nav (pushed as detail screen)
- [X] T026 [P] [US1] Create `mobile/lib/features/wishlist/presentation/screens/wishlist_screen/widgets/wishlist_item_card.dart` — `Dismissible` with swipe-to-remove calls `context.read<WishlistCubit>().toggle(slug)`; taps navigate to `AppRoutes.bookDetail` with `BookDetailArgs(slug, titleAr)`; uses existing `BookCoverWidget` for cover image
- [X] T027 [P] [US1] Create `mobile/lib/features/wishlist/presentation/screens/wishlist_screen/widgets/wishlist_empty_state.dart` — `EmptyStateWidget` with wishlist-specific illustration and translated strings using `wishlist_empty_title` and `wishlist_empty_subtitle` keys
- [X] T028 [US1] Add heart icon button to book detail screen (locate `book_detail_screen.dart` or `book_detail_body.dart` in `mobile/lib/features/books/presentation/`) — driven by `BlocBuilder<WishlistCubit,WishlistState>`; icon filled when slug is in `WishlistLoaded.slugs`; tap calls `context.read<WishlistCubit>().toggle(book.slug)`; show `SnackBarHelper.showSuccess(wishlist_added)` or `wishlist_removed` toast

### Group G — Ratings & Comments Feature

- [X] T029 [P] [US1] Create `mobile/lib/features/ratings/domain/entities/rating.dart` — Equatable entity: `id: String`, `productId: String`, `stars: int`, `average: double`, `count: int`, `distribution: Map<int,int>` (star 1–5 → count)
- [X] T030 [P] [US1] Create `mobile/lib/features/ratings/domain/entities/comment.dart` — Equatable entity: `id: String`, `authorName: String`, `content: String`, `date: DateTime`, `parentId: String?`, `productId: String?`, `articleId: String?`
- [X] T031 [P] [US1] Create `mobile/lib/features/ratings/domain/repositories/ratings_repository.dart` — abstract interface: `getRatings(String productId)→Future<Either<Failure,Rating>>`, `submitRating(String productId, String email, int stars)→Future<Either<Failure,Unit>>`, `getComments(String productId, {int page, int limit})→Future<Either<Failure,PaginatedResponse<Comment>>>`, `submitComment({required String authorName, required String email, required String content, String? productId, String? articleId, String? parentId})→Future<Either<Failure,Unit>>`
- [X] T032 [P] [US1] Create `mobile/lib/features/ratings/data/models/rating_model.dart` — `fromJson`: parse `distribution` JSON array of `{stars,count}` objects into `Map<int,int>`; `toEntity()→Rating`
- [X] T033 [P] [US1] Create `mobile/lib/features/ratings/data/models/comment_model.dart` — `fromJson` with `DateTime.parse(json['createdAt'])`; `toEntity()→Comment`
- [X] T034 [US1] Create `mobile/lib/features/ratings/data/data_sources/ratings_remote_data_source.dart` — `@lazySingleton`; `getRatings(productId)→GET /ratings?productId=`; `submitRating(productId,email,stars)→POST /ratings` (upsert by email+productId); `getComments(productId,{page,limit})→GET /comments?productId=&page=&limit=`; `submitComment(...)→POST /comments` — **always include `website: ''` in body** (honeypot anti-spam field per spec); all methods return `Either<Failure,T>` using `ApiEnvelope`/`PaginatedResponse`
- [X] T035 [US1] Create `mobile/lib/features/ratings/data/repositories/ratings_repository_impl.dart` — `@LazySingleton(as: RatingsRepository)`; inject `RatingsRemoteDataSource`; delegate with fold pattern from `books_repository_impl.dart`
- [X] T036 [P] [US1] Create `mobile/lib/features/ratings/presentation/cubit/ratings_cubit.dart` and `ratings_state.dart` — `@injectable`; sealed states: `RatingsInitial`, `RatingsLoading`, `RatingsLoaded(Rating rating)`, `RatingsSubmitting`, `RatingsSubmitted`, `RatingsError(String message)`; methods: `load(String productId)`, `submitRating(String productId, String email, int stars)`
- [X] T037 [P] [US1] Create `mobile/lib/features/ratings/presentation/cubit/comments_cubit.dart` and `comments_state.dart` — `@injectable`; sealed states: `CommentsInitial`, `CommentsLoading`, `CommentsLoaded(List<Comment> comments, bool hasNextPage, int page)`, `CommentsLoadingMore`, `CommentsSubmitting`, `CommentsSubmitted`, `CommentsError(String message)`; methods: `load(String productId)`, `loadMore()` (increments page, appends to list), `submitComment({required String authorName, required String email, required String content, String? productId, String? articleId})`; on submit success reload page 1
- [X] T038 [US1] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `RatingsRemoteDataSource`, `RatingsRepositoryImpl`, `RatingsCubit`, `CommentsCubit` registrations in `injection_container.config.dart`
- [X] T039 [P] [US1] Create `mobile/lib/features/ratings/presentation/widgets/star_rating_bar.dart` — two modes: `interactive` (tappable, 1–5 stars, calls `onRatingSelected` callback) and `readOnly` (displays filled/empty stars proportionally); use `AppColors` for fill color; `const`-friendly
- [X] T040 [P] [US1] Create `mobile/lib/features/ratings/presentation/widgets/rating_summary_widget.dart` — shows average (large text), total count, and 5 horizontal distribution bars (filled proportionally from `Rating.distribution`); hidden if `Rating.count == 0`
- [X] T041 [P] [US1] Create `mobile/lib/features/ratings/presentation/widgets/comment_card.dart` — shows `authorName`, formatted `date` (use existing `DateFormatterHelper` or `intl`), `content` text; no edit/delete controls per spec FR-052b
- [X] T042 [P] [US1] Create `mobile/lib/features/ratings/presentation/widgets/comment_form.dart` — `AppTextField` fields: display name (2–100 chars), email (RegexHelper email validator), comment (10–2000 chars with character counter turning red within 100 chars of limit); pre-fill name+email from `SharedPreferences`; validate on submit attempt only; Submit button calls `context.read<CommentsCubit>().submitComment(...)`
- [X] T043 [P] [US1] Create `mobile/lib/features/ratings/presentation/widgets/rating_form.dart` — `StarRatingBar` (interactive) + optional comment `AppTextField`; Submit button enabled only when stars > 0; calls `context.read<RatingsCubit>().submitRating(...)`; becomes read-only after `RatingsSubmitted` state
- [X] T044 [US1] Update `mobile/lib/core/router/app_router.dart` bookDetail route case to `MultiBlocProvider` wrapping `BookDetailCubit`, `WishlistCubit`, `RatingsCubit`, `CommentsCubit`; add `RatingSummaryWidget`, `RatingForm`, paginated `CommentCard` list, and `CommentForm` to `book_detail_body.dart` (or equivalent book detail screen body file)

### Group L — Home Screen Complete

- [X] T045 [US1] Update `mobile/lib/features/books/presentation/cubit/home_content_cubit.dart` — add `BookStats? stats` to `HomeContentLoaded` state; refactor `load()` to use `Future.wait([getStats(), getFeaturedBooks(), getCategories(), getTranslatedBooks(limit:6), getRecommendedForTranslation(limit:6), getTopPublishers()])` for parallel API calls; move `getTopPublishers` to use `PublishersRepository.getPublishers(limit:5)` (removes cross-feature data-source dependency per plan Risk #4); each section result stored independently — one section failure does not block others; update `HomeContentLoaded` with all new section fields
- [X] T046 [US1] Wire 8 non-newsletter sections in the home screen widgets under `mobile/lib/features/books/presentation/screens/home_screen/` (or `pages/home/`): (1) `BookStatsWidget` with animated count-up from 0 to live values — show `–` on error; (2) hero carousel with 5s auto-advance `Timer`, dot indicator only for 2+ slides, `PageView` with `BookCardWidget`; (3) categories row with tappable chips → `CatalogScreen`; (4) latest books 2-column grid up to 12, "See All"→`CatalogScreen`; (5) translated books horizontal scroll "See All"→`AppRoutes.translatedBooks`; (6) recommended books horizontal scroll "See All"→`AppRoutes.recommendedBooks`; (7) publisher spotlight sponsored-first row "See All"→`PublishersScreen`; (8) channels strip with 6 `ArticleChannelCard` widgets → `ArticlesScreen` with pre-selected channel; update `HomeShimmer` to cover all new sections; hide any section with zero items (FR-011)

### Group M — Translated & Recommended Screens

- [X] T047 [P] [US1] Create `mobile/lib/features/books/presentation/pages/translated_books_screen/translated_books_screen.dart` — `BlocProvider<CatalogCubit>` in `AppRouter` pre-initialized with `status=TranslationStatus.translated`; 2-column `GridView.builder` with `ScrollController` for infinite scroll calling `loadMore()`; `AppBarWidget` with `tr('translated_books_title')`; reuse existing filter/sort bar
- [X] T048 [P] [US1] Create `mobile/lib/features/books/presentation/pages/recommended_books_screen/recommended_books_screen.dart` — same structure as T047 with `status=TranslationStatus.nominated`; `AppBarWidget` with `tr('recommended_for_translation_title')`; pinned `tr('translation_rights_notice')` banner below AppBar (FR-025)

### Tests for User Story 1 (Group R)

- [X] T049 [P] [US1] Create `test/features/books/data/books_remote_data_source_test.dart` — mock `ApiManager`; test `getBookBySlug` Right path → `BookModel.toEntity()` returns `Book` with correct `slug` and `purchaseOption`; test `getStats` → `BookStats` with 4 int fields; test `getBooks` with category filter → correct query params sent to `ApiManager.get`
- [X] T050 [P] [US1] Create `test/features/wishlist/data/wishlist_repository_impl_test.dart` — mock `WishlistStorage`; test `addToWishlist` calls `WishlistStorage.addSlug`; test `removeFromWishlist` calls `removeSlug`; test `getWishlist` returns Right with slug list; test `isInWishlist` returns correct bool; test `clearWishlist` calls `clear`
- [X] T051 [P] [US1] Create `test/features/ratings/data/ratings_remote_data_source_test.dart` — mock `ApiManager`; test `submitComment` POST body always includes `website: ''`; test `submitRating` sends correct `productId`, `email`, `stars`; test `getRatings` fromJson correctly converts distribution `[{stars,count}]` array to `Map<int,int>`

**Checkpoint**: User Story 1 complete. Core reader loop (discover → browse → detail → wishlist → rate) works end-to-end with live API data.

---

## Phase 4: User Story 2 — App Shell, Navigation & Language Toggle (Priority: P1)

**Goal**: All 10 new routes reachable; More drawer links to all new screens; ~50 AR+EN translation keys added; MultiBlocProvider on BookDetail + ArticleDetail routes wired.

**Independent Test**: Navigate all five bottom tabs. Open More drawer — tap each new item (Wishlist, Recommended, Translated Books, Notification Settings, About, Contact, Privacy, Terms) — each screen opens without hitting unknown route fallback. Toggle language — all strings switch; layout flips RTL↔LTR.

**Acceptance Criteria** (FR-001–FR-006, SC-005, SC-011):
- All new routes defined and navigable
- Language toggle switches instantly with no app restart
- Language preference persists across restarts
- All new UI strings present in both `ar.json` and `en.json`

- [X] T052 [US2] Add 9 route name constants to `mobile/lib/core/router/app_routes.dart`: `static const wishlist = '/wishlist'`, `translatedBooks = '/translated-books'`, `recommendedBooks = '/recommended-books'`, `notificationSettings = '/notification-settings'`, `staticPage = '/static-page'`, `aboutUs = '/about-us'`, `contactUs = '/contact-us'`, `privacyPolicy = '/privacy-policy'`, `termsOfUse = '/terms-of-use'`
- [X] T053 [US2] Create `mobile/lib/core/router/args/static_page_args.dart` — immutable plain Dart class `StaticPageArgs({required this.slug, required this.title})`
- [X] T054 [US2] Add all new route cases to `mobile/lib/core/router/app_router.dart`: `wishlist→BlocProvider<WishlistCubit>(WishlistScreen)`; `translatedBooks→BlocProvider<CatalogCubit>(TranslatedBooksScreen)`; `recommendedBooks→BlocProvider<CatalogCubit>(RecommendedBooksScreen)`; `notificationSettings→BlocProvider<NotificationSettingsCubit>(NotificationSettingsScreen)`; `staticPage/aboutUs/contactUs/privacyPolicy/termsOfUse→BlocProvider<StaticPageCubit>(StaticPageScreen)`; update existing `bookDetail` case to `MultiBlocProvider([BookDetailCubit,WishlistCubit,RatingsCubit,CommentsCubit])`; update existing `articleDetail` case to `MultiBlocProvider([ArticleDetailCubit,CommentsCubit])`; add `publish→BlocProvider<PublishCubit>(PublishScreen)` — all with null guard on `settings.arguments` → `_unknown(settings)` fallback
- [X] T055 [US2] Update the More tab drawer/sheet (locate its widget in `mobile/lib/features/`) to include navigation entries for: My Wishlist (`AppRoutes.wishlist`), Books Recommended for Translation (`AppRoutes.recommendedBooks`), Translated Books (`AppRoutes.translatedBooks`), Notification Settings (`AppRoutes.notificationSettings`), About Us (`AppRoutes.aboutUs`), Contact Us (`AppRoutes.contactUs`), Privacy Policy (`AppRoutes.privacyPolicy`), Terms of Use (`AppRoutes.termsOfUse`) — per FR-003
- [X] T056 [P] [US2] Add all ~50 new English translation keys to `mobile/assets/translations/en.json` — include all keys listed in plan Group Q1: `wishlist_*` (6 keys), `ratings_*` (4 keys), `comments_*` (8 keys), `newsletter_*` (5 keys), `notifications_*` (5 keys), `translated_books_title`, `recommended_for_translation_title`, `translation_rights_notice`, `publish_step_*` (9 keys), `about_us_title`, `contact_us_title`, `privacy_policy_title`, `terms_of_use_title`, `team_title`, `channel_*` (6 keys)
- [X] T057 [P] [US2] Add all ~50 new Arabic translation keys to `mobile/assets/translations/ar.json` — mirror of T056 with correct Arabic translations for all keys

**Checkpoint**: All routes navigable. All strings translated. Language toggle verified.

---

## Phase 5: User Story 3 — Editorial & Media Channels: Read Articles, Watch Videos, Listen to Podcasts (Priority: P2)

**Goal**: All 6 channel tabs show real articles from API; article detail renders linked books; YouTube embeds in Watch Your Book + Novel & Story; just_audio player in Book Talk.

**Independent Test**: Open Articles tab → all 6 channel tabs show real article data. Open Essence of Ideas article → linked book card below headline. Open Book Talk episode → audio player with play/pause/seek/speed controls. Open Watch Your Book → YouTube embed 16:9. Open Novel & Story video → AI disclosure always visible.

**Acceptance Criteria** (FR-030–FR-036):
- 6 channel tabs, reverse-chronological order, real API data
- Book Harvest: linked books in scrollable row; report period label
- Novel & Story: AI disclosure on every entry — no exceptions (FR-033)
- Watch Your Book + Novel & Story: YouTube full-width 16:9 (FR-034)
- Book Talk: play/pause, seek, duration, speed 1×/1.25×/1.5×/2× (FR-035)
- ⚠️ BLOCKER: Confirm `videoUrl` field name with backend before wiring YouTube widget

- [X] T058 [P] [US3] Update `mobile/lib/features/articles/domain/entities/article.dart` — additive only: add `slug: String`, `authorFirstName: String`, `authorLastName: String`, `readingTime: int`; add getters `readMinutes→readingTime` (backward compat) and `authorFullName→'$authorFirstName $authorLastName'`; update channel key constants from 3 to 6 values: `harvest`, `ideas`, `world-reads`, `books-talk`, `watch-your-book`, `novel-story`
- [X] T059 [P] [US3] Update `mobile/lib/features/articles/domain/entities/article_detail.dart` — additive only: add `slug: String`, `authorFirstName: String`, `authorLastName: String`, `videoUrl: String?`
- [X] T060 [US3] Create `mobile/lib/features/articles/data/models/article_model.dart` — `fromJson` mapping `readingTime`, `imageUrl` (used as cover), `authorFirstName`, `authorLastName`, `slug`; `toEntity()→Article`
- [X] T061 [US3] Create `mobile/lib/features/articles/data/models/article_detail_model.dart` — `fromJson` with nested `relatedArticles: List<ArticleModel>` from `json['relatedArticles']`, `pullQuote: String?`, `videoUrl: String?`; `toEntity()→ArticleDetail`
- [X] T062 [US3] Replace all stub/hardcoded data in `mobile/lib/features/articles/data/data_sources/articles_remote_data_source.dart`: `getArticles({channel,page,limit,sort,locale})→GET /articles` with query params via `PaginatedResponse<ArticleModel>`; `getArticleDetail(slug,{locale})→GET /articles/{slug}?locale={locale}` via `ApiEnvelope<ArticleDetailModel>`; `getRelatedArticles(slug,{limit})→GET /articles/{slug}/related?limit=`; `getChannels()→` return hardcoded list of 6 `ArticleChannel` objects (no backend endpoint) with keys: `harvest`, `ideas`, `world-reads`, `books-talk`, `watch-your-book`, `novel-story`
- [X] T063 [US3] Add `getArticles({String? channel, int page, int limit, String? sort, String? locale})→Future<Either<Failure,PaginatedResponse<Article>>>` abstract method to `mobile/lib/features/articles/domain/repositories/articles_repository.dart`
- [X] T064 [US3] Add `getArticles` delegation to `mobile/lib/features/articles/data/repositories/articles_repository_impl.dart` following existing fold pattern
- [X] T065 [US3] Update `mobile/lib/features/articles/presentation/cubit/articles_list_cubit.dart` — update channel key strings to 6 new values; switch from in-memory mock to real `ArticlesRepository.getArticles(channel: channel)`; add `loadMore()` method following `CatalogCubit` pagination pattern (increment page, append list, check `hasNextPage`)
- [X] T066 [US3] Implement media rendering in article detail screen(s) under `mobile/lib/features/articles/presentation/`: add `youtube_player_iframe` widget (full-width, `AspectRatio(16/9)`) for `watch-your-book` and `novel-story` channels using `article.videoUrl` — add `tr('ai_disclosure')` banner below player for `novel-story` channel entries (FR-033); add `just_audio` player widget for `books-talk` channel with play/pause `IconButton`, `Slider` seek bar, `Text` duration/position, speed control `DropdownButton([1.0,1.25,1.5,2.0])` (⚠️ BLOCKER Risk #6: confirm `videoUrl` field name with backend before wiring; confirm audio URL format for Book Talk Risk #7)

**Checkpoint**: All 6 editorial and media channels functional with real API data and media playback.

---

## Phase 6: User Story 4 — Global Search with Autocomplete (Priority: P2)

**Goal**: Fix SearchCubit architecture violation; wire real `GET /search` and `GET /search/suggestions` APIs; autocomplete after 2+ chars + 300ms debounce; tabbed results.

**Independent Test**: Tap search. Type 1 char → no suggestions. Type 3 chars, pause 300ms → up to 5 suggestions with type labels appear. Submit → All/Books/Articles/Publishers tabs with real results. Verify `SearchCubit` no longer imports `PublishersRemoteDataSourceImpl`.

**Acceptance Criteria** (FR-037–FR-040, SC-003):
- Architecture violation resolved: `SearchCubit` depends only on `SearchRepository`
- Autocomplete triggers at 2+ chars after 300ms inactivity (FR-038)
- Search results organized in All/Books/Articles/Publishers tabs (FR-039)
- Recent searches stored locally (last 5); popular searches server-loaded (FR-037)

- [X] T067 [P] [US4] Create `mobile/lib/features/search/domain/entities/search_suggestion.dart` — Equatable entity: `type: String` (one of `'book'|'publisher'|'article'`), `label: String`, `slug: String`
- [X] T068 [P] [US4] Create `mobile/lib/features/search/domain/entities/search_response.dart` — Equatable entity: `books: List<Book>`, `articles: List<Article>`, `publishers: List<Publisher>`, `totalResults: int`
- [X] T069 [P] [US4] Create `mobile/lib/features/search/domain/repositories/search_repository.dart` — abstract interface: `search(String query, {String? type, int page, int limit, String? locale})→Future<Either<Failure,SearchResponse>>`, `getSuggestions(String query, {int limit})→Future<Either<Failure,List<SearchSuggestion>>>`
- [X] T070 [US4] Create `mobile/lib/features/search/data/models/search_result_model.dart` — `SearchResponseModel.fromJson`: parse `json['data']['books']` as `List` via `BookModel.fromJson`, `json['data']['articles']` via `ArticleModel.fromJson`, `json['data']['publishers']` via `PublisherModel.fromJson`; `toEntity()→SearchResponse`
- [X] T071 [US4] Create `mobile/lib/features/search/data/data_sources/search_remote_data_source.dart` — `@lazySingleton`; `search(...)→GET /search?q=&type=&page=&limit=&locale=` via `ApiEnvelope<SearchResponseModel>`; `getSuggestions(...)→GET /search/suggestions?q=&limit=` returning list of `SearchSuggestion`
- [X] T072 [US4] Create `mobile/lib/features/search/data/repositories/search_repository_impl.dart` — `@LazySingleton(as: SearchRepository)`; inject `SearchRemoteDataSource`; delegate with fold pattern
- [X] T073 [US4] Fix `mobile/lib/features/search/presentation/cubit/search_cubit.dart` — **remove `PublishersRemoteDataSourceImpl` injection entirely** (architecture violation fix); inject `SearchRepository` instead; keep existing 300ms `Timer` debounce; add `suggestions: List<SearchSuggestion>` field to the Success state; add `loadMore()` following `CatalogCubit` pagination pattern; update `search()` to call `searchRepository.search(...)` and `getSuggestions(...)` in parallel
- [X] T074 [US4] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `SearchRemoteDataSource` and `SearchRepositoryImpl` appear in `injection_container.config.dart`
- [X] T075 [P] [US4] Create `test/features/search/data/search_repository_impl_test.dart` — verify `search_cubit.dart` does NOT import `package:booksplatform/features/publishers/data/data_sources/` (grep check); test `SearchRepositoryImpl.search` returns `Right<SearchResponse>` with mocked data source; test `getSuggestions` returns `Right<List<SearchSuggestion>>`

**Checkpoint**: Search architecture violation resolved. Autocomplete and tabbed results functional.

---

## Phase 7: User Story 5 — Publisher Directory & Profiles (Priority: P2)

**Goal**: Replace 7 hardcoded publishers with real API; publisher profiles show real data including paginated book grid; country filter populated from API.

**Independent Test**: Open Publishers tab. Scroll — real publisher data loads. Filter by a country. Open a publisher profile — banner, logo, name, website, email, books grid visible. Tap website → browser opens. Tap email → mail app pre-filled.

**Acceptance Criteria** (FR-028–FR-029):
- Sponsored publishers appear first with "Sponsored" badge
- Publisher profile: banner, logo, name (AR + original), country, website (→ browser), email (→ mail app), description, books grid paginated
- Country filter derived from publishers API (no dedicated endpoint)

- [X] T076 [P] [US5] Update `mobile/lib/features/publishers/domain/entities/publisher.dart` — additive only: add `slug: String`, `title: String`, `imageUrl: String?`, `excerpt: String?`, `countries: List<String>`; add getters `name→title` (backward compat), `countryAr→countries.isNotEmpty ? countries[0] : ''`; keep old `countryAr/countryEn/countryFlag` fields as nullable
- [X] T077 [US5] Create `mobile/lib/features/publishers/data/models/publisher_model.dart` — `fromJson`: map `title→title`, `booksCount→bookCount`, `countries→countries` array; `toEntity()→Publisher` with all updated fields
- [X] T078 [US5] Create `mobile/lib/features/publishers/data/models/publisher_book_model.dart` — `fromJson` for publisher's `/books` endpoint response shape; `toEntity()→PublisherBook` (or `Book` if the shape matches)
- [X] T079 [US5] Replace all mock/hardcoded data in `mobile/lib/features/publishers/data/data_sources/publishers_remote_data_source.dart`: `getPublishers({country,page,limit,search,locale})→GET /publishers` via `PaginatedResponse<PublisherModel>`; `getPublisherBySlug(slug)→GET /publishers/{slug}` via `ApiEnvelope<PublisherModel>`; `getPublisherBooks(slug,{page,limit})→GET /publishers/{slug}/books` via `PaginatedResponse<PublisherBookModel>`; `getCountries()→` calls `getPublishers(limit:100)` and extracts unique sorted country strings from `countries` arrays, cached in `List<String>? _cachedCountries` field
- [X] T080 [US5] Update all method implementations in `mobile/lib/features/publishers/data/repositories/publishers_repository_impl.dart` to delegate to real data source using fold pattern

**Checkpoint**: Publisher directory and profiles fully functional with real API data.

---

## Phase 8: User Story 6 — Author Submission Wizard: Publish Your Book (Priority: P2)

**Goal**: Complete the full Publish feature domain/data/cubit chain; refactor `PublishScreen` from `StatefulWidget` to `BlocConsumer`; 3-step wizard with PDF upload, eligibility check, and content standards gate.

**Independent Test**: More → Publish Your Book. Fill Step 0 (author info) → email blur fires eligibility check → green "first submission free" badge. Fill Step 1 (book info) → pick PDF → picker opens → select file ≤50MB. Complete Step 2 (review) → check content standards checkbox → Submit button becomes active → tap → full-screen success state shown.

**Acceptance Criteria** (FR-053–FR-059):
- Back button on Steps 1/2 preserves all form data
- Eligibility check fires on email field blur; green badge for first-time authors
- File picker supports Google Drive, iCloud, local storage; PDF capped at 50MB (FR-055)
- Content standards checkbox required before Submit button is enabled (FR-056)
- Form autosaves after each step transition; "Resume Draft" banner on re-entry (FR-057)
- Paid submission shows "Continue to Web for Payment" redirect (FR-056)
- ⚠️ BLOCKER Risk #2: File upload service undefined — `StubFileUploadServiceImpl` used

- [X] T081 [P] [US6] Create `mobile/lib/features/publish/domain/entities/submission.dart` — Equatable: `id: String`, `status: String`, `isFirstFree: bool`, `requiresPayment: bool`, `paymentStatus: String?`
- [X] T082 [P] [US6] Create `mobile/lib/features/publish/domain/entities/eligibility_result.dart` (`isEligibleForFree: bool`, `submissionsCount: int`) and `submission_request.dart` value object with all Step 1 + Step 2 form fields: `authorName`, `authorEmail`, `authorPhone`, `authorBio`, `bookTitleAr`, `bookType`, `bookSummary`, `bookLanguage`, `bookCategory`, `coverImageUrl: String?`, `manuscriptFileUrl: String?`, `allowFreeDownload: bool`
- [X] T083 [P] [US6] Create `mobile/lib/features/publish/domain/repositories/publish_repository.dart` — abstract: `checkEligibility(String email)→Future<Either<Failure,EligibilityResult>>`, `submitBook(SubmissionRequest request)→Future<Either<Failure,Submission>>`
- [X] T084 [US6] Create `mobile/lib/features/publish/data/data_sources/publish_remote_data_source.dart` — `@lazySingleton`; `checkEligibility(email)→GET /submissions/check-eligibility?email=` via `ApiEnvelope`; `submitBook(req)→POST /submissions` with all `SubmissionRequest` fields + **`website: ''` honeypot** (FR-059 spam prevention)
- [X] T085 [US6] Create `mobile/lib/features/publish/data/repositories/publish_repository_impl.dart` — `@LazySingleton(as: PublishRepository)`; inject `PublishRemoteDataSource`; fold pattern
- [X] T086 [US6] Create `mobile/lib/features/publish/services/file_upload_service.dart` — abstract `FileUploadService` interface with `uploadFile(String localPath)→Future<String>` and `uploadImage(String localPath)→Future<String>`; implement `StubFileUploadServiceImpl` as `@LazySingleton(as: FileUploadService)` returning placeholder URL `'https://placeholder.booksplatform.net/stub'` with `// TODO: integrate UploadThing or S3 — blocked on backend (Risk #2)` comment
- [X] T087 [US6] Create `mobile/lib/features/publish/presentation/cubit/publish_cubit.dart` and `publish_state.dart` — `@injectable`; inject `PublishRepository` + `FileUploadService`; sealed states: `PublishInitial`, `PublishStep(int step, Map<String,dynamic> formData)`, `CheckingEligibility`, `EligibilityLoaded(bool isEligibleForFree)`, `UploadingFile(double progress)`, `PublishSubmitting`, `PublishSuccess(Submission submission)`, `PublishError(String message)`; methods: `checkEligibility(email)`, `nextStep()` (validates current step fields first), `prevStep()`, `updateField(String key, dynamic value)`, `pickFile()` (via `file_picker`, 50MB cap), `pickCoverImage()` (via `image_picker`), `submit()` (upload PDF → upload cover → call `submitBook`); autosave form data to `SharedPreferences` under `'publish_draft'` key after every step transition
- [X] T088 [US6] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `PublishRemoteDataSource`, `PublishRepositoryImpl`, `StubFileUploadServiceImpl`, `PublishCubit` in `injection_container.config.dart`
- [X] T089 [US6] Refactor `mobile/lib/features/publish/presentation/screens/publish_screen/` — replace existing `StatefulWidget` with `BlocConsumer<PublishCubit,PublishState>`; Step 0: author fields (`AppTextField` for name/email/phone/bio with `RegexHelper` validators) + eligibility badge below email field; Step 1: book fields (title, type `DropdownButton`, summary, language, category) + file picker row for PDF + cover image picker; Step 2: read-only review summary + IP statement + content standards `Checkbox` (`AppConstants.kContentStandards` key) — Submit button disabled until checked; progress stepper at top; Back/Next in `Scaffold.bottomNavigationBar`; each step body in `SingleChildScrollView`; `BlocListener`: on `PublishSuccess` → full-screen success state with "Submit Another" (reset form) + "Back to Home" buttons
- [X] T090 [P] [US6] Create `test/features/publish/presentation/publish_cubit_test.dart` — test `nextStep()` increments step; test `prevStep()` decrements without data loss; test `checkEligibility` emits `CheckingEligibility` then `EligibilityLoaded`; test `submit()` calls `FileUploadService.uploadFile` before `PublishRepository.submitBook`

**Checkpoint**: Full 3-step submission wizard functional. Eligibility check, file pickers, and success state working.

---

## Phase 9: User Story 7 — Shopping Cart with Web Checkout Handoff (Priority: P2)

**Goal**: Cart items persist across app restarts via `CartStorage`; cart badge count accurate after cold restart; no network call required to display stored cart.

**Independent Test**: Add 2 books to cart. Kill app. Reopen → both items present in cart. Cart badge shows correct count immediately. "Complete on Web" opens browser. Offline: button disabled with message.

**Acceptance Criteria** (FR-041–FR-045, SC-008):
- Cart persists in `SharedPreferences` across app restarts
- Cart badge count correct immediately on launch (no loading state)
- Unavailable items flagged (FR-047); price changes disclosed (FR-045)
- Disclosure: "cart stored on device, not synced with web" always visible (FR-044)

- [X] T091 [US7] Update `mobile/lib/features/cart/presentation/cubit/cart_cubit.dart` — inject `CartStorage`; add `_loadFromStorage()` called immediately after `super(CartState([]))` in constructor; in `_loadFromStorage`: call `cartStorage.getItems()`, convert each `Map` via `_cartItemFromMap`, emit loaded state; after every mutation (add/remove/update/clear): call `cartStorage.saveItems(_serializeItems(state.items))`; add private `_serializeItems(List<CartItem>)→List<Map<String,dynamic>>` storing only `{slug, quantity, titleAr, titleEn, price, imageUrl}`; add private `_cartItemFromMap(Map)→CartItem` reconstructing minimal `CartItem` without full `Book` entity
- [X] T092 [US7] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `CartStorage` injected correctly into `CartCubit` (CartCubit remains `@lazySingleton` exception per CLAUDE.md); confirm `CartCubit` provided via `BlocProvider.value(value: getIt<CartCubit>())` in `CartScreen` route case

**Checkpoint**: Cart items survive app kills. Badge count accurate from cold start.

---

## Phase 10: User Story 8 — Push Notifications Opt-In and Deep Linking (Priority: P2)

**Goal**: Firebase FCM integrated client-side; soft pre-prompt on first launch only; deep links route correctly from cold start; notification settings screen functional.

**Independent Test**: Fresh device install. Soft pre-prompt appears once. Tap Allow → OS dialog shown → grant → FCM token stored in SecureStorage. Send test notification → appears on lock screen → tap → correct screen opens. Open Notification Settings → toggle on/off.

**Acceptance Criteria** (FR-065–FR-068b, SC-006):
- Soft pre-prompt appears exactly once on first launch (FR-005)
- "Not Now" does NOT trigger OS permission dialog (FR-005)
- FCM token never logged; stored via `SecureStorageHelper` only
- Deep link from cold start opens correct screen in < 3 seconds (SC-006)
- Token refresh triggers automatic re-registration (FR-068b)
- ⚠️ BLOCKER Risk #1: `POST /notifications/mobile/subscribe` does not exist; stub used
- ⚠️ BLOCKER Risk #8: iOS APNs requires Apple Developer account + Firebase Console setup

- [ ] T093 [US8] Add Firebase config files: `google-services.json` to `mobile/android/app/`; `GoogleService-Info.plist` to `mobile/ios/Runner/`; add `apply plugin: 'com.google.gms.google-services'` to `mobile/android/app/build.gradle`; add Google Services classpath to `mobile/android/build.gradle` `buildscript.dependencies` — (⚠️ BLOCKER: obtain files from Firebase Console after creating a Firebase project with your Android package name and iOS bundle ID)
- [X] T094 [US8] Create `mobile/lib/features/notifications/services/fcm_service.dart` — `@lazySingleton`; `initialize()`: sets up `FirebaseMessaging.onMessage.listen` → call `_showLocalNotification(msg)`; `FirebaseMessaging.onMessageOpenedApp.listen` → call `_handleNotificationTap(msg)`; `getInitialMessage()` → handle cold-start tap; `requestPermission()→FirebaseMessaging.instance.requestPermission()→bool granted`; `getToken()→FirebaseMessaging.instance.getToken()` then `SecureStorageHelper.saveString('fcm_token', token!)` — never log the token; `_handleNotificationTap(RemoteMessage msg)`: parse `msg.data['type']` and `msg.data['slug']`, push correct named route via `GlobalKey<NavigatorState>`; `_showLocalNotification`: use `flutter_local_notifications` to display foreground notifications
- [X] T095 [US8] Create `mobile/lib/features/notifications/data/data_sources/notifications_remote_data_source.dart` — `@lazySingleton`; `registerFcmToken(String token, String locale)→Future<Either<Failure,Unit>>` — **STUB: returns `Right(unit)` immediately without making any HTTP call**; add comment: `// TODO: POST /notifications/mobile/subscribe — endpoint not yet implemented (Risk #1)` — no exceptions, no network call
- [X] T096 [US8] Create `mobile/lib/features/notifications/domain/repositories/notifications_repository.dart` — abstract: `registerFcmToken(String token, String locale)→Future<Either<Failure,Unit>>`
- [X] T097 [US8] Create `mobile/lib/features/notifications/data/repositories/notifications_repository_impl.dart` — `@LazySingleton(as: NotificationsRepository)`; inject `NotificationsRemoteDataSource`; delegate
- [X] T098 [US8] Create `mobile/lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` and `notification_settings_state.dart` — `@injectable`; sealed states: `NotificationSettingsInitial`, `NotificationSettingsLoaded(bool pushEnabled, String? fcmToken)`, `NotificationSettingsUpdating`, `NotificationSettingsError(String message)`; `load()`: reads `kNotifOptInKey` from `SharedPreferences` via `SecureStorageHelper`; `togglePush(bool enabled)`: if true → `FcmService.requestPermission()` → if granted → `getToken()` → `registerFcmToken(token,locale)` → save flag; if false → save flag=false
- [X] T099 [US8] Create `mobile/lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart` — `Scaffold` with `AppBarWidget(tr('notifications_title'))`; `SafeArea`; `BlocBuilder` renders `SwitchListTile` with `tr('notifications_push_label')` driven by `NotificationSettingsLoaded.pushEnabled`; if OS permission denied (check via `Permission.notification.isDenied` from `permission_handler` or `FirebaseMessaging.instance.getNotificationSettings()`): show `TextButton(tr('open_system_settings'))` that calls `url_launcher.launchUrl(Uri.parse('app-settings:'))` or `AppSettings.openNotificationSettings()`
- [X] T100 [US8] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `FcmService`, `NotificationsRemoteDataSource`, `NotificationsRepositoryImpl`, `NotificationSettingsCubit` in `injection_container.config.dart`
- [X] T101 [US8] Update `mobile/lib/main.dart` — add `await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)` immediately after `WidgetsFlutterBinding.ensureInitialized()`; after `await configureDependencies()`: add `getIt<FcmService>().initialize()`; add first-launch soft pre-prompt logic: check `kNotifOptInKey` from `SharedPreferences`; if not set, schedule a one-time `BottomSheetHelper.showAppBottomSheet` with an "Allow / Not Now" dialog — only tap "Allow" triggers `getIt<FcmService>().requestPermission()`

**Checkpoint**: Push notifications work end-to-end client-side. Stub registered; backend integration pending endpoint.

---

## Phase 11: User Story 9 — Newsletter Subscription with Double Opt-In (Priority: P3)

**Goal**: Newsletter subscribe flow with email validation; success/already-subscribed messages; resend link after 60s; homepage newsletter banner tap-opens bottom sheet.

**Independent Test**: Tap newsletter strip on homepage → bottom sheet opens. Enter valid email → Subscribe → success message shows email address. Re-enter same email → "already subscribed" message. Offline → Subscribe button disabled.

**Acceptance Criteria** (FR-060–FR-064b):
- Double opt-in: success message says "confirmation email sent" (FR-061)
- "Already subscribed" message for duplicate emails (FR-062)
- Email max 254 chars; validate on submit only, not while typing (FR-064b)
- Resend link active after 60 seconds (FR-064)
- Newsletter accessible from homepage strip + article footers + More drawer (FR-060)

- [X] T102 [P] [US9] Create `mobile/lib/features/newsletter/domain/repositories/newsletter_repository.dart` — abstract: `subscribe(String email, {required String locale, String source})→Future<Either<Failure,NewsletterResult>>`; create `NewsletterResult` value class (`message: String`, `alreadySubscribed: bool`)
- [X] T103 [US9] Create `mobile/lib/features/newsletter/data/data_sources/newsletter_remote_data_source.dart` — `@lazySingleton`; `subscribe(email,{locale,source})→POST /newsletter/subscribe` with body `{email, locale, source:'mobile'}`; parse `data['alreadySubscribed']` bool from response; return `Right(NewsletterResult(message, alreadySubscribed))`
- [X] T104 [US9] Create `mobile/lib/features/newsletter/data/repositories/newsletter_repository_impl.dart` — `@LazySingleton(as: NewsletterRepository)`; inject `NewsletterRemoteDataSource`; fold pattern
- [X] T105 [US9] Create `mobile/lib/features/newsletter/presentation/cubit/newsletter_cubit.dart` and `newsletter_state.dart` — `@injectable`; sealed states: `NewsletterInitial`, `NewsletterLoading`, `NewsletterSuccess(String message, bool alreadySubscribed)`, `NewsletterError(String message)`; method: `subscribe(String email, String locale)`
- [X] T106 [US9] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `NewsletterRemoteDataSource`, `NewsletterRepositoryImpl`, `NewsletterCubit` in `injection_container.config.dart`
- [X] T107 [US9] Create `mobile/lib/features/newsletter/presentation/widgets/newsletter_bottom_sheet.dart` — `BlocProvider<NewsletterCubit>` wraps entire sheet content (not in AppRouter, since it's a bottom sheet); `AppTextField` for email (max 254 chars enforced; validate on submit attempt only via form key — NOT `onChanged`); AR/EN locale toggle chips; Subscribe `AppButton`; `BlocListener`: on `NewsletterSuccess` → `SnackBarHelper.showSuccess(message)` + `Navigator.pop`; on `NewsletterError` → `SnackBarHelper.showError(message)`; show resend link `TextButton` 60s after submission attempt (use `Timer(Duration(seconds:60), () => setState(...))` in stateful sheet wrapper)
- [X] T108 [US9] Add newsletter banner card to home screen (section 8, after stats) in `mobile/lib/features/books/presentation/screens/home_screen/` — `InkWell` or `GestureDetector` calls `BottomSheetHelper.showAppBottomSheet(context, child: NewsletterBottomSheet())`; banner displays `tr('newsletter_title')` and `tr('newsletter_subtitle')`; completes the 9th home section from Group L
- [X] T109 [P] [US9] Create `test/features/newsletter/data/newsletter_remote_data_source_test.dart` — mock `ApiManager`; test success case: `subscribe` emits `Right(NewsletterResult(message, false))`; test already-subscribed case: response with `alreadySubscribed:true` maps to `Right(NewsletterResult(message, true))`; verify POST body always includes `source:'mobile'`

**Checkpoint**: Newsletter subscription fully functional. Homepage banner wired. All 9 home sections now complete.

---

## Phase 12: User Story 10 — Static Informational Pages and Contact (Priority: P3)

**Goal**: All 5 static pages (About, Team, Contact, Privacy, Terms) accessible from More drawer; backend-first with `assets/static/` fallback; Contact email link opens mail app.

**Independent Test**: More → each static page link → page loads content. If backend unavailable → fallback markdown content loads. Contact page → tap email → mail app opens. Privacy Policy and Terms load server-managed content (FR-069).

**Acceptance Criteria** (FR-069–FR-071):
- Privacy Policy + Terms fetched from server; fallback to bundled assets if 404
- Contact email tappable via `url_launcher`
- All 5 pages reachable from More drawer
- ⚠️ BLOCKER Risk #3: Backend endpoint existence unconfirmed — fallback to `assets/static/` planned

- [X] T110 [P] [US10] Create `mobile/lib/features/static_pages/domain/entities/static_page.dart` — Equatable entity: `slug: String`, `title: String`, `content: String` (HTML or markdown)
- [X] T111 [P] [US10] Create `mobile/lib/features/static_pages/domain/repositories/static_pages_repository.dart` — abstract: `getPage(String slug)→Future<Either<Failure,StaticPage>>`
- [X] T112 [US10] Create `mobile/lib/features/static_pages/data/models/static_page_model.dart` — `StaticPageModel.fromJson`; `toEntity()→StaticPage`
- [X] T113 [US10] Create `mobile/lib/features/static_pages/data/data_sources/static_pages_remote_data_source.dart` — `@lazySingleton`; `getPage(slug)`: first attempt `GET /static-pages/{slug}` via `ApiEnvelope<StaticPageModel>`; on `Left(Failure)` or 404 → fallback: `rootBundle.loadString('assets/static/$slug.md')` wrapped in try/catch → return `Right(StaticPage(slug, title, markdownContent))` with title derived from slug; if both fail → `Left(ServerFailure('Page not available'))`
- [X] T114 [US10] Create `mobile/lib/features/static_pages/data/repositories/static_pages_repository_impl.dart` — `@LazySingleton(as: StaticPagesRepository)`; inject `StaticPagesRemoteDataSource`; fold pattern
- [X] T115 [US10] Create `mobile/lib/features/static_pages/presentation/cubit/static_page_cubit.dart` and `static_page_state.dart` — `@injectable`; sealed states: `StaticPageInitial`, `StaticPageLoading`, `StaticPageLoaded(StaticPage page)`, `StaticPageError(String message)`; method: `load(String slug)`
- [X] T116 [US10] Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` — verify `StaticPagesRemoteDataSource`, `StaticPagesRepositoryImpl`, `StaticPageCubit` in `injection_container.config.dart`
- [X] T117 [US10] Create `mobile/lib/features/static_pages/presentation/screens/static_page_screen/static_page_screen.dart` — receives `StaticPageArgs` from `AppRouter`; `AppBarWidget` with `args.title`; `SafeArea`; `BlocBuilder`: on `StaticPageLoaded` → `SingleChildScrollView` wrapping `StaticPageBody(content)`; special case for `slug == 'contact'`: add `GestureDetector` with `url_launcher.launchUrl(Uri.parse('mailto:contact@booksplatform.net'))` on email text; create `widgets/static_page_body.dart` rendering content as `SelectableText` with `AppTextStyles.body`
- [X] T118 [US10] Create fallback markdown files `mobile/assets/static/about.md`, `team.md`, `contact.md`, `privacy.md`, `terms.md` with placeholder content; register in `mobile/pubspec.yaml` under `assets:` — add `assets/static/` entry

**Checkpoint**: All 5 static pages accessible. Privacy + Terms serve from server with asset fallback.

---

## Phase 13: Tests & Polish — Group R

**Purpose**: Final verification that all new domain/data logic is tested, DI is clean, and the codebase has zero analysis errors.

- [X] T119 [P] Create `test/core/network/api_envelope_test.dart` — test `ApiEnvelope.fromJson` with success JSON `{success:true, data:{...}}` → correct `T` returned; test `ApiEnvelope.fromJson` with error JSON `{success:false, error:{message:'...'}}` → `ApiError` populated; test `PaginatedResponse.fromJson` → correct `data` list length and `pagination.hasNextPage` value
- [X] T120 Run `dart run build_runner build --delete-conflicting-outputs` from `mobile/` (final pass) — verify all expected registrations present in `mobile/lib/core/di/injection_container.config.dart`; confirm no stale/conflicting entries
- [X] T121 Run `flutter analyze` from `mobile/` directory — resolve ALL errors and warnings to zero; pay special attention to unused imports (CLAUDE.md requirement) and any `@deprecated` API usages introduced during implementation
- [X] T122 Run `flutter test` from `mobile/` directory — confirm all test files added in T049–T051, T075, T090, T109, T119 pass; zero failing tests

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup): No dependencies — start immediately
- **Phase 2** (Foundational): Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3** (US1 — P1): Depends on Phase 2 completion
- **Phase 4** (US2 — P1): Depends on Phase 3 (MultiBlocProvider on BookDetail needs WishlistCubit, RatingsCubit, CommentsCubit from Phase 3)
- **Phase 5** (US3 — P2): Depends on Phase 2 only; can start in parallel with Phase 3 after Phase 2
- **Phase 6** (US4 — P2): Depends on Phase 2 + entity updates from Phases 3 (Book), 5 (Article), 7 (Publisher)
- **Phase 7** (US5 — P2): Depends on Phase 2 only; can start after Phase 2
- **Phase 8** (US6 — P2): Depends on Phase 2 + Phase 6 (pubspec packages from T006)
- **Phase 9** (US7 — P2): Depends on Phase 2 (CartStorage from T008) only
- **Phase 10** (US8 — P2): Depends on Phase 2 (T006 Firebase packages) only
- **Phase 11** (US9 — P3): Depends on Phase 2 only; T108 (home banner) depends on Phase 3 home screen
- **Phase 12** (US10 — P3): Depends on Phase 2 only
- **Phase 13** (Polish/Tests): Depends on all phases complete

### User Story Dependencies (cross-story)

- **US1 → US2**: Phase 4 router changes depend on WishlistCubit (T023), RatingsCubit (T036), CommentsCubit (T037) from Phase 3
- **US4 → US3, US5**: `SearchResponseModel` (T070) depends on `ArticleModel` (T060) and `PublisherModel` (T077)
- **US9 → US1**: Newsletter home banner (T108) depends on home screen structure from T046
- All other user stories are independent of each other after Phase 2 completes

### Within Each User Story

- Domain entities first (no dependencies)
- Data models after entities
- Data source after models (needs model types)
- Repository impl after data source and abstract repository
- Cubit after repository impl
- `dart run build_runner` after each DI annotation batch
- Screen/widgets after cubit
- Tests can be written in parallel with implementation

---

## Parallel Example: User Story 1 (Phase 3)

```bash
# Start immediately in parallel after Phase 2 completes:
T011  create purchase_option.dart
T013  create book_stats.dart
T020  create wishlist_item.dart
T021  create wishlist_repository.dart (abstract)
T029  create rating.dart
T030  create comment.dart
T031  create ratings_repository.dart (abstract)

# After T011 + T013 complete:
T012  update book.dart (needs PurchaseOption from T011)

# After T012 complete, in parallel:
T014  create book_model.dart
T015  create category_model.dart
T016  create book_stats_model.dart
T032  create rating_model.dart
T033  create comment_model.dart

# After T021 complete:
T022  create wishlist_repository_impl.dart

# Continue per dependency chain...
```

---

## Implementation Strategy

### MVP (Phase 1 + 2 + 3 only — User Story 1)

1. Complete Phase 1: baseline
2. Complete Phase 2: infrastructure (CRITICAL gate)
3. Complete Phase 3: US1 core reader loop
4. **STOP and VALIDATE**: real books load, wishlist persists, ratings submit
5. Demo to client if ready

### Incremental Sprint Delivery

1. Phase 2 → Foundation ready
2. Phase 3 → Core discovery + wishlist + ratings (MVP!) ✅
3. Phase 4 → All routes + translations ✅
4. Phases 5–10 → Feature completions (can parallelize by developer)
5. Phases 11–12 → P3 features
6. Phase 13 → Tests + final analysis

### Parallel Team Strategy (if staffed)

After Phase 2 completes:
- **Dev A**: Phase 3 (US1) → Phase 4 (US2)
- **Dev B**: Phase 5 (US3) → Phase 6 (US4)
- **Dev C**: Phase 7 (US5) → Phase 8 (US6)
- **Dev D**: Phase 9 (US7) → Phase 10 (US8) → Phase 11 (US9) → Phase 12 (US10)

---

## Known Blockers Summary

| Task | Blocker | Risk # | Mitigation |
|---|---|---|---|
| T093, T101 | Firebase project + APNs certificate not yet created | #8 | Client must create Firebase project and provide `google-services.json` / `GoogleService-Info.plist` |
| T095 | `POST /notifications/mobile/subscribe` does not exist | #1 | Stub returns `Right(unit)`; flag for backend team |
| T086 | File upload service endpoint (UploadThing/S3) undefined | #2 | `StubFileUploadServiceImpl` with TODO; flag for backend team |
| T066 | `videoUrl` field existence in article detail response unconfirmed | #6 | Review backend schema before wiring YouTube widget |
| T066 | Audio URL format for Book Talk unconfirmed | #7 | Confirm MP3/SoundCloud/other with backend before `just_audio` integration |
| T113 | `GET /static-pages/{slug}` endpoint existence unconfirmed | #3 | Fallback to `assets/static/` bundled markdown |

---

## Notes

- `[P]` tasks touch different files and have no cross-dependencies — safe to work in parallel
- Run `dart run build_runner build --delete-conflicting-outputs` after EVERY batch of `@injectable`/`@lazySingleton` annotations added (tasks T010, T024, T038, T074, T088, T092, T100, T106, T116, T120)
- All padding: `EdgeInsetsDirectional`; all alignment: `AlignmentDirectional` — never `EdgeInsets`/`Alignment`
- ScreenUtil `.sp/.w/.h/.r` only inside `build()` methods or lazy getters — never at class-level static init
- `BlocProvider` always in `AppRouter.generateRoute` — never inside a screen widget (exception: `NewsletterBottomSheet` per plan Group I5)
- `ApiManager` is the sole error boundary — no `try/catch` in data sources
- Domain contracts return entities only — never `*_response.dart` or `*_model.dart` types
