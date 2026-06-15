# Session Handoff — 2026-06-15

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Also read `001-2026-06-15-consistency-fixes-and-skill.md` for the session before this one.

## What Was Done

- Designed and created a `templates/` folder inside `mobile/.claude/` to give Claude ready-to-adapt Dart boilerplate for each architectural layer
- Decided on three-axis folder structure: `layers/` (architecture), `integrations/` (SDKs), `patterns/` (cross-cutting)
- Created 7 layer templates (T1–T7), each with frontmatter `§` references, fenced Dart code blocks with `<Placeholder>` tokens, and Notes explaining the non-obvious parts
- Created stub `_index.md` files in `integrations/` and `patterns/` — both intentionally empty until real content exists
- Updated the global `flutter-rule-sync` skill with: a new `## Templates` section, a new routing row for code-shape changes, and a new Phase 5 item 5 (template sync check)
- Ran `/flutter-rule-sync` to add a new localization policy rule (single-language apps, fallback locale, JSON file creation policy)
- Applied 3 targeted edits across 2 rule files for the localization rule

## Bugs Found

None in this session.

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/.claude/templates/layers/T1-cubit.md` | Created | Cubit + state sealed class template; governed by §4, §3, §2 Rule 5 |
| `mobile/.claude/templates/layers/T2-data-source.md` | Created | Remote data source impl template; governed by §2 Rule 1, §2 Rule 2, §3, §11 |
| `mobile/.claude/templates/layers/T3-repository.md` | Created | Repository impl template; governed by §2 Rule 3, §3 |
| `mobile/.claude/templates/layers/T4-entity.md` | Created | Domain entity template; governed by §2 Rule 3 |
| `mobile/.claude/templates/layers/T5-models.md` | Created | Response model + request model template; governed by §7, §8 |
| `mobile/.claude/templates/layers/T6-use-case.md` | Created | Use case template with prominent §2 Rule 4 gate warning |
| `mobile/.claude/templates/layers/T7-screen.md` | Created | Screen template — Variant A (flat) + Variant B (folder); governed by §1.1, §6 |
| `mobile/.claude/templates/integrations/_index.md` | Created | Stub: rules for when/how to add SDK integration templates |
| `mobile/.claude/templates/patterns/_index.md` | Created | Stub: rules for when/how to add behavioral pattern templates (P-prefix) |
| `C:\Users\youss\.claude\skills\flutter-rule-sync\SKILL.md` | Updated | Added `## Templates` section; new routing row for code-shape changes; new Phase 5 item 5 |
| `mobile/.claude/rules/flutter_scaffold_prompt.md` | Updated (Localization section) | `en.json` is now the always-present source/fallback; additional language files added only when actively supported; wording updated to cover single-language apps |
| `mobile/.claude/rules/flutter_scaffold_prompt.md` | Updated (main.dart init) | `fallbackLocale` changed from `const Locale('ar')` → `const Locale('en')`; `supportedLocales` example is now minimal with a comment |
| `mobile/.claude/rules/flutter_feature_prompt.md` | Updated (§13) | New anti-pattern row: hardcoding strings in a single-language app |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `mobile/CLAUDE.md` | Whether localization rule needed propagation | No localization policy section exists there; scaffold/feature prompts are the right home |
| `mobile/.claude/rules/flutter_scaffold_prompt.md` edge cases (item 14) | Conflict with new fallback locale | Only covers delegate wiring — no conflict |

## Pending Tasks

- [ ] User indicated more `/flutter-rule-sync` edits are planned in the new session — no specific topics given yet

## What's Next (ordered)

1. Read this file, then start the new session fresh
2. User will invoke `/flutter-rule-sync` with additional rule changes — follow the skill's Phase 1→5 workflow for each one
3. If a rule change affects any of T1–T7, update the matching template per Phase 5 item 5

## Key References

- `mobile/CLAUDE.md` — project law (most authoritative)
- `mobile/.claude/rules/flutter_scaffold_prompt.md` — `lib/core/` blueprint
- `mobile/.claude/rules/flutter_feature_prompt.md` — `lib/features/` guide (§1–§13)
- `mobile/.claude/templates/layers/` — T1–T7 code templates
- `C:\Users\youss\.claude\skills\flutter-rule-sync\SKILL.md` — skill for routing rule changes

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Flat templates folder vs. categorized subfolders? | Categorized: `layers/`, `integrations/`, `patterns/` — each answers a different question (architecture / SDK / behavior) |
| Name `feature_level/` or `layers/`? | `layers/` — more accurate; `feature_level` implies "only for features" but entities and use cases span both |
| Dart files vs Markdown for templates? | Markdown — can explain the "why" alongside code; `.dart` files are syntactically valid but can't annotate themselves |
| One file per layer type vs one per feature? | One per layer type — timeless and composable; per-feature files go stale when the real feature diverges |
| Should `integrations/` and `patterns/` be populated now? | No — stubs only; create content only when building an actual integration or when a pattern has stabilized across 2+ real features |
| For the localization rule: if app only supports one language, keep one JSON file? | Yes — create only the JSON files for languages actively supported; never speculatively |
| Is English the default because it is the source language (where keys are first written)? | Yes |
| Should both ar.json and en.json always exist even in single-language apps? | No — keep one file; en.json always exists (it's the source/fallback), additional files added when that language is needed |
| Should the current project's Dart code be changed to reflect the localization rule? | No — rule files only; these are guidelines for future projects (do not write "for future projects" in the files themselves) |

## Notes

- `flutter_feature_prompt.md` has 13 numbered sections (§1–§13). Always use § notation when referencing them.
- `CLAUDE.md` and `flutter_scaffold_prompt.md` do not use § numbering — reference them by section heading name.
- The `flutter-rule-sync` skill's Phase 5 now has 5 items (the 5th is template sync). Don't forget to check T*.md after any rule that affects code shape.
- Template naming convention: `T` prefix for `layers/` templates (T1–T7), `T` prefix scoped per subfolder for `integrations/`, `P` prefix for `patterns/`.
- The `<Placeholder>` token convention in templates uses angle brackets (e.g. `<Feature>`, `<Entity>`, `<Action>`). Keep this consistent in any new templates.
- The current project (`books-platform`) uses `fallbackLocale: const Locale('ar')` in its actual `main.dart` — this was NOT changed. Only the scaffold prompt blueprint was updated to `en` as the new default guidance.
