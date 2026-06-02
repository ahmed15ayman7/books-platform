# Session Handoff — 2026-06-01

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- **Generated `DESIGN.md`** at the project root using the `/init-design-md` skill. Source was `doc/claude-design/books-platfotm-mobile-designs/` (HTML, JSX, CSS, markdown files) cross-referenced with `lib/core/theme/` and `lib/core/constants/`. The file is a two-layer spec: YAML frontmatter (machine-readable tokens) + markdown prose (intent and rules for AI agents and developers).

- **Discussed ScreenUtil scope** — clarified that ScreenUtil only scales sizes proportionally and does NOT handle content overflow (short phones) or device safe areas (notch, home indicator). Those require `SingleChildScrollView`/`Expanded`/`Flexible` and `SafeArea` respectively.

- **Reviewed a practical layout guide** from the user (RTF file) covering overflow fixes and SafeArea patterns. Added one missing case the doc didn't cover: using `Scaffold.bottomNavigationBar` for pinned bottom buttons instead of `Positioned(bottom: 0)`.

- **Applied the layout & responsiveness mentality to 3 rule files** (planned first, then approved, then executed):
  - `flutter_feature_prompt.md` — new §6, renumbering, checklist, anti-patterns
  - `CLAUDE.md` — ScreenUtil bullet + Layout subsection under Flutter rules
  - `flutter_scaffold_prompt.md` — ScreenUtil note + cross-reference fixes

## Bugs Found

None — this session was documentation and rule-writing only.

## Files Changed

| File | Change | Why |
|---|---|---|
| `DESIGN.md` (project root) | **Created** — full two-layer design spec with all tokens from claude-design folder | Machine-readable blueprint for AI agents generating UI |
| `.claude/rules/flutter_feature_prompt.md` | Added §6 Layout & Responsiveness; renumbered §6–§12 → §7–§13; fixed stale `see §7` cross-ref → `see §9`; added 7 layout items to Pre-Ship Checklist; added 4 layout anti-patterns | Layout rules were missing; any feature built without them risks overflow/SafeArea bugs |
| `CLAUDE.md` | Added ScreenUtil scope bullet under ScreenUtil rules; added `### Layout & responsiveness` subsection (7 bullets) under Flutter rules | CLAUDE.md is the first file read in every session — layout rules need to be here too |
| `.claude/rules/flutter_scaffold_prompt.md` | Added ScreenUtil scope note to Edge Case 2; updated `§9`→`§10` and `§10`→`§11` cross-references | Cross-refs were off by one after new §6 was inserted in feature guide |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/core/theme/app_colors.dart` | Token values for DESIGN.md | All 20 color tokens extracted |
| `lib/core/theme/app_text_styles.dart` | Font families, sizes, weights, line-heights | Cairo/Tajawal/Inter stack confirmed |
| `lib/core/theme/app_shadows.dart` | BoxShadow values for elevation tokens | 4 shadow tokens extracted |
| `lib/core/theme/app_theme.dart` | Global theme config (radius, button, input) | Confirmed radius values: sm=8, md=14, lg=18, xl=24, xxl=28 |
| `lib/core/constants/app_constants.dart` | kDesignWidth/Height, radius constants | 390×844 canvas, kRadius* tokens confirmed |
| `lib/core/constants/spacing_constants.dart` | AppSpacing scale | 4pt base, s4–s64 / v4–v64 confirmed |
| `lib/core/router/app_routes.dart` | Screen inventory for DESIGN.md | 15 routes confirmed |

## Pending Tasks

- [ ] **Uncommitted changes** — all 4 file changes (DESIGN.md, CLAUDE.md, flutter_feature_prompt.md, flutter_scaffold_prompt.md) are untracked/modified in git. Commit them when ready.
- [ ] **Icon library gap** — DESIGN.md notes that the design spec recommends `lucide_icons` package but `pubspec.yaml` only has `cupertino_icons`. Decision needed: add `lucide_icons` or keep Material Icons.
- [ ] **Dark mode** — DESIGN.md documents dark theme color values (from `data.js`) but `AppColors` in code only has light mode. Dark mode is deferred to phase 2 — no action needed now, but the values are documented.

## What's Next (ordered)

1. **Commit the 4 changed files** — `DESIGN.md`, `CLAUDE.md`, `.claude/rules/flutter_feature_prompt.md`, `.claude/rules/flutter_scaffold_prompt.md`. These are complete and verified.
2. **Decide on icon library** — `lucide_icons` vs Material Icons. If going with Lucide, `dart pub add lucide_icons` and note it in `pubspec.yaml`.
3. **Continue feature development** — resume from wherever the prior session (`005-2026-05-31-audit-remediation.md`) left off, now with the layout rules baked into all rule files so every screen built going forward will include overflow and SafeArea handling.

## Key References

- `DESIGN.md` — full token spec, screen inventory, component inventory (project root)
- `.claude/rules/flutter_feature_prompt.md` — §6 Layout & Responsiveness (new), §12 Pre-Ship Checklist (updated), §13 Anti-Patterns (updated)
- `CLAUDE.md` — Flutter rules → Layout & responsiveness subsection (new)
- `doc/handoffs/design-system-implementation/005-2026-05-31-audit-remediation.md` — previous session state

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should the layout/responsiveness rules go in CLAUDE.md as well as the two rule files? | Yes — CLAUDE.md should also have this mentality |
| Should the scaffold_prompt.md get the full layout rules or just a pointer? | Just a pointer (one sentence) — scaffold is for infrastructure, not screen building |

## Notes

- **DESIGN.md token sources:** All hex values were sourced from `app_colors.dart` (codebase wins over design doc). The only values taken directly from `data.js`/`ds.css` without a codebase counterpart are the dark mode palette (not yet in `AppColors`) and the extended gray scale (g300, g600, g700, g800 — present in CSS but not in `AppColors`).
- **`kAnimationDuration` discrepancy:** `app_constants.dart` has 300ms; DESIGN.md documents 320ms from the design spec CSS. Use 300ms for Flutter `AnimationController`; 320ms is the CSS-spec reference.
- **Book cover palette:** The 10 gradient color pairs (plum, crimson, ink, teal, ochre, slate, wine, forest, sand, indigo) are documented in DESIGN.md §9 and sourced from `data.js`. These should be used for book cover placeholders — never flat gray.
- **The `§9`→`§10` and `§10`→`§11` cross-ref fix in scaffold_prompt.md** was necessary because inserting §6 in the feature guide shifted all subsequent section numbers. Both cross-refs now point to the correct sections (Route Args = §10, ApiEnvelope = §11).
