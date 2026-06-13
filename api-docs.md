# API Documentation — Books Platform

> **Version:** 1.0 (in progress)  
> **Base URL:** `https://booksplatform.net/api/v1`  
> **Last Updated:** May 2026

---

## Table of Contents

1. [Overview & Conventions](#1-overview--conventions)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Pagination](#4-pagination)
5. [Books API](#5-books-api)
6. [Publishers API](#6-publishers-api)
7. [Articles API](#7-articles-api)
8. [Search API](#8-search-api)
9. [Cart API](#9-cart-api)
10. [Orders API](#10-orders-api)
11. [Wishlist API](#11-wishlist-api)
12. [Newsletter API](#12-newsletter-api)
13. [Submissions API](#13-submissions-api)
14. [Comments & Ratings API](#14-comments--ratings-api)
15. [Notifications API](#15-notifications-api)
16. [Ambassador API](#16-ambassador-api)
17. [Admin API](#17-admin-api)
18. [Mobile Integration Guide (Flutter/Dart)](#18-mobile-integration-guide-flutterdart)
19. [Webhooks](#19-webhooks)
20. [Changelog](#20-changelog)

---

## 1. Overview & Conventions

### Base URL

```
Production:  https://booksplatform.net/api/v1
Development: http://localhost:3000/api/v1
```

### Versioning

- All endpoints are versioned under `/api/v1`
- Breaking changes will be introduced under `/api/v2` with a deprecation period
- Deprecated endpoints include `Deprecation` and `Sunset` response headers

### Request Format

- Content-Type: `application/json`
- Accept: `application/json`
- Encoding: `UTF-8`

### Standard Headers

| Header | Description | Example |
|--------|-------------|---------|
| `Authorization` | Bearer token for authenticated endpoints | `Bearer eyJhbGciOiJIUzI1NiJ9...` |
| `Accept-Language` | Preferred response language | `ar` or `en` |
| `X-Request-Id` | Client-generated request ID (optional) | `uuid-v4` |
| `Content-Type` | Request body format | `application/json` |

### Language Parameter

Every endpoint that returns content with Arabic/English variants supports:

```
?locale=ar   (default)
?locale=en
```

Or via header: `Accept-Language: ar`

---

## 2. Authentication

Books Platform uses **JWT (JSON Web Tokens)** with short-lived Access Tokens and long-lived Refresh Tokens.

### Token Strategy

| Token | TTL | Storage | Transfer |
|-------|-----|---------|----------|
| Access Token | 15 minutes | Client memory | `Authorization: Bearer <token>` |
| Refresh Token | 7 days | HTTP-only Cookie | Automatic (cookie) |

### 2.1 Login



**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 900,
    "user": {
      "id": "cuid123",
      "email": ""  ,
      "fullName": "مدير المنصة",
      "role": "ADMIN"
    }
  }
}
```

> The Refresh Token is set as an HTTP-only cookie automatically.

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded (10/min) |
| 403 | `ACCOUNT_LOCKED` | Account locked after 5 failed attempts |

---

### 2.2 Refresh Token

```http
POST /api/v1/auth/refresh
```

> No body needed — reads the HTTP-only refresh token cookie automatically.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 900
  }
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 401 | `REFRESH_TOKEN_MISSING` | No refresh token cookie |
| 401 | `REFRESH_TOKEN_EXPIRED` | Token expired |
| 401 | `REFRESH_TOKEN_REVOKED` | Token was revoked (logout) |

---

### 2.3 Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{ "success": true }
```

Clears the refresh token cookie and revokes the token in DB.

---

### 2.4 Change Password (Admin / Ambassador)

```http
POST /api/v1/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "current",
  "newPassword": "NewSecure@123"
}
```

---

### Auth Flow Diagram (Flutter Integration)

```
App starts → Load stored accessToken
     ↓
API request → if 401 → POST /auth/refresh → new accessToken
     ↓
Still 401? → Redirect to login screen
```

---

## 3. Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (duplicate) |
| `422` | Unprocessable Entity (business rule violation) |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Request body failed Zod validation |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient role |
| `DUPLICATE` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INVALID_CREDENTIALS` | 401 | Wrong login credentials |
| `ACCOUNT_LOCKED` | 403 | Account locked |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 4. Pagination

All list endpoints support cursor or offset pagination.

### Query Parameters

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | Page number (1-indexed) |
| `limit` | `12` | `50` | Items per page |
| `sort` | varies | — | Sort field |
| `order` | `desc` | — | `asc` or `desc` |

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 177,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 5. Books API

### 5.1 List Books

```http
GET /api/v1/books
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page (default: 12) |
| `category` | string | Category slug |
| `language` | string | Book language |
| `publisher` | string | Publisher slug |
| `status` | string | `NOT_TRANSLATED`, `NOMINATED`, `TRANSLATED` |
| `sort` | string | `newest`, `oldest`, `title` |
| `locale` | string | `ar` or `en` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid123",
      "slug": "the-idea-factory",
      "nameEn": "The Idea Factory",
      "nameAr": "مصنع الأفكار",
      "imageUrl": "https://...",
      "translationStatus": "NOMINATED",
      "purchaseOption": "REFERRAL",
      "price": null,
      "language": "en",
      "publicationYear": 2023,
      "publisher": {
        "id": "pub123",
        "title": "Penguin Books",
        "slug": "penguin-books"
      },
      "primaryCategory": {
        "id": "cat123",
        "name": "Technology & Science",
        "nameAr": "تقنيات وعلوم",
        "slug": "technology-science"
      },
      "averageRating": 4.2,
      "ratingsCount": 15
    }
  ],
  "pagination": { ... }
}
```

---

### 5.2 Get Book Detail

```http
GET /api/v1/books/:slug
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "slug": "the-idea-factory",
    "nameEn": "The Idea Factory",
    "nameAr": "مصنع الأفكار",
    "description": "Full Arabic description...",
    "imageUrl": "https://...",
    "isbn": "978-1-59420-381-0",
    "language": "en",
    "publicationYear": 2023,
    "translationStatus": "NOMINATED",
    "purchaseOption": "DIRECT",
    "price": "24.99",
    "currency": "USD",
    "referralLink": null,
    "publisher": {
      "id": "pub123",
      "title": "Penguin Books",
      "slug": "penguin-books",
      "imageUrl": "https://..."
    },
    "categories": [
      { "id": "cat123", "name": "Technology", "nameAr": "تقنيات", "slug": "technology" }
    ],
    "tags": [
      { "id": "tag1", "name": "Innovation", "slug": "innovation" }
    ],
    "averageRating": 4.2,
    "ratingsCount": 15
  }
}
```

---

### 5.3 Get Similar Books

```http
GET /api/v1/books/:slug/similar?limit=6
```

---

### 5.4 Get Book Categories

```http
GET /api/v1/books/categories
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat1",
      "name": "Technology & Science",
      "nameAr": "تقنيات وعلوم",
      "slug": "technology-science",
      "linkedCount": 234
    }
  ]
}
```

---

### 5.5 Get Homepage Stats

```http
GET /api/v1/books/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalBooks": 1247,
    "totalPublishers": 89,
    "totalTranslatedBooks": 312,
    "totalCountries": 34
  }
}
```

---

## 6. Publishers API

### 6.1 List Publishers

```http
GET /api/v1/publishers?page=1&limit=20&country=us&search=penguin&locale=ar
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "pub1",
      "title": "Penguin Books",
      "slug": "penguin-books",
      "imageUrl": "https://...",
      "excerpt": "Brief description...",
      "countries": [{ "name": "United States", "nameAr": "الولايات المتحدة", "slug": "us" }],
      "booksCount": 45,
      "isSponsored": true,
      "sponsoredPriority": 1
    }
  ],
  "pagination": { ... }
}
```

---

### 6.2 Get Publisher Detail

```http
GET /api/v1/publishers/:slug
```

---

### 6.3 Get Publisher Books

```http
GET /api/v1/publishers/:slug/books?page=1&limit=12
```

---

## 7. Articles API

### 7.1 List Articles by Channel

```http
GET /api/v1/articles?channel=harvest&page=1&limit=10&sort=newest&locale=ar
```

**Channels:** `harvest`, `ideas`, `world-reads`, `books-talk`, `watch-your-book`, `novel-story`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "art1",
      "slug": "article-slug",
      "title": "Article Title in Arabic",
      "excerpt": "Short excerpt...",
      "imageUrl": "https://...",
      "channel": "harvest",
      "date": "2024-01-15T00:00:00.000Z",
      "readingTime": 5,
      "authorFirstName": "أحمد",
      "authorLastName": "محمد"
    }
  ],
  "pagination": { ... }
}
```

---

### 7.2 Get Article Detail

```http
GET /api/v1/articles/:slug
```

---

### 7.3 Get Related Articles

```http
GET /api/v1/articles/:slug/related?limit=3
```

---

## 8. Search API

### 8.1 Global Search

```http
GET /api/v1/search?q=hemingway&type=all&page=1&limit=10&locale=ar
```

**`type` options:** `all`, `book`, `article`, `publisher`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [
      { "id": "b1", "slug": "...", "nameAr": "...", "nameEn": "...", "imageUrl": "..." }
    ],
    "articles": [
      { "id": "a1", "slug": "...", "title": "...", "imageUrl": "..." }
    ],
    "publishers": [
      { "id": "p1", "slug": "...", "title": "...", "imageUrl": "..." }
    ]
  },
  "query": "hemingway",
  "totalResults": 14
}
```

---

### 8.2 Search Suggestions (Autocomplete)

```http
GET /api/v1/search/suggestions?q=hem&limit=5
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "type": "book", "label": "Hemingway's A Farewell to Arms", "slug": "farewell-to-arms" },
    { "type": "publisher", "label": "Hemingway Press", "slug": "hemingway-press" }
  ]
}
```

---

## 9. Cart API

Cart is session-based (no auth required). Session ID managed via cookie.

### 9.1 Get Cart

```http
GET /api/v1/cart
```

### 9.2 Add Item to Cart

```http
POST /api/v1/cart/items
Content-Type: application/json

