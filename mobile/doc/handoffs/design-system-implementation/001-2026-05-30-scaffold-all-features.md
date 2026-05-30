# Session Handoff — 2026-05-30

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Fetched and decompressed the Anthropic design handoff bundle (`Mobile Design System & Screen Map.html`) — it was a gzip-compressed TAR archive; extracted manually using PowerShell to `C:\Users\youss\.claude\projects\...\tool-results\design_extracted\`.
- Read the full design spec: brand-red (#B11E2E) primary color, Tajawal/Cairo/Inter fonts, 28dp card radii, "Soft UI" personality, RTL-first (AR/EN bilingual).
- Created and approved a full implementation plan (saved at `C:\Users\youss\.claude\plans\fetch-this-design-file-staged-taco.md`).
- Implemented all 10 steps — **`flutter analyze` → 0 issues** at end of session.

### Core token updates (Step 0)
- `lib/core/theme/app_colors.dart` — primary → #B11E2E, primaryDark → #8B1623, secondary → #0B0B0B (brand-black), brandRedSoft added, info added; all neutral grays/semantic colors updated to design spec.
- `lib/core/theme/app_shadows.dart` — **new file**; `AppShadows.soft / softLg / brand / header`.
- `lib/core/theme/app_theme.dart` — card radius 28r, button radius 24r, input 14r, bottom sheet top 28r, ElevatedButton height 52h.
- `lib/core/theme/app_text_styles.dart` — rewritten to use `google_fonts` (Cairo headings, Tajawal body, Inter micro-labels). All `height: 1.7` for Arabic readability.
- `lib/core/constants/app_constants.dart` — added `kRadius*` constants + `kOnboardingDoneKey`.
- `pubspec.yaml` — added `google_fonts: ^6.3.3`.

### New core widgets (Step 1)
| File | Purpose |
|---|---|
| `lib/core/widgets/book_cover_widget.dart` | Gradient cover placeholder; spine effect; Cairo title; caller wraps in `AspectRatio(3/4)` |
| `lib/core/widgets/translation_status_badge.dart` | Pill chip — translated(green)/nominated(warning)/new(red)/notTranslated(gray) |
| `lib/core/widgets/app_bar_widget.dart` | Custom sticky container (NOT Flutter AppBar); home vs title variant; `LangToggle`; cart badge |
| `lib/core/widgets/bottom_nav_widget.dart` | 4-tab nav + center elevated FAB (→ /publish); `BottomNavTab` enum |
| `lib/core/widgets/section_header_widget.dart` | `SectionHeaderWidget(title, onSeeAll?, seeAllLabel?)` |
| `lib/core/enums/translation_status.dart` | `TranslationStatus` enum (shared between core widgets and books feature) |

### Features built (Steps 2–8)

**Onboarding** (`lib/features/onboarding/`)
- `SplashScreen` — brand-black bg, Timer → checks `kOnboardingDoneKey` → /language or /home
- `LanguageScreen` — AR/EN cards; sets `context.setLocale()` via easy_localization
- `OnboardingScreen` — PageView, 3 slides, animated dot indicators, saves done key on finish

**Books** (`lib/features/books/`) — Priority 1-3
- Entities: `Book`, `Category`, `PublisherSummary`, `SortOrder` enum
- `BooksRemoteDataSourceImpl` (@lazySingleton) — **mock data** from `books_mock_data.dart` (6 books, 8 categories, 5 publishers)
- `BooksRepositoryImpl` (@LazySingleton)
- `HomeContentCubit` (@injectable) — sequential awaits for 4 repo calls; `HomeContentSuccess` with featured/categories/freshBooks/translatedBooks/topPublishers
- `CatalogCubit` (@injectable) — status + sort filter; `applyFilter()`
- `BookDetailCubit` (@injectable) — loads book + similar
- `HomeScreen` — `CustomScrollView` with 6 sections: featured hero, categories HScroll, newly released, translated, publishers, newsletter strip
- `CatalogScreen` — filter row + 2-up `GridView.builder`
- `BookDetailScreen` — args: `BookDetailArgs(slug, titleAr)`; hero cover, biblio table, expandable description, add-to-cart + wishlist buttons, similar carousel
- Widgets: `BookCardWidget`, `FeaturedBookHeroWidget`

**Publishers** (`lib/features/publishers/`)
- `Publisher` entity, `PublishersRemoteDataSourceImpl` (mock, 7 publishers)
- `PublishersListCubit` — country filter (re-queries DS)
- `PublishersScreen` — search bar (visual only), country chips, publisher cards with avatar initials + book count chip

**Search** (`lib/features/search/`)
- `SearchResult` sealed class: `BookSearchResult | PublisherSearchResult`
- `SearchCubit` — 300ms `Timer` debounce; searches books mock + publishers DS
- `SearchScreen` — sticky red-border search field; recent chips; mixed book/publisher result rows

**Articles** (`lib/features/articles/`)
- `Article`, `ArticleChannel` entities
- `ArticlesListCubit` — inline static data (3 channels populated: harvest, translation, analysis); `switchChannel()`
- `ArticlesScreen` — channel tabs HScroll with count badges; featured card (150h); article list rows (78×78 gradient thumb)
- **Note:** `ArticleDetailScreen` is **not yet built** — route registered but falls through to `_UnknownScreen`

**Cart** (`lib/features/cart/`)
- `CartItem` entity
- `CartCubit` (@lazySingleton) — shared state; `addItem / removeItem / updateQuantity / clear`; `CartState` with computed subtotal/fee/total
- `CartScreen` — uses `BlocProvider.value(getIt<CartCubit>())`; empty state; line items with qty stepper; summary card with checkout button

**Publish** (`lib/features/publish/`)
- `PublishScreen` — 3-step (`StatefulWidget`, no cubit); step indicator with animated connector lines; author form → book form + PDF upload zone → success state; "first book free" promo banner

### Routing and DI (Step 9)
- `app_routes.dart` — 12 routes: `/`, `/language`, `/onboarding`, `/home`, `/books`, `/books/detail`, `/books/category`, `/publishers`, `/publishers/detail`, `/articles`, `/articles/detail`, `/search`, `/cart`, `/publish`, `/login` (placeholder for AuthInterceptor)
- `app_router.dart` — fully wired; `BookDetailArgs` and `ArticleDetailArgs` null-guarded
- Args files: `lib/core/router/args/book_detail_args.dart`, `publisher_detail_args.dart`, `article_detail_args.dart`
- `dart run build_runner build` — succeeded; all factories/singletons verified in `injection_container.config.dart`
- `flutter analyze` — **0 issues**

---

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | `TextDirection.rtl` caused analyzer errors | Medium | `book_detail_screen.dart`, `search_screen.dart` | Worked around by using `locale == 'ar'` instead of `Directionality.of(context) == TextDirection.rtl`; root cause unclear — may be analyzer quirk with Dart 3.11.5 |
| 2 | `ServerFailure` called with named params instead of positional | Medium | `books_remote_data_source_impl.dart`, `publishers_remote_data_source_impl.dart` | Fixed to `ServerFailure(404, 'message')` |
| 3 | `Future.wait` returns untyped `List<dynamic>` breaking type inference | Medium | `home_content_cubit.dart`, `publishers_list_cubit.dart` | Replaced with sequential `await` calls |
| 4 | Apostrophe in single-quoted Dart string | High (compile break) | `publish_screen.dart` line ~461 | `'We'll...'` → changed to double-quoted string |

