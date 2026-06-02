# Books Platform Mobile App — Claude Design Prompt
> Ready to paste directly into Claude Design

---

## CLARIFICATION QUESTIONS (ask the client before proceeding)

Before starting the design system, you need answers to the following:

1. **Monetization / e-commerce depth** — The web has a `/cart` route but no visible checkout flow. Is the mobile app an e-commerce product (buy translation rights, purchase books) or a pure discovery/catalog app? This determines whether we need checkout screens, payment flows, or order history.

2. **Authentication** — Does the mobile app require user accounts (login, register, forgot password)? The web currently has no visible auth UI. Do you want auth in this version?

3. **RTL as the primary direction** — The web is Arabic-first (AR default with EN switch). Should the mobile app be RTL-first with LTR as secondary, or bilingual from day one with a language toggle in the app?

4. **Cart / wishlist** — The web has a `/cart` route. Is this a "save for later" wishlist or a true purchase cart? What happens inside it?

5. **Article pages** — The articles section (/articles/harvest, /ideas, /world-reads) currently shows "no articles" on the new domain. Should the mobile app include article reading views, or focus on the books catalog only for this phase?

6. **Publisher portal** — The "Publish your book" form is a key feature. Is this flow included in the mobile app, or is it web-only?

7. **Brand colors** — Can you share the exact hex values for the primary color palette, or should we derive them visually from the website (dark navy/gold appears to be the main palette)?

---

## CLAUDE DESIGN PROMPT (paste this into the prompt box)

---

> Build a complete mobile design system for the Books Platform (منصة الكتب العالمية) Flutter app — a bilingual Arabic/English global books discovery platform.

The web platform at booksplatform.ahmed15ayman7.com is a Next.js site with Arabic as the primary language. The mobile app must be a faithful, native-feeling mobile translation of all core features: book catalog (4,654+ books), book detail pages, category filtering, publisher directory (665 publishers from 63 countries), article reading sections, and a book submission form. The codebase has already been attached to this project for reference.

**Phase 1 — Design System Foundation (no screens yet)**

Audit the attached codebase and the live website to extract and define:

1. **Color tokens** — Extract the exact primary palette. The website uses what appears to be a dark navy/deep indigo primary, warm gold/amber accent, off-white backgrounds, and muted gray text. Confirm exact hex values from the codebase CSS/Tailwind config. Define the full token set: primary, secondary, accent, surface, background, error, success, text-primary, text-secondary, text-hint, border, divider — all in light AND dark mode variants.

2. **Typography system** — Map to Flutter `TextTheme`. The website uses a clean sans-serif. Define: displayLarge, displayMedium, titleLarge, titleMedium, bodyLarge, bodyMedium, labelLarge, labelSmall — each with font size, weight, line height, and letter spacing. Arabic text needs specific line-height adjustments (1.6–1.8x recommended for Arabic readability).

3. **Spacing & grid** — Define the base spacing unit (8px system recommended). Document the standard padding values for: screen edges, card inner padding, list item height, section gap, component gap.

4. **Border radius** — Extract corner radius values for: cards, buttons, chips/tags, bottom sheets, input fields, image containers (book cover thumbnails).

5. **Elevation / shadows** — Define shadow tokens for: app bar, floating cards, bottom nav, modals/sheets.

6. **Icon set** — Identify which icons are needed across the app. The website uses custom icons for categories (أفكار وسياسات, دراسات اجتماعية, فلسفات, اقتصاد, لغات, تقنيات). Recommend a Flutter icon approach: Material Symbols, Phosphor, or custom SVG.

7. **Component inventory** — List every reusable component the app needs, grouped by type:
   - Navigation: bottom nav bar (Home, Books, Articles, Publishers), app bar with search, drawer (optional)
   - Books: BookCard (grid/list variants), BookCoverImage, TranslationStatusBadge (مرشح/مترجم/غير مترجم), CategoryChip, FeaturedBookHero
   - Publishers: PublisherCard (logo + name + country + book count), CountryFilterChip
   - Articles: ArticleCard (thumbnail + title + category), ArticleCategoryChip
   - Inputs: SearchBar, FilterSheet (sort + translation status + category), BookSubmissionForm
   - Feedback: EmptyState, LoadingSkeletons, ErrorState, SnackBar
   - Misc: LanguageToggle (AR/EN), SectionHeader (title + "view all" link), StatCounter (for homepage stats)

**Phase 2 — Produce structured plan with screen map**

After extracting all tokens and component inventory, produce:

- A **screen map** listing every screen the app needs (as route names), grouped by section:
  - Onboarding: Splash, Language Select (if needed)
  - Main tabs: Home, Books Catalog, Articles, Publishers
  - Detail screens: BookDetail, PublisherDetail, ArticleDetail, CategoryBooks
  - Actions: Cart/Wishlist, PublishBookForm, Search Results, About/Services/Contact
  - Settings/misc: Language toggle, Privacy, Terms

- For each screen, list: the primary data it displays, the key interactions, and any navigation it triggers.

- Identify the **5 highest-priority screens** to design first (suggested: Home, Books Catalog, Book Detail, Publishers, Search).

- Flag any **ambiguous requirements** where client input is needed before proceeding to screen design (see clarification questions above).

⛔ Do not start producing screen designs yet. Present the full design system token document and screen map for approval first.

---

**Platform context for Flutter implementation:**
- Flutter 3.x, Material 3 design baseline
- RTL support via `Directionality` widget and locale-aware padding
- `flutter_localizations` for AR/EN switching
- Book cover images served from `booksplatform.net/wp-content/uploads/` (legacy CDN)
- Primary content: text-heavy catalog in Arabic, rich bibliographic metadata tables
- Target: iOS and Android, portrait-primary layout

**Visual identity anchors extracted from the live site:**
- Brand name: منصة الكتب العالمية / Books Platform (World Books Platform)
- Tagline: نافذة العالم على الكتب ("The world's window on books")
- Logo: Text-based with a `.webp` file at `/logo.webp`
- Categories (8 main): أفكار وسياسات · دراسات اجتماعية · فلسفات وثقافات · اقتصاد وتنمية · لغات وآداب · تقنيات وعلوم · أديان وعقائد · أخرى
- Book states (3): مرشح للترجمة (Nominated) · مترجم (Translated) · غير مترجم (Not translated)
- Article sections (4): حصاد الكتب · زبدة الأفكار · العالم يقرأ · حديث الكتب
- Key stats: 4,654+ books · 665 publishers · 63 countries · bilingual AR/EN
- Social channels: Twitter/X, Facebook, Instagram, Telegram, YouTube, LinkedIn

**Design mode tags active:** Hi-fi design · Interactive prototype
