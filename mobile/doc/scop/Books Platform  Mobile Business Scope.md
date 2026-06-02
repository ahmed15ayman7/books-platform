# Books Platform — Mobile Application Business Scope Document

---

## Preamble

This document is the authoritative Business Scope for the **Books Platform (منصة الكتب العالمية) Mobile Application** — a Flutter-built companion application to the Books Platform web experience. It is written for product owners, designers, developers, and any new team member joining the mobile effort. The document defines every screen, every user flow, every business rule, every edge case, and every explicit exclusion applicable to the mobile application.

This document is a companion to — not a replacement for — the web platform's Business Scope (v1.1). Where the mobile application mirrors the web platform in behavior and rules, those rules are carried forward here in full. Where the mobile application differs from the web — due to mobile-specific constraints, hardware capabilities, deliberate scope decisions, or interaction pattern differences — those differences are stated explicitly.

Anyone reading this document should be able to understand the complete mobile application — what it does, what it does not do, why every rule exists, and how every user interaction unfolds — with zero prior knowledge of the project.

**Version:** 1.0
**Date:** June 2026
**Prepared for:** Books Platform — منصة الكتب العالمية — Mobile Application

---

## 1. Executive Summary

Books Platform is an Arabic-language digital platform whose mission is to make every Arab reader aware of every new book published anywhere in the world. The mobile application brings this mission to the most personal device in a reader's life — their phone — placing global book discovery, editorial content, and author submission tools in their pocket wherever they go.

The mobile application is a **reader-facing companion** to the web platform. It delivers the full depth of the platform's content — the book catalog, the six editorial and media channels, publisher profiles, search, and the author submission flow — optimized for mobile interaction patterns: thumb-reachable navigation, swipe-driven browsing, and push notifications dispatched directly by the platform's backend server. Everything a reader, writer, or book enthusiast needs to engage with the platform is available in the mobile app.

The mobile application serves three primary user groups. **General readers and book enthusiasts** are the primary and largest audience — they browse books, read editorial articles, watch video content, save books to a local wishlist, leave ratings and comments, and subscribe to push notifications to be alerted when new content is published. **Authors** use the mobile app to submit unpublished manuscripts through the platform's full three-step "Publish Your Book" form, with PDF file upload from their device's storage. **Publishers and translators**, like on the web, interact as general readers — they browse publisher profiles, use the translation-status filter to find rights-available books, and access publisher contact information for rights inquiries.

The mobile application is **deliberately not** a full-feature replica of the web platform. The Admin Dashboard is a web-only tool; it is not accessible from the mobile app in any form. Payment processing is excluded from mobile version one — the shopping cart is visible and functional for adding and reviewing items, but the checkout button is locked and directs users to the web to complete their purchase. The Ambassador Dashboard, B2B institutional subscription management, and author login with submissions tracking are also excluded from this version.

The mobile application communicates with the same backend API that powers the web platform. All business logic, content management, moderation, and administration continues to happen on the web. The mobile app is a consumer of the platform's content and services — it does not manage them.

---

## Scope at a Glance

A quick-reference list of everything this mobile application builds and delivers.

**Book Catalog & Discovery**
- Full book catalog with filters by category, language, translation status, and publisher
- Book detail pages with cover image, full bibliographic data, summary, aggregate ratings, and purchase options
- Dedicated section for books recommended for translation, filterable by language and category
- Dedicated section of translated books showing original title and Arabic title side by side
- Homepage discovery feed: hero carousel, latest books grid, categories row, editorial highlights, publisher spotlight, and live platform statistics

**Editorial & Media Channels**
- Three text editorial channels: World Reads (daily book news), Book Harvest (category digests), Essence of Ideas (long-form essays)
- Three media channels: Watch Your Book (video summaries), Book Talk (podcast episodes), Novel & Story (cinematic retellings)
- Full article and media detail screens with linked book cards, share button, and reader comments

**Publisher Directory**
- Scrollable publisher directory with keyword search and country filter
- Individual publisher profile screens with full details, website link, contact email, and linked book catalog
- Sponsored publisher placement clearly labeled throughout

**Search**
- Full-text keyword search across books, publishers, and articles
- Live autocomplete suggestions as the user types
- Recent and popular searches surfaced before typing begins

**Reader Actions**
- Device-local wishlist — save any book with one tap, no account or email required
- Shopping cart with quantity management (checkout redirects to the web — no in-app payment in version one)
- 5-star ratings submitted directly from book and article detail screens
- Written comments on books and articles, submitted for Admin review before going live
- Email newsletter subscription with double opt-in confirmation

**Notifications**
- Push notifications for new books, new articles, and Admin broadcasts — dispatched by the platform's backend server
- Opt-in flow with a soft pre-prompt on first launch followed by the OS permission dialog
- Deep linking from any notification directly to the relevant book or article screen

**Author Submissions**
- Full three-step guest submission wizard for unpublished manuscripts — no login required
- PDF manuscript upload and cover image upload directly from device storage or connected cloud drives
- Automatic free-submission eligibility check by email address
- First submission free and completable entirely in the app; paid subsequent submissions redirected to the web
- Draft autosave so authors can exit and resume an incomplete form at any time

**App Experience**
- Full Arabic and English bilingual support with instant RTL and LTR layout switching
- Native device share sheet for any book or article page
- Static informational screens: About Us, Team, Contact Us, Privacy Policy, Terms of Use

For what this scope does NOT include, see Section 10.

---

## 2. Platform Vision & Mobile-Specific Value Proposition

### The Problem Statement

The core problem Books Platform solves — the information asymmetry between global book publishing and Arabic-speaking readers, publishers, and translators — is documented in full in the web scope. The mobile application addresses an additional layer of this problem: **access on the go**.

Arabic readers consume content primarily on mobile devices. A reader waiting for a bus, commuting, or relaxing at home expects to be able to discover a new book, read an editorial review, or follow up on a translation recommendation from their phone with the same ease and depth they would experience on a desktop browser. Without a native mobile application, the platform's reach is limited to moments when readers are at a computer — a shrinking minority of their available reading time.

For authors, the barrier to submission is meaningfully lower on mobile. A writer who has finished a manuscript wants to submit it from wherever they are — not only when they are at a desk. The mobile app removes this friction by delivering the full submission form, including document upload, natively on the device.

### The Solution

The mobile application brings the complete reader-facing experience of Books Platform into a native mobile context. It is optimized for one-handed use, fast browsing, and content discovery in short sessions. It adds capabilities that the web cannot provide: device-level push notifications dispatched directly by the platform's backend server, and device-native file access for manuscript uploads.

### Why This Approach

The mobile app deliberately mirrors the web's content scope rather than creating a different content experience. A reader who uses both the web and the mobile app must find the same books, the same articles, the same publisher profiles, and the same submission form — with no divergence in content or rules. The mobile app is a delivery surface, not a separate product.

Payments are excluded from mobile version one because integrating a native mobile payment SDK (Stripe Mobile, Paymob Mobile) requires additional security certification, platform-specific testing, and compliance work that is out of scope for this initial release. The cart is preserved so that users can build their order on mobile and complete it on web — this creates a cross-platform continuity that is preferable to blocking the shopping experience entirely.

The ambassador program and the admin panel are excluded from mobile version one because their user populations are small, their use cases are naturally desktop-oriented (detailed data review, content management), and the engineering cost of rebuilding them for mobile is not justified at this stage.

---

## 3. User Roles & Personas

### Role 1: Visitor / General Reader (Primary Mobile User)

**Who They Are:** Any person who opens the mobile app — an Arabic-speaking reader interested in books, a student researching a topic, a translator browsing for rights-available titles, a journalist looking for book news. No account is required. This is the dominant user type for the mobile app.

**Primary Goal on the App:** To discover new books from around the world, read editorial content, watch or listen to media content, save books of interest to a local wishlist, and stay connected to the platform through push notifications.

**Capabilities:**
- Browse the full book catalog across all 7 categories with filters (category, language, translation status, publisher)
- View individual book detail pages with full bibliographic data, cover image, summary, ratings, and comments
- Browse the "Books Recommended for Translation" section with filters
- Browse the "Translated Books" section
- Read all editorial content (6 channels: World Reads, Book Harvest, Essence of Ideas, Watch Your Book, Book Talk, Novel & Story)
- Browse all publisher profiles and the publisher directory (with search and country filter)
- Add books to a device-local wishlist (no email required)
- Submit a star rating on any book
- Submit a written comment on any book or editorial article
- Search the platform by keyword across books, publishers, and articles
- Subscribe to push notifications for new books, new articles, and platform broadcasts
- Sign up for the email newsletter from within the app
- Add books to the shopping cart and view cart contents
- Switch between Arabic and English versions of the app with RTL/LTR layout adjustment
- Share any book page or article via the device's native share sheet (WhatsApp, messaging apps, social media, copy link)
- Access static pages: About Us, Team, Contact, Privacy Policy, Terms of Use