{
  "productId": "cuid123",
  "quantity": 1
}
```

### 9.3 Update Item Quantity

```http
PATCH /api/v1/cart/items/:itemId
Content-Type: application/json

{
  "quantity": 2
}
```

### 9.4 Remove Item

```http
DELETE /api/v1/cart/items/:itemId
```

### 9.5 Apply Coupon

```http
POST /api/v1/cart/coupon
Content-Type: application/json

{
  "code": "SAVE10"
}
```

---

## 10. Orders API

### 10.1 Create Order (Checkout)

```http
POST /api/v1/orders/checkout
Content-Type: application/json

{
  "customerName": "محمد أحمد",
  "customerEmail": "user@example.com",
  "customerPhone": "+201012345678",
  "shippingAddress": {
    "line1": "123 Street",
    "city": "Cairo",
    "country": "EG"
  },
  "couponCode": "SAVE10",
  "paymentProvider": "stripe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_cuid",
    "orderNumber": "BP-2024-001234",
    "total": "49.99",
    "currency": "USD",
    "paymentUrl": "https://stripe.com/checkout/...",
    "status": "PENDING"
  }
}
```

### 10.2 Get Order by Number

```http
GET /api/v1/orders/:orderNumber?token=access_token_for_order
```

---

## 11. Wishlist API

### 11.1 Add to Wishlist

```http
POST /api/v1/wishlist
Content-Type: application/json

