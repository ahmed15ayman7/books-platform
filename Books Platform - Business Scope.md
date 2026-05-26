# Books Platform — Complete Business Scope Document

---

## Preamble

This document is the authoritative Business Scope for the full rebuild of **Books Platform (منصة الكتب العالمية)**. It is written for stakeholders, product owners, and any new team member who joins the project. The document covers every module, business rule, user workflow, edge case, out-of-scope declaration, and open question relevant to this build.

This document is written entirely in business language. It contains no technical implementation details, framework names, or code references. Anyone reading this document should be able to understand the complete system — what it does, how it works, why every rule exists, and what it deliberately does not do — with zero prior knowledge of the project.

**Version:** 1.1
**Date:** May 2026 (updated May 2026 — v1.1 adds Smart Notifications, Visitor Analytics, Recommendation Engine, Ambassador Referral Program, Social Auto-Post, and Technical Marketing standards)
**Prepared for:** Books Platform — منصة الكتب العالمية

---

## 1. Executive Summary

Books Platform is an Arabic-language digital platform whose mission is to make every Arab reader aware of every new book published anywhere in the world. It operates as a cultural knowledge bridge — connecting the global flow of book publishing to Arabic-speaking readers, writers, translators, and publishers who have historically had no single, structured destination for this purpose.

The platform solves a genuine gap in the Arabic digital landscape. Today, an Arab publisher who wants to find promising foreign books for translation must manually search dozens of international publishers and book databases in multiple languages. An Arab translator looking for rights-available books has no organized directory. An Arab reader who wants to follow global literary output has no Arabic-language hub that tracks it daily. Books Platform addresses all of these pain points simultaneously.

The platform generates revenue through five streams: B2B institutional subscriptions (sold to libraries, universities, newspapers, and television channels), book sales and purchase referrals (a commission-based e-commerce system), a tiered author publishing service (where the first book submission is free and subsequent submissions are paid), sponsored publisher profiles (where publishing houses pay for featured placement and premium exposure), and an Ambassador Referral Program (where influencers, reviewers, and content partners earn commissions on purchases made through their unique referral links).

The platform serves six categories of users: general visitors and Arabic readers who browse and consume content freely with no account required; authors who submit unpublished works for exposure; publishers who are profiled on the platform; translators who use the platform to discover rights-available books; Ambassadors who promote books and earn commissions through referral links; and the Admin and Editorial Team who manage all platform content, approve submissions, fulfill institutional subscriptions, and run all commercial operations.

Beyond its core content mission, Books Platform is built as an intelligent, data-driven system. It tracks visitor behavior through integrated analytics tools, delivers personalized book recommendations based on browsing patterns, maintains a Smart Notification System that keeps visitors connected via web push alerts and WhatsApp and Telegram channels, and provides the Admin team with the ability to auto-post new book announcements directly to social media — with AI-generated descriptions — from within the Admin panel.

What makes this platform distinct from a general bookstore or book review site is its institutional orientation, its translation recommendation infrastructure, its multi-format editorial output (written articles, podcasts, and AI-assisted video), its comprehensive marketing intelligence layer, and its coverage of books in all languages — not just Arabic. It is a knowledge infrastructure platform with a commercial engine built in.

---

## 2. Platform Vision & Core Problem

### The Problem Statement

The Arab reader, publisher, and translator exist in a state of deep information asymmetry when it comes to global book publishing. The world publishes tens of thousands of new books every year across dozens of languages — in English, German, French, Spanish, Chinese, and more — and the vast majority of this output never reaches the awareness of Arabic-speaking audiences.

This has three consequences that Books Platform is built to address:

**For the Arab reader:** They have no single Arabic-language source that systematically tracks global new releases, explains their significance, and presents them in accessible formats. Discovering an important new book published in Germany or Japan, for example, requires the Arab reader to actively monitor foreign-language sources — a barrier most cannot or do not overcome.

**For the Arab publisher and translator:** There is no organized, Arabic-language directory of foreign books recommended for translation, no catalog of what has already been translated, and no infrastructure for connecting rights-holders with Arabic publishers. Publishers who want to pursue translation rights must conduct expensive and time-consuming research in foreign markets. Translators have no central place to discover high-value books worth pursuing.

**For the Arab writer:** There is no platform where an unpublished Arab author can present their manuscript to publishers and readers simultaneously, creating visibility before formal publication and enabling discovery by publishing houses who might otherwise never encounter the work.

### The Solution

Books Platform solves these problems by acting as the central Arabic-language hub for global book intelligence. It aggregates and presents new book releases from international publishers in Arabic, organizes them by category, provides editorial analysis, produces media content (video and audio) to lower the barrier of engagement, maintains a curated directory of publishers, and runs a dedicated channel for translation recommendations.

For institutional clients — libraries, universities, newspapers, television channels — the platform provides structured data feeds: daily bibliographic updates, weekly research reports, and media-ready audio and video content.

For commercial clients — publishing houses — the platform offers sponsored profile placement and exposure to an Arabic-speaking audience actively looking for books to acquire or translate.

For individual users — readers, writers, translators — the platform offers free access to its entire editorial and catalog content, with the ability to purchase books directly, submit unpublished works, and subscribe to newsletters.

### Why This Approach

The platform is designed around content-first, commerce-second because the primary value proposition is knowledge access, not retail. The e-commerce layer exists to complete the user journey when a reader wants to act on a recommendation — but the platform's credibility and return-visit loyalty depends entirely on the quality and consistency of its editorial output.

The Admin controls publisher profiles (rather than allowing self-registration) because data accuracy and editorial integrity are critical to the platform's value to institutional subscribers. A library or university subscribing to bibliographic data must trust that publisher information is verified and maintained by the platform, not self-reported by commercial actors with incentives to inflate their profiles.

The "first book free" model for author submissions is designed to lower the barrier for new and young Arab writers, while the paid model for subsequent submissions ensures that the platform's author-submission channel remains a curated discovery tool rather than an open submission flood.

---

## 3. User Roles & Personas

### Role 1: Visitor / Public Reader

**Who They Are:** Any person who arrives at the platform — an Arab reader interested in books, a student researching a topic, a journalist looking for book news, a casual browser. They have not created an account and are not expected to in this version of the platform.

**Primary Goal on the Platform:** To discover new books from around the world, read editorial content about those books, watch or listen to book-related media, and — if desired — purchase a book or sign up for the newsletter.

**Capabilities:**
- Browse the full book catalog across all 7 categories
- View individual book detail pages with full bibliographic data and summaries
- Browse the "Books Recommended for Translation" section
- Browse the "Translated Books" section
- Read all editorial content (World Reads, Book Harvest, Essence of Ideas)
- Watch all video content (Watch Your Book, Novel & Story)
- Listen to all podcast content (Book Talk)
- Browse all publisher profiles and the publisher directory
- Browse author-submitted works in the "Publish Your Book" section
- Add books to a shopping cart and complete a purchase
- Leave comments on book pages and editorial articles
- Rate books
- Subscribe to the newsletter by entering their email address
- Search the platform by keyword
- Filter books by category, language, publisher, or translation status
- Switch between Arabic and English versions of the platform
- Share any page on social media
- Add books to a Wish List (saved via email link — see Module 11)
- Opt in to web push notifications to receive alerts when new books or articles are published
- Subscribe to WhatsApp or Telegram notification channels for book updates
- Receive a triggered notification when a book on their Wish List transitions to "Translated" status
- Click on an Ambassador referral link and arrive at a book page (the referral is tracked automatically)
- Receive personalized book recommendations based on their session browsing behavior (see Module 21)

**Restrictions:**
- Cannot create a personal account or reading profile in this version
- Cannot access any administrative functions
- Cannot create or edit a publisher profile
- Cannot access B2B subscription content feeds directly
- Cannot view or manage another visitor's Wish List
- Cannot opt out of session-based behavior tracking used for anonymized analytics and personalization (disclosed in the Privacy Policy)

**How They Join:** No registration required. All public content is freely accessible. Wish List and notification opt-in require only an email address or messaging platform subscription — no password account is created.

**Access Levels:** Single level. All visitors have identical access. Visitors who opt in to notifications or save a Wish List are identified only by their email address or messaging channel — they do not have an elevated access level.

---

### Role 2: Author (Unpublished)

**Who They Are:** An Arab writer, novelist, poet, academic researcher, or student who has a completed work — a manuscript, novel, short story collection, or academic dissertation — that has not been formally published by a publishing house. They come to the platform to gain visibility for their unpublished work among publishers and the reading public.

**Primary Goal on the Platform:** To submit their unpublished work and have it listed on the "Publish Your Book" section so that publishers and readers can discover it.

**Capabilities:**
- Submit an unpublished work through the "Publish Your Book" submission form
- Submit their first book for free
- Submit subsequent books after paying the applicable submission fee
- Have their approved work displayed on the "Publish Your Book" section with a cover image, summary, and author bio
- Allow visitors to download their work for free if they choose that option during submission
- Provide contact details so publishers can reach them directly

**Restrictions:**
- Cannot publish their own work directly — all submissions require Admin approval before becoming visible on the platform
- Cannot edit their own submission after it has been approved without contacting the Admin
- Cannot access any part of the Admin panel
- Cannot create a persistent author profile page in this version (their work appears in the section but they do not have a login account)

**How They Join:** By completing the "Publish Your Book" submission form. No account is created. The submission is reviewed by the Admin team.

**Access Levels:** Single level. Authors submit once per form submission and have no ongoing session or account.

---

### Role 3: Publisher

**Who They Are:** A publishing house — either Arab or international — that publishes books relevant to Arabic-speaking audiences. They are represented on the platform by a profile page that the Admin creates and maintains on their behalf.

**Primary Goal on the Platform:** To be discoverable by Arab readers, translators, and other publishers who are looking for books in their catalog, and — if they are a sponsored publisher — to receive premium placement and enhanced visibility.

**Capabilities (as represented on the platform):**
- Have a publisher profile page displaying: publisher name, country of origin, website link, contact email, a descriptive write-up, cover image, and all books listed on the platform that belong to their catalog
- Have all their books linked back to their profile page
- Appear in the publisher directory
- Be listed as a sponsored publisher if a commercial arrangement is active

**Restrictions:**
- Cannot create or edit their own profile in this version — all profile creation and editing is performed by the Admin
- Cannot log in to the platform — there is no publisher account
- Cannot directly upload books to their own profile
- Cannot view platform analytics or subscription data

**How They Join:** The Admin creates their profile. For sponsored publishers, a commercial arrangement is confirmed off-platform, and then the Admin activates the sponsored status.

**Access Levels:** Not applicable — publishers have no system account in this version.

---

### Role 4: Translator

**Who They Are:** A professional translator or translation agency working between Arabic and one or more foreign languages. They use the platform as a research and discovery tool to find books worth translating and to identify rights-available titles before approaching publishers.

**Primary Goal on the Platform:** To discover foreign books recommended for translation, review their bibliographic details, and identify the publisher to contact for translation rights.

**Capabilities:**
- Browse the "Books Recommended for Translation" section
- Filter by language, category, or publisher
- Access publisher profile pages to find contact information for rights inquiries
- Browse the "Translated Books" section to understand what has already been translated and avoid duplication

**Restrictions:**
- No special access beyond that of a general visitor — the translator role is a use-case distinction, not a system role with different permissions in this version
- Cannot register a translator profile or be listed as a verified translator on the platform

**How They Join:** No registration. Translators use the platform as general visitors.

**Access Levels:** Same as Visitor / Public Reader.

---

### Role 5: Admin / Editorial Team

**Who They Are:** The internal team at Books Platform — editors, content managers, and administrators — who are responsible for managing all content on the platform, approving submissions, fulfilling subscriptions, and running commercial operations.

**Primary Goal on the Platform:** To maintain the platform's content quality, ensure all modules are up to date, approve or reject author submissions, manage publisher profiles, handle orders and subscriptions, and oversee all commercial activity.

**Capabilities:**
- Full access to every part of the Admin panel
- Create, edit, and delete book entries (all bibliographic data, cover images, summaries, categories, purchase links, translation status)
- Create, edit, and delete publisher profile pages
- Create, edit, and delete editorial articles in all three editorial sections
- Create, edit, and delete media content in all three media sections
- Review, approve, or reject author submissions from "Publish Your Book"
- Manage e-commerce: view orders, process refunds, manage product listings and pricing
- Manage institutional subscriptions: activate, deactivate, and renew B2B subscriber accounts
- Manage sponsored publisher profiles: activate and deactivate sponsorship status
- Manage newsletter subscribers: view subscriber list, send campaigns
- Moderate comments: approve, edit, hide, or delete any comment
- View platform analytics: visitor counts, most-viewed books, top categories, order history
- Manage the platform's bilingual content (Arabic and English versions of all content)
- Manage static pages: About Us, Team, Privacy Policy, Terms of Use, Contact
- Trigger Social Auto-Post for approved books to Facebook, X, and Instagram from within the Admin panel
- Generate AI-written social media descriptions for new book posts using the built-in AI generation tool
- Manage Smart Notification campaigns (web push broadcasts, WhatsApp and Telegram channel updates)
- Manage Ambassador accounts: create, approve, pause, and close accounts; view all referral link performance; view and record commission payouts
- Configure the Abandoned Cart Recovery system: enable/disable, set delay period, set discount code amounts
- View all marketing analytics including heatmaps, event tracking data, and Pixel conversion reports

**Restrictions:**
- There are no restrictions documented at this level — the Admin has full system access
- Individual admin sub-roles and permission levels are not defined in this version (the Admin functions as a single unified role)

**How They Join:** Admin accounts are created directly in the system by whoever has system-level access. No self-registration.

**Access Levels:** Full access. Single admin role level in this version.

---

### Role 6: Ambassador / Platform Partner

**Who They Are:** An influencer, book reviewer, literary blogger, content creator, or public figure in the Arab cultural space who has an established audience and wishes to promote books from the platform in exchange for commissions on purchases driven through their personal referral links. Ambassadors are also referred to as "Platform Partners" in the context of formal agreements.

**Primary Goal on the Platform:** To share unique referral links for individual books with their audience, drive purchases through those links, and earn commissions or points credited to their Ambassador account based on confirmed sales.

**Capabilities:**
- Log in to a personal Ambassador Dashboard within the platform
- View all referral links assigned to them, organized by book
- View their total earnings (commissions or points) broken down by book and by date range
- View click counts and conversion rates for each of their referral links
- Download a summary report of their link performance
- View the terms of their referral agreement (commission rate or points value per sale)
- View their payout history: dates and amounts of commissions paid out by the Admin

**Restrictions:**
- Cannot access any Admin panel functions
- Cannot see other Ambassadors' referral links, earnings, or performance data
- Cannot create their own referral links independently — links are generated by the system upon Admin action
- Cannot modify the landing page of a referral link — the link always points to the designated book detail page on the platform
- Cannot issue discounts or promotional offers directly — only the Admin can create discount codes
- Cannot approve their own account — Ambassador accounts must be created or approved by the Admin
- Cannot process or request commission payouts directly from the dashboard — payouts are managed by the Admin through the agreed payment arrangement

**How They Join:** An Ambassador applies or is invited by the Admin. The Admin creates the Ambassador account in Module 16N of the Admin panel, sets the commission rate or points structure, and provides the Ambassador with their login credentials. No public self-registration for Ambassador accounts exists in this version.

**Access Levels:** Single level. All Ambassadors have the same capabilities within their own account. One Ambassador cannot see another's data.

---

## 4. System Overview (Module Map)

