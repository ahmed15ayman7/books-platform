# Feature Specification: Books Platform Mobile Application

**Feature Branch**: `001-books-platform-mobile`

**Created**: 2026-06-02

**Status**: Draft

**Sprint Methodology**: One Sprint (accelerated delivery — client urgency)

---

## Overview

Books Platform (منصة الكتب العالمية) is a Flutter-built mobile companion to the Books Platform web experience. It brings global book discovery, six editorial and media channels, publisher profiles, full-text search, and an author submission workflow to iOS and Android — optimized for mobile interaction patterns: thumb-reachable navigation, swipe-driven browsing, and native push notifications dispatched by the platform's backend server.

The app operates without user accounts. All interactions are either fully anonymous (browsing, wishlist) or use a lightweight email identifier (newsletter, comments, ratings, author submissions). It consumes the same REST API that powers the web platform.

**Delivery platform**: iOS (App Store) + Android (Google Play)
**Default language**: Arabic (RTL); bilingual AR/EN with instant layout switching
**Design canvas**: 390 × 844 (ScreenUtil)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Core Content Discovery: Browse Books, Read Details, Save to Wishlist (Priority: P1)

A reader opens the app, browses the homepage discovery feed and the book catalog, opens a book detail page to read full bibliographic information and the summary, saves the book to their device-local wishlist, and submits a 5-star rating.

**Why this priority**: The book catalog and detail page are the app's central value. Everything else drives users to these screens. Without a working catalog and detail screen, no other module is useful.

**Independent Test**: Install the app on a fresh device. Navigate the homepage, open the catalog, filter by a category, tap a book, save it to the wishlist, and submit a rating. Delivers the full core reader loop.

**Acceptance Scenarios**:

1. **Given** the app loads on a connected device, **When** the user opens the homepage, **Then** the hero carousel, latest books grid, categories row, editorial highlights, publisher spotlight, and platform statistics all render with live data.
2. **Given** the user is on the homepage, **When** they tap a category chip, **Then** the catalog opens pre-filtered to that category.
3. **Given** the catalog is open, **When** the user taps the Filter button and selects "French" language + "Philosophy & Culture" category and taps "Apply Filters," **Then** the grid shows only French Philosophy books; if zero results, displays "No books found matching your filters" with a "Clear Filters" button.
4. **Given** the user is on a book detail screen, **When** they tap the heart icon (book not yet saved), **Then** the icon fills and a toast "Added to Wishlist" appears; tapping again removes it.
5. **Given** the user taps 4 stars in the Submit Rating section, **Then** the aggregate rating updates immediately and "Thank you for your rating" replaces the input; the user cannot re-rate in the same session.
6. **Given** the device has no internet connection, **When** the user opens any content screen, **Then** a "No internet connection" notice with a retry button is shown; the wishlist screen still shows saved books from local storage.

---

### User Story 2 — App Shell, Navigation & Language Toggle (Priority: P1)

A user navigates the app using the five-tab bottom navigation bar, accesses secondary screens via the "More" drawer, and switches the app language between Arabic (RTL) and English (LTR) without losing their current screen or form data.

**Why this priority**: The shell is the foundation every other module rests on. Navigation and RTL/LTR correctness must be verified before any feature screen is testable.

**Independent Test**: Launch the app. Navigate through all five bottom tabs and all items in the More drawer. Toggle the language — verify RTL/LTR layout, navigation direction, and all strings switch instantly. Return to the same screen you were on.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the user taps each bottom nav tab (Home, Books, Articles, Publishers, More), **Then** each navigates to its root screen; tapping the active tab scrolls to the top.
2. **Given** the user is on any screen, **When** they tap the language toggle (AR/EN), **Then** the entire app layout, text direction, and all UI strings switch instantly — no partial mix of languages.
3. **Given** the user has Arabic selected, **When** they switch to English and then back to Arabic, **Then** their language preference persists across app restarts.
4. **Given** the user is mid-form (e.g., step 2 of the submission wizard), **When** they toggle the language, **Then** the language switches but all form data is preserved.
5. **Given** an English content item has no English translation, **When** the app is in English mode, **Then** the Arabic content is shown with the notice "English version coming soon / النسخة الإنجليزية قريباً."
6. **Given** the cart icon is in the top app bar, **When** the user adds a book to the cart, **Then** the cart badge count updates in real time on every screen.

---

### User Story 3 — Editorial & Media Channels: Read Articles, Watch Videos, Listen to Podcasts (Priority: P2)

A reader opens the Articles section, browses all three text channels (World Reads, Book Harvest, Essence of Ideas) and three media channels (Watch Your Book, Book Talk, Novel & Story), reads a full article, comments on it, plays a podcast episode, and watches a video.

**Why this priority**: The six editorial/media channels are the platform's intellectual backbone and a primary driver of user engagement and return visits.

**Independent Test**: Navigate to the Articles tab. Browse all six channel tabs. Open a long-form essay, scroll to the end, submit a comment. Navigate to Book Talk and press Play on an episode. Navigate to Watch Your Book and play a video. Confirm all flows work independently.