{
  "email": "user@example.com",
  "productId": "cuid123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تم الحفظ! تحقق من بريدك للوصول لقائمتك",
  "data": {
    "accessToken": "magic-token-for-link"
  }
}
```

### 11.2 Get Wishlist (Magic Link)

```http
GET /api/v1/wishlist/:accessToken
```

### 11.3 Remove from Wishlist

```http
DELETE /api/v1/wishlist/items/:itemId?token=:accessToken
```

---

## 12. Newsletter API

### 12.1 Subscribe

```http
POST /api/v1/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "locale": "ar",
  "source": "homepage"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تحقق من بريدك لتأكيد الاشتراك"
}
```

### 12.2 Confirm Subscription

```http
GET /api/v1/newsletter/confirm?token=:confirmToken
```

### 12.3 Unsubscribe

```http
POST /api/v1/newsletter/unsubscribe
Content-Type: application/json

{
  "token": "unsubscribe-token"
}
```

---

## 13. Submissions API

### 13.1 Create Submission (Publish Your Book)

```http
POST /api/v1/submissions
Content-Type: application/json

{
  "authorName": "سارة محمد",
  "authorEmail": "sara@example.com",
  "authorPhone": "+201012345678",
  "authorBio": "روائية مصرية...",
  "bookTitle": "رواية جديدة",
  "bookSummary": "ملخص الكتاب...",
  "bookLanguage": "ar",
  "bookCategory": "novel",
  "fileUrl": "https://uploadthing.com/...",
  "coverUrl": "https://uploadthing.com/...",
  "allowFreeDownload": false
}
```

### 13.2 Check Eligibility (First Free)

```http
GET /api/v1/submissions/check-eligibility?email=sara@example.com
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isEligibleForFree": true,
    "submissionsCount": 0
  }
}
```

---

## 14. Comments & Ratings API

### 14.1 List Comments

```http
GET /api/v1/comments?productId=cuid123&page=1
GET /api/v1/comments?articleId=cuid456&page=1
```

### 14.2 Create Comment

```http
POST /api/v1/comments
Content-Type: application/json

