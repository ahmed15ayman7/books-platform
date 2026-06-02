---
# ============================================================================
# LAYER 1 — MACHINE-READABLE DESIGN TOKENS
# AI coding agents (Claude Code, Cursor, Copilot) read this section to generate
# on-brand UI. Every token has a semantic role comment — never change the key
# names without updating the prose sections below.
# Source: doc/claude-design/books-platfotm-mobile-designs/ + lib/core/theme/
# Codebase wins over design doc when values diverge (codebase is shipped truth).
# ============================================================================

theme: "Soft UI · Red-Black · Arabic-first"
version: "0.1.0"
platform: "Flutter 3.x · Material 3 · useMaterial3: true"
canvas: "390x844 (portrait only, iPhone 14 base)"
direction: "rtl-first · bidirectional (AR + EN)"

tokens:
  colors:
    # Brand
    primary: "#B11E2E"         # brand-red — CTAs, links, active states, focused borders
    primaryHover: "#8B1623"    # brand-red-hover — pressed / tap state of primary
    primarySoft: "#F8E5E8"     # brand-red-soft — icon wells, category chip fills, tints
    secondary: "#0B0B0B"       # brand-black — dark surfaces, header bar background, FAB chrome
    # Surface & Background
    background: "#FAFAFA"      # gray-50 — scaffold / page background
    surface: "#FFFFFF"         # cards, dialogs, app bar, bottom nav
    surface2: "#F5F5F5"        # secondary surface — lang toggle bg, muted fills
    cardBackground: "#FFFFFF"  # card fill (same as surface; explicit token for CardTheme)
    # Text
    textPrimary: "#1A1A1A"     # gray-900 — headings, body, labels
    textSecondary: "#6B6B6B"   # gray-500 — subtitles, metadata, helper text
    textHint: "#A3A3A3"        # gray-400 — placeholders, empty-state icons, disabled
    textOnPrimary: "#FFFFFF"   # text on primary-colored backgrounds (CTAs, FAB)
    # Semantic — use for status/feedback only, never for marketing/decoration
    success: "#15803D"         # "مترجم" Translated badge, success snackbar
    warning: "#CA8A04"         # "مرشح للترجمة" Nominated badge, warning snackbar
    error: "#DC2626"           # validation borders, error icons, error snackbar
    info: "#1D4ED8"            # info banners
    # Structural
    divider: "#E5E5E5"         # gray-200 — Divider, drag handles, separators, default borders
    inputFill: "#F5F5F5"       # gray-100 — TextField fill color
    shimmerBase: "#E5E5E5"     # loading skeleton base
    shimmerHighlight: "#F5F5F5" # loading skeleton shimmer sweep
    # Dark mode values (design intent; full dark theme not yet in AppColors)
    # dark_background: "#0B0B0B"
    # dark_surface: "#1A1A1A"
    # dark_surface2: "#262626"
    # dark_border: "#262626"
    # dark_primarySoft: "#2A1518"
    # dark_textPrimary: "#FFFFFF"
    # dark_textSecondary: "#A3A3A3"

  typography:
    fontDisplay: "Cairo"       # display & headings — Arabic-optimised for large text (Google Fonts)
    fontPrimary: "Tajawal"     # body & UI — Arabic-first, strong Latin coverage (Google Fonts)
    fontMicro: "Inter"         # Latin micro-labels only — eyebrow badges, CAPS labels (Google Fonts)
    baseSize: "14sp"           # bodyMedium reference size
    lineHeightArabic: 1.7      # Arabic readability — never below 1.7 for body
    lineHeightLatin: 1.5       # Latin can sit tighter
    scale:
      displayLarge:  { font: "Cairo",   size: "34sp", weight: 800, lineHeight: 1.15, letterSpacing: "-0.5" }
      displayMedium: { font: "Cairo",   size: "28sp", weight: 700, lineHeight: 1.2 }
      headlineLarge: { font: "Cairo",   size: "32sp", weight: 700, lineHeight: 1.2 }
      headlineMedium:{ font: "Cairo",   size: "28sp", weight: 700, lineHeight: 1.2 }
      headlineSmall: { font: "Cairo",   size: "24sp", weight: 700, lineHeight: 1.25 }
      titleLarge:    { font: "Tajawal", size: "22sp", weight: 700, lineHeight: 1.3 }
      titleMedium:   { font: "Tajawal", size: "18sp", weight: 700, lineHeight: 1.4 }
      bodyLarge:     { font: "Tajawal", size: "16sp", weight: 400, lineHeight: 1.7 }
      bodyMedium:    { font: "Tajawal", size: "14sp", weight: 400, lineHeight: 1.7 }
      bodySmall:     { font: "Tajawal", size: "12sp", weight: 400, lineHeight: 1.7, color: "textSecondary" }
      labelLarge:    { font: "Tajawal", size: "14sp", weight: 500 }
      labelSmall:    { font: "Inter",   size: "11sp", weight: 600, letterSpacing: "0.14em", transform: "uppercase" }

  spacing:
    unit: 4                    # base unit in dp (4-pt system, 8-pt preferred for components)
    scale: [4, 8, 12, 16, 20, 24, 32, 48, 64]
    screenEdge: 16             # standard screen horizontal padding (16.w)
    cardPadding: 12            # book card inner padding; 16 for detail panels
    sectionGap: 32             # vertical gap between homepage sections
    componentGap: 12           # gap between chips, inline elements, Wrap spacing
    listItemHeight: "72–88"    # list item height range; min tap target 48dp

  radius:
    none: "0"
    sm:   "8"     # book cover thumbnail radius (inside card), small interactive elements
    md:   "14"    # input fields, small buttons, snackbar
    lg:   "18"    # panels, callout notes
    xl:   "24"    # buttons (ElevatedButton, OutlinedButton, TextButton)
    xxl:  "28"    # cards (book, publisher, article), bottom sheets, modals
    full: "9999"  # chips, badges, pills, search bar, icon buttons, lang toggle

  elevation:
    soft:   "BoxShadow(Color(0x0F000000), blurRadius: 24, offset: Offset(0, 4))"     # cards, app bar on scroll
    softLg: "BoxShadow(Color(0x14000000), blurRadius: 40, offset: Offset(0, 12))"    # bottom nav, sheets, hover
    brand:  "BoxShadow(Color(0x38B11E2E), blurRadius: 28, offset: Offset(0, 8))"     # primary CTA buttons only
    header: "BoxShadow(Color(0x73000000), blurRadius: 40, offset: Offset(0, 12))"    # dark app bar / hero sections

  motion:
    fast:   "180ms"                                 # color fades, hover transitions
    base:   "320ms"                                 # cards, sheets, standard transitions
    slow:   "520ms"                                 # page-in stagger, large elements
    spring: "cubic-bezier(.34, 1.45, .64, 1)"       # card lift (y:-6 scale:1.015), tap (0.98) — brand signature
    easing: "cubic-bezier(.4, 0, .2, 1)"            # standard ease-in-out — menus, drawers
    smooth: "cubic-bezier(.25, .8, .25, 1)"         # button scale, entrances
    # NOTE: kAnimationDuration in app_constants.dart is 300ms; the design spec says 320ms.
    # Use 300ms for Flutter AnimationController durations; 320ms for CSS-equivalent transitions.

  icons:
    library: "Lucide (design spec) / Material Icons (current implementation)"
    strokeWidth: "1.6–1.8"
    directionalNote: >
      Flutter: use Transform.scale(scaleX: -1) to mirror Lucide directional icons in RTL
      (chevron, back arrow, forward arrow). Material Icons with matchTextDirection=true
      mirror automatically. Never write isRtl ternaries in callers.