| # | Module | Purpose | Who Uses It |
|---|--------|---------|-------------|
| 1 | Homepage & Global Navigation | The platform's entry point — presents curated highlights from all sections and orients every type of visitor | All visitors, all roles |
| 2 | Book Catalog & Book Detail Page | The core content unit — every book has a dedicated page with full data, purchase options, and comments | All visitors; Admin (write); Ambassadors (referral links) |
| 3 | Books Recommended for Translation | A curated channel highlighting foreign books not yet translated into Arabic | Visitors, translators; Admin (write) |
| 4 | Translated Books Section | A catalog of foreign books that have already been translated into Arabic | Visitors; Admin (write) |
| 5 | Publisher Directory & Publisher Profiles | A directory of publishing houses with dedicated profile pages and linked book catalogs | All visitors; Admin (write) |
| 6 | Editorial Content Hub | Three distinct editorial channels presenting book news, periodic reports, and deep analytical reads | All visitors; Admin (write) |
| 7 | Media Creations Hub | Three distinct media channels presenting book videos, podcast episodes, and AI-assisted cinematic summaries | All visitors; Admin (write) |
| 8 | Publish Your Book | An author-submission channel where unpublished writers submit works for visibility | Authors (submit); Admin (review & approve) |
| 9 | E-Commerce & Shopping Cart | A purchasing system allowing visitors to buy books directly or be referred to the publisher, with Abandoned Cart Recovery | All visitors (purchase); Admin (manage & configure) |
| 10 | Comments & Ratings | A public engagement layer allowing visitors to comment on and rate books and articles | All visitors (submit); Admin (moderate) |
| 11 | Wish List & Reading Lists | A feature allowing visitors to save books via email-based identity, with translation notification triggers | All visitors (save & retrieve); Admin (no direct management) |
| 12 | Newsletter & Email Subscription | An email capture and distribution system for platform updates and book news | All visitors (subscribe); Admin (send) |
| 13 | B2B Institutional Subscriptions | A commercial subscription layer delivering curated content packages to institutional clients | Admin (manage); B2B clients (receive) |
| 14 | Sponsored Publisher Profiles | A commercial feature giving paying publishers premium placement and visual prominence | Admin (activate); Visitors (see) |
| 15 | Search & Filtering | A platform-wide search and filter system covering books, publishers, and editorial content | All visitors |
| 16 | Admin Panel | The internal control center for managing all platform content, users, orders, subscriptions, social posts, notifications, and ambassador accounts | Admin only |
| 17 | Bilingual Platform (Arabic / English) | Full Arabic and English versions of all public-facing content | All visitors |
| 18 | SEO & Technical Marketing Infrastructure | Metadata, structured data, sharing tools, performance standards, and conversion optimization embedded across all pages | All visitors (share); Admin (configure) |
| 19 | Smart Notification System | A multi-channel notification system delivering book alerts via web push, WhatsApp, and Telegram — including automated Wish List translation alerts | All visitors (opt-in); Admin (manage & broadcast) |
| 20 | Visitor Analytics & Marketing Intelligence | A comprehensive visitor behavior tracking and marketing conversion layer including event tracking, Pixel integration, heatmaps, and cart recovery analytics | Admin / Marketing team (view & configure); Visitors (tracked anonymously) |
| 21 | Intelligent Recommendation Engine | A session-based content personalization system suggesting books based on each visitor's browsing patterns | All visitors (receive recommendations); Admin (configure) |
| 22 | Ambassador Referral Program | A partner marketing channel where Ambassadors earn commissions through unique per-book referral links with a dedicated Ambassador Dashboard | Ambassadors (use dashboard); Admin (manage); Visitors (click referral links) |

---

## 5. Module-by-Module Deep Dive

---

### Module 1: Homepage & Global Navigation

#### Purpose & Business Context
The homepage is the platform's most important first impression. It must simultaneously serve a casual browser, a professional translator looking for books to acquire, and an institutional subscriber checking for new content. It must communicate the platform's identity, surface the most important content from every section, and direct every type of visitor toward what they need without confusion. The navigation structure is the skeleton of the entire user experience.

#### Who Interacts With This Module
- All visitors: read-only access, browsing and clicking through
- Admin: manages which content appears in featured/highlighted positions on the homepage

#### What the Homepage Displays

**Top Utility Bar (above the main header):**
- Links to: About Us — Our Services — Careers — Team — Contact Us
- Language switcher (Arabic / English)
- Shopping cart icon with live item count and total value

**Main Header:**
- Platform logo (links back to homepage)
- Main navigation menu

**Main Navigation Menu:**
- Home
- Book Categories (dropdown: 7 sub-categories)
- Books Recommended for Translation
- Translated Books
- Readings & Reviews (dropdown: World Reads / Book Harvest / Essence of Ideas)
- Media Creations (dropdown: Watch Your Book / Book Talk / Novel & Story)
- Publishers
- Publish Your Book

**Homepage Body Sections (in order):**
1. Hero banner — platform tagline and a featured or rotating highlight of recently added books
2. Latest Books — a curated grid of the most recently added books across all categories
3. Featured Editorial Article — one prominent article from the editorial content hub
4. Books Recommended for Translation — a section showing the latest additions
5. Media Highlights — a row of the latest video or podcast items
6. Publisher Spotlight — featured publishers (sponsored publishers appear here with priority)
7. Statistics counters — total books cataloged, total publishers listed, total translated books, years in operation (these must be populated with live data, not zeros)
8. Newsletter signup strip — email input with subscribe button

**Footer:**
- About Us — Team — Privacy Policy — Terms & Conditions of Use
- Social media icons: Facebook, Instagram (correct link), X, Telegram, YouTube, LinkedIn

#### Business Rules
1. The statistics counters on the homepage must pull live data from the platform's database. They must never display zero when content exists.
2. Sponsored publishers receive priority placement in the Publisher Spotlight section before non-sponsored publishers.
3. The Instagram social media link must point to the platform's actual Instagram account, not the Facebook page. (The current live site has this wrong.)
4. The Cart icon must always reflect the current number of items in the visitor's active session cart in real time.
5. The homepage content (hero banner, featured articles, featured books) is curated by the Admin — it does not auto-populate randomly.

#### Edge Cases & Special Handling
- **Empty sections:** If a content section has no items (e.g., no podcast episodes have been added yet), that section must not render as a blank space. It must either hide the section or display a "Coming Soon" placeholder. Empty sections damage credibility.
- **Cart persistence:** Since visitors have no account, their cart is tied to their browsing session. If they close the browser, the cart clears. This is expected behavior and no warning is required.
- **Language switching:** Switching language from Arabic to English from the homepage must reload the equivalent English homepage, not redirect to the home page of the other language version with different content.

#### Notifications & Communications
None triggered from the homepage itself.

#### Audit & Accountability
- Admin changes to the homepage layout or featured content selections are logged with the admin's name and timestamp.

#### Validation Rules
- Newsletter email field: required, must be a valid email format, maximum 254 characters.

---

### Module 2: Book Catalog & Book Detail Page

#### Purpose & Business Context
The book is the central content unit of the entire platform. Every other module — editorial content, translation recommendations, publisher profiles, e-commerce — either links to or originates from a book record. The book catalog must be rich enough to serve a professional translator researching a title, detailed enough to satisfy an academic reader, and compelling enough to drive a casual reader to purchase or share.

#### Who Interacts With This Module
- All visitors: browse catalog, view book detail pages, rate and comment, purchase
- Admin: create, edit, delete all book records

#### Book Record — Required Fields

Every book in the catalog must have all of the following:

| Field | Description | Required? |
|---|---|---|
| Title (Arabic) | The Arabic translation of the title, or the original title if Arabic | Required |
| Title (Original Language) | The book's title in its original language | Required |
| Cover Image | High-resolution cover image | Required |
| Author Name(s) | Full name(s) of the author(s) | Required |
| Publisher | Linked to a publisher profile in the Publisher Directory | Required |
| Publication Year | Year the book was first published | Required |
| Language | The original language of the book | Required |
| Category | One of the 7 platform categories | Required |
| ISBN | International Standard Book Number | Required |
| Summary (Arabic) | A substantive Arabic-language summary of the book's content and significance | Required |
| Translation Status | One of: "Not Translated," "Recommended for Translation," or "Translated" | Required |
| Purchase Option | "Direct Purchase" or "Referral to Publisher" or "Not Available for Purchase" | Required |
| Price (if direct purchase) | Price in the applicable currency | Required if direct purchase |
| Publisher Referral Link | External URL to the publisher's own website or store | Required if referral |
| Summary (English) | English-language version of the summary | Optional |
| Tags / Keywords | For search and filtering | Optional |

#### Book Detail Page Layout

Each book has a dedicated page displaying:
- Cover image (large, prominent)
- Full title in Arabic and original language
- Author name(s)
- Publisher name (linked to publisher profile)
- Year, language, ISBN, category
- Translation status badge
- Full Arabic summary
- Purchase button (if available) or referral link button
- Social sharing buttons
- Rating display (aggregate star rating)
- Comments section
- Related books (same category or same publisher)

#### Business Rules
1. A book can only be assigned to one of the 7 primary categories. It cannot be assigned to "Recommended for Translation" and a primary category simultaneously — "Recommended for Translation" and "Translated" are translation-status flags, not categories.
2. If a book's purchase option is "Direct Purchase," a price must be provided. The Admin cannot save a book record with "Direct Purchase" selected but no price entered.
3. If a book's purchase option is "Referral to Publisher," the publisher referral URL must be provided. The Admin cannot save without it.
4. The cover image is mandatory. No book can be published to the public-facing catalog without a cover image.
5. The Admin can mark a book as "Recommended for Translation" regardless of its primary category. This adds it to the Translation Recommendations channel without removing it from its primary category.
6. When a book is marked "Translated," it appears in the "Translated Books" section. The Admin must add the Arabic title and optionally the Arabic publisher and year of translation to complete the translated entry.
7. Books cannot be visible to the public until the Admin explicitly sets their status to "Published." A draft state exists for books being prepared.

#### Edge Cases & Special Handling
- **Book with multiple authors:** The system must support multiple author names on a single book record. Each author's name is entered separately and all are displayed on the detail page.
- **Book in a language with no Arabic translation of the title yet:** The Admin may enter the original-language title in the Arabic title field as a placeholder, flagged internally for later update.
- **Publisher not yet in the directory:** The Admin cannot link a book to a publisher that does not have a profile. If the publisher does not exist, the Admin must create the publisher profile first, then return to link the book.
- **Price currency:** The platform must display prices in a consistent currency. If the platform serves multiple markets, the Admin must specify the currency at the time of entry. Currency conversion is out of scope for this version.
- **Book removed from catalog:** If a book is deleted by the Admin, any purchase orders that included that book are preserved in the order history. The book detail page returns a "no longer available" message. Pending orders for deleted books must be reviewed manually by the Admin.

#### Notifications & Communications
- When a visitor completes a purchase of a book, they receive an order confirmation (see Module 9 — E-Commerce).
- No notification is sent when a new book is added to the catalog (newsletter serves this function — see Module 12).

#### Audit & Accountability
- Every book creation, edit, and deletion is logged with the admin's name and timestamp.
- Changes to a book's price are logged specifically, capturing the old price, new price, and the admin who made the change.

#### Validation Rules
- Title (Arabic): required, maximum 500 characters
- Cover image: required, accepted formats JPG/PNG/WEBP, minimum 300px wide
- ISBN: required, must follow valid ISBN-10 or ISBN-13 format
- Price: required if direct purchase, numeric, minimum value 0.01, maximum 4 digits before decimal
- Summary (Arabic): required, minimum 100 characters, maximum 5,000 characters
- Publisher referral URL: must be a valid URL format if provided

---

### Module 3: Books Recommended for Translation

#### Purpose & Business Context
This is one of the platform's most strategically distinctive features. Arab publishers and translators have no organized, Arabic-language channel that curates foreign books worth translating. This module fills that gap. It is a filtered view of the book catalog showing only books flagged with "Recommended for Translation" status, presented in a way that makes their translation potential clear.

#### Who Interacts With This Module
- All visitors, specifically translators and Arab publishers: read and browse
- Admin: flags books as recommended for translation, writes recommendation rationale

#### What the Module Displays
- A browsable grid or list of all books currently flagged as "Recommended for Translation"
- Each entry shows: cover, title, author, publisher, original language, category, and a brief recommendation note explaining why this book is considered translation-worthy
- Filter controls: by original language, by category, by publisher country
- Sort controls: newest added, most viewed

#### Business Rules
1. A book can only appear in this section if the Admin has explicitly set its translation status to "Recommended for Translation." This status is not set automatically.
2. A book can be both in a primary category (e.g., "Technology & Science") AND in the "Recommended for Translation" section. These are not mutually exclusive.
3. Once a book is translated and the Admin updates its status to "Translated," it is automatically removed from "Recommended for Translation" and added to the "Translated Books" section.
4. The Admin may add a brief recommendation note for each book explaining its significance for Arabic translation. This note is optional but strongly encouraged for quality.

#### Edge Cases & Special Handling
- **Already translated by someone unknown to the platform:** If the platform later discovers a book listed as "Recommended" has already been translated and published in Arabic by a third party, the Admin must update the status to "Translated" immediately to avoid misleading translators.
- **Book recommended but rights are unavailable:** The platform does not track rights availability in this version. This is a known limitation. Translators are expected to verify rights directly with publishers using the contact information on the publisher profile page.

#### Notifications & Communications
- No automatic notification to visitors when new recommendations are added. Newsletter campaigns serve this purpose.

#### Audit & Accountability
- All status changes (marking as recommended, removing recommendation, updating to translated) are logged.

---

### Module 4: Translated Books Section

#### Purpose & Business Context
This section prevents duplicated translation efforts and helps the Arab reader discover which important foreign books are now available in Arabic. It is an informational catalog — not a purchase channel — showing foreign books that have been translated into Arabic and providing the Arabic title, translator (if known), and Arabic publisher.

#### Who Interacts With This Module
- All visitors: browse and discover
- Admin: manage translated book entries

#### What the Module Displays
- A browsable catalog of all books with "Translated" status
- Each entry shows: original cover, original title and author, Arabic title, Arabic publisher (if known), year of Arabic publication, and a link to the full book detail page
- Filter controls: by original language, by category

#### Business Rules
1. Entries in this section are informational only. There is no purchase option or referral link in this section. Purchase options appear only on the individual book detail page.
2. The Arabic publisher field is optional — not every translation's publisher will be registered on the platform.
3. If the translated book's Arabic publisher is registered in the Publisher Directory, their name must be linked to their profile page.

#### Edge Cases & Special Handling
- **Translated by a publisher not in the directory:** The Arabic publisher name is displayed as plain text without a link.
- **Multiple translations of the same book:** Some books have been translated into Arabic more than once by different publishers. Each translation is listed as a separate entry, both linked to the same original book record.

#### Audit & Accountability
- All entries added, edited, or removed are logged with admin name and timestamp.

---

### Module 5: Publisher Directory & Publisher Profiles

#### Purpose & Business Context
Publisher profiles serve two audiences simultaneously. For visitors, translators, and Arab publishers, they provide a curated directory of the world's publishing houses — both Arab and international — with their contact details and complete catalog of books listed on the platform. For sponsored publishers, they serve as a commercial channel — a premium placement that drives traffic, discovery, and business inquiries.

All publisher profiles are created and maintained by the Admin. Publishers do not self-register in this version.

#### Who Interacts With This Module
- All visitors: browse directory, view publisher profiles
- Admin: create, edit, manage all publisher profiles; activate/deactivate sponsored status

#### Publisher Directory Page
- A full list of all publishers on the platform
- Organized by country of origin
- Each entry shows: publisher logo, publisher name, country, and a link to their profile
- Filter by country, by type (Arab / International)
- Sponsored publishers appear at the top of the directory with a visual indicator of their sponsored status

#### Publisher Profile Page — Required Fields

| Field | Description | Required? |
|---|---|---|
| Publisher Name | Official name of the publishing house | Required |
| Country | Country where the publisher is based | Required |
| Cover / Banner Image | Visual representing the publisher | Required |
| Descriptive Write-up | An editorial profile of the publisher's history, focus areas, and significance | Required |
| Website URL | Publisher's official website | Required |
| Contact Email | Email address for translation rights inquiries | Required |
| Sponsored Status | Whether the publisher is currently a sponsored partner | Admin-controlled |
| Books on Platform | Auto-populated list of all books assigned to this publisher | Auto-populated |

#### Business Rules
1. A publisher profile cannot be saved without all required fields completed.
2. Books cannot be linked to a publisher that does not have a profile. The publisher profile must exist first.
3. Sponsored publishers receive visual prominence: they appear first in the directory, first in the homepage Publisher Spotlight section, and carry a "Sponsored" or "Featured" badge on their profile.
4. Sponsorship status is toggled by the Admin only. It is never self-activated by the publisher.
5. Deleting a publisher profile is blocked if any books are currently linked to that publisher. The Admin must reassign or delete all linked books before the publisher profile can be deleted.
6. The publisher's contact email is visible to all visitors on the profile page — this is intentional, as it facilitates translation rights inquiries.

#### Edge Cases & Special Handling
- **Publisher changes their name or website:** The Admin edits the profile. All books linked to that publisher automatically reflect the updated publisher name and link.
- **Sponsored publisher's commercial arrangement expires:** The Admin deactivates sponsored status. The publisher's profile remains on the platform but loses all premium placement. No content is deleted.
- **International publisher with no English-language profile information:** The Admin writes the profile in Arabic only. The English version is left blank and the page displays the Arabic content in both language versions until an English version is written.