{
  "authorName": "قارئ",
  "email": "reader@example.com",
  "content": "كتاب رائع جداً!",
  "productId": "cuid123",
  "parentId": null
}
```

### 14.3 Submit Rating

```http
POST /api/v1/ratings
Content-Type: application/json

{
  "productId": "cuid123",
  "email": "reader@example.com",
  "stars": 5
}
```

### 14.4 Get Product Ratings (Aggregate)

```http
GET /api/v1/ratings?productId=cuid123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "average": 4.2,
    "count": 28,
    "distribution": {
      "5": 12,
      "4": 8,
      "3": 5,
      "2": 2,
      "1": 1
    }
  }
}
```

---

## 15. Notifications API

### 15.1 Subscribe to Web Push

```http
POST /api/v1/notifications/push/subscribe
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  },
  "email": "user@example.com",
  "locale": "ar",
  "topics": ["new-books", "translations"]
}
```

### 15.2 Unsubscribe from Web Push

```http
DELETE /api/v1/notifications/push/unsubscribe
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/..."
}
```

### 15.3 Subscribe to Channel (WhatsApp / Telegram)

```http
POST /api/v1/notifications/channels/subscribe
Content-Type: application/json

{
  "type": "WHATSAPP",
  "identifier": "+201012345678",
  "email": "user@example.com",
  "topics": ["new-books"]
}
```

---

## 16. Ambassador API

All endpoints require `Authorization: Bearer <access_token>` with `role: AMBASSADOR`.

### 16.1 Get Dashboard Stats

```http
GET /api/v1/ambassador/dashboard
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalClicks": 1247,
    "totalConversions": 89,
    "conversionRate": 7.14,
    "pendingEarnings": "450.00",
    "paidEarnings": "1200.00",
    "currency": "USD"
  }
}
```

### 16.2 Get Ambassador Links

```http
GET /api/v1/ambassador/links
Authorization: Bearer <token>
```

### 16.3 Get Performance Data

```http
GET /api/v1/ambassador/performance?from=2024-01-01&to=2024-01-31
Authorization: Bearer <token>
```

### 16.4 Get Payout History

```http
GET /api/v1/ambassador/payouts
Authorization: Bearer <token>
```

---

## 17. Admin API

All admin endpoints require `Authorization: Bearer <access_token>` with `role: ADMIN`.

> Full admin API documentation will be added during Phase 4.

### Base Pattern

```http
# List
GET /api/v1/admin/books?page=1&search=query