---

# DESIGN.md — Books Platform (منصة الكتب العالمية)
> Arabic-first books discovery & commerce experience — RTL native, bilingual AR/EN, Soft UI on Flutter Material 3.

## 0. Quick-start for AI agents

When you generate UI for this project:

1. **Never hardcode hex values.** Reference only the token names defined in the YAML above (e.g. `AppColors.primary`, not `Color(0xFFB11E2E)`).
2. **Never invent colors.** The palette is `primary` (brand-red `#B11E2E`), `secondary` (brand-black `#0B0B0B`), and warm grays. No purple, no blue, no gradients unless defined above.
3. **Directional values always.** Use `EdgeInsetsDirectional`, `AlignmentDirectional`, `PositionedDirectional`, `TextAlign.start/end`. Never hardcode `left`/`right` padding or alignment.
4. **No raw pixel literals.** All sizes use ScreenUtil extensions: `.w` (horizontal), `.h` (vertical), `.r` (radius/square), `.sp` (font). Exceptions: `const` BoxShadow definitions in `AppShadows`.
5. **Respect the radius system.** Cards → `radius.xxl` (28.r), buttons → `radius.xl` (24.r), inputs → `radius.md` (14.r), chips → `radius.full` (9999.r).
6. **Arabic first.** Default text direction is RTL. Line height for Arabic body is **1.7 minimum**. Never go below **12sp** for any visible body text.
7. **No `.sp/.w/.h/.r` at class level.** Only inside `build()` methods or lazy getters. `AppTextStyles` and `AppSpacing` use `static get`, not `static const`.
8. **Directional icons, no ternaries.** Use `Transform.scale(scaleX: -1)` for Lucide directional icons in RTL — never `isRtl ? Icons.chevron_left : Icons.chevron_right`.

---

## 1. Brand Identity & Aesthetic Rationale

### Visual personality
Books Platform is a **"Soft UI" cultural product** — a warm, trustworthy, Arabic-first discovery experience. The palette is cultural red (`#B11E2E`) against near-black (`#0B0B0B`) and clean white over warm grays, explicitly named `أحمر + أسود + أبيض` in the web source. The generous radii (28dp on cards, 24dp on buttons) and spring easing signal confidence and approachability, not a cold technical app. The typography stack — Cairo for display, Tajawal for body — prioritises Arabic readability at every scale while maintaining clean Latin fallback.

### Brand story
- **App name:** Books Platform · منصة الكتب العالمية
- **Tagline (AR):** هدفنا أن يعرف القارئ العربي بكل كتاب جديد يصدر في العالم
- **Tagline (EN):** Our goal is to make the Arab reader aware of every new book published in the world
- **Core mission:** Books discovery, translation-status tracking, and commerce — connecting Arabic readers with global publishing
- **Audience:** Arabic readers, academics, researchers, institutional subscribers (libraries, publishers, media channels)
- **Stats:** 4,654+ books · 665+ publishers · 63 countries

