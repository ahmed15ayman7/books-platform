# Data Model: Books Platform Mobile

---

## Updated Entities

### Book (mobile/lib/features/books/domain/entities/book.dart)

**Existing fields (unchanged):** id, titleAr, titleEn, publisher, publisherId, countryAr, countryEn, countryFlag, originalLanguage, status (TranslationStatus), price, categorySlug, coverColors, isbn, pages, edition, year, descriptionAr, isNew

**New fields (additive):**
| Field | Type | Source |
|---|---|---|
| slug | String | `json['slug']` |
| imageUrl | String? | `json['imageUrl']` |
| purchaseOption | PurchaseOption | `PurchaseOption.fromString(json['purchaseOption'])` |
| referralLink | String? | `json['referralLink']` |
| averageRating | double? | `json['averageRating']` |
| ratingsCount | int? | `json['ratingsCount']` |
| descriptionEn | String? | `json['description']` when locale=en |

**New enum: PurchaseOption**
- `direct` ← `'DIRECT'`
- `referral` ← `'REFERRAL'`
- `notAvailable` ← any other value

---

### Article (mobile/lib/features/articles/domain/entities/article.dart)

**New fields:**
| Field | Type | Source |
|---|---|---|
| slug | String | `json['slug']` |
| authorFirstName | String | `json['authorFirstName']` |
| authorLastName | String | `json['authorLastName']` |
| readingTime | int | `json['readingTime']` (minutes) |

**Getter:** `readMinutes → readingTime` (backward compat)
**Getter:** `authorFullName → '$authorFirstName $authorLastName'`

**Channel keys (updated from 3 to 6):**
- `harvest` — Book Harvest
- `ideas` — Essence of Ideas
- `world-reads` — World Reads
- `books-talk` — Book Talk
- `watch-your-book` — Watch Your Book
- `novel-story` — Novel & Story

---

### Publisher (mobile/lib/features/publishers/domain/entities/publisher.dart)

**New fields:**
| Field | Type | Source |
|---|---|---|
| slug | String | `json['slug']` |
| title | String | `json['title']` |
| imageUrl | String? | `json['imageUrl']` |
| excerpt | String? | `json['excerpt']` |
| countries | List\<String\> | `json['countries']` array |

**Getters:** `name → title`, `countryAr → countries.isNotEmpty ? countries[0] : ''`

---

## New Entities

### BookStats
```
totalBooks: int
totalPublishers: int
totalTranslatedBooks: int
totalCountries: int
```
Source: `GET /books/stats`

### Rating
```
id: String
productId: String
stars: int            (1–5)
average: double
count: int
distribution: Map<int, int>   (star → count)
```
Validation: stars ∈ [1,5]
Source: `GET /ratings?productId=`

### Comment
```
id: String
authorName: String
content: String
date: DateTime
parentId: String?
productId: String?
articleId: String?
```
Source: `GET /comments?productId=`

### SearchSuggestion
```
type: String   ('book' | 'publisher' | 'article')
label: String
slug: String
```
Source: `GET /search/suggestions?q=`

### SearchResponse
```
books: List<Book>
articles: List<Article>
publishers: List<Publisher>
totalResults: int
```
Source: `GET /search?q=`

### WishlistItem
```
bookSlug: String   (only field stored locally)
```
Storage: SharedPreferences JSON array under `kWishlistKey`

### Submission
```
id: String
status: String   ('draft' | 'pending' | 'approved' | 'rejected')
isFirstFree: bool
requiresPayment: bool
paymentStatus: String?
```
Source: `POST /submissions`

### EligibilityResult
```
isEligibleForFree: bool
submissionsCount: int
```
Source: `GET /submissions/check-eligibility?email=`

### StaticPage
```
slug: String   ('about' | 'team' | 'contact' | 'privacy' | 'terms')
title: String
content: String   (HTML or markdown)
```
Source: backend or bundled assets fallback

---

## API Envelope Types (`lib/core/network/api_envelope.dart`)

### ApiEnvelope\<T\>
```
success: bool
data: T?
error: ApiError?
```
Factory: `ApiEnvelope.fromJson(json, fromData: T Function(dynamic))` — reads `json['data']` and applies factory

### ApiError
```
code: String?
message: String
```
Factory: reads `json['error']` object

### PaginatedResponse\<T\>
```
data: List<T>
pagination: PaginationMeta
```
Factory: `PaginatedResponse.fromJson(json, fromJsonT: T Function(Map<String,dynamic>))` — iterates `json['data']` array

### PaginationMeta
```
page: int
limit: int
total: int
totalPages: int
hasNextPage: bool
```
Factory: reads `json['pagination']`

---

## Repository Methods Summary

### BooksRepository (additions)
- `getStats()` → `Future<Either<Failure, BookStats>>`
- `getTranslatedBooks({int page, int limit})` → `Future<Either<Failure, PaginatedResponse<Book>>>`
- `getRecommendedForTranslation({int page, int limit})` → `Future<Either<Failure, PaginatedResponse<Book>>>`

### SearchRepository (new)
- `search(String query, {String? type, int page, int limit, String? locale})` → `Future<Either<Failure, SearchResponse>>`
- `getSuggestions(String query, {int limit})` → `Future<Either<Failure, List<SearchSuggestion>>>`

### WishlistRepository (new)
- `getWishlist()` → `Future<Either<Failure, List<String>>>`
- `addToWishlist(String slug)` → `Future<Either<Failure, Unit>>`
- `removeFromWishlist(String slug)` → `Future<Either<Failure, Unit>>`
- `isInWishlist(String slug)` → `Future<Either<Failure, bool>>`
- `clearWishlist()` → `Future<Either<Failure, Unit>>`

### RatingsRepository (new)
- `getRatings(String productId)` → `Future<Either<Failure, Rating>>`
- `submitRating(String productId, String email, int stars)` → `Future<Either<Failure, Unit>>`
- `getComments(String productId, {int page, int limit})` → `Future<Either<Failure, PaginatedResponse<Comment>>>`
- `submitComment({required String authorName, required String email, required String content, String? productId, String? articleId})` → `Future<Either<Failure, Unit>>`

### NewsletterRepository (new)
- `subscribe(String email, {required String locale, String source})` → `Future<Either<Failure, NewsletterResult>>`

### PublishRepository (new)
- `checkEligibility(String email)` → `Future<Either<Failure, EligibilityResult>>`
- `submitBook(SubmissionRequest request)` → `Future<Either<Failure, Submission>>`

### NotificationsRepository (new)
- `registerFcmToken(String token, String locale)` → `Future<Either<Failure, Unit>>` [STUB — backend pending]

### StaticPagesRepository (new)
- `getPage(String slug)` → `Future<Either<Failure, StaticPage>>`