# Get one
GET /api/v1/admin/books/:id

# Create
POST /api/v1/admin/books

# Update
PATCH /api/v1/admin/books/:id

# Delete
DELETE /api/v1/admin/books/:id
```

**Entities:** `books`, `publishers`, `articles`, `submissions`, `orders`, `comments`, `newsletter`, `categories`, `users`, `ambassadors`, `settings`, `b2b-clients`, `notifications`

---

## 18. Mobile Integration Guide (Flutter/Dart)

### 18.1 HTTP Client Setup (Dio with interceptors)

```dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://booksplatform.net/api/v1';
  late Dio _dio;
  
  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar',  // Change for locale
      },
    ));
    
    _dio.interceptors.add(AuthInterceptor(_dio));
  }
  
  Dio get dio => _dio;
}

class AuthInterceptor extends Interceptor {
  final Dio dio;
  
  AuthInterceptor(this.dio);
  
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
  
  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Attempt token refresh
      try {
        final refreshResponse = await dio.post('/auth/refresh');
        final newToken = refreshResponse.data['data']['accessToken'];
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', newToken);
        
        // Retry original request
        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
        final response = await dio.fetch(err.requestOptions);
        handler.resolve(response);
      } catch (_) {
        // Refresh failed — navigate to login
        handler.reject(err);
      }
    } else {
      handler.next(err);
    }
  }
}
```

### 18.2 Books Service Example

```dart
class BooksService {
  final ApiClient _client;
  
  BooksService(this._client);
  
  Future<Map<String, dynamic>> getBooks({
    int page = 1,
    int limit = 12,
    String? category,
    String? translationStatus,
    String locale = 'ar',
  }) async {
    final response = await _client.dio.get(
      '/books',
      queryParameters: {
        'page': page,
        'limit': limit,
        if (category != null) 'category': category,
        if (translationStatus != null) 'status': translationStatus,
        'locale': locale,
      },
    );
    return response.data;
  }
  
  Future<Map<String, dynamic>> getBookDetail(String slug, {String locale = 'ar'}) async {
    final response = await _client.dio.get(
      '/books/$slug',
      queryParameters: {'locale': locale},
    );
    return response.data;
  }
}
```

### 18.3 Locale Handling

```dart
// Set locale dynamically
void setLocale(String locale, ApiClient client) {
  client.dio.options.headers['Accept-Language'] = locale;
}

// Or per request
final response = await dio.get(
  '/books',
  options: Options(headers: {'Accept-Language': 'en'}),
);
```

### 18.4 Error Handling

```dart
try {
  final response = await booksService.getBooks();
} on DioException catch (e) {
  if (e.response != null) {
    final error = e.response!.data['error'];
    final code = error['code'];
    final message = error['message'];
    
    switch (code) {
      case 'NOT_FOUND':
        // Handle 404
        break;
      case 'RATE_LIMITED':
        // Show retry message
        break;
      default:
        // Generic error handling
    }
  }
}
```

---

## 19. Webhooks

### 19.1 Payment Webhook

```http
POST /api/webhooks/payment
X-Stripe-Signature: t=...,v1=...
Content-Type: application/json
```

The webhook verifies the signature and updates order status.

**Events handled:**
- `payment_intent.succeeded` → Mark order as PAID, trigger confirmation email
- `payment_intent.payment_failed` → Mark as FAILED, notify customer
- `charge.refunded` → Mark as REFUNDED

---

## 20. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | May 2026 | Initial structure, Auth endpoints documented |
| — | — | Books, Publishers, Articles, Search, Cart, Orders documented |
| — | — | Wishlist, Newsletter, Submissions, Comments, Notifications documented |
| — | — | Ambassador, Admin APIs documented |
| — | — | Flutter integration guide added |

---

_يُحدَّث هذا الملف بعد كل endpoint جديد يُنفَّذ._