**Acceptance Scenarios**:

1. **Given** the user opens the Articles tab, **When** they tap the "Book Harvest" channel tab, **Then** a list of Book Harvest articles appears; each shows a featured image, channel badge, headline, excerpt, and date.
2. **Given** the user opens an Essence of Ideas article (800+ words), **Then** the full text renders in clean mobile typography; a thin reading-progress indicator appears at the top of the screen.
3. **Given** a Book Harvest article is linked to 3+ books, **Then** all linked books appear in a scrollable row within the article body.
4. **Given** the user submits a comment on an article, **Then** the success message "Your comment has been submitted and is awaiting review" appears; the comment is not immediately visible in the comment list.
5. **Given** the user opens a Watch Your Book entry, **Then** the YouTube embed player loads in 16:9 full-width; the linked book card with "View Book" is visible above the player.
6. **Given** the user opens a Book Talk podcast episode, **Then** the in-app audio player shows play/pause, seek bar, duration, and playback speed (1×, 1.25×, 1.5×, 2×).
7. **Given** a Novel & Story video entry is opened, **Then** the AI production disclosure "This video was produced with the assistance of AI tools" is always visible — no exceptions.

---

### User Story 4 — Global Search with Autocomplete (Priority: P2)

A reader taps the search bar and types a keyword. Live autocomplete suggestions appear after 2+ characters. The reader taps a suggestion or submits the search and sees results grouped by Books, Articles, and Publishers.

**Why this priority**: As the catalog grows, search is the fastest path to a specific item. It must work correctly before launch so users are not forced to scroll through the full catalog.

**Independent Test**: Open the app. Tap the search bar. Type a 2-character query and verify autocomplete suggestions appear within 300ms of typing pause. Tap a suggestion and verify direct navigation to the item. Submit a full search and verify tabbed results.

**Acceptance Scenarios**:

1. **Given** the search screen opens, **Then** it shows "Recent Searches" (last 5, stored locally) and "Popular Searches" (server-loaded).
2. **Given** the user types 1 character, **Then** no autocomplete is shown (minimum 2 characters required).
3. **Given** the user types 3+ characters and pauses for 300ms, **Then** up to 5 autocomplete suggestions appear, each labeled by type (Book / Publisher / Article).
4. **Given** the user submits a search, **Then** results are organized in tabs: "All," "Books," "Articles," "Publishers"; each result shows a thumbnail, type label, title, and excerpt.
5. **Given** zero results are found, **Then** "No results found for '[query]'" is shown with suggestions to try different keywords or browse by category.
6. **Given** the device is offline, **Then** autocomplete is disabled and submitting a search shows "Search requires an internet connection."
7. **Given** a search query contains Arabic diacritics (e.g., "كِتَاب"), **Then** results match the normalized form ("كتاب").

---

### User Story 5 — Publisher Directory & Profiles (Priority: P2)

A user browses the publisher directory, searches by name, filters by country, and opens an individual publisher profile page showing full details, website link, contact email, and linked book catalog.

**Why this priority**: Translators and rights buyers depend on publisher profiles for contact information. The directory is a core reference tool for the platform's B2B audience.

**Independent Test**: Navigate to the Publishers tab. Search for a publisher by partial name. Filter by a specific country. Open a publisher profile. Verify website link opens in browser. Verify contact email opens the device's mail app.

**Acceptance Scenarios**:

1. **Given** the publisher directory is open, **Then** sponsored publishers appear first with a visible "Sponsored" badge above all non-sponsored publishers.
2. **Given** the user searches for a publisher name, **Then** the list filters in real time to matching publishers.
3. **Given** the user opens a publisher profile, **Then** the profile shows: banner image, logo, name (Arabic + original language), country, website link, contact email, description, and a grid of the publisher's books.
4. **Given** the publisher's "Books from This Publisher" grid has more than 12 books, **Then** a "Load More" button appears after the initial 12.
5. **Given** a publisher has no website, **Then** the website field shows "Not available" and is not tappable.
6. **Given** the user taps the contact email, **Then** the device's email app opens with the publisher's email pre-filled.

---

### User Story 6 — Author Submission Wizard: Publish Your Book (Priority: P2)

An author accesses the "Publish Your Book" form, completes all three steps (author info → book info → review & submit), uploads a PDF manuscript from Google Drive and a cover image from the gallery, and submits. The eligibility check confirms their first submission is free.

**Why this priority**: Author submissions are a key differentiator of the platform. The full 3-step native form with PDF upload on mobile is a flagship capability not available in web-first form.

**Independent Test**: Navigate to More → Publish Your Book. Fill in all required fields across all three steps. Upload a PDF under 50MB and a JPG cover image. Complete the review screen and tap Submit. Verify the full-screen success state and confirm the draft is cleared.

**Acceptance Scenarios**:

1. **Given** the author enters their email on Step 1 and loses focus, **Then** the eligibility check fires; if first submission, a green badge "Your first submission is free" appears immediately below the email field.
2. **Given** the eligibility check shows "paid submission required," **Then** Step 3 shows "Continue to Web for Payment" instead of "Submit My Work."
3. **Given** the author taps "Choose Manuscript (PDF)" on Step 2, **Then** the OS file picker opens; selecting a PDF from Google Drive, iCloud, or local storage is supported.
4. **Given** the author selects a PDF larger than 50MB, **Then** the picker shows "File too large. Maximum allowed size is 50MB" immediately.
5. **Given** the author completes Steps 1 and 2 and exits the app, **When** they reopen the app, **Then** a "Resume Draft" banner appears on the Publish Your Book entry screen.
6. **Given** the author submits a valid free submission, **Then** the full-screen success state shows "Your work has been submitted! / تم إرسال عملك بنجاح" with next-steps messaging.
7. **Given** the submission is attempted while offline, **Then** the Submit button is disabled and "Internet connection required to submit" is shown.
8. **Given** Step 3 contains a content standards checkbox, **Then** the Submit button is disabled until the checkbox is checked.

---

### User Story 7 — Shopping Cart with Web Checkout Handoff (Priority: P2)

A reader adds books to the cart from book detail screens, reviews cart contents with quantity management, views the pricing summary, and taps "Complete on Web" to be directed to the platform's web checkout in the device browser.

**Why this priority**: The cart preserves purchase intent on mobile even without in-app payment. It is the bridge between mobile discovery and web checkout.

**Independent Test**: Add two books with Direct Purchase status to the cart. Open the cart. Increment quantity of one book. Remove the other. Verify the total updates in real time. Tap "Complete on Web" and confirm the device browser opens.

**Acceptance Scenarios**:

1. **Given** a book has "Direct Purchase" status, **When** the user taps "Add to Cart" on the book detail screen, **Then** the cart badge increments and a toast "Added to cart" appears.
2. **Given** the same book is added twice, **Then** the quantity is incremented — no duplicate line item is created.
3. **Given** the user taps the trash icon on a cart item and confirms, **Then** the item is removed and an "Undo" option is available for 3 seconds.
4. **Given** a book in the cart has been removed from the catalog, **Then** it is flagged "This item is no longer available" and excluded from the total.
5. **Given** a book's price has changed since it was added to the cart, **Then** a banner "Price updated: [Book Title] is now [new price]" is shown when the cart is opened.
6. **Given** the user taps "Complete on Web," **Then** the device browser opens to the web platform's cart page; the cart disclosure note states "Your mobile cart is stored on this device and is not synced with the web platform."
7. **Given** the device is offline, **Then** the "Complete on Web" button shows "Internet connection required to proceed" rather than opening the browser.

---

### User Story 8 — Push Notifications Opt-In and Deep Linking (Priority: P2)

A user opens the app for the first time, sees the soft pre-prompt, grants notification permission, and later receives a push notification for a new book that deep-links directly to the book detail screen.

**Why this priority**: Push notifications are the mobile-native retention mechanism — the feature that brings users back without requiring them to open the app.

**Independent Test**: Install the app on a fresh device. Verify the soft pre-prompt appears only on first launch. Grant permission. From the backend, trigger a new-book notification. Verify the notification appears on the lock screen and tapping it opens the correct book detail screen from a cold start.

**Acceptance Scenarios**:

1. **Given** it is the user's first app launch, **Then** the soft pre-prompt appears exactly once: "Stay updated on new books and articles — allow notifications?" with Allow and Not Now buttons.
2. **Given** the user taps "Allow" on the pre-prompt, **Then** the OS permission dialog is shown; granting registers the device token with the platform's backend.
3. **Given** the user taps "Not Now," **Then** the OS dialog is not shown; the user can enable notifications later via More → Notification Settings.
4. **Given** the backend dispatches a "New Book Published" notification, **Then** the notification appears on the device (even from a cold start) and tapping it opens the specific book detail screen.
5. **Given** the backend dispatches an "Admin Broadcast" notification, **Then** tapping it opens the app or a specified deep link.
6. **Given** the app is reinstalled, **Then** the user is treated as a new installation and the permission opt-in flow begins again.

---

### User Story 9 — Newsletter Subscription with Double Opt-In (Priority: P3)

A user enters their email in the newsletter strip on the homepage (or any other signup location), receives a confirmation success message in the app, and confirms their subscription via the email they receive.

**Why this priority**: Newsletter subscription is a retention tool but secondary to content discovery. It requires only a simple form and an API call.

**Independent Test**: Enter a valid email in the homepage newsletter strip. Tap Subscribe. Verify the success message shows the correct email address and a "Resend" link after 60 seconds. Verify that entering an already-subscribed email shows the appropriate message.

**Acceptance Scenarios**:

1. **Given** the user submits a valid email in the newsletter form, **Then** the success message "A confirmation email has been sent to [email]. Please confirm your subscription" appears.
2. **Given** the email is already subscribed, **Then** the message "This email is already subscribed" is shown.
3. **Given** the user does not receive the confirmation email, **When** 60 seconds have passed, **Then** a "Resend confirmation email" link becomes active.
4. **Given** the device is offline, **Then** the Subscribe button is disabled and "Internet connection required to subscribe" is shown.

---

### User Story 10 — Static Informational Pages and Contact Form (Priority: P3)

A user accesses About Us, Team, Contact Us, Privacy Policy, and Terms of Use from the More drawer. They fill in the Contact form and submit a message.

**Why this priority**: Required for app store compliance (Privacy Policy, Terms of Use) and user trust (About Us, Contact). Low complexity.

**Independent Test**: Open each static page from the More drawer. Verify content loads. Fill in the Contact form with name, email, subject, and message. Submit and verify the success message.

**Acceptance Scenarios**:

1. **Given** the user opens Privacy Policy or Terms of Use, **Then** the full text loads from the server; content reflects the latest version managed on the web Admin panel.
2. **Given** the Privacy Policy has been updated since the user last opened the app, **Then** a notice "Our Privacy Policy has been updated. Please review the changes" appears on app launch; the user can dismiss it.
3. **Given** the user submits the Contact form with all required fields, **Then** "Your message has been sent. We will respond within [X] business days" is shown.

---

### Edge Cases

- **Homepage with no internet on first load**: Full-screen "No connection" message with a retry button; no partial data is shown.
- **Returning to app without connection**: Same full-screen notice; no cached content is shown (offline cache is out of scope for v1).
- **Hero carousel with one slide**: No dots indicator and no auto-advance.
- **Statistics API error**: Stat tiles show dashes (–) — never zero when content exists.
- **Book detail with no cover image**: Publisher logo or book-silhouette placeholder is shown.
- **Book removed from catalog (404)**: Book detail screen shows "This book is no longer available" with a button to return to catalog.
- **Author with multiple names**: All names displayed comma-separated.
- **Cart cold start (app restart)**: App fetches current prices and availability for all cart items on launch; unavailable items are removed with a single notification to the user.
- **Comment pre-fill email change**: After submitting a comment with different details, the app asks once: "Update your saved name and email?" with Yes / No options.
- **Comment character limit**: A character counter appears below the text field, turning red when within 100 characters of the 2,000-character limit.
- **PDF upload timeout**: Upload progress indicator is shown; if the upload fails mid-submission, all previously entered form data is retained and the user must only re-select the file.
- **Video made private on YouTube**: The embedded player shows a standard YouTube error; the rest of the screen remains accessible.
- **Audio unavailable**: Player shows "This episode is currently unavailable."
- **Phone call while playing audio**: Audio pauses automatically (OS behavior); user can resume.
- **Cart badge while offline**: The cart badge reflects the locally stored cart state and MUST NOT reset to zero when the device has no internet connection.
- **Article with deleted linked book**: If a book linked to an article has been deleted from the catalog, the related book card is hidden; the article body remains fully readable.
- **Push notification token after app update**: The token is preserved across app updates. If the OS issues a new token for any reason, the app re-registers with the platform's backend automatically on next launch.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Module 1 — App Shell & Navigation

- **FR-001**: The app MUST display a persistent bottom navigation bar with five tabs: Home, Books, Articles, Publishers, More.
- **FR-002**: The top app bar MUST show the screen title (in the active language), a cart icon with a live item count badge, and a language toggle (AR / EN) on every screen; sub-screens (book detail, article detail, publisher profile, etc.) MUST show a back arrow.
- **FR-003**: The "More" tab MUST open a bottom sheet or drawer linking to: Books Recommended for Translation, Translated Books, Publish Your Book, My Wishlist, About Us, Contact Us, Privacy Policy, Terms of Use, and Notification Settings.
- **FR-004**: The language toggle MUST switch the entire app between Arabic (RTL) and English (LTR) instantly with no app restart; the preference MUST persist across sessions.
- **FR-005**: On first app launch only, the app MUST show a soft push notification pre-prompt before triggering the OS permission dialog; "Not Now" prevents the OS dialog from appearing.
- **FR-006**: If an item has no English version when the app is set to English, the Arabic content MUST be shown with the notice "English version coming soon / النسخة الإنجليزية قريباً."

#### Module 2 — Homepage & Discovery Feed

- **FR-007**: The homepage MUST render (top to bottom): hero carousel, latest books grid (2-column, up to 12), categories quick-access row (7 chips), featured editorial article card, books recommended for translation preview row, media highlights row, publisher spotlight row, platform statistics (4 counters), and newsletter signup strip.
- **FR-008**: The hero carousel MUST auto-advance every 5 seconds; manual swipe MUST override auto-advance; a dots indicator MUST appear only when there are 2+ slides.
- **FR-009**: Platform statistics MUST show live server data; when offline or on API error, all four tiles MUST show dashes (–) — never zero.
- **FR-010**: Sponsored publishers MUST appear first in the publisher spotlight row, marked with a "Sponsored" badge.
- **FR-011**: Content sections with no items MUST be hidden entirely — no blank space or permanent loading indicator.
- **FR-011b**: The homepage Latest Books grid reflects the Admin's editorial curation settings; within that curated set, books the user has viewed more during the current session MUST be weighted toward the top. This session-based personalization resets completely when the app is fully closed.