#### Notifications & Communications
- No automated notifications in this module.

#### Audit & Accountability
- All profile creations, edits, deletions, and sponsorship status changes are logged.

---

### Module 6: Editorial Content Hub

#### Purpose & Business Context
The Editorial Content Hub is the intellectual backbone of the platform. It is what justifies the platform's authority as a knowledge destination rather than a mere book database. The Hub has three distinct channels, each with a different format and publishing cadence, each targeting a different depth of engagement.

#### Who Interacts With This Module
- All visitors: read articles, comment, share
- Admin: write, edit, publish, and manage all editorial content

#### Sub-Module 6A: The World Reads (العالم يقرأ)

**Purpose:** A daily news channel covering the most important book releases and book-world news from around the globe. Think of it as a book-focused newswire — short, timely, and frequent.

**Content Format:** Short journalistic pieces, typically 300–600 words. Published as frequently as daily.

**Article Fields:**
- Headline (Arabic) — required
- Headline (English) — optional
- Body text (Arabic) — required, minimum 200 words
- Body text (English) — optional
- Featured image — required
- Publication date — required, auto-set to publish date
- Category tag — optional, links to one of the 7 book categories
- Related book — optional, links to a book in the catalog
- Author / Editor byline — required (Admin team member name or "Books Platform Editorial")

**Business Rules:**
1. Articles in this section are published in Arabic by default. The English version is optional and may be added later.
2. An article can optionally be linked to a specific book in the catalog. If linked, the book's cover appears alongside the article and a "View Book" button is shown.
3. Articles are listed in reverse chronological order (newest first).
4. The Admin can schedule articles for future publication — they are drafted and dated, but do not appear on the public site until the scheduled time arrives.

**Edge Cases:**
- **Article about a book not yet in the catalog:** The Admin must add the book to the catalog first, then link the article to it. If the book will not be added to the catalog (e.g., it is only newsworthy, not being cataloged), the article runs without a book link.

---

#### Sub-Module 6B: Book Harvest (حصاد الكتب)

**Purpose:** A periodic digest format that groups the most significant recent books by category. Think of it as a curated "best of the month" or "best of the week" report, organized by subject area.

**Content Format:** Longer report-style articles, typically one report per category published on a regular cycle (weekly, monthly, or quarterly — at Admin discretion). Each report covers multiple books.

**Article Fields:** Same fields as The World Reads, with the addition of:
- Report period (e.g., "April 2026," "Q1 2026") — required
- Multiple linked books — a single Harvest article must link to at least 3 books

**Business Rules:**
1. Each Book Harvest article must be linked to at least 3 books in the catalog. An article that names books not yet in the catalog cannot be published until those books are added.
2. Book Harvest articles are organized by the 7 platform categories. Each issue covers one category.
3. Harvest articles are longer than World Reads articles. Minimum word count is 600 words.

---

#### Sub-Module 6C: Essence of Ideas (زبدة الأفكار)

**Purpose:** The platform's premium long-form analytical reading channel. These are in-depth reviews and intellectual explorations of individual books, targeted at researchers, academics, and serious readers.

**Content Format:** Long-form analytical essays, typically 1,000–3,000 words per piece. Published less frequently than the other two channels.

**Article Fields:** Same as World Reads. One article is always linked to exactly one book.

**Business Rules:**
1. Every Essence of Ideas article must be linked to exactly one book in the catalog.
2. The linked book's full record (cover, title, summary, purchase link) is displayed alongside the article.
3. Minimum word count for this channel is 800 words. Articles below this threshold should not be published in this channel — they belong in World Reads instead.

---

#### Comments on Editorial Articles
All three editorial channels allow visitors to leave comments on articles. Comment rules are identical to those on book detail pages (see Module 10).

---

#### Audit & Accountability
- All article creations, edits, publications, scheduled publications, and deletions are logged with admin name and timestamp.

---

### Module 7: Media Creations Hub

#### Purpose & Business Context
The Media Creations Hub extends the platform's reach beyond text-based content to serve visitors who prefer visual or audio formats. It also creates distributable content for social media platforms, broadening the platform's organic reach. The Hub has three distinct media channels.

#### Who Interacts With This Module
- All visitors: watch videos, listen to podcasts, share
- Admin: create, upload, manage all media content

---

#### Sub-Module 7A: Watch Your Book (شاهد كتابك)

**Purpose:** Short video summaries (typically 2–5 minutes) about new or notable books, designed for sharing on YouTube, TikTok, and social media.

**What Each Entry Contains:**
- Video title (Arabic) — required
- Linked book — required (must link to a book in the catalog)
- Video embed — required (YouTube embed link)
- Brief description (Arabic) — required, maximum 300 words
- Publication date — required
- Category tag — optional

**Business Rules:**
1. Videos are hosted on YouTube and embedded on the platform via the YouTube embed system. The platform does not host video files directly.
2. Every Watch Your Book entry must be linked to a book in the catalog.
3. If the linked YouTube video is removed or made private on YouTube, the platform entry remains but the embed area shows an error. The Admin must be alerted (manually) to update or replace the video link.

---

#### Sub-Module 7B: Book Talk (حديث الكتب)

**Purpose:** Short audio podcast episodes (3–5 minutes) covering a single book or book topic per episode. Designed for quick, on-the-go consumption.

**What Each Entry Contains:**
- Episode title (Arabic) — required
- Linked book — optional (some episodes may cover a topic rather than a single book)
- Audio file or audio embed link — required
- Episode transcript or description (Arabic) — required, minimum 100 words
- Duration — required
- Publication date — required

**Business Rules:**
1. Audio files are either hosted directly on the platform or embedded from an external podcast platform. The Admin chooses per episode.
2. Episode duration must be displayed on the listing page.
3. If an episode covers a specific book, it must be linked to that book's catalog record.

---

#### Sub-Module 7C: Novel & Story (رواية فحكاية)

**Purpose:** Cinematic-style short videos that retell the stories of famous novels — both Arab and international — using AI-assisted production. These videos are designed to introduce readers to classic and contemporary literary works in an engaging, accessible format.

**What Each Entry Contains:**
- Video title (Arabic) — required
- Source novel (linked to book in catalog, or noted as reference if not in catalog) — required
- Video embed (YouTube) — required
- Brief introduction (Arabic) — required
- AI production note — a disclosure that the video was produced with AI tools, displayed on every entry
- Publication date — required

**Business Rules:**
1. Every Novel & Story entry must include a disclosure that AI tools were used in production. This is a transparency requirement.
2. Videos retelling stories of books already in the catalog must be linked to the book's record.
3. Videos for books not yet in the catalog may be published, but the Admin should add the book to the catalog within a reasonable time after the video is published.

---

#### Audit & Accountability
- All media entry creations, edits, and deletions are logged.

---

### Module 8: Publish Your Book (Author Submission)

#### Purpose & Business Context
This module gives unpublished Arab writers — novelists, poets, researchers, academics — a channel to present their work to publishers and the reading public before formal publication. It serves the platform's mission of supporting Arab cultural production, while also creating a unique content type that no comparable platform offers. It is not a self-publishing platform — the platform does not publish the work commercially. It is a discovery and visibility channel.

#### Who Interacts With This Module
- Authors: submit unpublished works via a public submission form
- Visitors: browse approved submissions
- Admin: review, approve, or reject all submissions; manage published entries

#### The Submission Flow

**Step 1 — Author completes the submission form:**

The form collects the following:

| Field | Description | Required? |
|---|---|---|
| Author Full Name | The writer's full name | Required |
| Author Bio | A short biography (max 300 words) | Required |
| Author Contact Email | How publishers or readers can reach the author | Required |
| Work Title (Arabic) | The title of the submitted work | Required |
| Work Type | Novel / Short Stories / Poetry / Academic Dissertation / Other | Required |
| Work Summary | A description of the work's content and themes (max 500 words) | Required |
| Cover Image | A representative image for the work | Required |
| Work File (PDF) | The full manuscript or a sample chapter | Optional |
| Allow Free Download | Whether the author permits public download of the file | Required if file provided |
| Previous Submissions | How many times this author has previously submitted to the platform | System-tracked |
| Submission Fee Acknowledgment | Checkbox confirming the author understands the fee policy | Required for paid submissions |

**Step 2 — Admin reviews the submission:**
- The Admin receives a notification of a new submission.
- The Admin reviews the content for quality, completeness, and appropriateness.
- The Admin either approves or rejects the submission.
- If rejected, the Admin enters a rejection reason that is communicated to the author by email.

**Step 3 — Approved submissions appear on the public page:**
- The work is listed in the "Publish Your Book" section with all fields from the submission form.
- If the author permitted free download and provided a file, a download button is shown to all visitors.
- The author's contact email is visible so publishers and readers can reach out.

#### Business Rules
1. **First submission is free.** An author's first submission to the platform requires no payment. The system identifies an author by their email address.
2. **Subsequent submissions are paid.** If the same email address attempts a second or further submission, the submission form requires payment before the form can be submitted.
3. **Fee amount is determined by the platform.** The Admin sets the submission fee amount in the Admin panel. The fee may be changed at any time and applies to all new paid submissions from that point forward.
4. **All submissions require Admin approval.** No submitted work becomes publicly visible until an Admin explicitly approves it. There is no automatic publication.
5. **Rejection must include a reason.** The Admin cannot reject a submission without entering a rejection reason. This reason is sent to the author by email.
6. **Approved works cannot be edited by the author.** Once approved and live, changes to the listing must be requested by the author and made by the Admin.
7. **The platform does not claim any rights over submitted works.** The work remains entirely the intellectual property of the author. The platform's role is visibility only.
8. **Adult content, offensive material, or content violating applicable laws will be rejected.** The Admin has full discretion to reject submissions that do not meet the platform's content standards.

#### Edge Cases & Special Handling
- **Author submits and then requests removal:** The Admin can remove an approved submission at the author's written request. The submission record is retained internally for business records.
- **Author provides no file but wants publishers to contact them:** This is valid. The submission can contain only a summary and contact information. Publishers contact the author directly.
- **Payment is made but Admin rejects the submission:** A refund process must be defined (see Open Questions — the payment gateway and refund policy are not yet confirmed).
- **Duplicate submission (same work by same author):** The system should check for duplicate titles from the same email address and warn the Admin during review.

#### Notifications & Communications
- **Author receives:** Confirmation email upon form submission (acknowledging receipt, not approval).
- **Admin receives:** Notification of new submission requiring review.
- **Author receives:** Approval notification email when their work goes live, including the URL of their listing.
- **Author receives:** Rejection notification email including the rejection reason provided by the Admin.

#### Audit & Accountability
- All submissions, approvals, rejections, and removals are logged with timestamps and admin names.
- Payment records for paid submissions are retained as part of the order system.

#### Validation Rules
- Author email: required, valid email format
- Work summary: required, minimum 100 characters, maximum 2,000 characters
- Author bio: required, maximum 1,200 characters
- Cover image: required, JPG/PNG/WEBP, minimum 300px wide
- File upload (if provided): PDF only, maximum 50MB

---

### Module 9: E-Commerce & Shopping Cart

