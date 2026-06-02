# Research: Books Platform Mobile — Resolved Decisions

All decisions resolved from codebase exploration and backend API analysis. No open clarifications remain for planning.

---

## D1: API Envelope Strategy

**Decision**: Create `lib/core/network/api_envelope.dart` with `ApiEnvelope<T>`, `PaginatedResponse<T>`, and `PaginationMeta`. Data sources own deserialization using these classes after receiving `Either<Failure, Map>` from `ApiManager`.

**Rationale**: Backend consistently wraps responses as `{success, data, pagination?}`. ApiManager must not change its generic interface. Parsing stays in the data layer (correct layer per Clean Architecture).

---

## D2: Real Backend URLs

**Decision**: dev=`http://localhost:3000/api/v1`, prod=`https://booksplatform.net/api/v1`. The `String.fromEnvironment` switch already exists in `api_constants.dart` — only string values change.

---

## D3: Cart Persistence

**Decision**: SharedPreferences via new `CartStorage` @lazySingleton. Store minimal fields per item `{slug, quantity, titleAr, titleEn, price, imageUrl}`. Cart is device-local per spec — no backend sync.

**Alternative rejected**: sqflite — overkill for a small list; adds migration complexity.

---

## D4: Wishlist Storage

**Decision**: SharedPreferences storing JSON array of slug strings only. Full book data fetched on demand from API when Wishlist screen opens.

**Alternative rejected**: Local SQLite — unnecessary for a string list; no offline content cache requirement in spec.

---

## D5: Search Architecture Fix

**Decision**: Introduce `SearchRepository` (abstract) → `SearchRepositoryImpl` → `SearchRemoteDataSource`. Remove direct `PublishersRemoteDataSourceImpl` injection from `SearchCubit`. Use `GET /search` endpoint which returns books + articles + publishers in one call.

**Why required**: Constitution Principle 1 violation — presentation layer (cubit) must not depend on a data source. All new search results from real `GET /search?q=` API endpoint.

---

## D6: Push Notifications

**Decision**: FCM (firebase_messaging) for native mobile push. `FcmService` @lazySingleton manages token lifecycle and message routing. Backend endpoint `POST /notifications/mobile/subscribe` **does not exist** — stub the registration call. Client side fully implemented; backend endpoint flagged as Risk #1.

**Alternative rejected**: Web Push Protocol (what the backend currently has at `/notifications/push/subscribe`) — Web Push uses browser-specific keys (p256dh/auth), incompatible with native iOS/Android push.

---

## D7: File Upload for Submissions

**Decision**: `FileUploadService` abstract interface + `StubFileUploadServiceImpl` returning placeholder URL. Backend must provide either: (a) UploadThing API key, (b) pre-signed S3 URL endpoint, or (c) new file upload endpoint. Flagged as Risk #2.

---

## D8: YouTube Player Package

**Decision**: `youtube_player_iframe` — WebView-based, cross-platform, handles both Android and iOS. Used for Watch Your Book and Novel & Story channels.

**Alternative rejected**: `youtube_player_flutter` — older, less actively maintained.

---

## D9: Audio Player Package

**Decision**: `just_audio` — better audio focus handling, background playback, streaming URL support. Used for Book Talk podcast channel.

**Alternative rejected**: `audioplayers` — less reliable background playback on iOS.

---

## D10: Article/Publisher/Book Entity Updates

**Decision**: Strictly additive — new fields are nullable or have default values. Backward-compat getters added (`readMinutes → readingTime`, `name → title`). No existing field renamed. All existing UI continues to compile without changes.

---

## D11: `PaginatedResponse<T>` Model

**Decision**: Generic class in `api_envelope.dart`. Cubits hold `currentPage`, `hasNextPage`, items list. `loadMore()` method fetches next page and appends. Reference implementation: existing `CatalogCubit` pattern.

---

## D12: Static Pages Fallback

**Decision**: `StaticPageCubit` tries backend API first. If backend returns 404 or no endpoint exists, load from bundled `assets/static/{slug}.md` files. This handles Risk #3 without blocking delivery.

---

## Existing Code Confirmed Compliant

- `ApiManager` — correct sealed pattern, single error boundary ✅
- `AuthInterceptor` — token injection invisible to data sources ✅
- `CartCubit` — correct @lazySingleton exception for global cart state ✅
- `AppRouter` — correct BlocProvider placement ✅
- All existing cubit states — correct `sealed class` + `final class` + Equatable ✅
- ScreenUtil usage — all `.sp/.w/.h` only in `build()` methods or lazy getters ✅
- `EdgeInsetsDirectional` usage — confirmed in existing screens ✅