#### Module 3 — Book Catalog & Filtering

- **FR-012**: The catalog MUST support filters (category, original language, translation status, publisher, purchase availability) via a bottom sheet; filters are additive (AND logic).
- **FR-013**: The catalog MUST support sort by Newest (default), A–Z, and Most Viewed; sort resets to Newest on app relaunch.
- **FR-014**: Active filters MUST be shown as removable chips below the search bar.
- **FR-015**: The catalog MUST use infinite scroll pagination loading 12 books per page; when all results are loaded, "You've seen everything" MUST appear at the bottom.
- **FR-015b**: All active filters MUST be cleared when the user navigates away from the catalog and returns via a bottom navigation tab tap (the tab tap resets the catalog to its root state).
- **FR-016**: Session-based personalization MUST weight books from categories the user has browsed in the current session toward the top of the unsorted view; this resets completely on app close.

#### Module 4 — Book Detail Page

- **FR-017**: The book detail screen MUST display: cover image, Arabic title, original-language title, author name(s), publisher name (tappable), publication year, original language, ISBN, category badge (tappable), and translation status badge (color-coded).
- **FR-018**: The purchase section MUST show: "Add to Cart" button for Direct Purchase books; "Buy from Publisher" button (opens device browser) for Referral books; "Currently Unavailable" for unavailable books.
- **FR-019**: The wishlist heart icon MUST reflect actual saved state at all times; tapping it MUST toggle save/remove with immediate visual feedback and a toast.
- **FR-020**: The submit rating section MUST accept 1–5 star input; one rating per book per device session; after submission it becomes read-only.
- **FR-021**: Comments MUST only display Admin-approved comments; pending and rejected comments are never shown.
- **FR-022**: The "Similar Books" row MUST show up to 6 books from the same category; it MUST be hidden if fewer than 2 exist; the current book MUST never appear in its own recommendations.

#### Module 5 — Books Recommended for Translation

- **FR-023**: This section MUST show only books flagged by the Admin as "Recommended for Translation"; it MUST filter by original language, category, and publisher country.
- **FR-024**: When a book's status is updated to "Translated," it MUST automatically move to the Translated Books section on the next app data refresh.
- **FR-025**: A visible notice MUST state: "Translation rights availability must be confirmed directly with the publisher."

#### Module 6 — Translated Books Section

- **FR-026**: Each entry MUST display the original title and author alongside the Arabic title; both a "Translated" green badge and the original language must be shown.
- **FR-027**: Multiple translations of the same original work MUST appear as separate entries.

#### Module 7 — Publisher Directory & Profiles

- **FR-028**: The directory MUST support keyword search (publisher name) and filter by country and type (Arab / International); sponsored publishers MUST always appear at the top.
- **FR-029**: Each publisher profile MUST show: banner, logo, name (Arabic + original), country, website link (opens browser), contact email (opens mail app), description, and a paginated grid of their books.

#### Module 8 & 9 — Editorial and Media Channels

- **FR-030**: The Articles section MUST provide tabs for all six channels; each channel MUST list articles/media in reverse chronological order with featured image, channel badge, headline, excerpt, and date.
- **FR-031**: Article detail screens MUST render full body text; the share button MUST open the device native share sheet. For **Essence of Ideas** articles, the single linked book's cover, title, and "View Book" button MUST be displayed prominently directly below the headline. For **World Reads** articles, when a related book link exists it MUST be displayed prominently in the article body. For **Book Harvest** articles, all linked books appear in a scrollable row (see FR-032). For all channels, if the linked book has been deleted from the catalog, the book card is hidden but the article remains readable.
- **FR-032**: Book Harvest articles MUST display a scrollable row of all linked books (minimum 3) and MUST show a report period label (e.g., "May 2026") below the article headline.
- **FR-033**: Every Novel & Story video entry MUST carry the AI production disclosure — no exceptions.
- **FR-034**: Watch Your Book and Novel & Story MUST embed YouTube videos via the YouTube player (full-width, 16:9); no in-app video hosting.
- **FR-035**: Book Talk MUST include an in-app audio player with play/pause, seek bar, duration, and playback speed controls (1×, 1.25×, 1.5×, 2×).
- **FR-036**: Long articles (10,000+ words) MUST render the full text without truncation and MUST display a thin reading-progress indicator at the top of the screen.

#### Module 10 — Global Search & Autocomplete

- **FR-037**: Search MUST display recent searches (last 5, local) and popular searches (server) before the user types.
- **FR-038**: Autocomplete MUST trigger after a minimum of 2 characters and 300ms of typing inactivity; up to 5 suggestions labeled by type.
- **FR-039**: Search results MUST be organized in tabs: All, Books, Articles, Publishers; sorted by relevance by default with a "Sort by Newest" option.
- **FR-040**: Search MUST handle Arabic diacritics via normalized matching.