---

## Files Changed

| File | Change | Why |
|---|---|---|
| `lib/core/theme/app_colors.dart` | Updated all hex values; added `brandRedSoft`, `info` | Design spec alignment |
| `lib/core/theme/app_theme.dart` | Radii: cards 28r, buttons 24r, inputs 14r, sheets 28r; button height 52h | Design spec |
| `lib/core/theme/app_text_styles.dart` | Switched to `google_fonts` (Cairo/Tajawal/Inter); updated sizes | Design typography spec |
| `lib/core/constants/app_constants.dart` | Added `kRadius*` + `kOnboardingDoneKey` | New constants needed |
| `pubspec.yaml` | Added `google_fonts: ^6.3.3` | Font requirement |
| `lib/core/router/app_routes.dart` | Added 12 new route constants | Feature routing |
| `lib/core/router/app_router.dart` | Full rewrite — all routes wired | Feature routing |

**New files created:** ~65 total — see the features section above for the full list.

---

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/core/network/failure.dart` | `ServerFailure` constructor signature | Positional: `ServerFailure(int, String)` — confirmed |
| `lib/core/di/injection_container.config.dart` | New DI registrations | All 6 factories + lazySingletons confirmed |
| `lib/core/theme/app_font_weight.dart` | Extra-bold weight available | `extraBold = FontWeight.w800` ✓ |
| `lib/main.dart` | ScreenUtil + easy_localization wiring | No changes needed |

---

## Pending Tasks

- [ ] **Build `ArticleDetailScreen`** — route `/articles/detail` is registered but falls through to `_UnknownScreen`. Design spec: hero (230h gradient), floating controls, byline, optional YouTube thumbnail, article body (RTL, pull-quote), comment composer + thread, related articles HScroll. Add `ArticleDetailCubit` (@injectable) for loading body + comments.
- [ ] **Build `PublisherDetailScreen`** — route `/publishers/detail` not implemented. Design: publisher logo/initials header, about text, that publisher's books `GridView`.
- [ ] **Wire `CategoryBooksScreen`** — route `/books/category` registered but not implemented. Should be a filtered `CatalogScreen` variation.
- [ ] **Add `CartCubit` call from `BookDetailScreen`** — "Add to Cart" button currently calls `onAddCart()` which navigates to `/cart` instead of actually adding the book. Pass `CartCubit` via `getIt<CartCubit>().addItem(book)` then navigate.
- [ ] **Connect real `BottomNavWidget` cart badge** — `cartCount` in `AppBarWidget` is always 0. Should observe `getIt<CartCubit>().state.totalCount` via `BlocBuilder`.
- [ ] **Connect locale to `AppBarWidget` and `BottomNavWidget`** — `currentLocale` is hardcoded or passed as `context.locale.languageCode`. Consider a cubit or inherited widget for locale state if easy_localization is insufficient.
- [ ] **Replace mock data with real API calls** — When backend is live, replace each `*_remote_data_source_impl.dart` mock body with `ApiManager.get(path: ..., fromJson: ...)`.
- [ ] **Add `shimmer` loading skeletons** — `shimmer` package is already in pubspec. Replace `AppLoadingIndicator` (spinner) in list screens with book-card shimmer placeholders.
- [ ] **Add onboarding image assets** — `assets/onboard-discover.png`, `assets/onboard-translate.png`, `assets/onboard-publish.png` referenced in `OnboardingScreen` but not yet in the assets folder. Falls back to `_PlaceholderIllustration` until added.
- [ ] **Persist recent searches** — `SearchScreen` shows hardcoded recent chips (`['هارفارد', 'فلسفة', 'ماركيز']`). Should read/write from `SecureStorageHelper` as JSON list.
- [ ] **Checkout flow** — `CartScreen` "Checkout" button calls `() {}` (no-op). Full checkout screen deferred pending payment gateway decision.

---

## What's Next (ordered)

1. **Fix `BookDetailScreen` → `CartCubit`** — `BookDetailScreen._DetailBody.onAddCart` should call `getIt<CartCubit>().addItem(book)` before navigating. This is a 3-line change and unblocks the cart flow.
2. **Build `ArticleDetailScreen`** — the articles tab is complete except the detail view. It's the largest remaining screen.
3. **Build `PublisherDetailScreen`** — simpler, can reuse `BookCardWidget` in a grid.
4. **Wire cart badge in AppBar** — wrap `AppBarWidget` `cartCount:` with `context.watch<CartCubit>().state.totalCount` in each screen (or use `getIt<CartCubit>()` stream).
5. **Add onboarding image assets** to `assets/` and declare in `pubspec.yaml` under `flutter.assets`.
6. **Replace mock data** with real API endpoints once the backend is live.

---

## Key References

- Design spec (decompressed): `C:\Users\youss\.claude\projects\D--Programing-Flutter-freelancing-books-platform-mobile\...\tool-results\design_extracted\books-platfotm-mobile-designs\project\`
  - `Mobile Design System & Screen Map.html` — full token + screen map spec
  - `bp/screens-a.jsx` — Home, Catalog, BookDetail, Publishers JSX
  - `bp/screens-b.jsx` — Articles, Cart, Publish, Search JSX
  - `bp/ui.jsx` — shared components (AppBar, BottomNav, BookCard, etc.)
  - `bp/data.js` — mock data structure (books, publishers, categories)
- Implementation plan: `C:\Users\youss\.claude\plans\fetch-this-design-file-staged-taco.md`
- Project CLAUDE.md: `D:\Programing\Flutter\freelancing\books-platform\mobile\CLAUDE.md`
- Feature guide: `D:\Programing\Flutter\freelancing\books-platform\mobile\.claude\rules\flutter_feature_prompt.md`
- Generated DI: `lib/core/di/injection_container.config.dart` (auto-generated — check after adding new @injectable classes)

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should the design's brand-red (#B11E2E) replace the scaffold's blue (#2563EB) primary color? | Yes — the scaffold colors were explicitly described as placeholders |
| Should `google_fonts` package be added for Tajawal/Cairo/Inter fonts? | Approved in plan |
| Dark mode at launch? | Deferred (open question in design — not built in this session) |
| Navy vs red brand — which is correct? | Red (#B11E2E) — confirmed by the live codebase's `globals.css` as noted in the design doc |
| No reader login/auth in this version? | Confirmed — cart and wishlist use session/email only |

---

## Notes

- **`TranslationStatus` enum lives in `lib/core/enums/`** (not inside the books feature) because `TranslationStatusBadge` (a core widget) needs it. Importing from a feature into core would violate the layer boundary.
- **`CartCubit` is `@lazySingleton`** — it is shared global state accessed by `AppBarWidget` (badge count) and `CartScreen`. It does NOT go in a `BlocProvider` wrapping the route; instead use `BlocProvider.value(value: getIt<CartCubit>())` in `CartScreen` and `context.watch<CartCubit>()` in screens that show the badge.
- **`ServerFailure` uses positional args**: `ServerFailure(statusCode, message)` — NOT named parameters. Check `lib/core/network/failure.dart`.
- **`TextDirection.rtl`** triggered an analyzer error with Dart 3.11.5. Workaround: compare `locale == 'ar'` instead of `Directionality.of(context) == TextDirection.rtl`. Investigate if this resolves in a future SDK update.
- **Mock data file**: `lib/features/books/data/datasources/books_mock_data.dart` — 6 books, 8 categories, 5 publishers. Articles mock data is inline in `ArticlesListCubit`. When replacing with real API, remove these and add real `ApiManager` calls.
- **`BottomNavWidget`** uses `Stack + Positioned(top: -22.h)` for the elevated center FAB — the outer `Container` clip must be `Clip.none` to show the FAB above the nav bar surface.
- **All spacing**: Use `EdgeInsetsDirectional` (not `EdgeInsets`) everywhere so RTL mirrors automatically.