**Restrictions:**
- Cannot create a personal account or reading profile in this version
- Cannot access the Admin panel in any form — Admin functions are web-only
- Cannot access the Ambassador dashboard — Ambassador features are not in mobile version one
- Cannot complete a payment in the app — cart checkout directs to the web
- Cannot access B2B institutional subscription content or management
- Cannot view or manage another user's wishlist (wishlists are device-local and not shared)
- Cannot opt in to WhatsApp or Telegram notification channels from within the app — only push notifications (managed by the platform's backend server) and email newsletter are available in this version

**How They Join:** No registration required. The app is freely downloadable and all content is freely accessible from the moment the app opens.

**Access Levels:** Single level. All readers have identical access. Readers who opt in to push notifications or save books to their local wishlist gain no elevated permissions — these are device-local preferences only.

---

### Role 2: Author (Unpublished Writer — Mobile Submission)

**Who They Are:** An Arab writer, novelist, poet, or academic researcher with a completed unpublished work who wants to submit it to the platform for visibility among publishers and readers.

**Primary Goal on the App:** To complete the "Publish Your Book" submission form — all three steps including PDF file upload — directly from their mobile device without needing a laptop or desktop.

**Capabilities:**
- Access and complete the full three-step "Publish Your Book" submission form natively in the app
- Upload their manuscript as a PDF file from their device's local storage, cloud storage (Google Drive, iCloud, Dropbox), or any file picker the operating system provides
- Upload a cover image from the device's photo library or camera
- Save a draft of their submission to resume later (draft saved locally on the device)
- Submit their completed form and receive on-screen confirmation of receipt
- Check the eligibility status for a free first submission (system checks by email address automatically when author enters their email)

**Restrictions:**
- No author login account in this version — the submission is a guest transaction
- Cannot view their submitted work's approval status, review notes, or history from within the mobile app — the author must check their email for notifications or visit the web platform's author submissions dashboard
- Cannot edit or withdraw an already-submitted form from the mobile app — this requires contacting the Admin via email or using the web platform
- Cannot pay for subsequent submissions from within the mobile app — if the submission requires payment (because it is not the author's first), the app directs them to complete the paid submission on the web

**How They Join:** No registration. The author completes the form as a guest. The system identifies them by their email address for eligibility checking.

**Access Levels:** Single level. All authors interact with the form at the same access level.

---

### Role 3: Publisher (Passive Presence — No Mobile Account)

**Who They Are:** A publishing house whose profile is maintained by the Admin on the web platform. On mobile, they are represented through their profile page — they have no mobile account and no mobile-specific interaction.

**Primary Goal on the App:** To be discoverable by Arabic-speaking readers, translators, and other publishers who find the app and search for their books or profile.

**Capabilities (as represented on the mobile app):**
- Have their publisher profile page displayed on the app with all details: name, country, logo, description, website link, contact email, and linked book catalog
- Appear in the publisher directory with filtering by country
- Carry a visible "Sponsored" badge if their commercial arrangement is active

**Restrictions:**
- Cannot log in to the mobile app — there is no publisher account on mobile or web in this version
- Cannot edit their own profile from the mobile app — all profile management is performed by the Admin on the web

**How They Join:** Not applicable. Publisher presence on mobile is automatic when their web profile exists.

---

### Role 4: Admin / Editorial Team (Web-Only Role — Not on Mobile)

The Admin role exists exclusively on the web platform. The mobile application contains no admin screens, no content management tools, no moderation queue, no order management, and no settings configuration. Any Admin team member who needs to perform administrative functions must do so through the web Admin panel.

This is an explicit and permanent exclusion for version one. If future versions introduce admin functionality on mobile, it will be scoped and documented separately.

---

## 4. System Overview — Mobile Module Map

The following table maps each module of the mobile application to its counterpart in the web scope. Where a mobile module is new (with no web equivalent), it is marked accordingly.

| # | Module | Purpose | User Roles That Interact |
|---|--------|---------|--------------------------|
| 1 | App Shell & Navigation | The app's persistent frame — bottom navigation bar, top app bar, drawer, language toggle, RTL/LTR layout | All users |
| 2 | Homepage & Discovery Feed | Entry screen — hero carousel, latest books, editorial highlights, publisher spotlight, stats, newsletter strip | All users |
| 3 | Book Catalog & Filtering | Full book catalog with pagination, filters (category, language, translation status, publisher), and sort options | All users |
| 4 | Book Detail Page | Individual book screen — cover, full data, purchase indicator, ratings, comments, similar books, share | All users |
| 5 | Books Recommended for Translation | Filtered view of books flagged for translation — filters by language, category | All users (translators primarily) |
| 6 | Translated Books Section | Catalog of foreign books translated into Arabic | All users |
| 7 | Publisher Directory & Profiles | Directory of publishing houses with search, country filter, and dedicated profile screens | All users |
| 8 | Editorial Channels (3 Text Channels) | World Reads, Book Harvest, and Essence of Ideas — article lists and detail screens with comments | All users |
| 9 | Media Channels (3 Media Channels) | Watch Your Book (video), Book Talk (podcast), Novel & Story (video) — embedded media with linked books | All users |
| 10 | Global Search & Autocomplete | Search across books, publishers, and articles with live suggestions | All users |
| 11 | Shopping Cart (Payment Locked) | Add books to cart, view cart, quantity management — checkout button redirects to web | All users |
| 12 | Device-Local Wishlist | Save books to a device-stored wishlist — no email or account required, persists between sessions | All users |
| 13 | Ratings & Comments | Submit 5-star ratings and written comments on books and articles | All users |
| 14 | Publish Your Book (Guest Submission) | Full 3-step native submission form with PDF upload — guest access, no login | Authors |
| 15 | Newsletter Subscription | Email capture form for the platform's newsletter — triggers double opt-in email | All users |
| 16 | Push Notifications | Opt-in to device push notifications for new books, new articles, and broadcasts — managed and dispatched by the platform's backend server | All users |
| 17 | Static Pages | About Us, Team, Contact, Privacy Policy, Terms of Use — informational screens | All users |

---

## 5. Module-by-Module Deep Dive

---

## Module 1: App Shell & Navigation

### Purpose & Business Context

The app shell is the persistent architectural frame that holds every screen together. On mobile, navigation decisions have a higher impact on usability than on the web because the screen is small, the user is often in a hurry, and the navigation must be reachable with one thumb. The shell defines how users move between the platform's main sections, how the language toggle is surfaced, and how the RTL/LTR layout mode responds.

### Who Interacts With This Module

All users interact with the shell on every screen.

### Bottom Navigation Bar

The primary navigation is a persistent bottom navigation bar (always visible, never scrolls away). It contains five tabs:

| Tab | Icon | Screen |
|-----|------|--------|
| Home | House icon | Homepage / Discovery Feed |
| Books | Open book icon | Book Catalog |
| Articles | Document icon | Editorial & Media Channel Hub |
| Publishers | Building icon | Publisher Directory |
| More | Three-dot / hamburger | Secondary navigation drawer |

The active tab is highlighted with the platform's brand color. Tapping a tab navigates to its root screen and resets that stack to its root (tapping "Books" when already in Books scrolls to the top).

### Top App Bar

Each screen has a top app bar displaying:
- Screen title (in the active language — Arabic or English)
- Cart icon (with a live item count badge) — always visible, taps to open the cart screen
- Language toggle button (AR / EN) — always visible and tappable from any screen
- Back arrow on sub-screens (book detail, article detail, publisher profile, etc.)

### Secondary Navigation Drawer ("More" Tab)

Tapping the "More" tab opens a bottom sheet or navigation drawer with links to:
- Books Recommended for Translation
- Translated Books
- Publish Your Book
- My Wishlist
- About Us
- Contact Us
- Privacy Policy
- Terms of Use
- Notification Settings (push notification toggle)

### Language Toggle & RTL/LTR Layout

The language toggle is the control that switches the entire app between Arabic (RTL layout) and English (LTR layout). Tapping it applies immediately — no app restart required.

**Language switching rules:**
1. Arabic is the default language on first app launch.
2. The user's language preference is stored in device settings and remembered on all subsequent sessions.
3. When the user switches language on a book detail screen, the same book is displayed in the selected language. The user does not return to the catalog.
4. If an item has no English version (e.g., a book with only an Arabic summary), the English screen displays the Arabic content with a visible notice: "English version coming soon / النسخة الإنجليزية قريباً."
5. All navigation labels, form labels, error messages, and UI strings switch immediately on language toggle — they are never a mix of Arabic and English.
6. RTL layout (for Arabic): text is right-aligned, the navigation drawer opens from the right, back arrows point right, the bottom navigation icons are mirrored appropriately.
7. LTR layout (for English): standard left-to-right alignment.

### Push Notification Permission Prompt

On the user's first launch of the app (and only the first launch), the app shows a soft permission pre-prompt before triggering the operating system's native push notification permission request. The pre-prompt explains: "Stay updated on new books and articles — allow notifications?" with "Allow" and "Not Now" buttons. If the user taps "Allow," the OS permission dialog is shown. If they tap "Not Now," the OS dialog is not shown and the user can enable notifications later through Notification Settings in the More drawer.

**Business Rule:** The OS permission prompt is shown at most once by the operating system. If the user dismisses or declines the OS prompt, the app respects that decision and does not re-prompt — it only provides a settings shortcut to the device's notification settings.

### Edge Cases & Special Handling
- **App opened with no internet connection:** The shell loads normally. Modules that depend on network content show a "No internet connection" notice with a retry button. Navigation remains fully functional.
- **Cart badge on no-internet:** The cart badge reflects the local cart state (items added previously persist in device storage). It does not clear to zero when offline.
- **Language toggle during a form:** If the user is mid-form (e.g., partway through the book submission form), tapping the language toggle applies the language switch but preserves the form's content. The user does not lose form input when switching languages.

---

## Module 2: Homepage & Discovery Feed

### Purpose & Business Context

The homepage is the first screen a user sees when they open the app. On mobile, it must load fast, scroll smoothly, and surface the platform's most compelling content immediately. It serves the same purpose as the web homepage — orienting every type of visitor and driving them toward the content most relevant to them — but in a vertically scrollable, card-based mobile layout.

### Who Interacts With This Module

All users.

### Screen Layout (Scrollable, Top to Bottom)

**1. Hero Banner / Featured Carousel**
A horizontally swipeable carousel of 1–5 Admin-curated hero slides. Each slide contains:
- A full-width background image
- A headline in the active language (Arabic or English)
- A subtitle in the active language
- An optional "View Book" or "Read More" tap target
- Auto-advances every 5 seconds; dots indicator at bottom
- Manual swipe always overrides auto-advance

**2. Latest Books Grid**
A grid of the most recently added books in the catalog. Each book card shows: cover image, Arabic title, publisher name, and a star rating badge. Tapping a card navigates to the book detail screen. The grid displays up to 12 books in a 2-column layout. A "View All" button navigates to the full book catalog.

**3. Categories Quick-Access Row**
A horizontally scrollable row of the platform's 7 category chips (Technology & Science, Social Studies, Languages & Literature, Philosophy & Culture, Religions & Beliefs, Economics & Development, Ideas & Politics). Tapping a category chip navigates directly to the book catalog pre-filtered to that category.

**4. Featured Editorial Article**
A large card showcasing one Admin-featured editorial article — from any of the three editorial channels. Shows: featured image, channel label (e.g., "World Reads"), headline, and excerpt. Tapping navigates to the article detail screen.

**5. Books Recommended for Translation Preview**
A horizontally scrollable row of the latest books with "Recommended for Translation" status. Each card shows: cover, title, original language flag. A "View All" button navigates to the full Recommended for Translation screen.

**6. Media Highlights Row**
A horizontally scrollable row of the latest media entries across Watch Your Book, Book Talk, and Novel & Story. Each card shows: thumbnail, channel label, and title. Tapping navigates to the media detail screen.

**7. Publisher Spotlight**
A horizontally scrollable row of featured publisher cards. Sponsored publishers appear first, marked with a "Sponsored" badge. Each card shows: publisher logo and name. Tapping navigates to the publisher profile screen.

**8. Platform Statistics**
Four stat counters displayed in a 2×2 grid: Total Books Cataloged, Total Publishers Listed, Total Translated Books, and Years of Operation. These values are loaded live from the server. They must never show zero when content exists.

**9. Newsletter Signup Strip**
An inline email signup form: a text field (email) and a "Subscribe" button. Submitting adds the user to the newsletter flow (see Module 15).

### Business Rules
1. The hero carousel slides are Admin-curated on the web platform. The mobile app displays exactly what the Admin has configured — it does not auto-select slides.
2. The statistics counters must display live values. They require an active internet connection and are not displayed while the app is offline. The four stat tiles show dashes (–) rather than any previously seen value when no connection is available.
3. Sponsored publishers appear first in the Publisher Spotlight row regardless of any other ordering.
4. If a content section has no items to display (e.g., no media has been added yet), that section is hidden entirely from the homepage. It does not render as blank space or show a loading indicator permanently.
5. The "Latest Books" grid reflects the Admin's editorial curation settings for the homepage — it is not purely algorithmic. However, within the curated set, books the user has viewed more often during their current session appear higher (session-based personalization — see Module 3 for personalization rules).

### Edge Cases & Special Handling
- **First app load with no internet:** The homepage shows a full-screen "No connection" message with a retry button. No partial data is shown.
- **Returning to app without a connection:** The homepage shows the same full-screen "No internet connection" notice with a retry button. No content is displayed without a live connection.
- **Hero carousel with one slide:** No dots indicator is shown. Auto-advance is disabled.
- **Statistics API returns an error:** The four stat tiles display dashes (–) instead of numbers. They do not show zero.

### Notifications & Communications
None triggered from the homepage itself.

### Validation Rules
- Newsletter email field: required, valid email format, maximum 254 characters. Validation fires on submission attempt, not while the user is typing.

---

## Module 3: Book Catalog & Filtering

### Purpose & Business Context

The book catalog is the core browsing experience of the app. It must allow a user to scan hundreds of books quickly — using cover images, titles, and quick-glance metadata — and narrow results through filters to find exactly what they are looking for. On mobile, the filter experience must be drawer-based or modal-based (not sidebar-based) to preserve screen real estate.

### Who Interacts With This Module

All users.

### Catalog Screen Layout

**Top section:**
- Search bar (inline at top — tapping opens the global search screen — see Module 10)
- Filter button (tapping opens the filter bottom sheet)
- Sort control (dropdown or chip row: Newest / A–Z / Most Viewed)

**Main content:**
- 2-column grid of book cards, paginated (12 books per load, infinite scroll loads more as the user reaches the bottom)
- Each book card shows: cover image (full card width), Arabic title, publisher name, and star rating badge
- Tapping a card navigates to the book detail screen

**Active filter indicators:**
- When filters are active, chips showing each active filter appear below the search bar (e.g., "Arabic," "Technology & Science"). Tapping a chip removes that filter.

### Filter Bottom Sheet

Tapping the Filter button opens a bottom sheet drawer from the bottom of the screen. The filter sheet contains:

| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select chips | All 7 categories |
| Original Language | Multi-select chips | Arabic, English, French, German, Spanish, and Other |
| Translation Status | Single-select chips | All / Not Translated / Recommended for Translation / Translated |
| Publisher | Search-and-select list | Searchable list of all publishers in the directory |
| Purchase Availability | Single-select | All / Available for Purchase / Referral Only / Not Available |

The filter sheet has a "Apply Filters" button and a "Clear All" link. Applying filters dismisses the sheet and updates the catalog grid.

### Business Rules
1. Filters are additive — applying multiple filters narrows results (AND logic, not OR). A user filtering by "French" AND "Technology & Science" sees only French Technology books.
2. If the filtered result is empty, the screen displays: "No books found matching your filters" with a "Clear Filters" button.
3. The sort order defaults to "Newest" on first load. The user's selected sort is preserved within the session but resets to "Newest" when the app is relaunched.
4. Session-based personalization: if the user has spent time viewing books in a particular category during their current app session, that category's books are weighted toward the top of the unsorted catalog view. This never overrides an explicit user sort selection.
5. Personalization is session-only — it resets completely when the app is fully closed and relaunched.
6. All filters are cleared when the user navigates away from the catalog and returns via the bottom navigation tab (tab tap resets to root state).

### Edge Cases & Special Handling
- **Catalog with 0 books total:** Displays a friendly "Coming soon" message — this should never occur in production but is handled defensively.
- **Infinite scroll at the end of all results:** When all matching books have been loaded, a "You've seen everything" message appears at the bottom.
- **Offline browsing:** The catalog requires an active internet connection. When the device is offline, a full-screen "No internet connection" notice with a retry button is shown. No books are displayed without a live connection.

---

## Module 4: Book Detail Page

### Purpose & Business Context

The book detail screen is the single most important screen in the mobile app. Every piece of content — editorial articles, search results, publisher profiles, notifications — ultimately links here. It must present the complete picture of a book in a mobile-optimized layout and enable the user to add to cart, save to wishlist, share, rate, and comment without leaving the screen.

### Who Interacts With This Module

All users.

### Screen Layout (Scrollable)

**Header (above the fold):**
- Large cover image (full screen width, approximately 50% of screen height)
- Arabic title (bold, large)
- Original-language title (smaller, below)
- Author name(s)
- Publisher name (tappable — navigates to publisher profile)
- Publication year, original language, ISBN displayed as a compact info row
- Category badge (tappable — navigates to that category in the catalog)
- Translation status badge (color-coded: grey for Not Translated, amber for Recommended for Translation, green for Translated)

**Purchase Section:**
- If the book's purchase option is "Direct Purchase": A prominent "Add to Cart" button showing the price, and a separate "View Cart" link. The button is full-width and in the platform's primary color.
- If the book's purchase option is "Referral to Publisher": A "Buy from Publisher" button that opens the publisher's URL in the device's default browser (not within the app).
- If the book's purchase option is "Not Available for Purchase": A greyed-out "Currently Unavailable" label with no action.

**Actions Row:**
- Heart / Bookmark icon: saves the book to the device-local wishlist (icon fills on save, outlined when not saved)
- Share icon: opens the device's native share sheet
- Rating stars (5-star display with aggregate score and count, e.g., "4.2 (38 ratings)")

**Summary Section:**
- "About This Book" heading
- Full Arabic summary (expandable if longer than 6 lines — "Read More" tap expands)
- If an English summary exists and the active language is English: English summary is shown instead

**Submit Rating Section:**
- A star-rating input row (1–5 stars, tap to rate)
- An optional comment field below the rating input
- A "Submit" button
- After submission: the star input is replaced with "Your rating has been saved. Thank you." The submitted rating is reflected in the aggregate score immediately.

**Comments Section:**
- Heading: "Reader Comments"
- Approved comments listed in chronological order, each showing: display name, date, comment text, and star rating (if provided with comment)
- "Be the first to comment" message when no approved comments exist
- "Add a Comment" section at the bottom of the comment list (see Module 13 for full comment flow)

**Similar Books Row:**
- Heading: "You May Also Like"
- Horizontally scrollable row of up to 6 books from the same category (see personalization rules)
- Same book card format as the catalog

### Business Rules
1. The cover image is mandatory. If a cover image fails to load (network error), a publisher-logo placeholder or a book-silhouette placeholder is shown.
2. The "Add to Cart" button is visible and tappable only for books with "Direct Purchase" status.
3. The "Buy from Publisher" button always opens in the device's external browser. The platform does not embed the publisher's website in a webview.
4. The wishlist heart icon reflects the book's actual saved state in the device-local wishlist at all times.
5. The aggregate star rating is calculated from all approved ratings on the server — it is not calculated locally from the mobile app. It reflects server data loaded with the book detail.
6. The "Similar Books" section is hidden if fewer than 2 similar books exist. It never shows the current book in its own recommendations.
7. If the book has been removed from the catalog (the API returns a 404), the app displays: "This book is no longer available" with a button to return to the catalog.
8. All comments visible in the app are only approved comments. Pending and rejected comments are never shown to readers.

### Edge Cases & Special Handling
- **Book detail screen while offline:** The screen shows a "No internet connection" notice with a retry button. Book details cannot be loaded without a live connection.
- **Book price changes after user adds to cart:** When the user next opens the cart, the app fetches the current price. If the price has changed, a banner is shown: "The price of [Book Title] has been updated. Please review your cart."
- **Book removed from catalog while in cart:** When the user opens the cart, removed books are flagged: "This item is no longer available" and removed from the cart automatically before checkout can proceed (even though checkout is locked in this version, the cart still enforces this rule).
- **Author with multiple names:** All author names are displayed in a comma-separated list.
- **Book with no English summary:** When the app language is set to English, the Arabic summary is shown with a notice: "English summary coming soon."

### Notifications & Communications
No notifications triggered from the book detail screen itself.

### Validation Rules
- Rating input: 1–5 stars required to submit a rating. Partial stars are not allowed.
- Comment text: optional when submitting a rating alone; required if submitting a comment without a rating; minimum 10 characters, maximum 2,000 characters.
- Display name (for comment): required, minimum 2 characters, maximum 100 characters.
- Email (for comment identification): required, valid email format, not shown publicly.

---

## Module 5: Books Recommended for Translation

### Purpose & Business Context

This screen serves translators, Arab publishers, and linguistically curious readers who want to discover foreign books that the platform's editorial team has identified as strong candidates for Arabic translation. It is a filtered, purpose-built view of the catalog — not a separate content type.

### Who Interacts With This Module

All users — primarily translators and publishers.

### Screen Layout

- Screen title: "Books Recommended for Translation" (Arabic: "كتب مرشحة للترجمة")
- Filter controls (bottom sheet, same pattern as catalog): by Original Language, by Category, by Publisher Country
- Sort: Newest Added (default), Most Viewed
- 2-column grid of book cards (same format as catalog)
- Each card additionally shows: a "Recommended for Translation" amber badge

### Business Rules
1. Only books explicitly flagged by the Admin as "Recommended for Translation" appear in this section.
2. A book can appear in this section AND in the main catalog simultaneously — these are not mutually exclusive.
3. When a book's translation status is updated to "Translated" by the Admin, it is automatically removed from this section and added to the "Translated Books" section on the next app data refresh.
4. This section displays no purchase options — books here are shown purely for translation discovery. If a reader wants to purchase, they tap through to the book detail screen.
5. The platform does not track or display translation rights availability in this version. A note visible on this screen reads: "Translation rights availability must be confirmed directly with the publisher."

### Edge Cases & Special Handling
- **No books match the selected filters:** "No books found matching your filters" message with "Clear Filters" button.
- **Section is empty (no books currently recommended):** A friendly message: "No books have been recommended for translation yet. Check back soon."

---

## Module 6: Translated Books Section

### Purpose & Business Context

This section serves as a reference archive showing which foreign books have already been translated into Arabic. It prevents translators from pursuing works already available in Arabic and helps readers discover existing Arabic editions of important foreign titles.

### Who Interacts With This Module

All users.

### Screen Layout

- Screen title: "Translated Books" (Arabic: "كتب مترجمة")
- Filter controls: by Original Language, by Category
- 2-column grid; each card shows: original cover, original title and author, Arabic title, and a "Translated" green badge
- Tapping a card navigates to the book detail screen

### Business Rules
1. The original language title and author are always shown alongside the Arabic title — the section serves as a bilingual reference.
2. If the Arabic publisher is known and has a profile on the platform, their name appears as a tappable link on the book detail screen.
3. Entries in this section have no purchase call-to-action on the section listing screen. Purchase options appear only on the individual book detail screen.
4. Multiple translations of the same original work appear as separate entries, each linking to the same original book record.

---

## Module 7: Publisher Directory & Profiles

### Purpose & Business Context

The Publisher Directory is a reference tool that serves translators and readers who want to understand the origin of a book, find contact information for rights inquiries, or explore the full catalog of a publishing house they trust. On mobile, the directory is searchable, filterable by country, and presented as a scrollable list of cards.

### Who Interacts With This Module

All users — primarily translators and publishers' own audiences.

### Directory Screen Layout

- Inline search bar at the top (searches publisher name)
- Filter chip row below search: "All" / by Country / by Type (Arab / International)
- Sponsored publishers appear at the top of the list with a visible "Sponsored" badge
- List of publisher cards, each showing: publisher logo, publisher name, country flag and name, and book count on the platform
- Tapping a card navigates to the publisher profile screen

### Publisher Profile Screen Layout

- Banner image (full width)
- Publisher logo (overlapping banner, bottom-left)
- Publisher name (Arabic and original language if different)
- Country and type (Arab / International)
- "Sponsored" badge (if applicable)
- Website link (opens in device browser)
- Contact email (tapping opens the device's email app with the address pre-filled)
- Descriptive write-up (full text, expandable if long)
- "Books from This Publisher" section: a 2-column grid of all books in the catalog linked to this publisher

### Business Rules
1. Sponsored publishers are always shown at the top of the directory list, above all non-sponsored publishers.
2. The contact email is always visible on the profile — this is intentional to facilitate translation rights inquiries.
3. The "Books from This Publisher" grid uses the same pagination as the main catalog. If the publisher has more than 12 books, the user can load more via "Load More."
4. If no books from this publisher are in the catalog, the books section shows: "No books from this publisher are currently listed in our catalog."

### Edge Cases & Special Handling
- **Publisher profile viewed while offline:** The screen shows a "No internet connection" notice with a retry button. Publisher profiles require a live internet connection to load.
- **Website link for a publisher with no website:** The website field shows "Not available" and is not tappable.

---

## Module 8: Editorial Channels (Text Channels)

### Purpose & Business Context

The three editorial channels — World Reads, Book Harvest, and Essence of Ideas — are the intellectual backbone of the platform. On mobile, they are surfaced through a unified "Articles" section (accessible via the bottom navigation) that routes to each channel. The reading experience is optimized for mobile: large typography, clean margins, and smooth scrolling.

### Who Interacts With This Module

All users.

### Channel Hub Screen Layout

- Screen title: "Articles & Reading"
- Three channel tabs or cards across the top:
  - **World Reads** (العالم يقرأ) — daily book news
  - **Book Harvest** (حصاد الكتب) — periodic category digests
  - **Essence of Ideas** (زبدة الأفكار) — long-form analytical essays
- Tapping a channel tab filters the article list to that channel
- Article list: full-width cards showing featured image, channel label badge, headline, excerpt (2 lines), and date
- Infinite scroll pagination

### Article Detail Screen Layout

- Featured image (full width)
- Channel label badge
- Article headline (large, bold)
- Author byline and publication date
- Article body text (full text, rendered in readable mobile typography — 16sp minimum, generous line spacing)
- If the article is linked to a book: a "Related Book" card appears inline in the article with the book cover, title, and "View Book" button
- Social share button (share icon in top app bar — opens device share sheet)
- Comments section at the bottom (same as book detail — see Module 13)

### Business Rules for Each Channel

**World Reads:**
1. Articles are listed in reverse chronological order (newest first) by default.
2. Minimum article body: 200 words. Articles below this threshold are not published by the Admin.
3. A related book link is optional but displayed prominently when present.

**Book Harvest:**
1. Each Harvest article must be linked to at least 3 books in the catalog. The mobile app displays all linked books in a scrollable row within the article.
2. Minimum article body: 600 words.
3. A report period label (e.g., "May 2026") is displayed below the headline.

**Essence of Ideas:**
1. Every article is linked to exactly one book. The linked book's cover, title, and "View Book" button are displayed prominently below the headline.
2. Minimum article body: 800 words.
3. These are the platform's premium long-form essays. The reading experience must be clean and distraction-free.

### Edge Cases & Special Handling
- **Article with no English version (active language is English):** The Arabic article body is shown with a notice: "English version coming soon."
- **Article linked to a book that has since been deleted:** The "Related Book" card is hidden. The article remains readable.
- **Long articles (10,000+ words):** The app renders the full text without truncation. A "Reading progress" indicator (a thin line at the top of the screen showing scroll position) aids orientation for long reads.
- **No internet connection:** All article content requires a live internet connection. When the device is offline, a "No internet connection" notice with a retry button is shown.

---

## Module 9: Media Channels

### Purpose & Business Context

The three media channels — Watch Your Book, Book Talk, and Novel & Story — extend the platform's reach to users who prefer visual and audio content over text. On mobile, video is embedded through YouTube's native mobile player and audio is played through an in-app audio player or opens in the device's default media player.

### Who Interacts With This Module

All users.

### Channel Hub Screen Layout

Accessible via the "Articles" section (same bottom nav tab as editorial content), with tabs:
- **Watch Your Book** (شاهد كتابك) — video summaries
- **Book Talk** (حديث الكتب) — podcast episodes
- **Novel & Story** (رواية فحكاية) — cinematic story retellings

Each channel shows a list of media cards: thumbnail, channel badge, title, and duration.

### Watch Your Book & Novel & Story (Video Channels)

Each video entry screen shows:
- Video title
- Linked book card (cover + "View Book" button)
- YouTube embed player (full-width, 16:9 aspect ratio)
- Short description (Arabic)
- AI production disclosure (Novel & Story only): "This video was produced with the assistance of AI tools."
- Publication date
- Share button

**Business Rules:**
1. All videos are hosted on YouTube and embedded via the YouTube player. The app does not download or host video files.
2. Every Watch Your Book entry is linked to a book in the catalog. If the book has been deleted, the linked book card is hidden but the video remains viewable.
3. Novel & Story entries must always carry the AI production disclosure — this is non-negotiable.
4. If the YouTube video has been made private or deleted on YouTube, the embedded player shows an error. The rest of the screen remains accessible.

### Book Talk (Podcast Channel)

Each podcast entry screen shows:
- Episode title
- Linked book card (if applicable)
- In-app audio player: play/pause, seek bar, duration display, playback speed controls (1x, 1.25x, 1.5x, 2x)
- Episode transcript / description (Arabic)
- Publication date
- Share button

**Business Rules:**
1. Audio files are either hosted directly (played within the app's audio player) or embedded from an external podcast platform. The behavior is identical to the user.
2. Episode duration is always displayed.
3. If the audio file URL becomes unavailable, the player shows an error: "This episode is currently unavailable."

### Edge Cases & Special Handling
- **Video playback on offline:** Videos cannot be played offline — they require a live YouTube connection. An "Internet connection required to play this video" message is shown when offline.
- **Audio playback on offline:** Audio hosted directly on the platform's server cannot be played if the device is offline. Audio from an external podcast platform also requires a connection.
- **User receives a phone call while playing audio:** The audio player pauses automatically (standard OS behavior) and the user can resume from where they left off.

---

## Module 10: Global Search & Autocomplete

### Purpose & Business Context

As the platform grows, search becomes the fastest way for a user to find a specific book, publisher, or article. The mobile search experience must be fast, intelligent with autocomplete, and comprehensive in its results.

### Who Interacts With This Module

All users.

### Search Experience

Tapping the search bar (available on the catalog screen and the top app bar) opens a dedicated full-screen search experience:

**Before the user types:**
- "Recent Searches" list (last 5 searches, stored locally, tapping re-runs the search)
- "Popular Searches" section (loaded from server — most common recent search terms)

**As the user types:**
- Live autocomplete suggestions appear below the search bar: up to 5 suggestions, each labeled by type (Book, Publisher, Article)
- Suggestions are fetched after 300 milliseconds of typing inactivity (not on every keystroke)
- Tapping a suggestion navigates directly to that item's detail screen

**After the user submits a search:**
- Results organized in tabs: "All," "Books," "Articles," "Publishers"
- Each result shows: thumbnail / cover, type label, title, and a brief excerpt
- Tapping a result navigates to that item's detail screen

### Search Scope

The search covers:
- Book titles (Arabic and original language)
- Author names
- Publisher names
- Editorial article headlines
- Summary content (partial match)

### Business Rules
1. Search results are sorted by relevance by default. A "Sort by Newest" option is available.
2. If search returns zero results, the screen shows: "No results found for '[query]'" with suggestions to try different keywords or browse by category.
3. Filters are additive — see Module 3 catalog for the same rule.
4. Recent searches are stored locally on the device. They are cleared if the user clears the app data or reinstalls the app.

### Edge Cases & Special Handling
- **Search while offline:** The autocomplete does not work offline. Submitting a search while offline shows: "Search requires an internet connection."
- **Search query with special characters or Arabic diacritics:** The search engine handles normalized matching — "كتاب" matches "كِتَاب."
- **Very short queries (1 character):** Autocomplete is not triggered for single-character queries. Minimum 2 characters before suggestions appear.

---

## Module 11: Shopping Cart (Payment Locked)

### Purpose & Business Context

The shopping cart on mobile allows users to browse and select books for purchase, building their order on the go. Because payment processing is excluded from mobile version one, the cart is a staging area — the user selects their books, reviews the cart, and then completes the purchase on the web. This preserves the commercial utility of the cart without requiring payment integration.

### Who Interacts With This Module

All users.

### Cart Screen Layout

**Cart Items List:**
- Each cart item shows: book cover thumbnail, Arabic title, publisher, price, quantity selector (+/−), and a remove (trash) icon
- Price is displayed per item and a running total is shown at the bottom of the list

**Order Summary Section (bottom of screen):**
- Subtotal
- Shipping: "To be calculated at checkout"
- Total: displayed prominently

**Payment Lock Banner:**
- A clearly visible banner above the checkout button that reads:
  "Complete your purchase on the web — تسوق واكمل الدفع عبر الموقع"
- The "Proceed to Checkout" button is labelled "Complete on Web" and tapping it opens the platform's web checkout URL in the device's default browser

**Empty Cart State:**
- When the cart is empty: "Your cart is empty — ابدأ التسوق" with a "Browse Books" button that navigates to the catalog

### Cart Persistence

The cart is stored locally on the device and persists between app sessions. If the user closes the app and reopens it, their cart items are still there. The cart uses local device storage (not a server session like the web) — this means the mobile cart and the web cart are separate and do not sync. A user who adds books to their mobile cart and then opens the web will need to add those books again on the web.

This limitation is disclosed in the cart screen with a note: "Your mobile cart is stored on this device and is not synced with the web platform."

### Business Rules
1. Only books with "Direct Purchase" status can be added to the cart. Books with "Referral to Publisher" status show only a "Buy from Publisher" button on the detail screen — no add-to-cart.
2. Quantity per item can be increased or decreased with the +/− buttons. Minimum quantity is 1.
3. Removing an item from the cart requires tapping the trash icon and confirming in a brief confirmation snackbar ("Undo" available for 3 seconds).
4. The cart total updates in real time as quantities change.
5. The "Complete on Web" button opens the web platform's cart page (not the homepage) in the device browser. The user will need to re-add their items on the web because the carts are not synced.
6. The checkout button is never a payment button in mobile version one. It always opens the web browser.
7. If a book in the cart has been removed from the catalog, it is flagged: "No longer available" and excluded from the total. The user must remove it manually before seeing a clean cart.
8. If a book's price has changed since it was added to the cart, a banner is shown: "Price updated: [Book Title] is now [new price]."

### Edge Cases & Special Handling
- **Cart viewed while offline:** The cart displays stored items normally. The "Complete on Web" button shows: "Internet connection required to proceed."
- **User adds the same book twice:** The quantity is incremented rather than creating a duplicate line item.
- **Cart has items from a previous session (cold start):** The app fetches current prices and availability for all cart items on app launch. If a previously added item is no longer available, it is removed from the cart automatically and the user is notified once.

---

## Module 12: Device-Local Wishlist

### Purpose & Business Context

The web platform's wishlist is email-based — a user enters their email, receives a magic link, and their wishlist is accessible anywhere via that link. For mobile, this mechanism is replaced with a simpler, native experience: the wishlist is stored locally on the device. No email, no account, and no link are required. The user taps a heart icon on any book and it is saved instantly.

This is a deliberate trade-off: local storage is faster, simpler, and requires no user action beyond a single tap. The downside is that the wishlist is tied to the device — if the user reinstalls the app or gets a new phone, the wishlist is lost. This limitation is clearly disclosed to the user.

### Who Interacts With This Module

All users.

### Adding and Removing from Wishlist

- On any book detail screen, a heart / bookmark icon is displayed in the actions row.
- When the book is NOT on the wishlist: heart icon is outlined. Tapping it saves the book and changes the icon to filled (solid). A brief confirmation toast is shown: "Added to Wishlist."
- When the book IS on the wishlist: heart icon is filled. Tapping it removes the book and changes the icon to outlined. A brief toast is shown: "Removed from Wishlist."
- The wishlist state is updated instantly — no loading indicator is needed.

### Wishlist Screen (via "More" drawer)

- Screen title: "My Wishlist" (Arabic: "قائمة أمنياتي")
- List of saved books, each showing: cover thumbnail, Arabic title, publisher, price (if available), and a remove button
- Tapping a book navigates to its detail screen
- "Add to Cart" shortcut button on each wishlist item (visible only for books with "Direct Purchase" status)
- Empty state: "Your wishlist is empty. Add books you love by tapping the ❤ on any book."

### Business Rules
1. The wishlist is stored in the device's local storage. It is not synced to any server, not tied to an email, and not shared between devices.
2. The wishlist is preserved across app sessions until the user manually removes items or uninstalls the app.
3. If a book saved to the wishlist is removed from the catalog, it remains in the wishlist but is marked: "No longer available on the platform." The user can remove it manually.
4. There is no limit to the number of books a user can save to their wishlist.
5. A clear disclosure is shown in the Wishlist screen: "Your wishlist is stored on this device only. Reinstalling the app will clear your wishlist."
6. Translation alerts: in this version, wishlist books do not trigger push notifications when their translation status changes. This is out of scope for mobile version one (see Section 10 — Out of Scope Declarations). The web platform's Wish List translation alert feature requires an email-based wishlist, which is not implemented on mobile.

### Edge Cases & Special Handling
- **Wishlist viewed offline:** All previously saved books are shown (from local storage). No network connection is needed to view the wishlist.
- **User clears app data through device settings:** The wishlist is lost. This is disclosed in the app's settings screen and in the wishlist disclosure notice.

---

## Module 13: Ratings & Comments

### Purpose & Business Context

Ratings and comments are the platform's public engagement layer. On mobile, the submission experience must be smooth — a few taps for a star rating, a short form for a written comment. Since there are no user accounts, all submissions use a display name and email address provided by the user.

### Who Interacts With This Module

All users (submit and view). Admin (moderate — web only).

### Rating Submission Flow

1. User opens a book detail screen.
2. In the "Submit Rating" section, the user taps 1–5 stars.
3. Optionally, the user writes a comment in the text field below.
4. The user enters their display name and email address (if not previously saved on the device).
5. The user taps "Submit."
6. The rating is submitted to the server immediately.
7. The aggregate star rating updates in real time on the screen.
8. A success message replaces the input: "Thank you for your rating."

### Comment Submission Flow

1. User taps "Add a Comment" in the comments section of a book or article screen.
2. A bottom sheet or inline form expands with fields:
   - Display Name (required)
   - Email Address (required, not shown publicly)
   - Comment Text (required, minimum 10 characters, maximum 2,000 characters)
   - Star Rating (optional — user can comment without rating)
3. User taps "Submit Comment."
4. The comment is sent to the server for Admin review.
5. A success message is shown: "Your comment has been submitted and is awaiting review."
6. The submitted comment is **not** immediately visible in the comment list — it is pending Admin approval.
7. Once the Admin approves the comment on the web platform, it appears in the comment list on the next app refresh.

### Saved Identity

To reduce friction for repeat commenters, the app stores the user's display name and email locally after their first comment submission. On subsequent comment submissions, these fields are pre-filled. The user can edit them at any time.

### Business Rules
1. All comments require Admin approval before becoming publicly visible. The app shows no preview of the pending comment to the submitter.
2. A star rating without any comment text is valid and is accepted.
3. A comment without a star rating is valid and is accepted.
4. One rating per book per device session. If a user has already submitted a rating for a book in the current session, the rating input shows their submitted rating as read-only. They cannot re-rate a book in the same session.
5. The commenter's email address is never displayed publicly — it is used for identity purposes only (available to Admin for moderation context).
6. Comments on articles follow the same rules as comments on books.
7. The Admin can approve, edit, hide, or delete comments from the web platform. The mobile app never allows a reader to delete or edit their own submitted comment.

### Edge Cases & Special Handling
- **Submitting a comment offline:** The app displays: "You must be connected to the internet to submit a comment."
- **Comment form with pre-filled email that is now different:** The user can edit the pre-filled fields before submission. The app asks once: "Update your saved name and email?" with "Yes" and "No" options after submission.
- **Comment text that is very long (close to 2,000 characters):** A character counter is displayed below the text field, turning red when within 100 characters of the limit.

---

## Module 14: Publish Your Book (Guest Submission)

### Purpose & Business Context

This module delivers the full "Publish Your Book" author submission experience natively on mobile. An Arab writer who has completed their manuscript can submit it entirely from their phone — filling in their information, entering their book details, uploading a PDF from any file source the device supports, and submitting for Admin review. This is a guest experience — no login is required or provided.

### Who Interacts With This Module

Authors — the submission form is accessible to any user who taps "Publish Your Book."

### Entry Point

Accessible from:
- The "More" bottom drawer navigation
- A call-to-action card on the homepage
- The Articles hub or dedicated promotion banners (Admin-configurable)

### Three-Step Submission Wizard

The form is a 3-step wizard with a progress bar at the top (Step 1 of 3, Step 2 of 3, Step 3 of 3). A "Back" button is available on Steps 2 and 3 to return to the previous step without losing data.

---

**Step 1 — Author Information**

| Field | Type | Required? | Rules |
|-------|------|-----------|-------|
| Author Full Name | Text input | Yes | Min 2 characters, max 100 characters |
| Author Email | Email input | Yes | Valid email format; triggers eligibility check on blur |
| Author Phone | Phone input | Yes | Valid phone format; allows country prefix selection |
| Author Biography | Multiline text | Yes | Minimum 50 characters, maximum 1,200 characters; character counter displayed |

When the author enters their email and the field loses focus, the app calls the eligibility check endpoint. The result is shown immediately below the email field:
- If first submission: a green checkmark badge: "Your first submission is free."
- If subsequent submission: an amber badge: "A fee of [amount] applies to this submission. Payment must be completed on the web platform." (See Section 10 — Out of Scope: Paid Submissions on Mobile.)

The author taps "Next" to proceed to Step 2.

---

**Step 2 — Book Information**

| Field | Type | Required? | Rules |
|-------|------|-----------|-------|
| Book Title (Arabic) | Text input | Yes | Max 500 characters |
| Book Type | Dropdown | Yes | Options: Novel / Short Stories / Poetry / Academic Dissertation / Other |
| Book Summary | Multiline text | Yes | Min 100 characters, max 2,000 characters; character counter shown |
| Book Language | Dropdown | Yes | Arabic, English, French, German, Spanish, Other |
| Book Category | Dropdown | Yes | Options: Novel / Short Stories / Poetry / Academic / Other |
| Cover Image | Image picker | Yes | Pick from device gallery or camera; JPG/PNG/WEBP; min 300px wide |
| Manuscript File (PDF) | File picker | Optional | PDF only; max 50MB; picks from device storage, Google Drive, iCloud, Dropbox, or any storage accessible via the OS file picker |
| Allow Free Download | Toggle | Required if file provided | Whether the platform allows visitors to download the manuscript |

The cover image picker allows the author to take a photo on the spot (camera) or choose from the gallery. A preview of the chosen image is shown.

The manuscript file picker opens the device's standard file picker — the author can select a PDF from internal storage, SD card, Google Drive, Dropbox, iCloud Drive, or any connected cloud storage that the operating system exposes.

File size validation happens immediately after file selection. If the file exceeds 50MB, the picker shows: "File too large. Maximum allowed size is 50MB."

The author taps "Next" to proceed to Step 3.

---

**Step 3 — Review & Submit**

This screen presents a complete read-only summary of all entered information:
- Author details: name, email, phone, biography preview
- Book details: title, type, category, language, summary preview
- Cover image: thumbnail preview
- Manuscript: file name and size (if provided), download permission status
- Eligibility status: "First submission — Free" or "Paid submission — Must complete payment on web"

**For first-time (free) submissions:**
A "Submit My Work" button is shown. Tapping it submits the form.

**For paid submissions (subsequent submissions):**
A "Continue to Web for Payment" button is shown instead. Tapping it opens the web submission page in the device browser with a note explaining that payment is required. The form data is not pre-filled on the web (the author must re-enter it — this is a known limitation of paid mobile submissions in version one; see Section 10).

After successful free submission:
- A full-screen success state is shown: "Your work has been submitted! / تم إرسال عملك بنجاح"
- A message explains next steps: "Our editorial team will review your submission and email you within [X] days."
- A "Submit Another Work" button is shown (resets the form).
- A "Back to Home" button returns to the homepage.

### Draft Saving (Local)

The form autosaves to the device's local storage after every step transition. If the user exits the app mid-form and returns, a "Resume Draft" banner is shown on the "Publish Your Book" entry screen: "You have a saved draft. Resume?" with "Yes" and "Start Over" options.

### Business Rules
1. The first submission from any given email address is free. The eligibility check is performed in real time by the server.
2. Subsequent submissions require payment. Payment cannot be completed inside the mobile app in version one. The app directs the author to the web.
3. The submission form is accessible to anyone — no login required.
4. No submission becomes publicly visible until the Admin approves it on the web platform.
5. The platform makes no claim on submitted intellectual property. A brief statement to this effect is displayed at the bottom of Step 1: "Your work remains your intellectual property. The platform serves only as a visibility channel."
6. The Admin approval workflow, rejection notification, and published listing are managed entirely on the web. The mobile app only handles the submission flow.
7. Adult content, offensive material, or content that violates applicable laws will be rejected by the Admin. The submission form includes a checkbox on Step 3: "I confirm that this submission complies with the platform's content standards." This checkbox is required.

### Notifications & Communications
- Author receives: a confirmation email upon form submission (sent by the server — not by the app)
- Author receives: an approval or rejection email from the Admin (managed on the web — not initiated by the mobile app)

### Edge Cases & Special Handling
- **Submission while offline:** Submission is blocked. The "Submit My Work" button is disabled and a notice is shown: "Internet connection required to submit."
- **File upload fails mid-submission:** The form retains all previously entered data. The user must re-select the file and try again. The app displays: "File upload failed. Please try again."
- **Author exits the app after Step 2:** The draft is saved locally. On the next app open, the "Resume Draft" prompt appears.
- **Author enters an email that triggers a paid submission but did not expect it:** The amber eligibility notice on Step 1 makes this clear before the author spends time completing the rest of the form.
- **Cover image file is too small (below 300px):** The image picker shows an inline warning: "This image may be too small. For best results, choose an image at least 300 pixels wide." It is a warning, not a blocker.

### Validation Rules (Summary)
- Author Full Name: required, 2–100 characters
- Author Email: required, valid format
- Author Phone: required, valid phone format
- Author Biography: required, 50–1,200 characters
- Book Title: required, max 500 characters
- Book Summary: required, 100–2,000 characters
- Cover Image: required, JPG/PNG/WEBP, minimum 300px wide
- Manuscript File (if provided): PDF only, max 50MB
- Content standards checkbox: required on Step 3

---

## Module 15: Newsletter Subscription

### Purpose & Business Context

The newsletter is the platform's primary retention tool. From the mobile app, users can subscribe to receive new book alerts, editorial highlights, and platform news by email. The subscription flow uses double opt-in, identical to the web.

### Who Interacts With This Module

All users.

### Subscription Flow

1. User enters their email in any newsletter signup form in the app (homepage strip, footer of articles, or a dedicated "Subscribe" screen accessible from the More drawer).
2. App sends the subscription request to the server.
3. Server sends a confirmation email to the provided address.
4. A success message is shown in the app: "A confirmation email has been sent to [email]. Please confirm your subscription."
5. The user opens their email client and clicks the confirmation link.
6. The subscription is activated. The user begins receiving newsletters.

### Business Rules
1. Double opt-in is mandatory. No subscriber is added to the active list without confirming their email.
2. Every newsletter email includes a one-click unsubscribe link. Users who wish to unsubscribe must use that link — unsubscription cannot be performed from within the mobile app.
3. If the user submits an email that is already subscribed and active, the app shows: "This email is already subscribed."
4. If the user submits an email that was previously unsubscribed, the system treats it as a new subscription and requires re-confirmation.

### Edge Cases & Special Handling
- **Subscription attempted while offline:** The subscribe button is disabled. A notice is shown: "Internet connection required to subscribe."
- **Confirmation email not received:** The app displays a "Resend confirmation email" link in the success message, which the user can tap after 60 seconds.

---

## Module 16: Push Notifications

### Purpose & Business Context

Push notifications are the mobile-native mechanism for keeping readers connected to new platform content without requiring them to open the app. The platform's backend server manages device token registration and dispatches native device notifications to opted-in users — appearing in the device's notification tray even when the app is closed. This keeps readers connected to new books and articles the moment they are published.

### Who Interacts With This Module

All users who opt in.

### Opt-In Flow

1. On first app launch, a soft pre-prompt appears (see Module 1 — App Shell) asking the user to allow notifications.
2. If the user taps "Allow," the device's OS permission dialog appears. Granting permission registers the device token with the platform's push notification system.
3. If the user taps "Not Now" or denies the OS prompt, notifications are disabled. The user can enable them later through the "Notification Settings" screen in the More drawer.
4. The "Notification Settings" screen shows the current status and a button that opens the device's system notification settings for the app.

### Types of Push Notifications

| Type | Trigger | Content |
|------|---------|---------|
| New Book Published | Admin publishes a new book on the web | "New Book: [Book Title]" — tapping opens the book detail screen |
| New Article Published | Admin publishes a new article on the web | "New Article: [Article Title]" — tapping opens the article detail screen |
| Admin Broadcast | Admin sends a broadcast notification from the web platform's notification management | Custom title and message set by Admin — tapping opens the app or a specified deep link |

### Deep Linking

All push notifications include a deep link — tapping a notification opens the specific screen in the app (book detail, article detail, or homepage). The app handles deep links from a cold start (app not open) and from a background state (app open but not in foreground).

### Business Rules
1. Push notifications are only sent to devices where the user has granted notification permission.
2. The platform must not send more than three push notifications per day to any single device. This limit is enforced server-side.
3. Admin broadcast notifications count against the daily limit. System-triggered new-content notifications also count against the limit.
4. Wishlist translation alerts are NOT sent via mobile push in version one (see Section 10 — Wishlist translation alerts are out of scope for mobile).
5. If the user has disabled notifications at the OS level, the app does not show any fallback in-app prompts. It respects the OS-level decision.
6. Notification preferences (topic subscriptions if implemented) are managed by the server, not by the app. The app only controls whether the device is subscribed or unsubscribed from all notifications.

### Edge Cases & Special Handling
- **Device offline when notification is sent:** The operating system's notification service queues and delivers the notification when the device reconnects. This is standard platform behavior on both iOS and Android.
- **App updated to a new version:** The device's push notification token is preserved across app updates. If the token changes for any reason, the app re-registers with the platform's backend automatically.
- **User reinstalls the app:** The previous push notification registration is lost. On reinstall, the user is treated as a new installation and the permission flow begins again.

---

## Module 17: Static Pages

### Purpose & Business Context

The app includes read-only informational screens for About Us, Team, Contact, Privacy Policy, and Terms of Use. These provide transparency, legal disclosures, and a human face to the platform.

### Who Interacts With This Module

All users.

### Available Static Screens

| Screen | Content | Access |
|--------|---------|--------|
| About Us | Platform mission, vision, and values | More drawer |
| Our Team | Team member grid (photo, name, role) | More drawer |
| Contact Us | Contact form (name, email, subject, message) + email and phone links | More drawer |
| Privacy Policy | Full privacy policy text | More drawer, Footer of app, App store listing |
| Terms of Use | Full terms of use text | More drawer, Footer of app |

### Contact Form Behavior

1. User fills in: Name, Email, Subject, Message.
2. User taps "Send."
3. Message is submitted to the server and sent to the platform's support email.
4. App shows: "Your message has been sent. We will respond within [X] business days."

**Business Rule:** The contact form is the only way to reach the Admin team from within the mobile app. There is no live chat or instant support.

### Business Rules
1. Privacy Policy and Terms of Use content is managed on the web Admin panel and fetched by the app from the server. Changes made on the web are reflected in the app on the next load.
2. If the Privacy Policy has been updated since the user last accepted it, a notification is shown on app launch: "Our Privacy Policy has been updated. Please review the changes." The user can dismiss this notice.
3. The Privacy Policy must disclose: push notification delivery and device token registration, anonymous session analytics, and local device storage (cart items, wishlist books, draft submissions, and commenter identity).

---

## 6. Cross-Cutting Business Rules

### Rule 1 — Arabic First, English Optional

All content is created in Arabic by the Admin. English is secondary and optional. On mobile, if an item has no English version, the Arabic content is shown in the English language view with a "English version coming soon" notice. No mobile screen shows blank content because an English version is missing.

**Why it exists:** The platform's primary audience is Arabic-speaking. English is served as a convenience for international users. This rule prevents publication gaps from causing blank screens.

### Rule 2 — Admin Approval Gate (Inherited from Web)

No user-generated content becomes publicly visible without Admin approval. On mobile, this means submitted comments appear immediately with "Your comment is awaiting review" status — they are never shown in the public comment list until the Admin approves them on the web.

**Why it exists:** To maintain editorial quality and prevent spam, abuse, or misinformation from appearing on the platform.

### Rule 3 — Cart Payment Lock

The mobile cart cannot process payment. The checkout button always redirects to the web platform. This rule has no exceptions in version one. The app must never attempt to collect payment details in any form.

**Why it exists:** Mobile payment SDK integration requires platform-specific security and compliance work that is deferred to a future version.

### Rule 4 — Cart Non-Sync

The mobile cart is stored locally on the device. It does not sync to the web cart. A user's web cart and mobile cart are always separate. This is disclosed to the user clearly in the cart screen.

**Why it exists:** Implementing cross-platform cart sync requires user authentication (so the server knows who owns the cart). Since mobile version one has no user login, per-user server carts are not available.

### Rule 5 — Wishlist is Device-Local and Ephemeral

The mobile wishlist is stored only on the device. It is not backed up, not synced to the server, and is lost if the app is uninstalled. This limitation is disclosed to the user in the wishlist screen.

**Why it exists:** The web wishlist is email-based (magic link). Implementing email-based wishlist access on mobile is deferred. The local wishlist is a mobile-native approximation.

### Rule 6 — No Wishlist Translation Alerts on Mobile

When a book on the user's device-local wishlist has its translation status updated to "Translated," the mobile app does not send the user a push notification. This automation requires matching a wishlist entry to a specific user identity — which is not possible with a purely device-local, anonymous wishlist.

**Why it exists:** The web wishlist alert requires the user to have provided an email at wishlist creation time. The mobile wishlist has no email. Without an identity linkage, the server cannot know which device to alert.

### Rule 7 — Notification Daily Frequency Limit

The platform sends at most 3 push notifications per day to any single device. This limit is enforced server-side. The mobile app has no control over this limit — it is a backend rule.

**Why it exists:** Notification fatigue causes users to disable notifications or uninstall the app. Protecting the notification channel's value requires strict frequency limits.

### Rule 8 — First Author Submission is Free, Paid Submissions Go to Web

The first book submission from any email address is free and can be completed entirely in the mobile app. All subsequent submissions require payment, which cannot be processed in the mobile app in version one. The app directs the user to the web for paid submissions.

**Why it exists:** Payment processing on mobile requires native SDK integration (Stripe Mobile, Paymob) that is deferred to a future version.

### Rule 9 — Comments Are Pending Until Admin Approves

No submitted comment is visible to any other user until an Admin approves it on the web platform. The submitting user sees a "Your comment is awaiting review" confirmation, not a live preview of their own comment in the list.

**Why it exists:** To prevent spam, abusive content, and misinformation from appearing on the platform unchecked.

### Rule 10 — Statistics Must Reflect Reality

The homepage statistics counters (books, publishers, translated books, years) display live data from the server. They require an active internet connection and are not displayed when the app is offline. They never show zero when content exists on the server.

### Rule 11 — Sponsored Content is Labeled

All sponsored publisher placements in the directory and on the homepage carry a visible "Sponsored" badge. Users have the right to know when prominent placement is commercially driven.

### Rule 12 — No Admin Functions on Mobile

The mobile app contains no administrative capabilities whatsoever. No moderation, no content management, no order management, no user management, and no settings configuration are accessible from the mobile app. If a team member needs to perform admin functions while away from a desktop, they must use the web platform through the device's mobile browser.

### Rule 13 — Two-Language Consistency for Core Records (Inherited from Web)

Book titles, publisher names, and author names are entered with both the Arabic version and the original-language version. The mobile app displays both where space allows. In compact views (catalog cards), the Arabic title is primary. In detail views, both titles are shown.

---

## 7. Key User Journeys

### Journey 1 — A First-Time Reader Opens the App, Browses Books, and Saves to Wishlist

**Starting State:** A reader has just downloaded and opened the Books Platform mobile app for the first time. Their phone is connected to Wi-Fi. The app language is Arabic (default).

The reader is greeted by the onboarding push notification pre-prompt: "Stay updated on new books and articles — allow notifications?" They tap "Allow" and grant the OS permission. The device is registered with the platform's push notification system.

The homepage loads. The reader sees the hero carousel with the platform's featured content. They scroll down and notice the "Latest Books" grid. A cover catches their eye — a striking design for a French novel in the "Philosophy & Culture" category. They tap the card.

The book detail screen opens. The reader sees the large cover, the Arabic title, the original French title, and a four-star aggregate rating with 22 ratings. They read the Arabic summary — 400 words describing the book's philosophical themes. They scroll down and see the purchase section: the book is available for direct purchase at 85 SAR. They tap the heart icon to save the book to their wishlist. The icon fills with color and a toast appears: "Added to Wishlist."

They continue scrolling and see the comments section — three approved comments from other readers. They tap the 4-star rating input and select 4 stars. The aggregate rating updates to reflect their new vote. A "Thank you for your rating" message appears.

They tap "Back" and return to the homepage. They scroll to the "Books Recommended for Translation" section and tap "View All." The Recommended for Translation screen opens. They filter by "French" and see 14 books. They spend 10 minutes browsing and saving two more books to their wishlist.

**End State:** The reader has rated a book, saved 3 books to their device-local wishlist, and enabled push notifications. They will receive alerts when new books or articles are published.

**Failure Case — No Internet:** If the reader loses their connection while browsing, the catalog shows a "No internet connection" notice with a retry button. No books can be browsed without a live connection. The rating submission is also blocked with an error notice.

---

### Journey 2 — A Reader Reads an Article and Submits a Comment

**Starting State:** A reader is using the app at home, connected to Wi-Fi. They want to explore the platform's editorial content.

The reader taps the "Articles" tab in the bottom navigation bar. The channel hub loads, showing three tabs: World Reads, Book Harvest, and Essence of Ideas. They tap "Essence of Ideas" — the platform's long-form analytical essay channel. A list of articles appears, each showing a featured image, the channel badge, a headline, and a two-line excerpt.

One headline catches their attention — a 1,100-word essay analyzing a recently translated German philosophy book. They tap the card. The article detail screen opens. The full essay loads in clean mobile typography: large text, generous line spacing, and a full-width featured image at the top. Partway through the article, they notice a "Related Book" card embedded in the article body, showing the book's cover and a "View Book" button. They tap it, read the book detail screen, then navigate back to the article.

The reader finishes the essay and scrolls down to the comments section. Two approved comments from other readers are already visible. The reader decides to share their own reaction. They tap "Add a Comment." An inline form expands showing: Display Name, Email Address, Comment Text, and an optional star rating. The character counter below the text field shows "0 / 2000."

The reader enters their display name and email address. They write an 85-word comment. They tap "Submit Comment."

A success message appears: "Your comment has been submitted and is awaiting review." The submitted comment does not appear in the list immediately — it awaits Admin approval on the web platform. The reader's display name and email are saved locally on the device and will be pre-filled the next time they submit a comment anywhere in the app.

**End State:** The comment is recorded in the Admin panel and awaiting moderation. Once the Admin approves it on the web platform, it will appear in the article's comment list on the next app refresh.

**Failure Case — No Internet Connection:** If the reader loses their connection before tapping Submit, the "Submit Comment" button is disabled and a notice is shown: "You must be connected to the internet to submit a comment." The typed comment text remains in the field and is not lost — the reader can submit as soon as connectivity is restored.

---

### Journey 3 — An Author Submits an Unpublished Book

**Starting State:** An Arab writer has just finished their debut novel and wants to submit it through the Books Platform mobile app. They have heard about the platform and downloaded the app. They have a PDF of their manuscript in their Google Drive and a cover image in their phone's gallery.

The author opens the app and navigates to "Publish Your Book" from the More drawer. The entry screen explains the service. They tap "Submit Your Work."

**Step 1 — Author Information:** The author enters their full name, email address, and phone number. They write their 150-word biography in the text area. The character counter shows "150 / 1200." They enter their email address and the app checks eligibility: a green badge appears — "Your first submission is free." They tap "Next."

**Step 2 — Book Information:** The author enters their novel title in Arabic. They select "Novel" as the book type, "Novel" as the category, "Arabic" as the language. They write a 350-word summary. They tap the "Choose Cover Image" button, select a photo from their gallery, and see a preview. They tap "Choose Manuscript (PDF)" and the file picker opens. They navigate to Google Drive and select their 2.8MB PDF file. A preview shows "novel-draft.pdf (2.8 MB)." They toggle "Allow Free Download" to ON — visitors can download the manuscript. They tap "Next."

**Step 3 — Review & Submit:** The author reviews all entered data. Everything looks correct. They tick the content standards confirmation checkbox. They tap "Submit My Work."

A loading indicator appears for 3 seconds (the PDF uploads to the server). Then the full-screen success state appears: "Your work has been submitted!" with the message explaining that the editorial team will review and email them.

The author receives a confirmation email at the address they provided.

**End State:** The submission is recorded in the Admin panel and awaiting review. The author will receive an approval or rejection email from the Admin.

**Failure Case — File Too Large:** If the author selects a PDF larger than 50MB, the file picker immediately shows: "File too large. Maximum allowed size is 50MB." The author must compress the file or select a smaller sample chapter.

**Failure Case — Second Submission:** If the same author returns to submit their second book, the eligibility check on Step 1 shows the amber badge: "A fee applies to this submission. Payment must be completed on the web platform." The "Submit My Work" button on Step 3 is replaced with "Continue to Web for Payment," which opens the web browser.

---

### Journey 4 — A Reader Searches for a Book, Adds to Cart, Attempts Checkout

**Starting State:** A reader has heard about a specific book — "The Anatomy of Fascism" — from a friend. They want to find it and purchase it. They are using the mobile app.

The reader taps the search bar at the top of the catalog screen. The search screen opens. They type "fascism" and see autocomplete suggestions — including "The Anatomy of Fascism" as a Book result. They tap the suggestion.

The book detail screen opens. The reader reads the summary and is convinced. They see the price — 95 SAR — and tap "Add to Cart." A brief toast: "Added to cart." The cart badge in the top app bar now shows "1."

The reader taps the cart icon. The cart screen opens with one item: the book, quantity 1, price 95 SAR. The total shows 95 SAR. A blue payment lock banner states: "Complete your purchase on the web — تسوق واكمل الدفع عبر الموقع."

The reader taps "Complete on Web." The device browser opens to the web platform's cart page. A note reminds the reader to re-add their item on the web since carts are not synced.

**End State:** The reader has been directed to the web to complete their purchase. The mobile cart still contains the item for future reference.

**Failure Case — Book Removed from Catalog:** If the book is removed from the catalog after being added to the cart, the next time the user opens the cart, the item is flagged: "This item is no longer available" and excluded from the total.

---

### Journey 5 — A New User Enables Push Notifications and Receives a New-Book Alert

**Starting State:** A reader has just installed and opened the app for the first time. They are a bookshop owner interested in Arabic translations of foreign books.

On first launch, the soft pre-prompt appears: "Stay updated on new books and articles — allow notifications?" They tap "Allow." The OS permission dialog appears. They tap "Allow" on the OS dialog as well. Their device is now registered with the platform's push notification system.

Three days later, the Admin publishes a new German book in the "Languages & Literature" category and triggers a broadcast push notification from the web platform's notification management panel.

The reader's phone is locked. A push notification appears on the lock screen: "New Book: The Language of Flowers — A new book has been added to our catalog." The reader unlocks their phone and taps the notification.

The Books Platform app opens directly to the German book's detail screen. The reader reads the summary, saves the book to their wishlist, and taps "Buy from Publisher" (the book is a referral, not a direct purchase) to visit the German publisher's website.

**End State:** The notification successfully brought an interested user back to the platform and drove them to the publisher's website for a potential purchase.

**Failure Case — User Disabled Notifications:** If the user had tapped "Not Now" on the first launch prompt, they receive no push notifications. If they later change their mind, they navigate to More → Notification Settings and tap "Enable Notifications" which opens the device's system settings for the app.

---

## 8. Integration Points & External Dependencies

### Platform Backend API

**Purpose:** The mobile app is a consumer of the same REST API that powers the web platform. All content, business logic, moderation, and data management lives in the backend.
**Direction:** Mobile app calls out to the backend API. No incoming calls from the backend to the app through the REST API (push notifications are dispatched by the backend server to device notification services through a separate channel, outside the REST API communication).
**What data is exchanged:** Books, articles, publishers, cart operations, submission form data, newsletter subscriptions, ratings, and comments.
**Failure handling:** If the API is unavailable, the app displays a "Service temporarily unavailable" notice with a retry button on all content screens.
**Fallback behavior:** The app shows error states for all content that requires a network connection. The cart and wishlist remain fully functional as they are stored locally on the device.
**Development status:** The backend API is in production and stable, having served the web platform since its launch. However, it was built primarily to support web features and has not yet been fully extended to cover all endpoints required by this mobile scope. Additional backend endpoints and updates will be developed in coordination with the mobile team throughout the project. A shared API readiness backlog between the backend and mobile teams is recommended to prevent mobile development being blocked on missing backend features.

---

### Push Notification Service (Backend-Managed)

**Purpose:** Delivers native push notifications to opted-in devices for new books, new articles, and Admin broadcasts — managed and dispatched directly by the platform's backend server.
**Direction:** The mobile app registers its device notification token with the platform's backend. When a notification event is triggered (new book published, new article published, Admin broadcast), the backend dispatches the notification directly to registered devices through the operating system's native notification channel.
**What data is exchanged:** Device notification token, notification title, notification body, deep link URL. No personally identifiable user information is associated with the device token on the backend.
**Failure handling:** If the backend's notification dispatch service is temporarily unavailable, a notification may be delayed or dropped. Non-delivery of a single notification does not affect platform functionality — the user can always open the app to see the latest content.
**Fallback behavior:** If push notification dispatch fails, the app still functions normally in all respects. No core platform functionality depends on push notifications — they are a convenience feature only.

---

### Device File System & OS File Picker

**Purpose:** Allows authors to select PDF manuscript files and cover images from their device storage, cloud drives, or any file source the operating system exposes.
**Direction:** The app calls the OS file picker API; the user selects a file; the app reads and uploads the file to the backend.
**What data is exchanged:** The selected file's binary content and metadata (file name, size, MIME type).
**Failure handling:** If the file picker fails to open (rare OS-level error), the app shows: "Unable to open file picker. Please try again." If the selected file is corrupted or unreadable, the upload fails with an error message.
**Fallback behavior:** The submission can proceed without a manuscript file (the file is optional). The cover image is required — the submission cannot proceed without a valid image.

---

### Platform Web Checkout (Browser Handoff)

**Purpose:** When a user taps "Complete on Web" in the cart, the app opens the platform's web checkout URL in the device's default browser.
**Direction:** The app opens an external URL. No data is passed directly — the user re-adds items on the web.
**What data is exchanged:** No API call — it is a URL open. The cart contents are not transferred.
**Failure handling:** If the browser cannot open the URL (no browser installed, or URL is invalid), the OS shows a standard "No app can handle this link" message.
**Fallback behavior:** The cart remains visible in the app. The user can try again.

---

### Email Service (Submission & Newsletter Confirmations)

**Purpose:** The backend email service sends transactional emails triggered by mobile actions: submission confirmation, newsletter double opt-in confirmation.
**Direction:** The mobile app triggers a server action; the server sends the email via the email service. The app never sends email directly.
**What data is exchanged:** User email address, notification type, confirmation links.
**Failure handling:** If the email service is down, the app's confirmation screens still appear (the server accepted the action). The email is queued and sent when the service recovers. If the email never arrives, the user can request a resend (newsletter) or contact support (submission).
**Fallback behavior:** All actions on the app side complete normally. Email delivery failure is a background issue handled by the backend.

---

### Device External Browser

**Purpose:** Opens external URLs (publisher websites for referral purchases, the web checkout for cart completion, contact email links).
**Direction:** The app calls the OS to open a URL in the default browser.
**What data is exchanged:** The URL to open.
**Failure handling:** If no browser is installed, the OS handles the error. The app displays no custom error.
**Fallback behavior:** The app remains open. The user can return to it after completing the action in the browser.

---

## 9. Security, Access Control & Compliance

### Access Control Summary — Mobile App

| Action | All Mobile Users |
|--------|-----------------|
| Browse all public content (books, articles, publishers) | ✅ |
| View book detail, article detail, publisher profile | ✅ |
| Submit star ratings | ✅ |
| Submit comments (pending Admin approval) | ✅ |
| Add to device-local wishlist | ✅ |
| Subscribe to push notifications | ✅ |
| Sign up for email newsletter | ✅ |
| Add books to cart (view only — no checkout) | ✅ |
| Submit "Publish Your Book" form (first, free submission) | ✅ |
| Access the Admin Panel | ❌ Never |
| Complete payment in-app | ❌ Not in v1 |
| Access Ambassador Dashboard | ❌ Not in v1 |
| Manage B2B subscriptions | ❌ Not in v1 |
| Access author submissions history / dashboard | ❌ Not in v1 |
| Edit or delete own submitted comment | ❌ Not available |
| Subscribe to WhatsApp / Telegram channels from in-app | ❌ Not in v1 |

### Data Stored Locally on the Device

The mobile app stores the following data locally on the user's device:

| Data | Purpose | When Cleared |
|------|---------|--------------|
| Active language preference (AR/EN) | Preserve language choice across sessions | User changes language; app reinstall |
| Shopping cart items (book IDs, quantities, price snapshots) | Preserve cart across sessions | User empties cart; app reinstall; item becomes unavailable |
| Wishlist items (book IDs and basic metadata) | Preserve wishlist across sessions | User removes items; app reinstall |
| Commenter display name and email | Pre-fill comment form for repeat commenters | User clears app data; app reinstall |
| Draft submission form data | Allow resuming incomplete submission | User submits or discards the draft |
| Recent search terms | Show recent search history | User clears search history; app reinstall |
| Device push notification token | Push notifications | Token registered with the platform's backend; app reinstall generates a new token and re-registers automatically |



### No Sensitive Data Stored

The mobile app stores no payment card data, no government ID information, no full personal profiles, and no authentication credentials. The app has no login system in version one — all interactions are either fully anonymous or use an email address as a lightweight identifier.

### File Upload Security

When an author uploads a PDF manuscript, the file is transmitted over HTTPS to the backend server. The backend validates the file type and size before storing it. The mobile app does not execute or preview PDF content locally beyond the file name and size confirmation — the file is treated as an opaque binary object for upload purposes.

### Push Notification Privacy

Device push notification tokens are not associated with any personally identifiable information on the platform's backend in version one. The platform sends broadcast notifications to all registered devices — no per-user targeting is performed. No browsing history or personal data is shared with any third-party service for push notification purposes. The token-to-device mapping is maintained entirely within the platform's own backend.

### Compliance Considerations

1. The Privacy Policy must disclose all data stored locally (as listed above), push notification delivery and device token registration (managed by the platform's backend), and anonymous behavioral data collection.
2. Newsletter subscription uses double opt-in, complying with email marketing regulations in applicable jurisdictions (GDPR, CAN-SPAM, and Arab-region regulations).
3. Author submission form data: the manuscript file is transmitted securely and stored on the platform's servers. The platform makes no claim on the intellectual property of submitted works. This is stated clearly in the submission form.
4. The contact form message is transmitted to the platform's support email. It is not stored permanently by the mobile app.

---

## 10. Explicit Out-of-Scope Declarations

---

### 1. Admin Dashboard — Not Implemented on Mobile

**What It Is:** The full Admin panel used by the Books Platform editorial team to manage books, articles, publishers, orders, submissions, comments, newsletters, ambassadors, B2B subscriptions, and all platform settings.

**Why It Is Excluded:** The Admin panel is a complex, data-intensive tool optimized for desktop workflows. Its users — the editorial team — perform their work at desktop computers. The engineering effort to rebuild the Admin panel for mobile interaction patterns (small screen, touch targets, file management, rich text editing) is not justified given the admin team's access to desktop devices. Mobile administration creates additional security surface area without sufficient user benefit.

**Current Workaround:** All administrative functions are performed through the web Admin panel. The web platform is fully responsive on mobile browsers — an Admin who needs to perform a task urgently while away from a desktop can use the web Admin panel through their phone's browser.

**Future Consideration:** A limited "Admin light" mobile experience — focused on the most time-sensitive tasks (approving comments, reviewing submissions, checking order status) — may be considered for a future version if the admin team requests it.

**Impact on Current System:** No artifacts. The mobile app has no admin routes, no admin UI components, and no admin-level API calls.

---

### 2. Payment & Checkout — Not Implemented on Mobile

**What It Is:** The ability to complete a book purchase — entering payment details and processing a transaction — directly within the mobile app.

**Why It Is Excluded:** Native mobile payment SDK integration (Stripe Mobile SDK, Paymob Mobile SDK) requires platform-specific implementation, security review (PCI compliance considerations), Apple App Store and Google Play Store payment policy compliance review, and end-to-end payment testing. These requirements are deferred to a future version to allow the core content experience to launch first.

**Current Workaround:** The shopping cart is fully functional on mobile — users can add books and review their cart. When ready to pay, the "Complete on Web" button opens the web platform's checkout in the device browser. The user must re-add their items on the web because the carts are not synced.

**Future Consideration:** A future version will integrate native payment processing using Stripe's mobile SDK or an equivalent, eliminating the browser handoff entirely. Cart sync between mobile and web will also be addressed in that version, which requires introducing user accounts.

**Impact on Current System:** The cart module exists in the mobile app but has the checkout button permanently locked to a web redirect. The UI includes a clear explanation of this limitation so users are not confused.

---

### 3. Ambassador Dashboard — Not Implemented on Mobile

**What It Is:** The Ambassador Dashboard where platform partners (influencers and content creators) log in to view their referral links, click counts, conversion rates, earnings, and payout history.

**Why It Is Excluded:** The Ambassador audience is small (a limited set of approved partners) and their dashboard interactions — analyzing performance data, copying referral links to share — are naturally desktop-oriented tasks. The mobile Ambassador user base does not justify the development cost in version one.

**Current Workaround:** Ambassadors access their dashboard through the web platform on desktop or via a mobile browser.

**Future Consideration:** If Ambassadors express strong demand for mobile dashboard access, a dedicated Ambassador section within the mobile app can be scoped in a future version.

**Impact on Current System:** No Ambassador-specific UI, routes, or API calls exist in the mobile app.

---

### 4. B2B Institutional Subscription Management — Not Implemented on Mobile

**What It Is:** The section of the web Admin panel where the editorial team manages institutional subscriber accounts (libraries, universities, newspapers, television channels) — creating accounts, renewing subscriptions, managing content delivery.

**Why It Is Excluded:** B2B subscription management is an Admin function. Since the Admin panel is excluded from mobile (see item 1 above), B2B management is excluded by extension. Additionally, the institutional clients themselves do not have a self-service portal (in this version or the next) — the entire B2B relationship is managed by the admin team.

**Current Workaround:** B2B management is performed through the web Admin panel.

**Future Consideration:** Not currently planned for mobile. A future B2B client portal (for institutional clients to log in and access their content packages) would be web-first.

**Impact on Current System:** None. No B2B-related UI or routes exist in the mobile app.

---

### 5. Author Login & Submissions Dashboard — Not Implemented on Mobile

**What It Is:** The ability for authors to log in with their credentials and view the status of their submitted works — whether pending, approved, or rejected — and receive review notes from the Admin.

**Why It Is Excluded:** The web platform does not have a robust author account system in version one — the author submission is a guest transaction tracked by email address. Replicating even a lightweight author login on mobile (with authentication state management, token storage, session handling) adds complexity that is not justified for a use case that occurs infrequently (authors submit occasionally, not daily).

**Current Workaround:** Authors receive all status updates by email (submission confirmation, approval notification with listing URL, rejection notification with reason). They can view their listing on the web platform without logging in by visiting the URL sent in the approval email. Detailed submission tracking (draft status, review notes) requires the author to contact the Admin directly or use the web platform.

**Future Consideration:** When user accounts are introduced to the platform (Phase 2), authors will have a persistent account that enables a mobile submissions dashboard.

**Impact on Current System:** The mobile submission form is guest-only. No login screen, no session tokens, and no "my submissions" screen exist in the mobile app. The form saves locally on the device (draft autosave) but has no server-side author identity.

---

### 6. Email-Based Wishlist — Replaced by Device-Local Wishlist

**What It Is:** The web platform's wishlist system, where a user enters their email address, receives a magic link, and can access their saved books from any browser using that link. The email linkage also enables automatic translation alerts — when a saved book becomes "Translated," the platform emails the user who saved it.

**Why It Is Excluded:** The email-based magic link wishlist was designed for the web's stateless, no-account model. On mobile, it is unnatural — requiring the user to enter their email just to save a book creates friction that discourages the feature's use. Mobile users expect "tap to save" without any additional steps. A device-local wishlist provides exactly that.

**Current Workaround:** The mobile wishlist is stored locally on the device. Books can be saved instantly with a single tap. The wishlist is available offline. The downside — loss on reinstall — is disclosed to the user.

**Future Consideration:** When user accounts are introduced, the mobile wishlist will be linked to the user's account, providing cross-device sync and enabling wishlist-based translation alerts on mobile.

**Impact on Current System:** The mobile wishlist is an entirely different implementation from the web wishlist. They do not share data. A user's web wishlist and mobile wishlist are independent lists. This is disclosed to users who use both.

---

### 7. WhatsApp & Telegram Subscription from Mobile — Not Implemented

**What It Is:** The ability for users to subscribe to the platform's WhatsApp broadcast channel or Telegram channel from within the mobile app — receiving book updates and personal Wish List alerts through those messaging platforms.

**Why It Is Excluded:** Push notifications delivered by the platform's backend server are the native mobile notification mechanism. WhatsApp and Telegram subscriptions are secondary channels designed for users who prefer those messaging platforms. The configuration complexity (WhatsApp Business API setup, Telegram bot integration, managing subscription opt-ins for WhatsApp numbers from mobile) is deferred in favor of a simpler, single-channel mobile notification approach (push notifications managed by the platform's backend).

**Current Workaround:** Users who want to subscribe to the platform's WhatsApp or Telegram channels can do so through the web platform or by visiting the platform's WhatsApp/Telegram profile links directly. Share buttons in the app can direct users to the platform's Telegram channel link.

**Future Consideration:** A future version can add WhatsApp and Telegram subscription flows in the Notification Settings screen of the mobile app.

**Impact on Current System:** The Notification Settings screen in the More drawer shows only the push notification toggle. No WhatsApp or Telegram subscription UI is present.

---

### 8. Wishlist Translation Alerts (Push) — Not Implemented on Mobile

**What It Is:** The automated feature on the web platform where, when a book's translation status changes to "Translated," any user who had saved that book to their Wish List receives an automatic notification (web push, email, WhatsApp, or Telegram).

**Why It Is Excluded:** This feature requires linking a saved book to a specific user identity so the system knows who to alert. The mobile wishlist is anonymous and device-local — the server has no record of which device saved which books. Without a user identity or email address tied to the wishlist, the server cannot determine who to notify when a book's status changes.

**Current Workaround:** Users who want to receive translation alerts for specific books must use the web platform's email-based Wish List, which is tied to their email address and supports the translation notification flow.

**Future Consideration:** When user accounts are introduced and the mobile wishlist is linked to a user identity, wishlist translation alerts can be extended to mobile push notifications.

**Impact on Current System:** The heart/save icon on book detail screens saves books to the local wishlist without creating any server-side record. The server has no awareness of which books a mobile user has saved.

---

### 9. Offline Content Cache — Not Implemented in Version One

**What It Is:** An automatic background caching system that stores book detail screens, article detail screens, publisher profiles, and homepage content to the device's local storage as the user browses. Cached content would be fully readable even when the device has no internet connection — appearing exactly as it did when last loaded online.

**Why It Is Excluded:** Implementing a reliable offline cache requires careful cache invalidation logic, storage management, version handling between cached and live content, and consistent offline/online state transitions across all modules. This complexity is deferred to allow the full online content experience to be delivered cleanly in version one.

**Current Workaround:** The app requires an active internet connection to load any content beyond the locally-stored cart and wishlist. When the device is offline, a clear "No internet connection" notice with a retry button is shown on all content screens.

**Future Consideration:** Offline caching is planned for a future version. When implemented, it will automatically cache book detail screens, article detail screens, and publisher profiles that the user has previously viewed — with a 7-day expiry and automatic storage management on the device.

**Impact on Current System:** No caching infrastructure exists in version one. The cart and wishlist continue to use their own local device storage (unaffected by this decision). All dynamic content screens show a connection error state rather than a cached version when the app is offline.

---

## 11. Assumptions & Constraints

### Assumptions

1. **The backend API is in production but is not yet complete for the full mobile scope.** The platform's backend API is live and actively serving the web platform in production. However, it was built primarily to support web features and has not yet been fully extended to cover all mobile-specific endpoints and behaviors required by this scope — including push notification device token registration, full cart persistence, mobile submission handling, bilingual content delivery via the `Accept-Language` header, and mobile-optimized search responses. Additional backend endpoints and updates will need to be developed and deployed as part of the mobile launch effort. The mobile team and backend team must maintain close coordination throughout development to sequence backend updates ahead of the mobile features that depend on them. CORS policies, authentication behavior, and endpoint availability will be verified and resolved as part of early integration testing.

2. **Push notifications are delivered directly by the platform's backend server.** The platform's backend manages device token registration and notification dispatch — no third-party push notification platform (such as Firebase Cloud Messaging) has been agreed as the integration point for this version. Notifications are sent by the backend server directly to device notification services.

3. **The mobile app will be distributed on both Apple App Store (iOS) and Google Play Store (Android).** Any platform-specific payment or file access policies (App Store review guidelines, Google Play billing requirements) have been reviewed and are not blocking given that no in-app payment is implemented in version one.

4. **The platform's content (books, articles, publishers) is sufficiently populated at launch.** The mobile app's user experience assumes the catalog contains at least 50 books, 5 publishers, and 10 articles. A sparse catalog at launch would undermine the app's value proposition.

5. **The web platform is in stable production and the backend is actively maintained.** The mobile app depends entirely on the backend API. Instability or downtime on the backend directly affects the mobile app. While the backend is production-stable for its current web features, it is being actively extended to support the full mobile scope — planned backend deployments and maintenance windows must be communicated to the mobile team in advance to avoid disrupting mobile development or testing.

6. **Arabic text rendering is handled by the Flutter framework with appropriate RTL support.** No custom Arabic text rendering library is required.

7. **Authors who submit a paid second submission from mobile are comfortable being redirected to the web.** The UX of the paid submission redirect (mobile → browser → web form) creates friction. It is assumed this is acceptable for the small subset of authors making paid submissions.

### Constraints

1. **No user accounts in version one.** All interactions are either anonymous (browsing, wishlist) or use a lightweight email identifier (newsletter, comments, ratings). This constrains cross-device sync, personalized push targeting, and wishlist translation alerts.

2. **No in-app payment.** The cart is present but payment cannot be processed in the app. This is a hard constraint for version one.

3. **Cart is not synced between mobile and web.** Adding books to the mobile cart does not add them to the web cart. This is a known limitation of the no-account architecture.

4. **Wishlist is device-local.** Wishlist data is not backed up to any server and is lost on reinstall. This is a known limitation accepted by the product team.

5. **All dynamic content requires an internet connection.** The app cannot load or send any dynamic data without a live connection. Content browsing, ratings, comments, search, and newsletter signups all require an internet connection. The cart and wishlist are the only features that function offline, as they use local device storage on the device.

6. **All content moderation happens on the web.** Comments submitted from mobile are not visible on mobile until approved on the web. There is no in-app moderation tool and no way to accelerate this process from mobile.

7. **Push notifications are broadcast-only in version one.** The app cannot send targeted, per-user notifications (e.g., "new book in your favorite category") because there is no user identity on the backend to target. All push notifications go to all subscribers.

### Known Risks

1. **App store review delays.** If Apple or Google require changes to the app before approval (particularly around the cart / payment lock behavior), the launch timeline may be affected.
2. **API version mismatch.** If the backend API is updated (endpoints added, changed, or removed) without coordinating with the mobile app team, screens may break. Versioning and communication protocols between the web and mobile teams must be established.
3. **Push notification delivery reliability.** In some Middle Eastern markets, underlying mobile platform notification channels may have connectivity variability. The platform's backend team should monitor notification delivery success rates by region after launch and be prepared to adjust notification dispatch logic if delivery rates are unacceptably low.
4. **PDF upload size and connectivity.** Authors uploading large PDF manuscripts over mobile data connections may experience timeouts. The 50MB limit is a constraint, but even 10–20MB files on slow connections can cause failures. Upload progress indication and retry logic are essential.
5. **Backend API development keeping pace with mobile scope.** The backend API is in production but incomplete for the full mobile scope. As mobile development progresses, gaps or missing endpoints will be discovered. If backend API updates lag behind mobile development milestones, mobile features may be temporarily blocked or require workarounds. A shared API readiness backlog — jointly maintained by the mobile and backend teams — is the primary mitigation for this risk.

---

## 12. Future Roadmap

The following features are not in scope for mobile version one but are planned for future phases. Their exclusion is intentional — not an oversight.

**User Accounts (Phase 2)**
Introducing reader accounts will unlock cross-device cart sync, persistent wishlists with translation alerts, personalized push notifications by topic or category, and an author submissions dashboard. This is the single most impactful capability gap between mobile version one and the full platform vision.

**In-App Payment (Phase 2)**
Native Stripe Mobile SDK (and Paymob Mobile SDK for regional markets) integration will allow users to complete purchases entirely within the app. This requires user accounts to support order history and receipt retrieval.

**Ambassador Dashboard on Mobile (Phase 3)**
A dedicated section for Ambassador partners to view their referral links, performance data, and earnings from the mobile app.

**Wishlist Translation Alerts via Push (Phase 2)**
Once user accounts link the wishlist to a server-side identity, translation status changes can trigger push notifications for the specific user who saved the affected book.

**Offline Content Cache (Phase 2)**
Automatic background caching of previously viewed book detail pages, article detail screens, and publisher profiles. Cached content will be fully readable without an internet connection, with a 7-day cache expiry, automatic storage management, and a read-only offline state across all cached screens.

**WhatsApp & Telegram Subscription from Mobile (Phase 2)**
Integrated subscription flows in the Notification Settings screen allowing users to opt in to WhatsApp and Telegram channels without leaving the app.

**Paid Submission Flow on Mobile (Phase 2)**
With in-app payment available, authors making paid (subsequent) submissions can complete the payment step natively rather than being redirected to the web browser.

**Admin Light Mobile Features (Phase 3)**
A limited set of time-sensitive admin capabilities — comment approval, submission review, new order alerts — available as a dedicated Admin mode for authenticated admin team members.

**B2B Client Portal on Mobile (Phase 4)**
A dedicated view for institutional subscribers to access their content packages from the mobile app.

---

## 13. Open Questions & Ambiguities

The following questions were unresolved at the time this scope was written. They must be resolved before the affected module is built.

**OQ-M-01: Paid submission form data transfer to web**
When a mobile user is redirected to the web for a paid submission, the form data they entered on mobile is not pre-filled on the web. The author must re-enter all their information. Is this acceptable for version one, or should a draft save mechanism be implemented so the web form can pre-populate from a server-side draft ID?

**OQ-M-02: Minimum app catalog size at launch**
How many books, articles, and publishers must be present in the catalog before the mobile app is released to the public? A sparse catalog at launch could result in negative reviews affecting App Store ratings. A minimum catalog size should be agreed upon before the launch date.

**OQ-M-03: App Store payment policy review**
Apple's App Store guidelines require review of any app that shows purchase prices but does not complete the transaction in-app. The cart + web redirect approach needs to be reviewed against the latest App Store guidelines to confirm it does not trigger a "reader app" policy issue.

**OQ-M-04: Deep link strategy for push notifications on web-to-mobile redirect**
When the "Complete on Web" button opens the browser and the user completes a purchase, should the web platform deep-link back to the app (e.g., to show an "Order confirmed" screen)? If yes, the URL scheme for mobile deep links must be defined.

**OQ-M-05: Article channel categorization in mobile navigation**
The mobile app groups all 6 article/media channels under one "Articles" bottom nav tab. Should Watch Your Book, Book Talk, and Novel & Story (media channels) be separated from the text editorial channels (World Reads, Book Harvest, Essence of Ideas) in a dedicated "Media" section? Or is the single unified Articles/Media hub the preferred approach?

**OQ-M-06: Cache storage limit and user disclosure** *(Resolved — Deferred)*
Offline content caching is not implemented in version one (see Section 10 — Out-of-Scope Declaration 9). This question is deferred to the phase where offline caching is introduced.

**OQ-M-07: App icon, splash screen, and brand assets**
Mobile-specific brand assets (app icon, splash screen, loading animation) have not been defined. These must be designed and approved before app store submission.

---

*This document is the authoritative scope for the Books Platform mobile application, version 1.0. It supersedes any informal requirements, notes, or verbal agreements made prior to its publication. Any changes to this scope must be formally recorded as a version update to this document.*