#### Module 11 — Shopping Cart

- **FR-041**: Only books with "Direct Purchase" status can be added to the cart; the cart MUST store items in local device storage across sessions.
- **FR-042**: Quantity can be increased or decreased; minimum quantity is 1; removing an item requires confirmation with a 3-second "Undo" option.
- **FR-043**: The "Proceed to Checkout" button MUST be labelled "Complete on Web" and MUST open the platform's web cart URL in the device browser — it MUST never process payment.
- **FR-044**: The cart MUST display a clear disclosure: "Your mobile cart is stored on this device and is not synced with the web platform."
- **FR-045**: Cart items MUST be validated for availability and current price on app launch; unavailable items are removed with a user notification; price changes MUST be disclosed via a banner.

#### Module 12 — Device-Local Wishlist

- **FR-046**: The wishlist MUST be stored entirely on the device; no email, account, or server record is created. There is no limit to the number of books a user can save to the wishlist.
- **FR-047**: The wishlist screen MUST show saved books with an "Add to Cart" shortcut for Direct Purchase books; books no longer in the catalog MUST be marked "No longer available on the platform."
- **FR-048**: A clear disclosure MUST appear in the wishlist screen: "Your wishlist is stored on this device only. Reinstalling the app will clear your wishlist."

#### Module 13 — Ratings & Comments

- **FR-049**: Rating submission MUST require 1–5 stars; a written comment is optional when submitting a rating alone; a rating is optional when submitting a comment alone.
- **FR-050**: Comment submission MUST require: display name (2–100 chars), email (valid format, not shown publicly), comment text (10–2,000 chars); a character counter MUST appear and turn red within 100 characters of the limit.
- **FR-051**: The commenter's display name and email MUST be stored locally and pre-filled on subsequent submissions; the user can edit them before submitting.
- **FR-052**: All submitted comments MUST go through Admin approval before becoming visible; the submitter sees "Your comment is awaiting review" — never a live preview.
- **FR-052b**: Readers MUST NOT be able to delete or edit their own submitted comments from the mobile app. Comment management (approve, edit, hide, delete) is performed exclusively by the Admin on the web platform.

#### Module 14 — Publish Your Book (Guest Submission)

- **FR-053**: The submission wizard MUST have exactly 3 steps with a progress bar; a Back button on Steps 2 and 3 MUST not lose data. The form MUST be accessible from three entry points: the More drawer, a call-to-action card on the homepage, and Admin-configurable promotional banners in the Articles hub.
- **FR-054**: On Step 1, entering the author's email MUST trigger a real-time eligibility check; first submission = green badge "free"; subsequent = amber badge with fee amount and web redirect notice. Step 1 MUST display a statement at the bottom: "Your work remains your intellectual property. The platform serves only as a visibility channel."
- **FR-055**: On Step 2, the cover image picker MUST support gallery and camera; the file picker MUST support PDF selection from device storage, Google Drive, iCloud, Dropbox, or any OS-accessible source; PDF MUST be capped at 50MB.
- **FR-056**: Step 3 MUST show a complete read-only review summary and a required content standards confirmation checkbox; for free submissions, "Submit My Work" is shown; for paid, "Continue to Web for Payment" redirects to the web browser.
- **FR-057**: The form MUST autosave to local device storage after every step transition; a "Resume Draft" banner MUST appear when returning to the entry screen with an incomplete draft.
- **FR-058**: On successful free submission, a full-screen success state MUST be shown with a "Submit Another Work" button (which resets the entire form to empty state) and a "Back to Home" button.
- **FR-059**: Submission MUST be blocked when offline; the Submit button MUST be disabled with the message "Internet connection required to submit."

##### Step 1 Validation
| Field | Rules |
|---|---|
| Author Full Name | Required, 2–100 characters |
| Author Email | Required, valid email format |
| Author Phone | Required, valid phone format with country prefix |
| Author Biography | Required, 50–1,200 characters; character counter shown |

##### Step 2 Validation
| Field | Rules |
|---|---|
| Book Title (Arabic) | Required, max 500 characters |
| Book Type | Required dropdown: Novel / Short Stories / Poetry / Academic Dissertation / Other |
| Book Summary | Required, 100–2,000 characters; character counter shown |
| Book Language | Required dropdown: Arabic, English, French, German, Spanish, Other |
| Book Category | Required dropdown: Novel / Short Stories / Poetry / Academic / Other |
| Cover Image | Required, JPG/PNG/WEBP, min 300px wide (warning if below, not blocking) |
| Manuscript File | Optional, PDF only, max 50MB |
| Allow Free Download | Required toggle only when manuscript file is provided |

#### Module 15 — Newsletter Subscription

