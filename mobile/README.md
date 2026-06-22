# BooksPlatform — Mobile App

A Flutter mobile application for browsing, purchasing, and publishing books and articles. Available on Android and iOS, with full Arabic/English bilingual support (RTL-aware).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [State Management Pattern](#state-management-pattern)
- [Dependency Injection](#dependency-injection)
- [Environment Variables Reference](#environment-variables-reference)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [Known Limitations / TODO](#known-limitations--todo)
- [License](#license)

---

## Tech Stack

| Category | Package | Version |
|---|---|---|
| **Language** | Dart | `^3.11.5` |
| **Framework** | Flutter | `^3.41.9` |
| **State Management** | flutter_bloc (Cubit) | `^9.1.1` |
| **Networking** | dio | `^5.9.2` |
| **Networking (logging)** | pretty_dio_logger | `^1.4.0` |
| **Dependency Injection** | get_it + injectable | `^9.2.1` / `^3.0.0` |
| **Functional Error Handling** | dartz (`Either`) | `^0.10.1` |
| **Secure Storage** | flutter_secure_storage | `^10.2.0` |
| **Preferences** | shared_preferences | `^2.5.5` |
| **UI Scaling** | flutter_screenutil | `^5.9.3` |
| **Image Loading** | cached_network_image | `^3.4.1` |
| **SVG** | flutter_svg | `^2.3.0` |
| **Skeleton Loading** | shimmer | `^3.0.0` |
| **Localization** | easy_localization | `^3.0.3` |
| **Formatting** | intl | `^0.20.2` |
| **Audio Playback** | just_audio | `^0.9.40` |
| **File Picker** | file_picker | `^8.1.7` |
| **Image Picker** | image_picker | `^1.1.2` |
| **Markdown Rendering** | flutter_markdown | `^0.7.7` |
| **Fonts** | google_fonts | `^6.2.1` |
| **Equality** | equatable | `^2.0.8` |
| **Connectivity** | connectivity_plus | `^7.1.1` |
| **URL Handling** | url_launcher | `^6.3.2` |
| **Testing (mocks)** | mocktail | `^1.0.4` |
| **Code Generation** | build_runner + injectable_generator | `^2.15.0` / `^3.0.2` |
| **Launcher Icons** | flutter_launcher_icons | `^0.14.4` |

---

## Architecture Overview

The project follows **Clean Architecture** with a **feature-first folder structure**. All shared infrastructure lives in `lib/core/`; all product code lives in `lib/features/<feature_name>/`. Dependency direction is strictly enforced:

```
Presentation → Domain → Data
Feature      → Core
Features must never import from other features.
```

Each feature is internally divided into three layers — **data** (API models, repository impl), **domain** (entities, repository contracts), and **presentation** (Cubits, screens, widgets). Cross-feature navigation passes typed args classes through `lib/core/router/args/` to avoid inter-feature imports.

```
mobile/
├── lib/
│   ├── main.dart                  # App entry point — DI, localization, routing bootstrap
│   ├── core/                      # Shared infrastructure (networking, DI, theme, routing, helpers)
│   │   ├── constants/             # AppConstants, ApiConstants, AppSpacing design tokens
│   │   ├── di/                    # get_it + injectable setup; generated injection_container.config.dart
│   │   ├── enums/                 # Shared enums (TranslationStatus, …)
│   │   ├── helpers/               # DialogHelper, SnackBarHelper, BottomSheetHelper, DateFormatterHelper, etc.
│   │   ├── network/               # ApiManager, DioFactory, AuthInterceptor, Failure hierarchy, api_envelope
│   │   ├── router/                # AppRouter, AppRoutes, args/ (typed navigation args)
│   │   ├── storage/               # SecureStorageHelper (wraps FlutterSecureStorage)
│   │   ├── theme/                 # AppColors, AppTextStyles, AppFontWeight, AppTheme
│   │   └── widgets/               # Shared widgets: AppLoadingIndicator, EmptyStateWidget, BookCoverWidget, etc.
│   └── features/                  # One folder per product feature
│       ├── books/                 # Home feed, catalog, book detail, recommended/translated lists
│       ├── articles/              # Article list + rich detail screen (audio/video)
│       ├── publishers/            # Publisher list + detail
│       ├── media_creations/       # Media items list
│       ├── search/                # Full-text search with history
│       ├── cart/                  # Local cart (SharedPreferences)
│       ├── wishlist/              # Local wishlist (SharedPreferences)
│       ├── publish/               # Multi-step book publishing wizard
│       ├── ratings/               # Ratings and comments (used on book + article detail)
│       ├── onboarding/            # Splash, language selection, onboarding slideshow
│       ├── notifications/         # FCM token registration + notification settings
│       ├── static_pages/          # About Us, Contact Us, Services, Team, Privacy Policy, Terms
│       └── more/                  # "More" bottom-sheet navigation panel
├── assets/
│   ├── translations/              # en.json, ar.json (easy_localization)
│   ├── branding/                  # Logo, app icon
│   ├── icons/social/              # Social media icon assets
│   └── onboarding/                # Onboarding slide images
├── test/                          # Unit and widget tests (mirrors lib/features structure)
├── android/                       # Android project (applicationId: com.booksplatform.booksplatform)
├── ios/                           # iOS project (with PrivacyInfo.xcprivacy)
└── scripts/                       # Helper scripts (e.g. validate_search_apis.py)
```

---

## Features

- **Onboarding** — splash screen, language selection (EN/AR), and illustrated onboarding slideshow
- **Home feed** — hero image carousel, categories strip, books carousel sections, publishers section, newsletter signup strip
- **Books catalog** — full paginated book list, filterable by category
- **Book detail** — cover image, bibliographic table, similar books, ratings, and user comments
- **Recommended books** — curated recommended books list
- **Translated books** — books filtered by translation status
- **Articles** — article list with category filtering; rich detail screen with embedded audio player and video badge
- **Publishers** — publisher directory with individual publisher detail pages
- **Media Creations** — browsable media items list
- **Search** — full-text search with persistent recent search history
- **Cart** — add/remove books, locally persisted across sessions (SharedPreferences)
- **Wishlist** — save/remove books, locally persisted (SharedPreferences)
- **Publish** — multi-step wizard for authors to submit a book (author info → book details → review → success)
- **Ratings & Comments** — star ratings and threaded comments on books and articles
- **Notification Settings** — screen to manage push notification preferences (FCM — currently blocked, see Known Limitations)
- **Static pages** — About Us, Contact Us, Services, Team, Privacy Policy, Terms of Use
- **Bilingual (AR/EN)** — full RTL/LTR support via `easy_localization` and Flutter's `Directionality` widget

---

## Getting Started

### Prerequisites

| Tool | Required Version |
|---|---|
| Flutter SDK | `^3.41.9` (stable channel) |
| Dart SDK | `^3.11.5` (bundled with Flutter) |
| Android Studio / Xcode | Latest stable |
| Android emulator or physical device | Android API 21+ |
| iOS Simulator or physical device | iOS 12+ |

Verify your setup:
```bash
flutter --version
flutter doctor
```

### Environment Setup

The app uses compile-time environment variables — no `.env` file is needed.

| Environment | Flag |
|---|---|
| Development (default) | *(no flag needed)* |
| Production | `--dart-define=ENVIRONMENT=prod` |

**VS Code** — add to `.vscode/launch.json` `args` array:
```json
"args": ["--dart-define=ENVIRONMENT=prod"]
```

**Android Studio** — open *Run → Edit Configurations → Additional run args*:
```
--dart-define=ENVIRONMENT=prod
```

### Installation

```bash
# 1. Install Flutter dependencies
flutter pub get

# 2. Regenerate DI code (required after any @injectable class changes)
dart run build_runner build --delete-conflicting-outputs
```

### Run

```bash
# Development (default environment)
flutter run

# Production environment
flutter run --dart-define=ENVIRONMENT=prod

# Target a specific device
flutter run -d <device-id>   # list devices with: flutter devices
```

### Build

```bash
# Android APK (production)
flutter build apk --dart-define=ENVIRONMENT=prod

# Android App Bundle for Google Play (production — recommended)
flutter build appbundle --release \
  --dart-define=ENVIRONMENT=prod \
  --obfuscate \
  --split-debug-info=build/app/outputs/symbols

# iOS (production)
flutter build ios --dart-define=ENVIRONMENT=prod
```

> **Release signing (Android):** `android/key.properties` must be present with `keyAlias`, `keyPassword`, `storeFile`, and `storePassword` filled in before building a release APK/AAB. Do not commit this file.

---

## Project Structure

```
lib/
├── main.dart
├── core/
│   ├── constants/
│   │   ├── app_constants.dart       # Design tokens, storage keys, animation durations
│   │   ├── api_constants.dart       # baseUrl (env-aware), HTTP timeouts
│   │   └── spacing_constants.dart   # AppSpacing — ScreenUtil-backed spacing getters
│   ├── di/
│   │   ├── injection_container.dart        # getIt instance + configureDependencies()
│   │   ├── injection_container.config.dart # Auto-generated — do not edit manually
│   │   └── register_module.dart            # @module: Dio, FlutterSecureStorage, NavigatorKey, SharedPreferences
│   ├── enums/
│   │   └── translation_status.dart
│   ├── helpers/
│   │   ├── dialog_helper.dart          # @lazySingleton — Material dialogs
│   │   ├── snack_bar_helper.dart       # @lazySingleton — success/error/info/warning SnackBars
│   │   ├── bottom_sheet_helper.dart    # Static utility — modal bottom sheets
│   │   ├── date_formatter_helper.dart  # Static — date formatting via intl
│   │   ├── regex_helper.dart           # Static const regex patterns + validate()
│   │   ├── url_launcher_helper.dart    # Static — opens URLs
│   │   └── book_biblio_helpers.dart    # Static — bibliographic field formatting
│   ├── network/
│   │   ├── api_manager.dart            # @lazySingleton — HTTP methods, returns Either<Failure, T>
│   │   ├── api_result.dart             # Internal sealed class — ApiSuccess / ApiFailure
│   │   ├── api_envelope.dart           # PaginatedResponse, PaginationMeta, ApiEnvelope helpers
│   │   ├── dio_factory.dart            # @lazySingleton — builds Dio with interceptors
│   │   ├── failure.dart                # Failure hierarchy (ServerFailure, NetworkFailure, …)
│   │   ├── failure_messages.dart       # failureToMessage() — single source of error strings
│   │   ├── connectivity_helper.dart    # @lazySingleton — wraps connectivity_plus
│   │   └── interceptors/
│   │       └── auth_interceptor.dart   # Bearer token injection + 401 → logout redirect
│   ├── router/
│   │   ├── app_router.dart             # generateRoute() — all route cases with BlocProvider wiring
│   │   ├── app_routes.dart             # Static route name constants
│   │   └── args/                       # Typed navigation argument classes
│   │       ├── book_detail_args.dart
│   │       ├── article_detail_args.dart
│   │       ├── category_books_args.dart
│   │       ├── publisher_detail_args.dart
│   │       └── static_page_args.dart
│   ├── storage/
│   │   └── secure_storage_helper.dart  # @lazySingleton — token and string storage
│   ├── theme/
│   │   ├── app_colors.dart             # Brand palette (primary: #B11E2E)
│   │   ├── app_font_weight.dart        # Weight constants
│   │   ├── app_text_styles.dart        # Text style getters (ScreenUtil .sp)
│   │   ├── app_shadows.dart            # Shadow definitions
│   │   └── app_theme.dart              # lightTheme — wires ColorScheme, TextTheme, etc.
│   └── widgets/                        # Reusable widgets shared across features
│       ├── app_loading_indicator.dart
│       ├── empty_state_widget.dart
│       ├── error_state_widget.dart
│       ├── book_cover_widget.dart
│       ├── section_header_widget.dart
│       ├── app_text_field.dart
│       ├── app_bar_widget.dart
│       ├── bottom_nav_widget.dart
│       └── ...
└── features/
    ├── books/
    │   ├── data/datasources/     # books_remote_data_source_impl.dart
    │   ├── data/models/          # BookResponse, CategoryResponse, HeroSlide, etc.
    │   ├── data/repositories/
    │   ├── domain/entities/
    │   ├── domain/repositories/
    │   └── presentation/
    │       ├── cubit/            # HomeContentCubit, CatalogCubit, BookDetailCubit
    │       ├── pages/            # home_screen/, catalog_screen/, book_detail_screen/, …
    │       └── widgets/
    ├── articles/                 # ArticlesListCubit, ArticleDetailCubit
    ├── publishers/               # PublishersListCubit, PublisherDetailCubit
    ├── media_creations/          # MediaListCubit
    ├── search/                   # SearchCubit (with SharedPreferences history)
    ├── cart/                     # CartCubit (@lazySingleton — global state)
    ├── wishlist/                 # WishlistCubit
    ├── publish/                  # PublishCubit, multi-step wizard + FileUploadService (stub)
    ├── ratings/                  # RatingsCubit, CommentsCubit
    ├── onboarding/               # splash_screen, language_screen, onboarding_screen/
    ├── notifications/            # NotificationsRemoteDataSource (FCM stub), notification_settings_screen/
    ├── static_pages/             # StaticPageCubit, about/contact/services/team/privacy/terms screens
    └── more/                     # more_bottom_sheet.dart
```

---

## API Overview

| Property | Value |
|---|---|
| **Base URL** | `https://booksplatform.net/api/v1` |
| **Auth mechanism** | Bearer JWT — injected automatically by `AuthInterceptor` |
| **Content-Type** | `application/json` |
| **Timeout** | 30 s (connect / receive / send) |

The API returns responses in one of two shapes — direct JSON objects (most endpoints) or paginated envelopes with a `{ data: [...], pagination: { page, limit, total, totalPages, hasNextPage } }` structure. See `lib/core/network/api_envelope.dart` for the `PaginatedResponse<T>` and `ApiEnvelope<T>` helpers.

**High-level endpoint groups:**

| Group | Prefix |
|---|---|
| Books | `/books/...` |
| Categories | `/categories/...` |
| Articles | `/articles/...` |
| Publishers | `/publishers/...` |
| Media | `/media/...` |
| Search | `/search/...` |
| Ratings / Comments | `/ratings/...`, `/comments/...` |
| Publish / Submit | `/publish/...` |
| Static Content | `/pages/...` |
| Notifications | `/notifications/mobile/subscribe` *(stub — endpoint not yet implemented)* |

---

## State Management Pattern

All feature state is managed with **flutter_bloc Cubits**. Each Cubit has an adjacent sealed-class state file:

```dart
// lib/features/books/presentation/cubit/catalog_cubit/catalog_state.dart
sealed class CatalogState extends Equatable { ... }
final class CatalogInitial  extends CatalogState { ... }
final class CatalogLoading  extends CatalogState { ... }
final class CatalogSuccess  extends CatalogState { final List<Book> books; ... }
final class CatalogError    extends CatalogState { final String message; ... }
```

Features that have both **read (list)** and **write (action)** operations use separate Cubits to avoid state collisions — e.g., `BookDetailCubit` for loading and `WishlistCubit`/`RatingsCubit` for mutations on the same screen.

`BlocProvider` is always created in `AppRouter.generateRoute`, never inside screen widgets. Screens with multiple Cubits use `MultiBlocProvider`.

**Cart** is the one exception: `CartCubit` is a `@lazySingleton` (global) shared between the app bar badge and the cart screen. It is accessed via `getIt<CartCubit>()` and provided with `BlocProvider.value(...)`.

Real example: [lib/features/books/presentation/cubit/catalog_cubit/](lib/features/books/presentation/cubit/catalog_cubit/)

---

## Dependency Injection

The app uses **get_it** as the service locator with **injectable** for annotation-driven code generation.

| Class type | Annotation | Scope |
|---|---|---|
| Remote data source | `@lazySingleton` | Lifetime |
| Repository impl | `@LazySingleton(as: Repo)` | Lifetime |
| Use case | `@injectable` | Factory |
| Cubit (all except Cart) | `@injectable` | Factory |
| CartCubit | `@lazySingleton` | Lifetime (global) |
| DialogHelper, SnackBarHelper | `@lazySingleton` | Lifetime |
| FlutterSecureStorage, Dio, NavigatorKey, SharedPreferences | `@module` providers | Singleton / lazy |

**After adding or modifying any `@injectable` / `@lazySingleton` class**, regenerate the config:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Verify the new binding appears in [lib/core/di/injection_container.config.dart](lib/core/di/injection_container.config.dart).

To register a new third-party dependency, add a getter to [lib/core/di/register_module.dart](lib/core/di/register_module.dart).

---

## Environment Variables Reference

The app does not use a `.env` file. Configuration is passed at build/run time via `--dart-define`.

| Key | Purpose | Required? |
|---|---|---|
| `ENVIRONMENT` | Selects `dev` or `prod` API base URL. Defaults to `dev`. | No |

**Runtime storage keys** (stored on device, never in code):

| Key | Storage | Purpose |
|---|---|---|
| `auth_token` | FlutterSecureStorage | JWT access token |
| `auth_user` | FlutterSecureStorage | Authenticated user payload |
| `onboarding_done` | SharedPreferences | Whether onboarding has been completed |
| `wishlist_slugs` | SharedPreferences | Locally persisted wishlist book slugs |
| `cart_items` | SharedPreferences | Locally persisted cart items |
| `search_history` | SharedPreferences | Recent search query strings |

**Android release signing** — populate `android/key.properties` (do not commit):

| Key | Purpose | Required? |
|---|---|---|
| `keyAlias` | Keystore alias | Yes (release builds) |
| `keyPassword` | Key password | Yes (release builds) |
| `storeFile` | Path to `.jks` / `.keystore` file | Yes (release builds) |
| `storePassword` | Keystore password | Yes (release builds) |

---

## Testing

Unit tests and some widget tests exist under `test/`, mirroring the feature structure.

**Test directories present:**

```
test/
├── core/
│   ├── helpers/        # Helper unit tests
│   └── network/        # ApiManager / Failure tests
├── features/
│   ├── books/data/     # BookResponse model tests, remote data source tests
│   ├── articles/
│   ├── newsletter/
│   ├── notifications/
│   ├── publish/
│   ├── publishers/
│   ├── ratings/
│   ├── search/
│   └── wishlist/
└── widget_test.dart
```

**Mocking library:** `mocktail ^1.0.4`

```bash
# Run all tests
flutter test

# Run a single file
flutter test test/features/books/data/book_model_test.dart

# Static analysis
flutter analyze
```

> Coverage focuses on data-layer models and repository contracts. Cubit and presentation-layer coverage is limited.

---

## CI/CD

> ⚠️ No CI/CD pipeline is configured in this repository. No `.github/workflows/`, `codemagic.yaml`, or other pipeline files were detected.

Manual release builds are handled via `scripts/build_release.ps1` (produces a signed Android App Bundle for Google Play).

---

## Contributing

**Branch naming** (inferred from git history):
- Features: `feat/<short-description>`
- Releases: `release/v<version>-<platform>`
- Fixes: `fix/<short-description>`
- Chores: `chore/<short-description>`

**Commit convention** (Conventional Commits): `feat:`, `fix:`, `chore:`, `docs:`

**Mandatory step before every commit that touches DI classes:**
```bash
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test
```

Do not commit `android/key.properties`, `google-services.json`, or `GoogleService-Info.plist`.

---

## Known Limitations / TODO

| # | Issue | Location |
|---|---|---|
| 1 | **Firebase push notifications blocked** — `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are absent. `firebase_messaging` and `firebase_core` are commented out in `pubspec.yaml`. FCM token registration is a no-op stub. | [pubspec.yaml](pubspec.yaml), [lib/features/notifications/data/datasources/notifications_remote_data_source.dart](lib/features/notifications/data/datasources/notifications_remote_data_source.dart) |
| 2 | **File upload service is a stub** — book cover and file uploads return placeholder URLs. Blocked on UploadThing/S3 backend integration. | [lib/features/publish/services/file_upload_service.dart](lib/features/publish/services/file_upload_service.dart) |
| 3 | **No authentication/login flow** — `AuthInterceptor` handles 401 → redirect to `/login`, but no login screen exists. The route constant is defined but has no case in `AppRouter`. | [lib/core/router/app_routes.dart](lib/core/router/app_routes.dart) |
| 4 | **Article audio URL format unconfirmed** — audio playback may fail if the backend serves a different URL scheme than expected. | [lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart](lib/features/articles/presentation/pages/article_detail_screen/article_detail_audio_player.dart) |
| 5 | **Dev and prod base URLs are identical** — both point to `https://booksplatform.net/api/v1`. Update `ApiConstants` when a staging environment is available. | [lib/core/constants/api_constants.dart](lib/core/constants/api_constants.dart) |
| 6 | **No CI/CD pipeline** — builds and tests must be run manually. | — |

---

## License

No license file detected in this repository — treat as **proprietary / all rights reserved**.
