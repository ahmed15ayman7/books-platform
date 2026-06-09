# Session Handoff — 2026-06-09

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Audited entire home screen widget tree, cubit, data source, and all sub-widgets
- Wrote a Python performance test (stdlib `urllib` only) and ran it against dev API (`https://booksplatform.ahmed15ayman7.com/api/v1`)
- Measured all 5 API endpoints the home screen calls, 3 consistency iterations, payload sizes, and image download performance
- Identified performance issues across API, images, and widget layers

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | **Images are huge (up to 1572KB)** — no server-side resizing, no WebP, no CDN | 🔴 Critical | Backend `wp-content/uploads/` URLs | API test: avg 272.5KB/image, largest 1571.5KB |
| 2 | **4 images fail to load (Arabic filenames)** | 🔴 Critical | `BookCoverWidget` → `CachedNetworkImage` with Arabic URLs like `تجاوز-الحدود.jpg` | API test: `ascii codec can't encode characters` error — Flutter's `CachedNetworkImage` likely fails the same way |
| 3 | **`/hero-slides` endpoint is 4× slower than others** (1674ms vs ~450ms avg) | 🟡 Important | Backend endpoint `/hero-slides` | API test: 1674ms response time |
| 4 | **125 images loaded on single screen** — no lazy loading for off-screen carousels | 🟡 Important | `HomeBooksCarouselSection` uses `SingleChildScrollView` + `Row`, not a lazy `ListView` | `home_books_carousel_section.dart:48-66` |
| 5 | **`GoogleFonts.*` called inside `build()` on every widget** — runtime font fetching | 🟡 Important | `book_card_widget.dart` (4 calls), `home_hero_carousel_widget.dart` (4 calls), `home_categories_section.dart` (2 calls), `home_publishers_section.dart` (3 calls), `home_newsletter_strip.dart` (3 calls) | Each `GoogleFonts.cairo()` / `.tajawal()` / `.inter()` may trigger network fetch on first call |
| 6 | **`_categoryName()` hardcoded slug→string mapping in BookCardWidget** | 🟢 Minor | `book_card_widget.dart:139-148` | Switch on slug strings called per card per rebuild; category name should come from `Book` entity or `Category` object |
| 7 | **No `RepaintBoundary` isolating heavy sections** | 🟢 Minor | `home_body.dart` — hero, carousels, publishers, newsletter all repaint together | Each section is complex but not isolated |

## Files Changed

| File | Change | Why |
|---|---|---|
| (none) | — | Session was audit-only, no code changes made |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `home_screen.dart` | Widget tree, state management, rebuild scope | ✅ Clean — AnimatedSwitcher, BlocBuilder, proper lifecycle |
| `home_body.dart` | Layout structure, scroll behavior, sliver usage | ✅ Uses CustomScrollView + Slivers correctly |
| `home_content_cubit.dart` | API concurrency, early-exit logic | ✅ Fires all 5 concurrently before first await |
| `home_books_carousel_section.dart` | Image list virtualization | ⚠️ SingleChildScrollView+Row renders ALL cards (no lazy loading) |
| `home_categories_section.dart` | Category chip rendering | ✅ Clean |
| `home_publishers_section.dart` | Publisher pill rendering | ✅ Clean |
| `home_newsletter_strip.dart` | Newsletter card | ✅ Clean |
| `home_hero_carousel_widget.dart` | Carousel lifecycle, timer management, image loading | ✅ Timer/Controller properly disposed |
| `book_card_widget.dart` | Card rebuild scope, GoogleFonts usage | ⚠️ 4 GoogleFonts calls + hardcoded category slug switch |
| `book_cover_widget.dart` | Image loading, fallback behavior | ✅ CachedNetworkImage with gradient fallback |
| `home_shimmer.dart` | Loading skeleton | ✅ Proper NeverScrollableScrollPhysics |
| `books_remote_data_source_impl.dart` | API paths, parameters | ✅ Correct endpoint definitions |
| `api_constants.dart` | Base URL, timeouts | ✅ 30s timeouts |
| `api_manager.dart` | Error handling chain | ✅ Clean Either conversion |

## API Performance Raw Data