- **FR-060**: Newsletter signup MUST be available from: the homepage strip, article footers, and a dedicated Subscribe screen in the More drawer.
- **FR-061**: Double opt-in is mandatory; no subscriber is added to the active list without email confirmation.
- **FR-062**: If the submitted email is already subscribed, the message "This email is already subscribed" MUST be shown; previously unsubscribed emails require re-confirmation.
- **FR-063**: Unsubscription MUST only be performed via the one-click unsubscribe link in emails — it CANNOT be done from within the mobile app.
- **FR-064**: A "Resend confirmation email" link MUST become active 60 seconds after the initial subscription attempt.
- **FR-064b**: The newsletter email field MUST enforce a maximum of 254 characters; validation MUST fire on submission attempt — not while the user is typing.

#### Module 16 — Push Notifications

- **FR-065**: The app MUST support three notification types dispatched by the platform's backend server: New Book Published, New Article Published, and Admin Broadcast.
- **FR-066**: Every notification MUST include a deep link; tapping MUST open the specific screen from both cold start and background state.
- **FR-067**: The platform MUST NOT send more than 3 push notifications per day to any single device (enforced server-side).
- **FR-068**: If the user has disabled notifications at the OS level, the app MUST respect that decision and MUST NOT show in-app fallback prompts; it provides only a shortcut button that opens the device's system notification settings for the app.
- **FR-068b**: If the device's push notification token changes for any reason (e.g., after an OS update), the app MUST automatically re-register the new token with the platform's backend without any user action.

#### Module 17 — Static Pages

- **FR-069**: Privacy Policy and Terms of Use content MUST be fetched from the server; changes made on the web Admin panel MUST be reflected in the app on next load.
- **FR-070**: If the Privacy Policy has been updated since the user last accepted it, a notice MUST appear on app launch; the user can dismiss it.
- **FR-071**: The Privacy Policy MUST disclose: push notification delivery and device token registration, anonymous session data, and all locally stored data (cart, wishlist, draft submission, commenter identity, recent searches).

---

### Cross-Cutting Business Rules

- **Rule: Admin Approval Gate** — No user-generated content (comments, ratings, submissions) becomes publicly visible without Admin approval on the web platform.
- **Rule: Cart Payment Lock** — The mobile cart MUST never process payment. The checkout button MUST always redirect to the web. No exceptions in v1.
- **Rule: Cart Non-Sync** — The mobile cart is device-local. It MUST NOT sync with the web cart. The user is informed of this clearly in the cart screen.
- **Rule: Wishlist is Device-Local** — The wishlist is not backed up, not server-synced, and is lost on reinstall. Disclosed to the user.
- **Rule: No Wishlist Translation Alerts on Mobile** — The anonymous device-local wishlist has no server-side identity linkage; translation status alerts are not possible in v1.
- **Rule: Notification Daily Limit** — Maximum 3 push notifications per day per device (backend-enforced).
- **Rule: First Submission Free, Paid → Web** — First book submission by email address is free and fully completable in-app; subsequent submissions require payment which redirects to the web.
- **Rule: Sponsored Content Labeled** — All sponsored publisher placements carry a visible "Sponsored" badge.
- **Rule: Arabic First, English Optional** — All content is created in Arabic; English is secondary. Missing English content shows Arabic with a "coming soon" notice — no blank screens.
- **Rule: No Admin Functions on Mobile** — Zero admin screens, routes, or API calls exist in the mobile app.
- **Rule: Statistics Must Reflect Reality** — Stat counters display live server data; never show zero when content exists; show dashes (–) when offline or on error.

---

### Key Entities

- **Book**: Arabic title, original-language title, author name(s), publisher (linked), publication year, original language, ISBN, category, translation status (Not Translated / Recommended / Translated), purchase availability (Direct / Referral / Unavailable), price, cover image URL, Arabic summary, English summary (optional), aggregate rating.
- **Article**: Channel (one of six), headline (Arabic + English optional), featured image, body text, author byline, publication date, linked books (0–N for World Reads/Book Harvest, exactly 1 for Essence of Ideas), report period label (Book Harvest only).
- **MediaEntry**: Channel (Watch Your Book / Book Talk / Novel & Story), title, thumbnail, YouTube URL or audio URL, duration, linked book (optional for Book Talk, mandatory for Watch Your Book), AI disclosure flag (Novel & Story).
- **Publisher**: Name (Arabic + original language), country, type (Arab / International), logo, banner image, description, website URL, contact email, sponsored flag.
- **CartItem**: Book reference, quantity, price snapshot, availability status.
- **WishlistItem**: Book reference, Arabic title, cover URL, price (if available), availability status.
- **Comment**: Display name, email (private), comment text, star rating (optional), status (pending / approved / hidden / rejected), target type (book / article), target ID.
- **SubmissionDraft**: Author name, email, phone, biography, book title, book type, book summary, book language, book category, cover image (local path), manuscript file (local path), allow download flag, eligibility status.
- **PushNotificationToken**: Device token, platform (iOS / Android), registered timestamp.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can discover, open, and save a book to their wishlist in under 60 seconds from app launch.
- **SC-002**: The book catalog loads within 2 seconds on a standard 4G connection.
- **SC-003**: Autocomplete search suggestions appear within 500ms of typing pause on a standard device.
- **SC-004**: An author can complete and submit the full 3-step submission form (including PDF file selection) in a single session without errors.
- **SC-005**: The app language switches between Arabic and English in under 300ms with no visible flash or blank screen.
- **SC-006**: Push notification deep links open the correct screen in under 3 seconds from a cold start.
- **SC-007**: Zero user-visible errors occur when the device loses internet connection — all screens show appropriate "No internet connection" states.
- **SC-008**: The cart persists all items correctly across app restarts without data loss.
- **SC-009**: The wishlist accurately reflects saved/unsaved state at all times, including after the app is closed and reopened.
- **SC-010**: All 17 modules function correctly on both iOS (App Store) and Android (Google Play) without platform-specific crashes or layout regressions.
- **SC-011**: RTL layout (Arabic) and LTR layout (English) render correctly and symmetrically on all supported screen sizes — no directional icons, text alignment, or spacing regressions.