### Anti-patterns — what this brand is NOT
- No navy/indigo gradients (the old written style guide described `#46467F`; the shipped code is red + black — the code is the truth)
- No random purple/blue decorative gradients not defined in the palette
- No "flat minimal" aesthetic — this brand has soft shadows and spring motion
- No sharp 6–8dp corners — Soft UI requires the generous radius system above
- No English-only UI — every visible string must have an Arabic translation key

---

## 2. Color System

### Brand colors — intended application

**`primary` (#B11E2E — brand-red):**
The single most important interactive color. Used for: primary CTAs (ElevatedButton background), active bottom nav icons, focused input borders, TranslationStatusBadge NEW badge, cart count badge, section "see all" links, the FAB, search icon in AppBar, and any element that says "tap me." The red draws from the cultural weight of Arabic publishing heritage — confident, not alarming.

**`primarySoft` (#F8E5E8 — brand-red-soft):**
The tinted sibling. Used for category chip icon wells (48×48 circles behind each category icon), callout note backgrounds, and any soft-fill context where the full red would be too heavy. Never use for text backgrounds — contrast is insufficient.

**`secondary` (#0B0B0B — brand-black):**
The dark anchor. Used for: the dark hero AppBar when variant is `home`, the publish FAB chrome ring, the dark button variant, header sections. Not a neutral — it has brand weight.

### Semantic colors — usage rules

| Token | Light | Dark | When to use | Never use for |
|---|---|---|---|---|
| `success` | #15803D | #15803D | "مترجم Translated" badge, success SnackBar, completed steps | decorative fills, marketing copy |
| `warning` | #CA8A04 | #CA8A04 | "مرشح للترجمة" Nominated badge, warning SnackBar | error states, destructive actions |
| `error` | #DC2626 | #DC2626 | Validation error borders, error SnackBar, `ErrorStateWidget` icon | status badges |
| `info` | #1D4ED8 | #1D4ED8 | Informational banners, info SnackBar | brand decoration |

### Translation status badge color map
| Status key | Color | Label AR | Label EN |
|---|---|---|---|
| `TRANSLATED` | `success` (#15803D) | مترجم | Translated |
| `NOMINATED` | `warning` (#CA8A04) | مرشح للترجمة | For Translation |
| `NOT_TRANSLATED` | `textHint` (#A3A3A3) | غير مترجم | Not translated |

### Color DO / DON'T

**DO:**
- Use `primary` for every interactive affordance that means "primary action"
- Use `primarySoft` as the icon well fill behind category icons
- Use semantic colors only for form/status feedback (badges, SnackBars, input borders)
- Reference `AppColors.X` — never raw hex in feature code

**DON'T:**
- No invented gradient combinations (purple/blue/teal) not in this palette
- `primarySoft` is not a text background — contrast ratio is below 4.5:1
- Do not use `secondary` (brand-black) for standard body text — use `textPrimary` (#1A1A1A)
- Semantic colors are not marketing colors — `success` is not "positive feature" color

---

## 3. Typography System

### Font stack rationale
**Cairo** (Google Fonts): A geometric Arabic typeface with excellent display weight (800). Chosen for headings because its clean geometric forms hold up at 24sp–34sp in both Arabic and Latin. Delivers the editorial authority the brand needs.

**Tajawal** (Google Fonts): The workhorse Arabic-first sans-serif. Excellent Arabic rendering at body sizes (12–22sp), with a clean Latin subset. Used for all body copy, UI labels, and button text. Line-height 1.7 is mandatory for Arabic — the taller x-height needs more breathing room.

**Inter** (Google Fonts): Used exclusively for Latin micro-labels — `labelSmall`, the "PLATFORM" eyebrow in the AppBar logo, and the publisher name on book covers. Never use Inter for Arabic text.

### Arabic readability rules
- Line height for Arabic body text: **1.7** — never below **1.7** for `bodyLarge`, `bodyMedium`, `bodySmall`
- Minimum body font size: **12sp** (`bodySmall`) — never render readable Arabic content below this
- `displayLarge` uses `letterSpacing: -0.5` only — tighten large Cairo at display sizes, never tighten Tajawal body
- `labelSmall` (Inter): `letterSpacing: 0.14em, textTransform: uppercase` — used for eyebrow badges only

### Text style usage guide
| Style | Font | Size | Weight | Line-h | Typical use |
|---|---|---|---|---|---|
| `displayLarge` | Cairo | 34sp | 800 | 1.15 | Hero splash headline, onboarding titles |
| `displayMedium` | Cairo | 28sp | 700 | 1.20 | Large feature headers, "صدر حديثًا" section |
| `headlineLarge` | Cairo | 32sp | 700 | 1.20 | Page titles on dark hero sections |
| `headlineMedium` | Cairo | 28sp | 700 | 1.20 | Book detail page title |
| `headlineSmall` | Cairo | 24sp | 700 | 1.25 | Category page header, publisher name large |
| `titleLarge` | Tajawal | 22sp | 700 | 1.30 | AppBar title, dialog title, section header |
| `titleMedium` | Tajawal | 18sp | 700 | 1.40 | Book card title, publisher card name |
| `bodyLarge` | Tajawal | 16sp | 400 | 1.70 | Article body, book description primary |
| `bodyMedium` | Tajawal | 14sp | 400 | 1.70 | Secondary copy, list subtitles, SnackBar text |
| `bodySmall` | Tajawal | 12sp | 400 | 1.70 | Captions, timestamps, book metadata |
| `labelLarge` | Tajawal | 14sp | 500 | — | Button labels, chip labels, form labels |
| `labelSmall` | Inter | 11sp | 600 | — | Badges, eyebrow CAPS labels, book cover micro-text |

### Overrides
Single-property override without losing the base style:
```dart
// Correct — inherit base style, change only color
AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)
AppTextStyles.titleMedium.copyWith(color: AppColors.primary)

// Correct — category label in brand-red
AppTextStyles.labelSmall.copyWith(color: AppColors.primary)
```

---

## 4. Spacing & Layout Grid

### Grid rules
The spacing system is built on a **4-pt base unit** with an 8-pt preference for component-level spacing. Two strictly separated axes exist in `AppSpacing`: horizontal (`s*` backed by `.w`) and vertical (`v*` backed by `.h`). Never mix axes — use horizontal tokens for horizontal spacing, vertical for vertical.

`AppSpacing` tokens are `static get` (not `static const`) because they call `.w`/`.h` which require ScreenUtil to be initialized. Always use them inside `build()` or lazy getters.

### Usage reference
| Context | Value | Flutter expression | Notes |
|---|---|---|---|
| Screen edge padding | 16dp | `16.w` / `AppSpacing.s16` | Standard horizontal gutter |
| Card inner padding (book) | 12dp | `12.w` / `AppSpacing.s12` | Book card `info` section |
| Card inner padding (detail) | 16dp | `16.w` / `AppSpacing.s16` | Detail panels, publisher card |
| Section gap (vertical) | 32dp | `32.h` / `AppSpacing.v32` | Between homepage sections |
| Component gap (chips, buttons) | 12dp | `12.w` / `AppSpacing.s12` | Wrap spacing, Row gaps |
| List item minimum height | 72–88dp | `72.h`–`88.h` | Min tap target: 48dp |
| Icon button touch target | 38×38dp | `38.w` × `38.h` | AppBar icon buttons |
| Book grid | 2-up, 12dp gap | `12.w` gap | Cover aspect ratio 3:4 |
| Book carousel item width | ~1.4-up | `(screenWidth - 48) / 1.4` | Scroll-snap horizontal list |
| AppBar top padding | 52dp | `52.h` | Status bar + AppBar padding |
| Bottom nav bottom padding | 26dp | `26.h` | Home indicator safe area |

### Direction-aware spacing — mandatory rule
**Always use direction-aware primitives.** The following are prohibited:

| Prohibited (LTR-hardcoded) | Required (direction-aware) |
|---|---|
| `EdgeInsets.only(left: …)` | `EdgeInsetsDirectional.only(start: …)` |
| `EdgeInsets.only(right: …)` | `EdgeInsetsDirectional.only(end: …)` |
| `Alignment.centerLeft` | `AlignmentDirectional.centerStart` |
| `Alignment.centerRight` | `AlignmentDirectional.centerEnd` |
| `Alignment.topLeft` | `AlignmentDirectional.topStart` |
| `Alignment.bottomRight` | `AlignmentDirectional.bottomEnd` |
| `Positioned(left: …)` | `PositionedDirectional(start: …)` |
| `TextAlign.left` | `TextAlign.start` |
| `TextAlign.right` | `TextAlign.end` |

Vertical-only values (`EdgeInsets.symmetric(vertical: …)`, `Alignment.topCenter`) are direction-neutral — no change needed.

---

## 5. Border Radius System

### Radius personality
The "Soft UI" brand signature. Every corner should feel friendly and modern — no sharp angles. The hierarchy runs from very rounded chips (full) down to slightly rounded thumbnails (sm). The 28dp card radius is the most visually prominent token and the strongest brand signal.

### Application rules
| Component | Radius | Token | Rationale |
|---|---|---|---|
| BookCard, PublisherCard, ArticleCard | 28.r | `radius.xxl` | The signature "Soft UI" card feel |
| Bottom sheets, modals (top corners only) | 28.r top | `radius.xxl` | Consistent with card language |
| ElevatedButton, OutlinedButton, TextButton | 24.r | `radius.xl` | Full pill buttons for primary actions |
| Input fields (TextField) | 14.r | `radius.md` | Slightly rounded, approachable |
| SnackBar | 14.r | `radius.md` | Floating toast style |
| Chips, badges, pills | 9999.r | `radius.full` | Full pill — translation status, category, lang toggle |
| Icon buttons (AppBar, nav) | 9999.r | `radius.full` | Circular 38×38dp touch targets |
| Category icon wells | 9999.r | `radius.full` | 48×48dp circles with primarySoft fill |
| Book cover thumbnail (inside card) | 0 | — | Flush with card top edge; card handles radius |
| Search bar | 9999.r | `radius.full` | Pill shape matching chip language |

---

## 6. Elevation & Shadow System

### Shadow philosophy
Soft, neutral shadows — no harsh Material elevation tinting. The app uses `BoxDecoration` + `AppShadows` constants, never Material's `elevation:` property, so card surfaces stay flat white and the tonal elevation layer never appears.

The brand shadow is **red-tinted** (`rgba(177,30,46,.22)`) — used exclusively on primary CTAs to reinforce the brand color and add tactile depth to the most important action on a screen.

### Shadow tokens (Flutter `AppShadows` class)
| Token | Flutter value | Use |
|---|---|---|
| `AppShadows.soft` | `BoxShadow(Color(0x0F000000), blurRadius: 24, offset: Offset(0, 4))` | Cards, app bar on scroll, icon buttons |
| `AppShadows.softLg` | `BoxShadow(Color(0x14000000), blurRadius: 40, offset: Offset(0, 12))` | Bottom nav, modal sheets, card hover/lift |
| `AppShadows.brand` | `BoxShadow(Color(0x38B11E2E), blurRadius: 28, offset: Offset(0, 8))` | Primary CTA ElevatedButton only |
| `AppShadows.header` | `BoxShadow(Color(0x73000000), blurRadius: 40, offset: Offset(0, 12))` | Dark hero app bar sections |

### Implementation note
Apply shadows via `BoxDecoration(boxShadow: AppShadows.soft)` on `Container` or `DecoratedBox`. The `CardTheme` in `AppTheme.lightTheme` sets `elevation: 0` globally — never rely on Material tonal elevation. Wrap custom card-like containers in `BoxDecoration` and apply the appropriate shadow list.

---

## 7. Motion & Animation

### Motion personality
Snappy and springy — not floaty or slow. The spring easing `cubic-bezier(.34, 1.45, .64, 1)` is the brand's tactile signature: it overshoots slightly and settles, giving cards and buttons a physical "lift and settle" feel. Standard transitions use the smooth curve; only tap/lift interactions use spring.

### Token usage
| Token | Value | Flutter | When to use |
|---|---|---|---|
| `fast` | 180ms | `Duration(milliseconds: 180)` | Color transitions, icon state changes, hover fades |
| `base` | 320ms | `Duration(milliseconds: 320)` | All standard transitions — cards, sheets, page elements |
| `slow` | 520ms | `Duration(milliseconds: 520)` | Page-entry stagger, large hero elements |
| `spring` | `cubic-bezier(.34,1.45,.64,1)` | `Curves.elasticOut` (approximate) | Card lift on hover, tap scale (0.98 → 1.0) |
| `easing` | `cubic-bezier(.4,0,.2,1)` | `Curves.easeInOut` | Menus, drawers, filter sheets |
| `smooth` | `cubic-bezier(.25,.8,.25,1)` | `Curves.decelerate` | Button scale, entrance animations |

> **NOTE:** `kAnimationDuration` in `app_constants.dart` is `300ms`. Use `300ms` for Flutter `AnimationController` durations; reserve `320ms` for future alignment with the design spec.

### Tap feedback pattern
```dart
// Apply to BookCard, CategoryChip, any tappable card
onTapDown: (_) => setState(() => _scale = 0.98),
onTapUp: (_) => setState(() => _scale = 1.0),
onTapCancel: () => setState(() => _scale = 1.0),
child: AnimatedScale(
  scale: _scale,
  duration: const Duration(milliseconds: 180),
  child: /* card content */,
),
```

### Accessibility rule
Always respect `MediaQuery.of(context).disableAnimations`. Wrap animated transitions:
```dart
final duration = MediaQuery.of(context).disableAnimations
    ? Duration.zero
    : const Duration(milliseconds: 320);
```

---

## 8. Iconography

### Icon library
**Design specification:** Lucide icons (stroke 1.6, rounded caps & joins) — same library as the web codebase, so web↔app icons match exactly.

**Current implementation:** The codebase currently uses Flutter's built-in Material Icons (`Icons.*`). The `lucide_icons` package is not yet in `pubspec.yaml`. When adding Lucide: `dart pub add lucide_icons`.

Until Lucide is added, use the closest Material equivalents. When adding new screens, prefer Lucide to close the gap with the web design.

### Directional icons — RTL handling
Lucide icons are **not** baked with `matchTextDirection`. Mirror directional icons explicitly:
```dart
// Lucide — explicit RTL mirror
Icon(LucideIcons.chevronRight,
  textDirection: Directionality.of(context) == TextDirection.rtl
      ? TextDirection.ltr  // flip via transform, not textDirection
      : TextDirection.ltr,
)
// Better: wrap in Transform
Transform.scale(
  scaleX: Directionality.of(context) == TextDirection.rtl ? -1 : 1,
  child: Icon(LucideIcons.chevronRight),
)
```

For Material Icons: use icons with `matchTextDirection: true` baked in, or use the semantic icon pattern from `flutter_feature_prompt.md §5`.

### Icon intent mapping
| Icon (Lucide) | Material fallback | Intent | In RTL renders as |
|---|---|---|---|
| `chevronRight` | `Icons.chevron_right_rounded` | Forward / next / see-all | ‹ (left-pointing) |
| `arrowLeft` | `Icons.arrow_back_rounded` | Back / previous | → (right-pointing) |
| `search` | `Icons.search_rounded` | Search | same |
| `shoppingCart` | `Icons.shopping_cart_outlined` | Cart | same |
| `heart` | `Icons.favorite_border` | Wishlist / save | same |
| `filter` | `Icons.tune_rounded` | Filter sheet | same |
| `star` | `Icons.star_rounded` | Rating | same |
| `plus` | `Icons.add_rounded` | Add / FAB | same |
| `bell` | `Icons.notifications_outlined` | Notifications | same |
| `share2` | `Icons.share_outlined` | Share | same |
| `globe` | `Icons.language_rounded` | Language / country | same |
| `mapPin` | `Icons.location_on_outlined` | Country / location | same |

### Category icon mapping (8 categories)
| Category | Icon key | Slug |
|---|---|---|
| أفكار وسياسات — Ideas & Policies | `ideas` (open-book variant) | `ideas-and-policies` |
| دراسات اجتماعية — Social Studies | `social` (graduation cap) | `social-studies` |
| فلسفات وثقافات — Philosophies & Cultures | `philos` (clock/globe) | `philosophies-and-cultures` |
| اقتصاد وتنمية — Economy & Development | `economy` (trend-up chart) | `economy-and-development` |
| لغات وآداب — Languages & Literature | `lang` (text/translate) | `languages-and-literature` |
| تقنيات وعلوم — Technologies & Sciences | `tech` (beaker/flask) | `technologies-and-sciences` |
| أديان وعقائد — Religions & Beliefs | `religion` (building/pillars) | `religions-and-beliefs` |
| أخرى — Other | `other` (circle-plus) | `uncategorized` |

---

## 9. Component Library

### Design principles
Components follow the Soft UI language: generous radii, gentle shadows, spring tap feedback, and consistent use of `primarySoft` as a well/tint color. Every tappable element must have a minimum 48×48dp touch target. All components respect `Directionality` — no hardcoded LTR assumptions.

---

### Navigation

#### BottomNavBar
4 tabs + center floating publish FAB.
- Tabs: Home (الرئيسية), Books (الكتب), Articles (المقالات), Publishers (الناشرون)
- FAB position: center, elevated above bar, `radius.full`, `primary` background, `AppShadows.brand`
- FAB icon: `+` (plus / add), navigates to `/publish`
- Active tab: `primary` color icon, `weight: 700` label, `bodySmall` size
- Inactive tab: `textHint` color icon, `weight: 600` label
- Background: `surface` with `softLg` shadow, `divider` top border, `bottomSheetTheme` shape

#### AppBar
Two variants: `home` (logo + lang toggle + search + cart) and `detail` (back + title + optional trailing).
- Background: `surface`, zero elevation, `scrolledUnderElevation: 0`
- `home` variant: logo block (34×34 `primary` rounded-9 square + Cairo "منصة الكتب" / Inter "PLATFORM")
- Icon buttons: 38×38dp, `radius.full`, `surface` background, `divider` border
- Cart icon shows red badge (count) when > 0
- Language toggle: pill with AR/EN; active = `primary` fill white text, inactive = transparent `textHint` text

#### SectionHeader
`Cairo 800 / 19sp` title + `primary` "see all" link with directional chevron icon.
Full-width, `padding: EdgeInsetsDirectional.only(start: 16.w, end: 16.w)`.

---

### Books

#### BookCard (grid + list + compact)
```
BorderRadius: 28.r (radius.xxl)
Border: 1px divider
BoxShadow: AppShadows.soft
Cover: aspectRatio 3:4, gradient background (colored, not gray)
Tap feedback: scale(0.98) spring → scale(1.0)
```
- Cover top corners: flush with card (card handles rounding)
- "New" badge: `primary` background, `radius.full`, `insetInlineStart: 8.w, top: 8.h`
- Info section: `padding: 11.w`, gap between elements `5.h`
- Category label: `labelSmall` + `primary` color
- Title: `Cairo w700 / 14.5sp`, lineClamp 2, `minHeight: 2.9em`
- Publisher: `bodySmall` + `textHint` color
- TranslationStatusBadge: inline below publisher

#### BookCoverImage
Aspect ratio 3:4. Colored gradient background (never plain gray) built from cover palette pairs:
`plum, crimson, ink, teal, ochre, slate, wine, forest, sand, indigo`.
Includes: spine shadow (6dp insetInlineEnd bar), Arabic title (Cairo w700), Latin title in opposite locale, publisher micro-label (Inter).

#### TranslationStatusBadge
Pill chip, `radius.full`, font weight 700, `fontSize: 11.5sp`.
Colors: TRANSLATED → `success`, NOMINATED → `warning`, NOT_TRANSLATED → `textHint`. Text on all = white.

#### CategoryChip
Pill button, `radius.full`, `surface` background (or `primary` when active).
48×48dp icon well (circle, `primarySoft` fill / `primary` icon color). Label: Cairo w700 / 13.5sp.

#### BiblioTable
Publisher, country, original language, pages, edition, ISBN. Each row is a label + value pair. Direction-aware layout — label start-aligned, value end-aligned.

---

### Commerce

#### AddToCartButton / WishlistButton
Full-width ElevatedButton (cart) and icon-only OutlinedButton (heart/wishlist). Both use `radius.xl` (24.r), height `52.h`.

#### CartLineItem
Book cover thumbnail (60×80dp, `radius.sm`), title + publisher, price, QuantityStepper, trash icon button.

#### QuantityStepper
Minus / count / Plus in a row. Minus/Plus are icon buttons (38×38dp, `radius.full`). Count is `titleMedium`.

#### CartSummary
Subtotal, service fee, total rows. CouponField (TextField with `radius.md`). Full-width checkout ElevatedButton with `AppShadows.brand`.

---

### Publishers

#### PublisherCard
Logo (48×48dp, `radius.md`), publisher name (`titleMedium`), country flag + name (`bodySmall`), book count badge.
Card: `radius.xxl`, `AppShadows.soft`.

#### CountryFilterChip
Horizontal scrollable row. Active = `primary`, inactive = `surface`. `radius.full`. Flag emoji + country name.

#### SponsoredBadge
`secondary` (black) background, `primary` (red) text/icon. Pill, `radius.full`.

---

### Articles

#### ArticleCard
Cover thumbnail (aspect 16:9, colored gradient), channel chip, title (`titleMedium`), date + read-time (`bodySmall`). Card: `radius.xxl`, `AppShadows.soft`.

#### ArticleChannelChip
Horizontal scrollable tabs. 4 channels: حصاد الكتب, زبدة الأفكار, العالم يقرأ, حديث الكتب.
Active = `primary` text + bottom indicator. Inactive = `textSecondary`.

#### CommentThread + CommentComposer
Avatar initials circle (36dp), name (`labelLarge`), time (`bodySmall`, `textHint`), comment body (`bodyMedium`).
Composer: TextField (`radius.md`, `inputFill`) + Post button (`primary`).
Moderation note: `bodySmall` + `textHint` — "تخضع التعليقات للمراجعة قبل نشرها".

---

### Inputs & Forms

#### SearchBar
Full-width pill (`radius.full`), `surface` background, `AppShadows.soft`, search icon in `textHint`.
Placeholder: `bodyMedium` + `textHint`. Focused: `primary` border 1.5px.

#### FilterSheet
Bottom sheet (`radius.xxl` top corners). Sections: sort (newest/oldest), translation status (chip group), category (chip group), country (chip group). Apply button: full-width ElevatedButton.

#### PublishBookForm (3-step)
Step 1: Author info (name, email, phone, bio). Step 2: Book info (title, description, file upload). Step 3: Submit + "first book is always free" notice.
Multi-step uses `CheckoutStepper` component (step indicators, back/next buttons).

#### TextField
Global theme: `inputFill` fill, `radius.md`, no visible default border, `primary` focused border, `error` error border. Hint: `bodyMedium` + `textHint`. Content padding: `EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h)`.

---

### Feedback (shared `lib/core/widgets/`)

#### AppLoadingIndicator
`CircularProgressIndicator`, 32×32dp default, `strokeWidth: 2.5`, `primary` color. Accepts custom `size` and `color`.

#### EmptyStateWidget
Centered column: icon (64.w, `textHint`), title (`titleMedium`), subtitle (`bodyMedium`, `textSecondary`), optional action `ElevatedButton`.

#### ErrorStateWidget
Centered column: `Icons.error_outline` (64.w, `error`), message (`bodyMedium`, `textSecondary`), optional retry `OutlinedButton.icon`.

#### LoadingSkeleton
Shimmer effect: `shimmerBase` → `shimmerHighlight`. Card-shaped and list-row-shaped variants. Match the exact layout of the real component being loaded.

#### SnackBar (via `SnackBarHelper`)
Floating, `radius.md` shape, `margin: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h)`.
Colors: success=`success`, error=`error`, warning=`warning`, info=`info`. Text: `bodyMedium.copyWith(color: surface)`.

---

### Misc

#### StatCounter
The "4,654+ كتاب · 665+ ناشر · 63 دولة" horizontal stat strip. Numbers in `displayMedium` / `headlineSmall`, labels in `bodyMedium`. Used in the home screen hero.

#### NewsletterStrip
Full-width section on home screen. Title (`headlineSmall`), subtitle (`bodyMedium`), email TextField + Subscribe button.

---

## 10. Screen Inventory

### Onboarding
| Route | Screen | Data | Key interactions |
|---|---|---|---|
| `/` | SplashScreen | Logo on black background, brand load animation | auto → `/language` (first run) or `/home` |
| `/language` | LanguageScreen | AR/EN choice with direction preview | setLocale → `/onboarding` or `/home` |
| `/onboarding` | OnboardingScreen | 3 illustrated slides (discover, translate, publish) | swipe/next → `/home` |

### Main Tabs
| Route | Screen | Data | Key interactions |
|---|---|---|---|
| `/home` | HomeScreen | Hero carousel, "صدر حديثًا" carousel, 8 category chips, featured publishers, stats strip, newsletter | tap book → `/books/detail`, category → `/books/category`, search → `/search`, cart → `/cart` |
| `/books` | CatalogScreen | 2-up book grid, filter/sort bar, translation status filter, infinite scroll | filter → FilterSheet, book → `/books/detail` |
| `/articles` | ArticlesScreen | Channel tab row (4 channels), article cards, empty state | channel switch, article → `/articles/detail` |
| `/publishers` | PublishersScreen | Publisher grid, country filter chips, sponsored first | country chip, publisher → `/publishers/detail` |

### Detail Screens
| Route | Screen | Data | Key interactions |
|---|---|---|---|
| `/books/detail` | BookDetailScreen | Cover, title/subtitle, TranslationStatusBadge, BiblioTable, description (expandable), ratings, price, related books | Add to cart / Buy / referral link, wishlist, comment, publisher → `/publishers/detail` |
| `/books/category` | CategoryBooksScreen | Category-filtered 2-up grid + category header | filter, book → `/books/detail` |
| `/publishers/detail` | PublisherDetailScreen | Logo, country, about text, publisher's books grid | book → `/books/detail`, external website link |
| `/articles/detail` | ArticleDetailScreen | Article body, optional YouTube embed, CommentThread + CommentComposer, related articles | comment, share |

### Actions & Commerce
| Route | Screen | Data | Key interactions |
|---|---|---|---|
| `/search` | SearchScreen | Query field, results (books + publishers), recent searches, empty/no-results states | result → detail, filter |
| `/cart` | CartScreen | CartLineItems, QuantitySteppers, CouponField, CartSummary | edit qty, coupon → `/checkout` (deferred) |
| `/publish` | PublishScreen | Multi-step PublishBookForm (3 steps) | submit → pending review confirmation |

### Deferred (not yet in router)
| Screen | Status |
|---|---|
| `/checkout` | Deferred — payment gateway provider not yet chosen |
| `/wishlist` | Deferred — email-keyed, no login required |
| `/about`, `/services`, `/contact` | Deferred — editorial pages |
| `/b2b` | Deferred — institutional subscription plans |
| `/settings` | Deferred — language toggle, notifications, newsletter |
| `/privacy`, `/terms` | Deferred — legal prose |

---

## 11. Platform & Accessibility Rules

### Platform
- **Stack:** Flutter 3.x · Material 3 (`useMaterial3: true`)
- **Widget style:** Material everywhere — no Cupertino widgets, no `Platform.isIOS` checks
- **Orientation:** Portrait only — `390×844` design canvas
- **Locale:** AR (RTL, primary) + EN (LTR, secondary). `EasyLocalization` for string lookup. `context.setLocale()` for runtime switching.
- **Direction switching:** Full `Directionality` flip on locale change via `MaterialApp.locale: context.locale`. All directional primitives (`EdgeInsetsDirectional`, `AlignmentDirectional`) update automatically.
- **Dark mode:** Designed (colors defined in `data.js`); not yet implemented in `AppColors`. Plan for phase 2.

### Accessibility
- Minimum contrast ratio: **4.5:1** (WCAG AA) for all text/background pairs. `textPrimary` (#1A1A1A) on `background` (#FAFAFA) = 17.7:1 ✓
- `primarySoft` (#F8E5E8) as a text background **fails** WCAG AA for `primary` text — never use as text background.
- Minimum tap target: **48×48dp** on all interactive elements. Icon buttons are 38×38dp rendered but must be wrapped in `InkWell`/`GestureDetector` with `padding` to reach 48dp.
- All interactive elements must have `Semantics(label: …)` or `Tooltip` for screen readers.
- Always respect `MediaQuery.of(context).disableAnimations` — provide zero-duration fallback for all animations.
- Arabic text: minimum 12sp, line-height 1.7, never clip Arabic descenders.

---

## 12. Design Boundaries — DO / DON'T Master List

### ✅ DO
- Reference `AppColors.X` for every color value — never raw hex in feature code
- Use `AppTextStyles.X` for every text style — never raw `TextStyle(...)` in screens
- Use `AppSpacing.sN` / `AppSpacing.vN` for gaps, or `.w`/`.h` extensions for precise values
- Apply `AppShadows.soft` to cards, `AppShadows.brand` to primary CTAs only
- Use `EdgeInsetsDirectional` and `AlignmentDirectional` for all directional values
- Use `Transform.scale(scaleX: -1)` to mirror directional icons in RTL — never ternaries
- Apply `radius.xxl` (28.r) to all cards and modal sheets
- Apply `radius.xl` (24.r) to all buttons
- Apply `radius.md` (14.r) to all input fields
- Apply `radius.full` to all chips, badges, pills, icon buttons
- Run `dart run build_runner build` after adding `@injectable` classes
- Write `flutter analyze` clean before marking any feature complete
- Provide `EmptyStateWidget`, `AppLoadingIndicator`, `ErrorStateWidget` for every list/async state
- Keep Arabic line-height at 1.7 — never lower for body styles
- Use `TranslationStatusBadge` for book status — never inline badge logic in screens
- Respect `prefers-reduced-motion` / `MediaQuery.disableAnimations`

### ❌ DON'T
- **No AI slop:** no random purple/blue gradients — the palette is red, black, and warm grays only
- **No off-palette colors:** every hex used must trace back to a token in Layer 1
- **No raw pixel literals:** all visible dimensions use `.w`, `.h`, `.r`, `.sp`
- **No left/right hardcoding:** `EdgeInsets.only(left/right: …)` is banned — use `EdgeInsetsDirectional`
- **No isRtl ternaries for icons:** use `Transform.scale(scaleX: -1)` pattern instead
- **No `Alignment.topLeft` in gradients:** use `AlignmentDirectional.topStart`
- **No Material elevation:** set `elevation: 0` everywhere; use `AppShadows` via `BoxDecoration`
- **No business logic in widgets:** all state goes through Cubits
- **No try/catch in data sources:** `ApiManager` is the sole error boundary
- **No response models crossing domain boundary:** `toEntity()` converts at the repo impl layer
- **No cross-feature imports:** features never import from other features
- **No `static const` with `.sp/.w/.h`:** ScreenUtil extensions require runtime init — use `static get`
- **No Arabic below 12sp:** never render Arabic body text smaller than bodySmall
- **No placeholder gray book covers:** book covers use colored gradients from the cover palette pairs