#### Purpose & Business Context
The e-commerce module enables visitors to purchase books directly from the platform or to be referred to the publisher's own website for purchase. This module converts the platform's content engagement into a commercial transaction layer. It requires integration with a payment gateway (not yet finalized at time of this document's writing — see Open Questions).

#### Who Interacts With This Module
- All visitors: add books to cart, complete purchases, receive order confirmations
- Admin: manage product listings (prices, availability), view and manage all orders, issue refunds

#### Purchase Models

The platform supports two purchase models per book, set by the Admin at the book-record level:

**Model A — Direct Purchase:**
The visitor pays the listed price on the platform, using the integrated payment gateway. The platform processes the transaction and fulfills the purchase (delivering a digital file, or confirming a physical order with the publisher).

**Model B — Referral to Publisher:**
The visitor clicks a "Buy from Publisher" button on the book detail page and is redirected to the publisher's own website or store in a new browser tab. The platform does not process payment in this model. This is a referral, and the commercial arrangement (commission on referral, flat fee, or no revenue) is managed off-platform.

#### Shopping Cart Behavior

- The cart is session-based. Visitors do not need an account to use the cart.
- Visitors can add multiple books to the cart.
- The cart persists for the duration of the browser session. Closing the browser clears the cart.
- The cart icon in the header shows the number of items and the current total at all times.
- Visitors can increase quantity, decrease quantity, or remove items from the cart before checkout.

#### Checkout Flow (Direct Purchase)

1. Visitor clicks "Buy" or "Add to Cart" on a book detail page.
2. Visitor proceeds to the cart to review items.
3. Visitor proceeds to checkout.
4. Visitor enters: full name, email address, and payment details via the payment gateway interface.
5. Payment is processed through the payment gateway.
6. On successful payment: order confirmation page is displayed and confirmation email is sent to the visitor's provided email address.
7. On payment failure: visitor is returned to the checkout page with an error message. The order is not created.

#### Abandoned Cart Recovery System

**Purpose:** When a visitor adds a book to their cart but does not complete the purchase within a configured waiting period, the system automatically sends them a recovery email — optionally including a discount code — to encourage them to return and complete the purchase.

**How It Works:**
- When a visitor adds a book to their cart and begins checkout (entering their email address), that email is captured.
- If the visitor does not complete the purchase within the Admin-configured delay period (e.g., 24 hours), the system automatically sends a reminder email.
- The reminder email contains the book(s) left in the cart, a direct link back to checkout, and — if the Admin has enabled it — a unique discount code with an expiry date.
- The system sends a maximum of two recovery emails per abandoned cart: one at the configured delay and optionally a second follow-up at a second configured interval.

**Admin Controls for Abandoned Cart Recovery:**
- Enable or disable the entire feature (on/off toggle in Module 16P)
- Set the delay period for the first recovery email (configurable in hours or days)
- Set the delay period for the second recovery email (configurable in hours or days after the first)
- Enable or disable discount codes in recovery emails
- Set the discount code value (percentage or fixed amount)
- Set the discount code expiry (in days after the email is sent)
- View recovery email performance: sent, opened, clicked, converted

**Business Rules for Abandoned Cart Recovery:**
1. The recovery email can only be sent if the visitor's email address was captured during checkout initiation in the abandoned session. No email from other sources (newsletter, Wish List) may be used for cart recovery.
2. Discount codes generated for cart recovery are single-use and expire as configured. They cannot be reused or shared.
3. If the visitor completes a purchase before the recovery email is sent, the recovery email is automatically cancelled.
4. The Admin can disable the entire Abandoned Cart Recovery system with a single toggle. When disabled, no recovery emails are sent regardless of other settings.
5. Recovery emails must include an unsubscribe option compliant with email marketing standards.

#### Business Rules
1. Only books flagged for "Direct Purchase" can be added to the cart and purchased on-platform. Referral books have a separate button that opens the publisher's URL.
2. A visitor cannot combine a direct-purchase book and a referral book in the same checkout flow — referral is always handled separately via a redirect.
3. The Admin sets and controls all book prices. Prices must be updated in the Admin panel and are reflected immediately on the public site.
4. Orders once placed and paid cannot be automatically cancelled by the visitor. Cancellations and refunds are handled manually by the Admin.
5. The platform must retain a complete order record for every transaction: buyer name, email, book(s) purchased, price paid, date, payment reference number, and order status.
6. Order statuses are: Pending, Completed, Refunded, Cancelled.
7. The Admin can issue full or partial refunds from the Admin panel. The refund is processed through the payment gateway. The order status is updated to "Refunded" or "Partially Refunded."
8. The payment gateway provider has not been finalized. The scope accounts for a payment gateway integration and the design must accommodate whichever gateway is ultimately chosen (see Open Questions).

#### Edge Cases & Special Handling
- **Book price changes after visitor adds to cart:** The cart retains the price at the time of adding. If the visitor does not complete checkout before the price changes, the cart displays a notice that the price has been updated and prompts the visitor to review the cart before proceeding.
- **Book is removed from catalog while in visitor's cart:** The cart displays a notice that one of the items is no longer available and removes it automatically before checkout can proceed.
- **Payment gateway is down:** The checkout page displays a "Payment service temporarily unavailable — please try again later" message. The visitor's cart is preserved during the session.
- **Duplicate order (visitor clicks pay twice):** The payment gateway handles deduplication. The platform must not process the same payment reference number more than once.

#### Notifications & Communications
- **Visitor receives:** Order confirmation email (upon successful payment) containing: order number, list of items purchased, total paid, and contact information for support.
- **Admin receives:** Notification of each new completed order.
- **Visitor receives:** Refund confirmation email if the Admin processes a refund.

#### Audit & Accountability
- Every order is logged: buyer email, items, total, payment reference, date, status.
- Every price change is logged: old price, new price, admin who changed it, date.
- Every refund action is logged: admin who initiated it, amount, reason.

#### Validation Rules
- Checkout name: required, minimum 2 characters, maximum 100 characters
- Checkout email: required, valid email format
- Payment fields: validated and handled entirely by the payment gateway (not by the platform's own validation)

---

### Module 10: Comments & Ratings

#### Purpose & Business Context
Comments and ratings enable public engagement on book pages and editorial articles. They signal to new visitors that the content is active and being read, and they generate user-contributed perspectives on books. Since the platform has no user accounts in this version, all comments are made as guest submissions.

#### Who Interacts With This Module
- All visitors: submit comments, submit ratings
- Admin: review and moderate all comments

#### Comment Behavior

- Visitors leave comments on book detail pages and on editorial articles (all three channels).
- To leave a comment, a visitor must provide: a display name and email address. No account is required.
- Comments are displayed publicly with the display name. The email address is never shown publicly.
- Comment submission triggers an Admin review. Comments are not published automatically — they require Admin approval.
- Once approved, comments appear on the relevant page in chronological order.

#### Rating Behavior

- Visitors can rate a book on its detail page using a 5-star scale.
- Ratings are submitted alongside a comment, or independently.
- The aggregate star rating (average of all submitted ratings) is displayed on the book detail page.
- Each visitor can submit one rating per book per browser session. (Since there are no accounts, full deduplication is not possible — this is a known limitation in this version.)

#### Business Rules
1. All comments require Admin approval before becoming publicly visible. No auto-publication.
2. The Admin can approve, edit (for minor corrections only — not to change meaning), hide, or permanently delete any comment.
3. Comments deleted by the Admin cannot be recovered.
4. A comment left without a rating is valid and can be approved. A rating without any comment text is also valid.
5. The display name provided by the commenter is shown publicly. Visitors are responsible for the accuracy of their own name entry — the platform does not verify identity.
6. The Admin can hide a comment without deleting it, making it invisible to the public while retaining it internally.
7. Spam or abusive comments are deleted by the Admin. There is no automated spam filter required in this version, though the Admin panel must make it easy to find and action pending comments.

#### Edge Cases & Special Handling
- **Comment on an article or book that is later deleted:** If a parent article or book is deleted, all associated comments are also deleted. This is expected behavior.
- **Visitor submits the same comment multiple times:** The Admin will see duplicate submissions in the review queue and approves only one.
- **Comment contains personally identifiable information about a third party:** The Admin must have the ability to edit the comment to remove such information before approving, or reject the comment entirely.

#### Notifications & Communications
- **Admin receives:** Notification when a new comment is submitted, for review.
- **Commenter:** No notification is sent to the commenter when their comment is approved or rejected in this version.

#### Audit & Accountability
- All comment approvals, edits, hiddings, and deletions are logged with admin name and timestamp.

---

### Module 11: Reading Lists

#### Purpose & Business Context
Reading Lists allow visitors to save books into personal, named lists — such as "Books to Read," "My Translation Picks," or "Recommended for My Library."

**Critical Note — Open Question:** This feature is listed as "in scope" in the project requirements, but the platform does not support user accounts in this version. A reading list by definition requires persistent storage tied to a specific user across sessions. Without an account, a list cannot be saved between sessions.

**Proposed Resolution (see also Section 13 — Open Questions):** Two possible approaches exist:
- **Option A:** Reading lists are session-based only — the visitor builds a list in the current browser session, can share it via a generated shareable link, but the list is lost when the browser is closed.
- **Option B:** Reading lists require a lightweight email-based "save" feature — the visitor enters their email and the platform emails them a link to retrieve their list on a future visit.

**This conflict must be resolved by the stakeholder before this module can be finalized.** Until resolved, the scope below assumes Option A (session-based lists with shareable links) as the default approach.

#### Who Interacts With This Module
- All visitors: create lists, add books, share lists
- Admin: no direct interaction (no content management needed)

#### Reading List Behavior (Session-Based — Option A)
- A visitor can add any book from the catalog to a reading list by clicking an "Add to List" button on the book detail page.
- The visitor can name their list and add multiple books.
- The list persists only for the duration of the browser session.
- The visitor can generate a shareable URL that displays the list to anyone who visits it.
- The shared URL is valid indefinitely (the list data is stored in the URL itself or as a temporary server record for a defined period — this is a technical detail to be resolved).

---

### Module 12: Newsletter & Email Subscription

#### Purpose & Business Context
The newsletter is the primary retention and re-engagement tool for the platform's growing audience. Visitors who find value in the platform's content sign up to receive regular updates — new book alerts, featured articles, platform news. The platform must have the infrastructure to capture subscribers, manage the list, and send targeted campaigns.

#### Who Interacts With This Module
- All visitors: subscribe via email form
- Admin: manage subscriber list, create and send newsletter campaigns

#### Subscription Flow
1. Visitor enters their email address in any newsletter subscription form on the platform (homepage strip, footer, or inline prompts in articles).
2. The system sends a confirmation email asking the subscriber to confirm their subscription (double opt-in). The subscription is not active until confirmed.
3. Once confirmed, the subscriber is added to the active mailing list.
4. The subscriber receives future newsletter campaigns sent by the Admin.

#### Newsletter Campaign Management
- Admin creates campaigns in the Admin panel or via the integrated email service.
- Campaigns can be sent immediately or scheduled for a specific date and time.
- Admin can view open rates, click rates, and unsubscribe counts for each campaign.
- Subscribers can unsubscribe via a link in every email. Unsubscribes are processed immediately.

#### Business Rules
1. Double opt-in is mandatory. No subscriber is added to the active list without confirming their email address.
2. Every newsletter email must include a one-click unsubscribe link. This is non-negotiable and legally required in most jurisdictions.
3. Unsubscribed emails are retained in the system as "unsubscribed" — they cannot be emailed again unless the visitor re-subscribes voluntarily.
4. The platform must comply with applicable email marketing laws (GDPR where relevant, and any applicable Egyptian and Arab-region regulations).
5. The Admin can segment the subscriber list by signup date or by campaign engagement (opened/clicked) for targeted sends.

#### Edge Cases & Special Handling
- **Visitor signs up with an email already in the system:** If already subscribed and active, the system sends a message saying "You are already subscribed." If previously unsubscribed, the system treats this as a new subscription and requires re-confirmation.
- **Confirmation email goes to spam:** The visitor can request a resend from a confirmation page. After 24 hours without confirmation, the pending subscription is cleared.

#### Notifications & Communications
- **Visitor receives:** Double opt-in confirmation email upon submission.
- **Visitor receives:** Welcome email upon confirmed subscription.
- **Visitor receives:** Unsubscribe confirmation email when they unsubscribe.

#### Audit & Accountability
- All subscription events, campaign sends, and unsubscribes are logged.

---

### Module 13: B2B Institutional Subscriptions

#### Purpose & Business Context
The B2B subscription channel is the platform's primary revenue stream. Institutional clients — national libraries, universities, research centers, newspapers, television channels, and specialized journals — pay a recurring subscription fee to receive structured, curated content packages from the platform. This is fundamentally different from the public-facing website experience: it is a service delivery relationship, not a browsing relationship.

#### Who Interacts With This Module
- Admin: manages all subscription accounts, creates content packages, delivers outputs
- Institutional clients: receive content packages (they do not have a login portal in this version — see Out-of-Scope)

#### What Institutional Subscribers Receive

Different client types receive different content packages. The Admin manages which package is active for each subscriber:

| Package | Content Included | Typical Recipient |
|---|---|---|
| Bibliographic Feed | Daily updated bibliographic data (book metadata, summaries, cover images) for new books added to the catalog — delivered in a structured format | National libraries, university libraries |
| Research Reports Package | Weekly or monthly analytical reports summarizing new books by category | Research centers, specialized journals |
| News Service Package | Daily journalistic digests (from The World Reads channel) formatted for republication | Newspapers, online media |
| Media Package | Audio-visual content (podcast episodes, video scripts or files) licensed for broadcast | TV channels, radio stations |
| Full Platform Package | All of the above | Large institutional clients |

#### Business Rules
1. Subscription accounts are created and managed entirely by the Admin. There is no self-service portal for institutional clients in this version.
2. Each subscription has a start date, end date, and renewal date. The Admin must renew subscriptions manually before they expire.
3. Content delivery to subscribers is managed by the Admin outside the public-facing platform (by email, shared drive link, or agreed format). The platform does not have an automated delivery system for institutional packages in this version.
4. Subscription fees are negotiated and agreed off-platform. The scope document does not define pricing — the Admin manages commercial terms directly with each client.
5. The Admin must be able to view all active subscriptions, their renewal dates, and their package type in the Admin panel.

#### Edge Cases & Special Handling
- **Subscription expires without renewal:** The Admin is alerted by the system 30 days and 7 days before expiry. Content delivery ceases on the expiry date unless renewed.
- **Client requests a custom package not listed above:** The Admin can configure a custom package for that client manually in the system.

#### Notifications & Communications
- **Admin receives:** Automated alerts 30 days and 7 days before any subscription expires.

#### Audit & Accountability
- All subscription creations, renewals, expirations, and cancellations are logged.

---

### Module 14: Sponsored Publisher Profiles

#### Purpose & Business Context
Sponsored publisher profiles are a commercial feature that allows publishing houses to pay for premium placement and enhanced visibility on the platform. From the visitor's perspective, sponsored publishers appear more prominently. From the platform's perspective, this is a revenue source that also increases the quality and completeness of the publisher directory.

#### Who Interacts With This Module
- Admin: activates and deactivates sponsorship status for publishers
- Visitors: see sponsored publishers in highlighted positions

#### What Sponsored Status Provides
- Priority position at the top of the Publisher Directory page
- Appearance in the Publisher Spotlight section on the Homepage
- A "Featured" or "Sponsored" visual badge on the publisher profile page
- Enhanced profile page styling (larger banner image, more prominent layout — Admin configures)

#### Business Rules
1. Sponsorship status is activated and deactivated exclusively by the Admin.
2. A publisher must have an existing profile on the platform before sponsorship can be activated.
3. If multiple publishers are sponsored simultaneously, their order in the directory is determined by the date their sponsorship was activated (most recent first) or by Admin-defined manual ordering.
4. Sponsorship status is clearly labeled so visitors are aware that the prominence of the publisher's placement is commercially driven.
5. Sponsorship does not affect the content or accuracy of the publisher's profile — the same fields and data quality standards apply.

#### Audit & Accountability
- All sponsorship activations and deactivations are logged with date and admin name.

---

### Module 15: Search & Filtering

#### Purpose & Business Context
As the platform's content grows into hundreds or thousands of books, publisher profiles, and articles, visitors need powerful search and filtering tools to find what they are looking for efficiently. Search is also critical for translators who are looking for specific titles or publishers, and for researchers looking for books on a particular subject.

#### Who Interacts With This Module
- All visitors: search and filter content

#### Search Scope
The platform-wide search function covers:
- Book titles (Arabic and original-language)
- Author names
- Publisher names
- Editorial article headlines
- Summary content (partial match)

#### Filter Options for the Book Catalog
- By category (7 primary categories)
- By original language
- By translation status (Not Translated / Recommended for Translation / Translated)
- By publisher
- By publication year
- By purchase availability (Available for Purchase / Referral Only / Not Available)

#### Filter Options for the Publisher Directory
- By country
- By type (Arab / International)
- By sponsored status

#### Filter Options for Editorial Content
- By channel (World Reads / Book Harvest / Essence of Ideas)
- By category
- By date range

#### Business Rules
1. Search results must be sorted by relevance by default, with the option to sort by newest.
2. If a search returns zero results, the page must display a helpful "No results found" message with suggestions to broaden the search or browse by category.
3. Filters are additive — applying multiple filters narrows the results (AND logic, not OR).

---

### Module 16: Admin Panel

#### Purpose & Business Context
The Admin Panel is the internal command center from which the entire platform is operated. Every piece of content, every commercial relationship, every order, and every subscriber is managed from here. The panel must be efficient, organized, and easy to use for the editorial team who will be using it daily.

#### Who Interacts With This Module
- Admin / Editorial Team only

#### Admin Panel Sections

**16A — Book Management**
- View all books in the catalog (with filters: by category, by translation status, by publication status)
- Create new book records (all fields as defined in Module 2)
- Edit existing book records
- Delete book records (blocked if book has active orders)
- Change book publication status (Draft / Published)
- Bulk-update translation status for multiple books

**16B — Publisher Management**
- View all publisher profiles
- Create new publisher profiles
- Edit existing publisher profiles
- Delete publisher profiles (blocked if publisher has linked books)
- Activate / deactivate sponsored status per publisher

**16C — Author Submission Review (Publish Your Book)**
- View all pending, approved, and rejected submissions
- Review each submission's details
- Approve or reject submissions (rejection requires a written reason)
- Manage the submission fee amount
- View payment status for paid submissions

**16D — Editorial Content Management**
- View, create, edit, delete articles in all three editorial channels (World Reads, Book Harvest, Essence of Ideas)
- Schedule articles for future publication
- Set article visibility (Published / Draft / Scheduled)

**16E — Media Content Management**
- View, create, edit, delete entries in all three media channels (Watch Your Book, Book Talk, Novel & Story)
- Manage YouTube embed links, audio files, publication dates

**16F — Order Management**
- View all orders (by date, by status, by book)
- View individual order details
- Update order status (Pending → Completed; Completed → Refunded; etc.)
- Process refunds
- Export order history to a spreadsheet

**16G — B2B Subscription Management**
- View all active subscriptions with renewal dates
- Create new subscription accounts
- Renew, modify, or cancel subscriptions
- Receive and view subscription expiry alerts

**16H — Comment Moderation**
- View all pending comments awaiting review
- Approve, edit, hide, or delete comments
- View all published comments
- Search comments by keyword

**16I — Newsletter Management**
- View subscriber list and count
- Export subscriber list
- Create and send newsletter campaigns
- Schedule campaigns
- View campaign performance (opens, clicks, unsubscribes)
- Manage unsubscribed addresses

**16J — Reading List Management**
- Not applicable in the session-based model — the Admin has no direct management of individual reading lists. Shared list URLs are self-managing.

**16K — Homepage & Static Content Management**
- Configure homepage featured content (hero banner, featured books, featured articles)
- Edit static pages (About Us, Team, Privacy Policy, Terms of Use, Contact)
- Update platform statistics counters

**16L — Analytics Dashboard**
- Total visitors (daily, weekly, monthly)
- Most-viewed books and articles
- Top search terms and top categories
- Cart abandonment rate and conversion rate
- Newsletter subscriber growth and new author submissions
- Referral link performance summary across all Ambassadors

**16M — Social Auto-Post**

When the Admin publishes a new book or article, this panel allows them to simultaneously push an announcement post to the platform's Facebook page, X (Twitter) account, and Instagram account — without logging in to each social platform separately.

The Admin can invoke the AI Content Generation tool: the system sends the book's title, summary, and category to the external AI service and returns a draft caption. The Admin reviews and edits before confirming. The AI-generated text is always a starting point, never an automatic publication — the Admin always has final approval.

**Social Auto-Post Workflow:**
1. Admin saves a new book and sets its status to "Published."
2. The Social Auto-Post panel appears in the same screen.
3. Admin selects which platforms to post to (any combination of Facebook, X, Instagram).
4. Admin clicks "Generate Description" (or writes the caption manually).
5. Admin reviews, edits if needed, and confirms the post.
6. The system submits the post to each selected platform via its API.
7. Success or error status is displayed per platform in the Admin panel.
8. The action is logged: which platforms, which book, which admin, timestamp, and success or failure per platform.

**Business Rules for 16M:**
1. Social Auto-Post is always an optional Admin action. No book is ever auto-posted without explicit Admin confirmation.
2. The AI-generated caption is a draft only. The system will not post without a final Admin confirmation click.
3. If a post fails on one platform, the Admin sees the error for that platform. Successful posts to other platforms are not cancelled.
4. Social media credentials (access tokens for Facebook, X, Instagram) are stored securely in Admin settings and refreshed when expired.
5. The Admin can re-post a book to social media at any time after initial publication — not only at first publish.

**16N — Ambassador Management**
- Create Ambassador accounts (name, email, commission rate or points structure)
- View all Ambassador accounts and their status (Active, Paused, Closed)
- Generate and assign referral links per book per Ambassador
- View all referral link performance: clicks, conversions, revenue generated
- View commission totals per Ambassador and across all Ambassadors
- Record commission payouts (date, amount, method)
- Activate or deactivate individual Ambassador accounts

**16O — Notification Management**
- Create and send web push broadcast notifications to all opted-in subscribers
- Manage WhatsApp and Telegram channel updates
- View notification delivery reports: sent, delivered, opened, clicked
- View the Wish List trigger queue (pending triggered notifications for translation status changes)
- Configure per-channel notification settings and frequency limits

**16P — Abandoned Cart Recovery Configuration**
- Enable or disable the Abandoned Cart Recovery feature
- Set delay periods for the first and second recovery emails (in hours or days)
- Enable or disable discount codes in recovery emails
- Set discount code value (percentage or fixed amount) and expiry period
- View recovery email performance: sent, opened, clicked, and revenue recovered

#### Business Rules
1. The Admin panel is accessible only to authenticated Admin users. All Admin sessions expire after a defined period of inactivity.
2. Destructive actions (delete, reject, refund) require a confirmation step before execution.
3. All Admin actions are logged (see Security section).
4. The Admin panel must be fully functional on desktop browsers. Mobile access for the Admin panel is not a requirement in this version.

---

### Module 17: Bilingual Platform (Arabic / English)

#### Purpose & Business Context
The platform serves both Arabic-speaking users and international users — particularly foreign publishers and translators — who may not read Arabic. All public-facing content must be available in both Arabic and English, though the Arabic version is the primary language and the English version may lag behind in content completeness.

#### Who Interacts With This Module
- All visitors: switch languages using the language toggle
- Admin: manages content in both languages

#### Bilingual Rules
1. Arabic is the default language. Every visitor arrives in Arabic by default.
2. The language toggle is present in the top utility bar on every page.
3. Every piece of content has an Arabic version and an optional English version. If no English version exists for a content item, the English page for that item displays the Arabic content with a notice saying the English version is not yet available.
4. Language switching preserves the visitor's position — switching from the Arabic version of a book detail page takes them to the English version of the same book, not back to the homepage.
5. The URL structure distinguishes the two language versions (e.g., `/book/title-here/` for Arabic, `/en/book/title-here/` for English).
6. All system notifications and emails are sent in the language that matches the visitor's active language at the time of the action.

---

### Module 18: SEO & Technical Marketing Infrastructure

#### Purpose & Business Context
The platform's organic growth depends on search engine discoverability, social sharing, and strong technical performance. Every page must be optimally configured for both search engines and social platforms. This module also defines the platform's standards for page performance, mobile responsiveness, and conversion optimization — the technical foundation that the marketing team depends on.

#### SEO Requirements
- Every public page has a unique, descriptive page title and meta description.
- Every public page has Open Graph tags (for Facebook/LinkedIn sharing previews).
- Every public page has Twitter Card tags (for X/Twitter sharing previews).
- Book pages and editorial articles have structured data markup for search engines.
- All images have descriptive alt text.
- The sitemap is automatically updated when new content is published.
- Canonical URLs are set on all pages to prevent duplicate content issues.
- Social sharing buttons appear on: book detail pages, editorial articles, media entries, publisher profiles.
- The sharing buttons link to: Facebook, X (Twitter), WhatsApp, LinkedIn, Telegram, and copy-link.

#### Performance & Mobile Standards
- Every page must load within an acceptable performance window on standard mobile connections. Oversized images, unoptimized assets, and blocking resources that degrade page speed are not acceptable.
- The platform is fully responsive on all screen sizes — desktop, tablet, and mobile. All features (cart, search, filters, comments, Wish List, notification opt-in) must function without degradation on a mobile browser.
- The platform's bounce rate is actively monitored through the analytics tools in Module 20. The Admin team uses this data to identify pages with high exit rates and improve them.

#### Conversion Rate Optimization (CRO) Standards
- The book detail page must present the purchase call-to-action (Buy button or Referral button) prominently and above the fold on all screen sizes.
- The checkout flow must be a maximum of three steps: Cart Review → Checkout → Confirmation. No unnecessary steps between adding to cart and completing payment.
- The newsletter signup form must be present in at least three distinct locations on the platform: homepage, article footer, and site footer.
- The notification opt-in prompt must appear within the first 30 seconds of a session and must be dismissable.

#### Pixel & Tag Management
- Facebook Pixel is integrated on all public-facing pages to track visit and conversion events (see Module 20).
- Google Tag Manager is integrated as the container for all tracking scripts, allowing the marketing team to add and modify tracking configurations without requiring code deployments.

#### Business Rules
1. No page is published without a completed meta title, meta description, and featured image — these are required fields for all content types.
2. All images uploaded to the platform are compressed before storage. Oversized originals are not served directly to visitors.
3. The sitemap is submitted to search engines and updated automatically when new content is published or unpublished.
4. Any third-party tracking script not managed through Google Tag Manager must be explicitly approved before implementation.

---


---

### Module 19: Smart Notification System

#### Purpose & Business Context
The Smart Notification System keeps visitors connected to the platform between visits without requiring a full account. Rather than relying exclusively on email newsletters, the platform delivers real-time alerts through three distinct channels: web push notifications (delivered to the visitor's browser even when the platform is closed), WhatsApp, and Telegram. The system also includes a high-value automation: when a book on a visitor's Wish List transitions to "Translated" status, the platform automatically alerts that visitor — a feature with no equivalent in the Arabic book landscape.

#### Who Interacts With This Module
- All visitors: opt in and receive notifications
- Admin: manage notification channels, create broadcast campaigns, view delivery reports (from Module 16O)

#### Sub-Module 19A: Web Push Notifications

**What It Does:** Delivers browser-based push notifications to opted-in visitors. These appear in the visitor's operating system notification tray — even when the platform is closed.

**Opt-In Flow:**
1. A visitor arrives at the platform. Within the first 30 seconds, a browser-native permission prompt appears.
2. The visitor clicks "Allow" or "Block."
3. If "Allow," they are subscribed. If "Block," the prompt does not reappear in that session.
4. Visitors manage their push subscription at any time through their browser settings.

**Types of Web Push Notifications:**
- New book published: "A new book has been added — [Book Title]"
- New editorial article published: "New article in World Reads — [Article Title]"
- Wish List translation alert: "[Book Title] has been translated into Arabic!"
- Admin broadcast: any custom message the Admin chooses to send

**Business Rules:**
1. Web push notifications are only sent to visitors who have explicitly opted in through the browser permission prompt.
2. The Admin can send broadcast push notifications to all opted-in subscribers from Module 16O.
3. The Wish List translation alert is triggered automatically when a book's translation status changes to "Translated" — no manual Admin action is needed.
4. All push notifications must include a direct link to the relevant page on the platform.
5. The platform must not send more than three push notifications per day to any single subscriber (see Cross-Cutting Rule 13).

**Edge Cases & Special Handling:**
- **Visitor unsubscribes from push notifications:** Removed from the subscription list. Wish List alerts via push are no longer delivered. WhatsApp or Telegram subscriptions continue unaffected.
- **Visitor clears browser data:** Their push subscription is lost. They will be prompted to opt in again on their next visit.
- **Push notification service is unavailable:** Notifications are queued and delivered when service is restored.

---

#### Sub-Module 19B: WhatsApp Notification Channel

**What It Does:** Visitors subscribe to the platform's official WhatsApp broadcast channel or chatbot to receive curated book news, new translation recommendations, and personal Wish List alerts directly on WhatsApp.

**Opt-In Flow:**
1. A visitor sees the WhatsApp subscription option on the notification opt-in prompt or on any book page.
2. They click the WhatsApp subscribe button, which opens a pre-filled WhatsApp message or redirects them to follow the platform's WhatsApp channel.
3. Once subscribed, they receive platform updates at the cadence set by the Admin.

**For Personal Wish List Alerts via WhatsApp:**
When a visitor adds a book to their Wish List and opts in to WhatsApp notifications, they provide their WhatsApp number at that point. When the book's translation status changes, the system sends them a direct WhatsApp message.

**Business Rules:**
1. WhatsApp notifications are only sent to visitors who have explicitly subscribed.
2. The Admin sends WhatsApp channel updates from Module 16O.
3. Wish List alerts via WhatsApp are automatic system-triggered messages — no Admin action is required.
4. Visitors opt out by replying "STOP" or through the platform's notification settings.
5. WhatsApp messaging frequency must comply with WhatsApp's messaging policy to avoid account restrictions.

**Edge Cases & Special Handling:**
- **WhatsApp API unavailable:** The message is queued for delivery when service is restored.
- **Invalid or inactive WhatsApp number:** The delivery fails silently. The Admin receives a delivery failure report.

---

#### Sub-Module 19C: Telegram Notification Channel

**What It Does:** The platform operates an official Telegram channel or bot. Visitors subscribe to receive book news, new recommendations, and personal alerts via Telegram.

**Opt-In Flow:**
1. A visitor clicks the Telegram subscription link on the platform.
2. They are directed to the platform's official Telegram channel and click "Join."
3. They receive platform updates broadcast by the Admin.

**For Personal Wish List Alerts via Telegram:**
Visitors who subscribe to the platform's Telegram bot and link their Wish List (by sharing their registered Wish List email with the bot) receive direct Telegram messages when a Wish List book becomes translated.

**Business Rules:**
1. Telegram notifications are only sent to visitors who have joined the platform's Telegram channel or bot.
2. The Admin broadcasts channel updates from Module 16O.
3. Wish List alerts via Telegram are automatic system-triggered messages.
4. Visitors leave the Telegram channel by clicking "Leave Channel" in the Telegram app.

#### Cross-Module Connection
- Module 11 (Wish List) triggers Module 19 notifications when a Wish List book's translation status changes.
- Module 2 (Book Catalog) fires the notification event when the Admin updates a book's translation status to "Translated."
- Module 16O is the Admin's control center for all notification activity.

---

### Module 20: Visitor Analytics & Marketing Intelligence

#### Purpose & Business Context
The Visitor Analytics module gives the platform's marketing team a comprehensive, data-driven view of how visitors interact with the platform — what they click, how far they scroll, what they watch, where they abandon purchases, and how effectively ads convert into visits and sales. This intelligence drives continuous improvement of the platform's content, design, and commercial performance. The module operates invisibly to visitors (with appropriate disclosure in the Privacy Policy) and is accessible only to the Admin team.

#### Who Interacts With This Module
- Admin / Marketing team: view all reports and dashboards, configure tracking settings
- Visitors: tracked anonymously; their behavior generates the data

#### Sub-Module 20A: Event Tracking

**What It Does:** Records specific visitor interactions as events aggregated into reports that tell the marketing team which content is most engaging and which commercial moments are being acted on or abandoned.

**Events Tracked:**
- Page views (all pages)
- Book detail page views (with book title and category)
- Media video plays (which video, how long watched)
- Podcast plays (which episode, how long listened)
- "Add to Cart" clicks (which book, which price)
- Checkout initiated
- Purchase completed (with order value)
- "Add to Wish List" clicks
- Notification opt-in events (which channel: push, WhatsApp, Telegram)
- Newsletter subscription completed
- Social share clicks (which platform, which page)
- Ambassador referral link clicks (tracked separately in Module 22)
- Search queries entered

**Business Rules:**
1. Event tracking data is anonymized at collection — no individual visitor is identifiable from event data alone.
2. Event data is accessible only to the Admin team in the Analytics Dashboard (Module 16L).
3. Event tracking is always active. It cannot be turned off by individual visitors in this version (disclosed in Privacy Policy).

---

#### Sub-Module 20B: Platform Pixel Integration (Facebook Pixel & Google Tag Manager)

**What It Does:** Deeply integrates the platform with Facebook's advertising tracking system and Google Tag Manager to enable conversion tracking from paid advertising campaigns. When a visitor arrives from a Facebook or Instagram ad and completes a purchase, the Facebook Pixel records the conversion — enabling the marketing team to measure return on ad spend accurately.

**Facebook Pixel Tracks:** PageView, ViewContent (book detail pages), AddToCart, InitiateCheckout, Purchase (with order value and currency).

**Google Tag Manager:** Acts as the container for all tracking scripts. Allows the marketing team to add, edit, and manage tracking configurations without requiring platform code changes. The container code is installed once during platform setup.

**Business Rules:**
1. All tracking scripts must be loaded through Google Tag Manager — not hardcoded directly into pages.
2. The Privacy Policy must clearly disclose the use of Facebook Pixel and Google Tag Manager.
3. Google Tag Manager configuration changes do not require platform redeployment.

**Edge Cases & Special Handling:**
- **Visitor uses an ad blocker:** Some tracking events will not fire. This is expected. The marketing team must account for underreporting in their analysis.
- **Facebook Pixel data mismatch:** The platform's order records in the Admin panel are the authoritative source of truth.

---

#### Sub-Module 20C: Heatmaps (Microsoft Clarity)

**What It Does:** Integrates Microsoft Clarity to visualize where visitors spend their time on key pages — particularly book detail pages and the homepage. The marketing team uses this data to understand which elements attract attention, which are ignored, and whether the purchase button is receiving the interaction it should.

**What It Provides:**
- Click heatmaps: where visitors click most frequently on each page
- Scroll heatmaps: how far down each page visitors scroll before leaving
- Session recordings: anonymized recordings of individual visitor sessions

**Business Rules:**
1. Microsoft Clarity is integrated via Google Tag Manager.
2. Session recordings are anonymized. No personally identifiable information (names, emails, payment details) is visible — these fields are masked automatically by Clarity.
3. Heatmap and session recording data is accessible only to the Admin team.
4. The use of Microsoft Clarity is disclosed in the platform's Privacy Policy.

---

#### Sub-Module 20D: Abandoned Cart Recovery — Analytics Component

The performance of the Abandoned Cart Recovery system (Module 16P) is reported here. The Admin views:
- Total carts abandoned vs. total carts recovered
- Recovery email open rate and click rate
- Revenue attributed to recovery emails
- Discount code usage rate

This data informs decisions about delay periods, discount values, and whether recovery emails are effective.

---

### Module 21: Intelligent Recommendation Engine

#### Purpose & Business Context
The Recommendation Engine makes the platform smarter with every page a visitor views. Rather than showing every visitor the same static homepage and book list, the platform observes what categories and books a visitor engages with during their session and dynamically adjusts what it surfaces to them. This increases time on platform, deepens content engagement, and creates more purchase opportunities by showing visitors books that match their demonstrated interests.

Because the platform has no user accounts in this version, all personalization is session-based — it resets when the visitor closes their browser. When reader accounts are introduced in Phase 2, personalization will become persistent and significantly more powerful.

#### Who Interacts With This Module
- All visitors: receive personalized recommendations automatically (no action required)
- Admin: configures recommendation rules and weights in the Admin panel

#### Sub-Module 21A: Similar Books Recommendations

**What It Does:** On every book detail page, the platform displays a "You May Also Like" section showing books related to the one the visitor is currently viewing.

**Recommendation Logic:**
1. Books from the same category as the current book form the primary recommendation pool.
2. Within that pool, books most frequently purchased or viewed (aggregate data) are ranked higher.
3. Books with shared tags with the current book are weighted upward.
4. Books in the same categories as other books the visitor viewed during their current session are also included in the pool.

**Business Rules:**
1. The "You May Also Like" section displays a maximum of 6 books.
2. The current book is never shown in its own recommendation section.
3. If fewer than 2 books exist in the recommendation pool, the section is hidden.
4. Recommendations are based on aggregate visitor behavior data — no individual visitor's data is used to generate recommendations for other visitors.

---

#### Sub-Module 21B: Homepage Personalization

**What It Does:** The platform's homepage adapts the "Latest Books" section based on the visitor's behavior during their current session. If a visitor has spent time in "Technology & Science," the Latest Books section prioritizes books from that category on their next homepage visit within the same session.

**Personalization Logic:**
1. The platform tracks which book categories a visitor views during their session.
2. The most-visited category is designated the visitor's "session interest."
3. The homepage "Latest Books" section re-orders its content to show books from the session-interest category at the top.
4. If the visitor shows no clear pattern, the Admin's default editorial curation is shown.

**Business Rules:**
1. Session personalization is active automatically for all visitors. No opt-in is required.
2. Personalization resets completely when the visitor closes their browser.
3. The Admin's editorially curated content (hero banner, featured article) is never overridden by personalization. Personalization only affects the "Latest Books" grid.
4. Personalization data is stored only in the visitor's active browser session — it is never retained after the session ends.

**Future Note:** When reader accounts are introduced in Phase 2, personalization will become persistent across sessions. The current session-based model is a deliberate first-phase approximation.

---

### Module 22: Ambassador Referral Program

#### Purpose & Business Context
The Ambassador Referral Program transforms the platform's most enthusiastic advocates — book reviewers, literary bloggers, social media influencers, and content creators in the Arab cultural space — into a distributed sales and awareness channel. Each Ambassador receives unique referral links specific to individual books. When a visitor arrives via one of these links and completes a purchase, the Ambassador earns a commission. The program is managed through the Admin panel (Module 16N), and Ambassadors access their performance data through a dedicated Ambassador Dashboard.

#### Who Interacts With This Module
- Ambassadors: use their personal dashboard to view links, earnings, and performance data
- Admin: create and manage Ambassador accounts, generate referral links, record payouts
- Visitors: arrive at book pages via Ambassador referral links (referral is tracked automatically)

#### Ambassador Account Creation
The Admin creates Ambassador accounts manually in Module 16N. The Admin sets the Ambassador's name, email address, and commission structure — either a percentage of each referred sale or a fixed amount per sale. Ambassadors do not self-register.

#### Referral Link Generation
- Referral links are book-specific and Ambassador-specific. One Ambassador promoting five books has five distinct referral links.
- The Admin generates referral links in Module 16N for a specific Ambassador and a specific book.
- The generated link is the book's standard detail page URL with a unique tracking parameter appended.
- The platform tracks: clicks per referral link, conversions (completed purchases), and the revenue value of those purchases.

#### Ambassador Dashboard
Ambassadors log in to a dedicated dashboard section — separate from the public platform and from the Admin panel — showing:
- All referral links assigned to the Ambassador, with corresponding book title and cover
- Per-link performance: total clicks, total conversions, total revenue generated
- Total earned commissions or points to date and a breakdown by date range
- Payout history: dates and amounts of commissions paid out by the Admin
- A download button to export a performance summary

The Ambassador cannot modify links, request specific payout amounts, or view any other Ambassador's data.

#### Commission & Payout Mechanics
- Commission is calculated automatically for every completed purchase originating from a referral link.
- The Admin views outstanding commission totals in Module 16N and records payouts manually. Payout happens through the agreed off-platform method (bank transfer, digital wallet, etc.).
- When the Admin records a payout, the Ambassador's outstanding balance is reduced and the payout appears in their Payout History.

**Business Rules:**
1. Referral links are only active for currently published books. If a book is unpublished or deleted, its referral links stop converting.
2. Referral attribution is valid for the duration of the visitor's browser session only. A new session does not re-attribute the referral.
3. Only completed and confirmed purchases generate commission. Abandoned carts and pending orders do not.
4. If a purchase is refunded, the commission for that purchase is reversed in the Ambassador's commission total.
5. The Admin can pause an Ambassador's account without deleting it. A paused Ambassador cannot log in and their referral links no longer generate commissions.
6. Commission rate changes apply only to purchases made after the change — no retrospective adjustments.
7. Last-click attribution applies when multiple Ambassadors' links are clicked before a purchase (see Cross-Cutting Rule 11).

**Edge Cases & Special Handling:**
- **Two Ambassadors' links clicked before same purchase:** Last-click attribution — commission goes to the most recently clicked link's Ambassador.
- **Visitor clicks referral link but purchases a different book:** No commission is earned. Commission is only on the specific linked book.
- **Ambassador account closed:** All historical data is retained in the Admin panel. Dashboard is deactivated.
- **Commission results in a fractional amount:** The system rounds to two decimal places in the Ambassador's favor.

**Notifications & Communications:**
- Ambassador receives: Account creation email with login credentials.
- Admin receives: No automated notification per referral — commissions accumulate and Admin reviews at their own cadence.

**Audit & Accountability:**
- All Ambassador account events, payout records, referral clicks, and commission-generating conversions are logged with timestamps.

**Validation Rules:**
- Ambassador email: required, valid format, must be unique in the system
- Commission rate: required, numeric, within acceptable range set by Admin

## 6. Cross-Cutting Business Rules

### Rule 1 — Arabic First, English Optional
Every content item is created in Arabic first. The English version is optional and secondary. No content item can be published in English only. If an English version exists, it is always accompanied by an Arabic version.

### Rule 2 — Admin Approval Gate
No user-generated content of any kind becomes publicly visible without explicit Admin approval. This applies to: author submissions (Publish Your Book) and visitor comments. This rule exists to maintain editorial quality and platform credibility.

### Rule 3 — Publisher Profile Must Precede Book
No book can be listed in the catalog without being linked to an existing publisher profile. This ensures that every book's origin is traceable and that publisher contact information is always accessible to translators and buyers.

### Rule 4 — Content Integrity of Linked Records
When a publisher profile is deleted, all books linked to it must be reassigned or deleted first. When a book is deleted, all comments on that book are also deleted. When an article is deleted, all comments on that article are also deleted. There are no orphaned records.

### Rule 5 — Price Transparency
Every book offered for direct purchase must have a clearly stated price on the detail page before being set to "Published" status. No book can be published with a "Direct Purchase" option and no price.

### Rule 6 — No Reader Accounts in This Version
The platform does not support visitor/reader registration or login in this version. All visitor interactions (cart, comments, ratings, newsletter signup, reading lists) are either session-based or require only an email address. This is a deliberate scope boundary, not an oversight.

### Rule 7 — First Author Submission Is Free, All Subsequent Are Paid
The system tracks author submissions by email address. The first submission from a given email address is free. All subsequent submissions require payment before the form can be submitted. This rule cannot be bypassed — the payment requirement is enforced automatically.

### Rule 8 — Statistics Must Reflect Reality
The homepage statistics counters (books cataloged, publishers listed, translated books, years of operation) must display live data from the database. They must never show zero when content exists, and must never show inflated figures. These counters are a trust signal to institutional clients evaluating the platform.

### Rule 9 — Sponsored Content Is Labeled
All commercially sponsored placements (sponsored publisher profiles, featured publisher spots) must carry a visible label indicating their commercial nature. Visitors have a right to know when a prominent placement is paid for.

### Rule 10 — Two-Language Consistency for Core Records
When a book title, publisher name, or author name is entered in Arabic, the Admin must also enter the original-language version. Bilingual completeness on core record identifiers is required for the platform's usefulness to translators and international visitors.

### Rule 11 — Ambassador Referral Attribution Is Last-Click
When a visitor clicks multiple referral links from different Ambassadors before making a purchase, the commission is attributed entirely to the most recently clicked referral link. No commission splitting between Ambassadors occurs.

**Why It Exists:** Split attribution creates disputes between partners. Last-click is the industry-standard approach for simple referral programs and is the most defensible rule to enforce and communicate to Ambassadors.
**Enforcement:** The system records a timestamp with every referral link click. The referral link associated with the most recent click before checkout completion is the one credited.
**Affects:** Module 22 (Ambassador Program), Module 9 (E-Commerce).

### Rule 12 — No Social Auto-Post Without Explicit Admin Confirmation
No post is ever automatically sent to Facebook, X, or Instagram without the Admin reviewing and confirming the content. The AI-generated caption is a draft only, not a final publication.

**Why It Exists:** AI-generated content can contain errors, inappropriate phrasing, or factual inaccuracies that would damage the platform's public reputation if published without review.
**Enforcement:** The Social Auto-Post panel in Module 16M requires a final confirmation click before any post is submitted. The system has no automatic posting mode.
**Affects:** Module 16 (Admin Panel — 16M), Section 8 (Social Media API Integrations).

### Rule 13 — Notification Frequency Must Protect Subscriber Experience
The platform must not send more than three push notifications per day to any single web push subscriber, and must not send more than one WhatsApp or Telegram broadcast message per day per subscriber. Personally triggered alerts (such as Wish List translation alerts) are not counted against this daily limit.

**Why It Exists:** Notification fatigue causes subscribers to unsubscribe and damages the platform's relationship with its audience. Triggered alerts (Wish List alerts) are expected and high-value; broadcast messages are the ones that require limiting.
**Enforcement:** The notification system enforces per-subscriber daily limits automatically. Admin broadcast messages count against the limit.
**Affects:** Module 19 (Smart Notification System), Module 16O (Notification Management).

### Rule 14 — Abandoned Cart Recovery Requires Prior Email Capture in Checkout
Abandoned cart recovery emails may only be sent to visitors whose email address was captured during the checkout initiation of the same abandoned session. Email addresses collected from other sources (newsletter, Wish List, comment submission) must never be used for cart recovery.

**Why It Exists:** Using an email address collected for one purpose to send cart recovery emails violates the visitor's expectation of how their data is used and may breach applicable privacy and marketing regulations.
**Enforcement:** The Abandoned Cart Recovery system checks that the email used for recovery was entered in the checkout flow of the abandoned cart session. No cross-purpose email use is permitted.
**Affects:** Module 9 (E-Commerce), Module 20 (Analytics), Module 12 (Newsletter).

---

## 7. Key User Journeys

### Journey 1 — A New Visitor Discovers the Platform and Purchases a Book

**Starting State:** A new visitor arrives at the Books Platform homepage for the first time. They have found the platform via a social media share or search engine result. They have no prior knowledge of the platform.

The visitor lands on the Arabic homepage and sees the platform's hero banner with its tagline. They notice the "Latest Books" grid below and spot a cover that interests them. They click on the book and land on the book detail page.

On the detail page, they read the Arabic summary and find the book compelling. They see it is available for direct purchase at a stated price. They click the purchase button and are taken to their shopping cart, which now shows one item.

They proceed to checkout. They enter their full name and email address. The payment form appears (provided by the integrated payment gateway). They enter their payment card details and confirm the order.

The payment is processed successfully. They see an order confirmation page showing their order number and the book purchased. Simultaneously, a confirmation email arrives in their inbox.

**End State:** The visitor has completed a purchase. An order record exists in the Admin panel. The visitor has their confirmation email.

**Failure Case:** If the payment fails (card declined, gateway error), the visitor is returned to the checkout page with a clear error message explaining the failure. Their cart is preserved and no order is created. They can try again or exit.

---

### Journey 2 — An Author Submits Their First Unpublished Work

**Starting State:** An Arab writer has completed their first novel and wants to gain visibility among publishers. They have found the "Publish Your Book" section.

The author clicks on "Publish Your Book" in the main navigation. They land on the section's page, which explains the service and shows previously approved submissions. They find a "Submit Your Work" button and click it.

The submission form loads. The author completes all fields: their full name, email, a 200-word biography, the novel's title, its genre (Novel), a 400-word summary, a cover image file, and the full manuscript as a PDF. They toggle "Allow Free Download" to yes, meaning any visitor can download their manuscript. They review the form and submit.

The system checks their email address. This is their first submission from this address — no payment is required. The form is submitted successfully.

The author sees a confirmation message: "Your submission has been received. Our editorial team will review it and notify you by email."

The Admin receives a notification of a new submission. The Admin reviews the submission, finds it meets content standards, and approves it. The system sends the author an approval email with the URL of their listing.

**End State:** The author's work is now publicly visible in the "Publish Your Book" section. Visitors can read the summary and download the manuscript. Publishers can use the author's contact email to reach out directly.

**Failure Case — Rejection:** If the Admin rejects the submission, they enter a reason (e.g., "The summary does not describe the work's content clearly enough"). The author receives a rejection email with this reason. The submission is not published.

**Failure Case — Second Submission:** If the same author submits a second work later using the same email address, the form requires payment before submission is possible. The author sees the fee amount and a payment prompt.

---

### Journey 3 — A Translator Researches Books for Translation Rights

**Starting State:** A professional translator is looking for French-language books published in the last two years that are not yet translated into Arabic and are worth pursuing for translation rights.

The translator navigates to the "Books Recommended for Translation" section. They use the filter controls to select: Original Language = French, Category = Literature & Languages.

The filtered results show a list of French books recommended for translation. The translator reads the summaries and notes three books that interest them. For each book, they click through to the book detail page, where they see the publisher's name linked to their publisher profile.

They visit the publisher profile pages for all three books. Each profile shows the publisher's website URL and contact email address. The translator notes the contact information and plans to reach out to each publisher to inquire about Arabic translation rights.

**End State:** The translator has a shortlist of promising titles and the direct contact information they need to begin rights negotiations. The platform has served its core translation-facilitation mission.

---

### Journey 4 — An Admin Adds a New Book and Publishes an Editorial Article About It

**Starting State:** A new book has just been released internationally and the editorial team wants to add it to the catalog and publish a World Reads article about it.

The Admin logs into the Admin panel. They navigate to Book Management and click "Create New Book." They complete all required fields: title in Arabic and original language, author, publisher (they check that the publisher already has a profile — it does), publication year, language, category (Ideas & Politics), ISBN, summary in Arabic, cover image upload, translation status (Not Translated), purchase option (Referral to Publisher), and the publisher's purchase URL.

They set the book status to "Published" and save. The book is immediately visible on the public site in the Ideas & Politics category and can be found via search.

The Admin then navigates to Editorial Content Management and opens The World Reads channel. They click "Create Article." They write a 450-word news piece about the book in Arabic, select the related book from the catalog (which links the book cover and a "View Book" button to the article), upload a featured image, set the publication date to today, and click "Publish."

The article is immediately live. It appears in The World Reads channel and on the homepage featured article spot (if the Admin selects it).

**End State:** The book is in the catalog, the article is live, and visitors can read about the book and click through to the publisher's site to purchase it.

---

### Journey 5 — An Institutional Subscriber Approaches the Platform for a Subscription

**Starting State:** A regional newspaper's digital content team has heard about Books Platform and wants to subscribe to the daily news service to supplement their own book coverage.

The newspaper contacts Books Platform through the "Contact Us" form or email. The Admin team reviews the inquiry and agrees on a package: the News Service Package (daily World Reads digests for republication).

The Admin creates a new subscription account in the B2B Subscription Management section of the Admin panel: client name, contact email, package type, start date, end date, and agreed renewal terms.

The Admin begins delivering daily digests to the newspaper's designated email address in the agreed format. The subscription shows as active in the Admin panel.

The system alerts the Admin 30 days before the subscription's annual renewal date. The Admin contacts the client, confirms renewal, and updates the subscription end date in the Admin panel.

**End State:** The subscription is active and delivering value. The Admin panel tracks the renewal schedule.

---

### Journey 6 — An Ambassador Promotes a Book and Tracks Their Earnings

**Starting State:** A literary influencer with a large Arabic social media following has been approved as a Books Platform Ambassador by the Admin. The Admin has created the Ambassador's account with a 10% commission rate and generated three referral links — one for each of three recently published books the Ambassador has agreed to promote.

The Ambassador logs in to their Ambassador Dashboard. They see the three referral links listed with the corresponding book covers and titles. They copy the referral link for the first book and paste it into their Instagram bio and story, directing their followers to the book on Books Platform.

Over the following week, 340 of their followers click the referral link. 42 of those visitors complete a purchase. The Ambassador's dashboard updates, showing 340 clicks, 42 conversions, and the total commission earned from those 42 sales.

At the end of the month, the Admin reviews outstanding commissions in Module 16N, transfers the earned amount to the Ambassador's bank account, and records the payout in the system. The Ambassador's dashboard now shows the payout in their Payout History and their outstanding balance is updated accordingly.

**End State:** The Ambassador has earned a commission for their promotional work. The platform has acquired 42 new purchases through a channel that did not exist before. The payout is recorded and auditable.

**Failure Case — Purchase Refunded:** One of the 42 purchasers requests a refund. The Admin processes the refund. The commission for that specific purchase is automatically reversed from the Ambassador's outstanding commission total. The Ambassador's dashboard reflects the updated figure.

**Failure Case — Ambassador's link stops working:** The book associated with the referral link is unpublished by the Admin. The link now routes to a "book not found" page. The Ambassador's dashboard shows zero new conversions from that point. The Ambassador contacts the Admin to request a replacement link for a different book.

---

## 8. Integration Points & External Dependencies

### YouTube

**Purpose:** All video content on the platform (Watch Your Book, Novel & Story) is hosted on YouTube and embedded on the platform via YouTube's embed system.
**Direction:** The platform calls out to YouTube — it embeds YouTube-hosted videos via their embed URL.
**What data is exchanged:** The embed URL is stored in the platform. YouTube serves the video player and the video file to visitors.
**Failure handling:** If YouTube is unavailable, the video embed area shows a player error. The rest of the page is unaffected.
**Fallback behavior:** The platform degrades gracefully — all text content around the video remains accessible.

---

### Social Media Platforms (Facebook, X, Instagram, Telegram, LinkedIn, YouTube)

**Purpose:** Social sharing buttons on content pages allow visitors to share links to the platform's books, articles, and media on their personal social networks. Static social media profile links in the header and footer direct visitors to the platform's own accounts.
**Direction:** Outbound only — the platform links out. There is no incoming social media data feed.
**What data is exchanged:** Sharing buttons pass the current page URL and, via Open Graph/Twitter Card metadata, a title, description, and thumbnail image.
**Failure handling:** If a social platform is unavailable, only the corresponding share button is affected. All other platform functionality continues normally.

---

### Payment Gateway (Not Yet Specified)

**Purpose:** To process direct book purchases made through the platform's e-commerce module.
**Direction:** The platform sends payment requests to the gateway; the gateway returns a success or failure status.
**What data is exchanged:** Order total, currency, buyer email, and a transaction reference. The platform does not store raw payment card data — this is handled entirely by the payment gateway.
**Failure handling:** If the payment gateway is unavailable during checkout, the visitor sees a "Payment service unavailable" message. No order is created. The visitor's cart is preserved for the session.
**Fallback behavior:** Checkout is blocked. No alternative payment method exists in this version. The Admin must be alerted to gateway downtime.
**Important note:** The payment gateway provider has not been finalized at the time of writing this document. The platform design must be gateway-agnostic enough to accommodate whichever provider is ultimately chosen. This is an open constraint (see Section 13).

---

### Email Service Provider (Newsletter & Transactional Emails)

**Purpose:** To send transactional emails (order confirmations, submission confirmations, subscription alerts) and newsletter campaigns to subscribers.
**Direction:** The platform sends outbound email via the email service provider's system.
**What data is exchanged:** Subscriber email addresses, campaign content, and delivery status reports.
**Failure handling:** If the email service is unavailable, emails are queued and delivered when service is restored. Order confirmations are the highest priority.
**Fallback behavior:** The platform degrades gracefully — purchases and submissions are processed normally even if the confirmation email is delayed.

---

### Audio Hosting (Podcast — Book Talk)

**Purpose:** To host and serve audio files for the Book Talk podcast channel.
**Direction:** Either directly hosted on the platform's server or embedded from an external podcast platform.
**What data is exchanged:** The audio file URL is stored in the platform and served to visitors.
**Failure handling:** If externally hosted audio is unavailable, the player shows an error. If self-hosted, audio availability depends on the platform's server.
**Note:** The choice between self-hosting and an external podcast platform has not been finalized. This must be decided before this module is built (see OQ-04).

---

### Web Push Notification Service

**Purpose:** Delivers browser-based push notifications to opted-in visitors for new books, new articles, and Wish List translation alerts (Module 19A).
**Direction:** Outbound — the platform sends notification events to the push service; the push service delivers them to subscribed browsers.
**What data is exchanged:** Notification title, message body, destination URL, and the list of browser subscriptions. No personally identifiable visitor information is exchanged.
**Failure handling:** If the push service is unavailable, notifications are queued and delivered when service is restored. Wish List alerts are delivered as soon as the service recovers.
**Fallback behavior:** Visitors who have opted in do not receive push notifications during the outage. All other platform functionality is entirely unaffected.
**Note:** The specific push notification service provider has not been finalized (see OQ-09).

---

### WhatsApp Business API

**Purpose:** Sends WhatsApp messages to subscribers who have opted in to WhatsApp notifications, including broadcast updates and individual Wish List translation alerts (Module 19B).
**Direction:** Outbound — the platform sends messages to the WhatsApp Business API, which delivers them to subscribers' WhatsApp accounts.
**What data is exchanged:** Subscriber WhatsApp phone numbers, message content, and delivery status reports.
**Failure handling:** Messages are queued and retried automatically by the WhatsApp Business API. Permanent failures (e.g., invalid number) are recorded in the Admin's delivery report.
**Fallback behavior:** If WhatsApp is unavailable, only WhatsApp-channel subscribers are affected. Web push and Telegram subscribers continue receiving notifications normally.
**Note:** The specific WhatsApp Business API provider has not been finalized (see OQ-07).

---

### Telegram Bot API

**Purpose:** Powers the platform's official Telegram channel or bot, enabling broadcast updates to Telegram subscribers and individual Wish List alerts to Telegram users (Module 19C).
**Direction:** Outbound — the platform sends messages to the Telegram Bot API, which delivers them to channel members or individual bot subscribers.
**What data is exchanged:** Message content, channel ID or individual chat IDs, delivery status.
**Failure handling:** Telegram API outages are rare. If unavailable, messages are retried automatically.
**Fallback behavior:** If Telegram is unavailable, only Telegram-channel subscribers are affected. Other notification channels continue normally.

---

### Facebook Graph API (Social Auto-Post)

**Purpose:** Enables the Admin to post content directly to the platform's official Facebook page from within the Admin panel as part of the Social Auto-Post feature (Module 16M).
**Direction:** Outbound — the platform submits post content to the Facebook Graph API on the Admin's behalf.
**What data is exchanged:** Post caption text, book cover image URL, book detail page URL. A Page Access Token stored securely in Admin settings authorizes the connection.
**Failure handling:** If the API is unavailable or the access token has expired, the post fails and the Admin sees an error message. The Admin must retry manually or refresh the access token.
**Fallback behavior:** Other social platforms (X, Instagram) are unaffected by a Facebook API failure. The book is published on the platform regardless of social posting success or failure.

---

### X (Twitter) API (Social Auto-Post)

**Purpose:** Enables the Admin to post content to the platform's official X account from within the Admin panel as part of the Social Auto-Post feature (Module 16M).
**Direction:** Outbound — the platform submits post content to the X API on the Admin's behalf.
**What data is exchanged:** Post text (character limit enforced by the system), book cover image, destination URL. Authorization credentials stored securely in Admin settings.
**Failure handling:** Post failure is shown as an error in the Admin panel. The Admin retries manually.
**Fallback behavior:** Facebook and Instagram posts are unaffected by an X API failure.

---

### Instagram Graph API (Social Auto-Post)

**Purpose:** Enables the Admin to post content to the platform's official Instagram account from within the Admin panel as part of the Social Auto-Post feature (Module 16M).
**Direction:** Outbound — the platform submits post content to the Instagram Graph API.
**What data is exchanged:** Image file (book cover), caption text, and authorization credentials stored securely.
**Failure handling:** Post failure is shown as an error in the Admin panel.
**Fallback behavior:** Facebook and X posts are unaffected by an Instagram API failure.
**Note:** Instagram posting via API requires the account be an Instagram Business or Creator account linked to a Facebook Page.

---

### OpenAI API (AI Caption Generation — Social Auto-Post)

**Purpose:** Generates draft social media captions for new books when the Admin clicks "Generate Description" in the Social Auto-Post panel (Module 16M). The system sends book data to the API and receives a suggested caption.
**Direction:** Outbound — the platform sends book title, summary, and category to the OpenAI API; receives generated text.
**What data is exchanged:** Book title, summary, and category (no personal visitor data is ever sent to this API). The generated text is returned and displayed in the Admin panel for Admin review.
**Failure handling:** If the OpenAI API is unavailable, the "Generate Description" button shows an error. The Admin writes the caption manually. The social post can still proceed.
**Fallback behavior:** Social Auto-Post works entirely without AI generation — the Admin always has the option to write the caption manually. AI generation is a convenience feature, not a dependency.
**Note:** The OpenAI API incurs a per-request cost. Usage monitoring is recommended (see OQ-10).

---

### Microsoft Clarity (Heatmaps)

**Purpose:** Provides heatmap visualization and session recording for key platform pages to help the marketing team understand visitor behavior (Module 20C).
**Direction:** Outbound — Clarity's script, loaded via Google Tag Manager, sends anonymized behavioral data to Microsoft Clarity's servers.
**What data is exchanged:** Anonymized click patterns, scroll depth, and session navigation paths. No personally identifiable information. Payment fields and email fields are masked automatically by Clarity.
**Failure handling:** If Clarity is unavailable, no heatmap data is collected during the outage. Platform functionality is entirely unaffected.
**Fallback behavior:** The platform operates normally. The absence of Clarity data is a loss of analytics insight only.

---

### Facebook Pixel & Google Tag Manager

**Purpose:** Facebook Pixel tracks visitor behavior and conversion events for paid advertising measurement. Google Tag Manager is the container through which all tracking scripts (including the Pixel) are loaded and managed (Module 20B).
**Direction:** Outbound — scripts run in the visitor's browser and send data to Facebook and Google servers.
**What data is exchanged:** Page view events, product view events, cart events, purchase events with order values. Personal contact details (email, name) are only shared with Facebook Pixel in hashed form if advanced matching is enabled.
**Failure handling:** If Facebook's servers are unavailable, Pixel events fail silently. Platform functionality is unaffected. Campaign performance data will be incomplete for the outage period.
**Fallback behavior:** All tracking is best-effort. The platform's own order records are the authoritative source of truth for sales data, regardless of what Pixel reports.

---

## 9. Security, Access Control & Compliance

### Access Control Summary

| Action | Visitor | Ambassador | Admin |
|---|---|---|---|
| Browse all public content | ✅ | ✅ | ✅ |
| Purchase books | ✅ | ✅ | ✅ |
| Submit comments | ✅ | ✅ | ✅ |
| Rate books | ✅ | ✅ | ✅ |
| Subscribe to newsletter | ✅ | ✅ | ✅ |
| Submit to Publish Your Book | ✅ | ✅ | ✅ |
| Add to Wish List | ✅ | ✅ | ✅ |
| Opt in to notifications | ✅ | ✅ | ✅ |
| View own Ambassador Dashboard | ❌ | ✅ | ✅ |
| View own referral link performance | ❌ | ✅ | ✅ |
| View other Ambassadors' data | ❌ | ❌ | ✅ |
| Create/Edit book records | ❌ | ❌ | ✅ |
| Create/Edit publisher profiles | ❌ | ❌ | ✅ |
| Approve/Reject comments | ❌ | ❌ | ✅ |
| Approve/Reject author submissions | ❌ | ❌ | ✅ |
| Manage orders and refunds | ❌ | ❌ | ✅ |
| Manage subscriptions | ❌ | ❌ | ✅ |
| Manage newsletter campaigns | ❌ | ❌ | ✅ |
| Post to social media via Auto-Post | ❌ | ❌ | ✅ |
| View heatmap and analytics data | ❌ | ❌ | ✅ |
| Manage Ambassador accounts | ❌ | ❌ | ✅ |
| Configure notification system | ❌ | ❌ | ✅ |
| Configure Abandoned Cart Recovery | ❌ | ❌ | ✅ |
| Access Admin panel | ❌ | ❌ | ✅ |
| View full order history | ❌ | ❌ | ✅ |
| View platform analytics | ❌ | ❌ | ✅ |

### Sensitive Data Handling

**Visitor purchase data:** Name and email address collected at checkout are stored for order fulfillment and support purposes. Payment card data is never stored on the platform — handled entirely by the payment gateway.

**Wish List data:** The email address used to save a Wish List is stored to enable list retrieval and translation notification alerts. It is used only for Wish List functionality and Wish List-triggered notifications.

**Author submission data:** Name, email, and manuscript file collected during author submissions are stored for editorial review and record-keeping. Contact email is publicly visible on approved listings — this is intentional and disclosed in the submission form.

**Newsletter subscriber data:** Email addresses collected for newsletter subscriptions are used only for newsletter purposes. Not shared with third parties.

**Commenter data:** Display names are public. Email addresses provided with comments are stored internally but never displayed publicly.

**Ambassador data:** Ambassador names, emails, commission rates, earnings, and payout history are stored and accessible only to the Admin and the individual Ambassador within their own dashboard.

**Behavioral tracking data:** Visitor click events, page views, and session behavior are collected anonymously through Google Tag Manager, Facebook Pixel, and Microsoft Clarity. No individual visitor is identifiable from this data. Disclosed in the Privacy Policy.

**Retention:** Order records retained for a minimum period consistent with applicable commercial law. Subscriber and Wish List data retained until deletion request. Author submission records retained indefinitely. Ambassador account data retained for audit purposes even after account closure.

### Document & File Security

Files uploaded to the platform (book cover images, author manuscript PDFs, publisher banner images) are stored on the platform's file server. Manuscript PDFs uploaded for author submissions where the author has permitted free download are accessible via a direct link on the public listing. Manuscripts where the author has not permitted free download are stored but not linked publicly — they are retained for Admin reference only.

### Account Security Events

- **Admin login from an unrecognized location:** Admin is prompted for additional verification.
- **Multiple failed Admin login attempts:** Account is temporarily locked and the registered Admin email is notified.
- **Admin session inactivity:** Session expires after a defined period. Admin must log in again.
- **Admin account deactivation:** All active sessions for that account are invalidated immediately.

### Compliance Considerations

- **Email marketing:** All newsletter emails must include an unsubscribe link. Double opt-in is mandatory. This is required by GDPR for subscribers in the European Union and is best practice regardless of geography. Abandoned Cart Recovery emails must also include an unsubscribe option.
- **Data privacy:** A Privacy Policy page is present on the platform and must accurately describe all data collected — including tracking tools (Pixel, Clarity, GTM), Wish List email storage, notification opt-ins, and Ambassador data — how it is used, and how it can be deleted on request.
- **Content copyright:** The platform publishes summaries and editorial commentary about books — not reproductions of book content. This is editorial and journalistic use, not reproduction.
- **Author submissions:** The platform must make clear in its Terms of Use and on the submission form that it does not claim any intellectual property rights over submitted works.
- **Ambassador agreements:** Commission terms must be documented in writing between the platform and each Ambassador before the account is activated.
- **AI-generated content disclosure:** All AI-assisted content (Novel & Story videos, AI-generated social captions) must be clearly labeled as AI-assisted. The Admin must be aware when any social caption was AI-generated, and the public-facing platform must carry the AI production disclosure on all Novel & Story entries.

---

## 10. Explicit Out-of-Scope Declarations

### Reader / Visitor Accounts — Not Implemented in Current Phase

**What It Is:** A system allowing general visitors and readers to create personal accounts with a username and password, giving them persistent identities on the platform.

**Why It Is Excluded:** Adding user accounts significantly increases the complexity of the system — it requires email verification, password management, account settings, security around stored credentials, and GDPR-compliant data deletion flows. The decision was made to launch without this feature to keep the current build focused and achievable.

**Current Workaround:** Visitors interact with the platform as guests. Comments require a name and email per submission. Cart is session-based. Newsletter subscribers are identified by email only.

**Future Consideration:** Reader accounts are planned for a future phase. When implemented, they will enable persistent reading lists, order history lookup, and personalized content feeds.

**Impact on Current System:** No visitor account tables or authentication flows exist in this version.

---

### Mobile Application — Not Implemented in Current Phase

**What It Is:** A native iOS and/or Android mobile application for Books Platform.

**Why It Is Excluded:** A mobile app is a separate product with its own design, testing, and distribution requirements. Building it simultaneously with the web platform would delay both. The decision was made to complete the web platform first.

**Current Workaround:** The web platform is fully responsive and usable on mobile browsers.

**Future Consideration:** A mobile app scope document will be produced as a separate sprint. This is a confirmed future phase.

**Impact on Current System:** None. The web platform's API and content structure should be designed with mobile consumption in mind, even though the mobile app is not built yet.

---

### Publisher Self-Registration — Not Implemented in Current Phase

**What It Is:** A system allowing publishing houses to create and manage their own profiles on the platform without Admin involvement.

**Why It Is Excluded:** Publisher profiles directly affect the platform's data quality and commercial relationships. Allowing self-registration without a verification and approval system creates risk of inaccurate or spam profiles. The Admin-controlled model ensures quality in this version.

**Current Workaround:** All publisher profiles are created by the Admin, either proactively or upon request.

**Future Consideration:** A verified publisher self-registration portal is a natural future development, potentially tied to the B2B subscription system.

**Impact on Current System:** No publisher registration or login functionality exists in this version.

---

### Translator Profiles — Not Implemented in Current Phase

**What It Is:** A dedicated profile system where professional translators can register, list their language pairs and specializations, and be discoverable by publishers.

**Why It Is Excluded:** While translators are an important target audience for the platform, building a verified translator profile system is a complex undertaking that is not critical for the platform's initial launch. Translators can use the platform effectively as anonymous visitors in this version.

**Current Workaround:** Translators use the platform as general visitors. Publishers who want translators contact them off-platform.

**Future Consideration:** A translator directory is a high-value future feature that would deepen the platform's role as a translation marketplace.

**Impact on Current System:** No translator-specific data structures exist in this version.

---

### Self-Service B2B Subscriber Portal — Not Implemented in Current Phase

**What It Is:** A dedicated login portal where institutional subscribers (libraries, newspapers, etc.) can log in to access their content package, download their reports, and manage their subscription details.

**Why It Is Excluded:** Building a subscriber portal is a significant investment that is not necessary while the subscriber base is small enough to manage personally. The Admin currently handles all content delivery manually.

**Current Workaround:** The Admin delivers content packages directly to institutional clients by email or agreed sharing method.

**Future Consideration:** As the subscriber base grows, a self-service portal becomes essential for scale. This is a confirmed future phase.

**Impact on Current System:** No institutional subscriber login system exists. The Admin panel's B2B subscription section tracks accounts but delivers content manually.

---

### Automated Rights Availability Tracking — Not Implemented in Current Phase

**What It Is:** A system that tracks whether translation rights for a given book are available, reserved, or sold, updated in real time through integration with publisher rights databases.

**Why It Is Excluded:** Rights availability is highly dynamic and requires direct data-sharing agreements with each publisher — a complex and time-consuming commercial negotiation. The platform cannot currently maintain accurate rights data without those agreements.

**Current Workaround:** The "Books Recommended for Translation" section does not include rights availability. Translators are expected to verify rights directly with the publisher using the contact information on the publisher profile.

**Future Consideration:** Rights availability tracking is a high-value feature that would significantly differentiate the platform. It requires commercial partnerships with publishers or rights clearinghouses.

**Impact on Current System:** No rights availability field exists on book records in this version.

---

### Returns & Physical Delivery — Not Implemented in Current Phase

**What It Is:** A system for handling physical book shipments, delivery tracking, and return logistics if the platform sells physical copies.

**Why It Is Excluded:** In this version, direct purchases are either digital goods or handled by referral to the publisher's own store. The platform does not manage physical inventory or shipping.

**Current Workaround:** Physical book purchases are handled via referral — visitors are directed to the publisher's own site where physical purchase and delivery are managed.

**Future Consideration:** If the platform moves to managing physical inventory directly, a fulfillment and returns system will be required.

**Impact on Current System:** No shipping address fields, delivery tracking, or returns management exist in the e-commerce module.

---

### Live Chat / Support System — Not Implemented in Current Phase

**What It Is:** A real-time chat widget allowing visitors to ask questions and get support from the platform team.

**Why It Is Excluded:** Not a priority for launch. The "Contact Us" form serves this purpose in this version.

**Current Workaround:** Visitors use the Contact Us form for support inquiries.

**Future Consideration:** May be added in a later phase if support volume justifies it.

**Impact on Current System:** None.

---

### Automated Ambassador Commission Payouts — Not Implemented in Current Phase

**What It Is:** An automatic payment transfer system that moves earned Ambassador commissions to their designated bank accounts or digital wallets without Admin involvement.

**Why It Is Excluded:** Automated financial disbursements require integration with banking systems or payment providers capable of payouts (not just collection), along with compliance, tax reporting, and fraud prevention infrastructure. The initial Ambassador program is expected to have fewer than 20 Ambassadors — a scale at which manual payout management is entirely feasible.

**Current Workaround:** The Admin views commission totals in Module 16N, arranges payment off-platform (bank transfer, digital wallet, etc.) on the agreed schedule, then records the payout in the system. The Ambassador sees their payout in their Payout History.

**Future Consideration:** If the Ambassador program grows beyond the scale where manual management is practical (roughly 20+ active Ambassadors with monthly payouts), an automated payout integration should be scoped as Phase 8.

**Impact on Current System:** The Ambassador Dashboard shows payout history but has no "Request Payout" button or automated transfer capability. Commission balances are informational displays only.

---

### Persistent Cross-Session Personalization — Not Implemented in Current Phase

**What It Is:** A version of the Recommendation Engine (Module 21) that remembers a visitor's interests across multiple visits — not just within a single session — and continuously improves its recommendations over time based on accumulated browsing and purchase history.

**Why It Is Excluded:** Persistent personalization requires a persistent identity for each visitor — which means reader accounts. Since reader accounts are out of scope in this version, cross-session personalization is also out of scope.

**Current Workaround:** Session-based personalization (Module 21) provides a meaningful but limited version of this feature within each visit. Recommendations reset when the visitor closes their browser.

**Future Consideration:** When reader accounts are introduced in Phase 2, persistent personalization becomes the natural evolution of Module 21 and should be scoped as part of the Phase 2 build.

**Impact on Current System:** Module 21 is built for session-based operation only. Data structures should be designed to accommodate persistent storage when Phase 2 is built, even if that capability is not activated in this version.

---

## 11. Assumptions & Constraints

### Assumptions

1. **Arabic is the primary market.** The scope assumes that the Arabic-language version will have significantly more content than the English version, and that Arabic-speaking users will make up the majority of the audience.

2. **The Admin team manages all content.** No user-generated content (books, publisher profiles, editorial articles, media) is created by the public. Only comments and author submissions come from outside the Admin team, and both require Admin approval.

3. **The platform does not hold physical inventory.** All direct book purchases are for digital goods or the platform acts as a transaction facilitator. Physical fulfillment is out of scope.

4. **Institutional subscription delivery is manual.** The Admin team personally delivers content packages to B2B subscribers. There is no automated data feed API in this version.

5. **YouTube is a long-term partner for video hosting.** All video embeds rely on YouTube. If the platform's YouTube channel is suspended or videos are removed, the embedded video content on the platform is affected.

6. **The platform will grow significantly in content.** The scope is designed with scale in mind — hundreds to thousands of books, dozens of publisher profiles, and frequent editorial output. Performance considerations must account for this growth.

7. **Arabic text rendering and right-to-left layout is handled at the design level.** The entire platform must function correctly in right-to-left layout for Arabic and left-to-right for English.

8. **The Ambassador program starts small.** The initial launch is expected to have fewer than 20 active Ambassadors. Manual payout management is feasible at this scale.

9. **All social auto-post platforms have active, connected accounts.** The Social Auto-Post feature assumes established accounts on Facebook, X, and Instagram with the appropriate API permissions already granted.

10. **Microsoft Clarity's automatic masking of sensitive fields is sufficient** for the platform's privacy requirements. If additional masking configurations are needed, this should be confirmed during implementation.

### Constraints

1. **Payment gateway not yet finalized.** The e-commerce module cannot be fully built until a gateway is chosen (OQ-02). This is the most time-sensitive open decision.

2. **No reader accounts.** A hard constraint for this version. The Ambassador Dashboard login is the only non-Admin login in this version. Features that require persistent identity use email-based approaches (Wish List) or are session-based (personalization).

3. **Admin team capacity.** The quality and frequency of editorial content, notification campaigns, and social posts depends on the Admin team's output. The platform cannot auto-generate editorial content.

4. **Audio hosting decision pending.** The podcast channel (Book Talk) requires a decision on self-hosting vs. external service (OQ-04).

5. **Social media API rate limits.** Facebook, X, and Instagram all impose limits on how frequently posts can be submitted via API. The Admin team must be aware of these limits to avoid account restrictions. The Social Auto-Post system does not manage queuing around rate limits in this version.

6. **OpenAI API costs.** AI caption generation incurs a per-request cost. The Admin team should monitor usage to avoid unexpected expense (OQ-10).

### Known Risks

1. **Payment gateway integration complexity.** Finalize the gateway choice as early as possible — it blocks both e-commerce and author submission payments.

2. **Content volume at launch.** Pre-load content before launch so statistics counters and featured sections are not sparse. A content pre-loading sprint is recommended.

3. **Wish List email-link model adoption.** OQ-01 is resolved as Option B (email-based magic link). The risk is whether visitors engage with this model. Monitor Wish List creation rates after launch — if adoption is low, consider adjusting the opt-in flow.

4. **Manual B2B content delivery bottleneck.** Will become unsustainable as the subscriber base grows. Phase 6 (self-service portal) should be triggered when manual delivery overhead becomes significant.

5. **Social auto-post API token expiry.** Social media platform access tokens expire periodically. If the Admin team does not refresh them, auto-posting will fail. The Admin panel should display a visible warning when tokens are close to expiry.

6. **Ambassador commission disputes.** If a commission attribution is disputed by an Ambassador, the platform's logged referral data is the authoritative source. The Admin team must be trained to use this data confidently to resolve disputes.

---

## 12. Future Roadmap (Planned Phases)

The following features are explicitly confirmed for future phases and are not part of the current build. They are listed here to inform design decisions in the current build — some current decisions (like the structure of book records and the bilingual content model) are made with these future phases in mind.

**Phase 2 — Reader Accounts & Persistent Features**
Introduction of visitor/reader registration and login, enabling: persistent reading lists saved across sessions, personal order history, personalized content recommendations, and saved search filters.

**Phase 3 — Mobile Application**
A dedicated native iOS and/or Android application. A separate full scope document will be produced for this phase.

**Phase 4 — Publisher Self-Registration Portal**
A verified self-service portal allowing publishing houses to create and manage their own profiles, submit books, and manage their presence on the platform, subject to Admin review and approval.

**Phase 5 — Translator Directory**
A dedicated profile system for professional translators to register, showcase their language pairs and translation history, and be discoverable by publishers seeking translation partners.

**Phase 6 — B2B Subscriber Self-Service Portal**
A secure login area for institutional subscribers to access their content packages, download reports, and manage their subscription details without Admin intervention.

**Phase 7 — Rights Availability Tracking**
Integration with publisher rights data to show real-time translation rights availability on book records in the "Recommended for Translation" section.

**Phase 8 — Automated Ambassador Commission Payouts**
When the Ambassador program exceeds roughly 20 active Ambassadors, an automated payout integration (via a payment disbursement API or digital wallet provider) should be scoped to replace the current manual payout recording system. This phase also introduces a "Request Payout" feature in the Ambassador Dashboard.

---

## 13. Open Questions & Ambiguities

The following items require stakeholder resolution before their respective modules can be finalized or built.

---

**OQ-01 — Reading Lists Without User Accounts — ✅ RESOLVED (v1.1)**

**Original Conflict:** Reading lists were listed as in scope, but user accounts were listed as out of scope — a direct contradiction, since a persistent reading list requires a user identity.

**Resolution:** The Wish List feature adopts **Option B — email-based magic link persistence.** The visitor enters their email address to save a Wish List and receives a magic link to retrieve it on future visits. No password is created. This approach was chosen because it enables the Smart Notification System's most valuable trigger: the automatic alert when a Wish List book becomes translated (Module 19). A session-only approach (Option A) would not support this trigger.

**Impact:** Module 11 has been fully rewritten to reflect this resolution. The module is now named "Wish List & Reading Lists." The email-based identity it creates also serves as the subscription identity for Wish List notification alerts in Module 19B and 19C.

---

**OQ-02 — Payment Gateway Selection**

**The Conflict:** The e-commerce module is fully in scope, but the payment gateway provider has not been finalized.

**Resolution Required:** The stakeholder must select a payment gateway (examples: Stripe, PayPal, Fawry, PayTabs, or any other provider). The choice affects: supported currencies, available countries, fee structure, and integration complexity.

**Blocked:** The e-commerce checkout flow (Module 9) cannot be fully built until a gateway is selected.

---

**OQ-03 — Author Submission Refund Policy**

**The Conflict:** Paid author submissions are in scope. If an Admin rejects a paid submission, what happens to the payment?

**Resolution Required:** Stakeholder must define: is the submission fee refunded if the submission is rejected? If yes, is it a full refund or partial? Is the refund automatic or manual? Does the author have any right of appeal?

**Blocked:** The rejection flow for paid submissions (Module 8) cannot be fully finalized until this is resolved.

---

**OQ-04 — Audio Hosting for Book Talk Podcast**

**The Conflict:** The Book Talk podcast channel requires audio hosting. The platform can either self-host audio files (storing them on the platform's own server) or embed from an external podcast platform (Anchor, Spotify for Podcasters, SoundCloud, etc.).

**Resolution Required:** Stakeholder must decide the audio hosting strategy. Self-hosting is simpler technically but increases server storage requirements. External embedding is more scalable but adds a dependency.

**Blocked:** The Book Talk channel (Module 7B) technical setup depends on this decision.

---

**OQ-05 — Currency for Direct Book Purchases**

**The Conflict:** The e-commerce module allows direct book purchases but the currency has not been defined. Different target markets use different currencies (Egyptian Pounds, Saudi Riyals, UAE Dirhams, US Dollars, etc.).

**Resolution Required:** Stakeholder must define: what currency or currencies will be used for book pricing? Will there be multi-currency support (showing prices in the visitor's local currency) or a single fixed currency?

**Blocked:** The pricing and checkout flow in Module 9 cannot be finalized without a currency decision.

---

**OQ-06 — Comments Notification to Commenter**

**The Conflict:** The scope currently states that no notification is sent to the commenter when their comment is approved. This may create a poor experience — a visitor leaves a comment and never knows if it was published or rejected.

**Resolution Required:** Stakeholder must decide: should commenters receive an email notification when their comment is approved? If yes, the system needs to send an outbound email to the commenter's provided email address. This is a simple addition but must be explicitly confirmed.

---

**OQ-07 — WhatsApp Business API Provider**

**The Conflict:** The WhatsApp notification feature (Module 19B) requires integration with the WhatsApp Business API. There are multiple access paths: directly through Meta's official WhatsApp Business Platform, or through a third-party provider (e.g., Twilio, Vonage, MessageBird, 360dialog, or others). Each has different pricing, regional availability, setup complexity, and approval timelines.

**Resolution Required:** Stakeholder must select the WhatsApp Business API provider before Module 19B can be built. Key considerations: whether the platform will use a broadcast channel (one-way, to followers) or a transactional bot (two-way, per-user), and which provider is most accessible for an Egypt-based operation.

**Blocked:** Module 19B (WhatsApp Notification Channel) cannot be built until the provider is selected.

---

**OQ-08 — Ambassador Commission Payout Method & Policy**

**The Conflict:** The scope defines that commissions are paid by the Admin off-platform through an agreed payment method. However, no specific payout method, minimum threshold, or payout frequency has been defined.

**Resolution Required:** Stakeholder must define: what payout methods are supported (bank transfer, Instapay, digital wallet, etc.), what the minimum commission balance must be before a payout is made, and what the payout frequency is (monthly, bi-monthly, on-request, etc.).

**Not Blocked:** Module 22 can be built without this decision, but the policy must be documented and communicated to Ambassadors before the first account is activated.

---

**OQ-09 — Web Push Notification Service Provider**

**The Conflict:** Web push notifications (Module 19A) require a third-party push notification service (e.g., OneSignal, Firebase Cloud Messaging, Pushwoosh, or similar). Each has different pricing, browser compatibility coverage, and management interfaces.

**Resolution Required:** Stakeholder must select a web push notification service provider before Module 19A can be built.

**Blocked:** Module 19A (Web Push Notifications) cannot be built until the provider is selected.

---

**OQ-10 — OpenAI API Usage Budget & Cost Management**

**The Conflict:** The Social Auto-Post AI caption generation feature (Module 16M) uses the OpenAI API, which charges per request. Without a defined budget or usage limit, the Admin team could accumulate unexpected costs, particularly if the "Generate Description" button is clicked frequently across many new book publications.

**Resolution Required:** Stakeholder must define: what is the acceptable monthly budget for OpenAI API usage? Should the Admin panel show a usage indicator (requests used / remaining this month)? Should there be a hard monthly limit after which AI generation is disabled until the next billing cycle?

**Not Blocked:** Module 16M can be built without this decision, but a usage policy must be agreed before the feature is deployed to production.

---

*End of Document*

---
*Books Platform — منصة الكتب العالمية*
*Business Scope Document v1.1 — May 2026*
*Original scope by scope-generator | Updated by scope-update*