---

## Assumptions

- The platform's backend REST API is in production but not yet fully extended for the mobile scope. Additional endpoints (push notification token registration, mobile submission handling, bilingual content via `Accept-Language`, mobile search) will be developed in coordination between the mobile and backend teams. A shared API readiness backlog is the primary risk mitigation.
- Push notifications are dispatched directly by the platform's backend server — no third-party push service (e.g., Firebase Cloud Messaging) has been agreed for this version.
- The app will be distributed on both Apple App Store (iOS) and Google Play (Android). The cart + web redirect approach has been reviewed against App Store guidelines (OQ-M-03 open question — must be verified before submission).
- The content catalog contains at least 50 books, 5 publishers, and 10 articles at launch time to support a meaningful first-time user experience.
- Arabic text rendering is handled natively by the Flutter framework with full RTL support; no custom text rendering library is required.
- Authors being redirected to the web for paid (subsequent) submissions is an accepted UX trade-off for v1.
- Mobile-specific brand assets (app icon, splash screen, loading animation) are to be designed and provided before app store submission (OQ-M-07).

---

## Out-of-Scope Declarations (Version 1)

The following are explicitly excluded and must not be built in this sprint:

| Excluded Feature | Reason | Workaround |
|---|---|---|
| Admin Dashboard | Desktop-oriented; small admin user base; mobile adds security risk | Web Admin panel accessible via mobile browser |
| In-App Payment & Checkout | Native payment SDK requires PCI compliance, App Store/Play Store policy review, and end-to-end payment testing | Cart is fully functional; checkout redirects to web browser |
| Ambassador Dashboard | Small user base; desktop-oriented analytics use case | Web platform dashboard via mobile browser |
| B2B Institutional Subscription Management | Admin function; no self-service portal in v1 | Web Admin panel |
| Author Login & Submissions Dashboard | No user accounts in v1; submission is guest-only | Authors receive all status updates by email |
| Email-Based Wishlist (Web-style magic link) | Unnatural mobile UX; device-local wishlist replaces it | Device-local wishlist with instant tap-to-save |
| WhatsApp & Telegram Subscription from Mobile | Push notifications cover the mobile notification channel; configuration complexity deferred | Users subscribe to WhatsApp/Telegram via web or direct messaging platform links |
| Wishlist Translation Alerts (Push) | Anonymous device-local wishlist has no server-side identity for targeting | Web platform email-based wishlist supports translation alerts |
| Offline Content Cache | Cache invalidation complexity deferred; clear error states provided instead | "No internet connection" notice on all dynamic screens |
| Paid Submission Payment in Mobile App | Requires native payment SDK; deferred | Redirect to web browser for paid submissions |

---

## Open Questions (Must Resolve Before Building Affected Module)

| ID | Module | Question |
|---|---|---|
| OQ-M-01 | Module 14 | When a mobile user is redirected to the web for a paid submission, should a draft-save mechanism pre-populate the web form? Or is manual re-entry acceptable for v1? |
| OQ-M-02 | Catalog / Homepage | What is the minimum required number of books, articles, and publishers that must be in the catalog before the app is released publicly? |
| OQ-M-03 | Module 11 | Has the cart + web redirect approach been formally reviewed against the latest Apple App Store "reader app" policy guidelines to confirm it will not be flagged during review? |
| OQ-M-04 | Module 11 / Module 16 | When the user completes a purchase on the web, should the web platform deep-link back to the mobile app (e.g., to show an "Order confirmed" screen)? If yes, the deep-link URL scheme must be defined before development. |
| OQ-M-05 | Module 8/9 | Should Watch Your Book, Book Talk, and Novel & Story (media channels) be separated from the text editorial channels into a dedicated "Media" bottom tab, or is the unified Articles/Media hub the preferred final navigation? |
| OQ-M-07 | All | Mobile-specific brand assets (app icon, splash screen, loading animation) — when will these be provided, and who is the approver before app store submission? |