```
Sequential API calls (simulates worst case):
  hero-slides       1674ms    3.4KB
  newly-released     438ms   18.8KB
  translated-books   452ms   15.0KB
  category-sections  534ms   39.6KB
  publishers         651ms  108.5KB
  TOTAL:           3750ms   185.3KB

Consistency (3 sequential runs): 2408ms – 3222ms (avg 2742ms)
Flutter cubit runs concurrent → real total ≈ ~1700ms (bottleneck = hero-slides)

Image performance (20 sample from 125 total):
  Avg download:  757ms   (target: <100ms)
  Slowest:      1611ms
  Avg size:     272.5KB  (target: <100KB)
  Largest:      1571.5KB (Cover-9.jpg)

Large images:
  1572KB  Cover-9.jpg
  1405KB  Cover1.jpg
   322KB  9791370091811-escepticos-4.jpg
   266KB  Idea-of-the-West-BookCover-Portrait.jpg

Failed images (Arabic filenames):
  تجاوز-الحدود.jpg
  الاستثمار-من-أجل-النمو.webp
  تنزيل-3-5.jpg
  دليل-الميزانية-الخضراء.webp
```

## Pending Tasks

- [ ] **Backend: Add image resizing** — serve thumbnails (`?w=300` or similar) for book cover images; convert to WebP; add CDN caching headers (`Cache-Control: max-age`)
- [ ] **Backend: Fix Arabic filenames** — URL-encode image URLs or rename to ASCII slugs on upload
- [ ] **Backend: Optimize `/hero-slides` endpoint** — currently 1674ms, 4× slower than other endpoints; investigate query optimization or caching
- [ ] **Backend: Add pagination/limit to category-sections books** — reduce per-section book count to limit total images
- [ ] **Frontend: Bundle fonts as assets** — replace `google_fonts` package with bundled Cairo, Tajawal, Inter font files in `pubspec.yaml`
- [ ] **Frontend: Add `RepaintBoundary`** around hero, each carousel section, publishers, newsletter in `home_body.dart`
- [ ] **Frontend: Move category name to entity** — add `categoryNameAr`/`categoryNameEn` to `Book` entity instead of slug-based switch in `BookCardWidget._categoryName()`

## What's Next (ordered)

1. **Backend image optimization** (highest impact) — resizing + WebP conversion cuts image payload by ~70%, expected to bring avg image time from 757ms to ~100ms
2. **Fix Arabic image filenames** — 4 books show gradient fallback instead of covers
3. **Optimize `/hero-slides` endpoint** — currently the API bottleneck at 1674ms
4. **Bundle fonts as assets** — eliminates `google_fonts` runtime network dependency
5. **Add `RepaintBoundary`** to home screen sections — cheap frontend win

## Key References

- `lib/features/books/presentation/pages/home_screen/` — all home screen files
- `lib/features/books/presentation/cubit/home_content_cubit/` — cubit + state
- `lib/features/books/data/datasources/books_remote_data_source_impl.dart` — API endpoint definitions
- `lib/core/constants/api_constants.dart` — base URL config
- `lib/features/books/presentation/widgets/book_card_widget.dart` — book card with GoogleFonts calls
- `lib/features/books/presentation/widgets/home_hero_carousel_widget.dart` — hero carousel

## Clarifications & Decisions

| Question | Answer |
|---|---|
| User asked to review home screen performance + hit APIs via Python + display image performance | Full audit done, Python test run, all results captured above |
| User asked why `aiohttp` was needed | User rejected external lib — test rewritten with stdlib `urllib` only |
| User asked to create a skill for later reuse | User interrupted — skipped, said "skip skill continue review" |

## Notes

- The Flutter cubit already fires all 5 API requests concurrently (good), so the real API bottleneck is the slowest single endpoint (`/hero-slides` at 1674ms), not the sequential total of 3750ms
- `CachedNetworkImage` handles caching after first load — the 757ms avg is first-load only. Subsequent visits are faster, but first impression is still slow
- The publishers endpoint returns 108.5KB — the cubit already limits to `.take(5)` in [home_content_cubit.dart:52](lib/features/books/presentation/cubit/home_content_cubit/home_content_cubit.dart#L52), but the full list is still downloaded. Backend should accept a `limit` param
- Total of 125 images on the home screen is the combined count from hero slides + newly released + translated + all category section books. Reducing category-section book count would cut this significantly
