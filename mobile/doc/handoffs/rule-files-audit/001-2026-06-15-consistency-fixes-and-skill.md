# Session Handoff — 2026-06-15

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Performed a full consistency audit across the three Flutter rule files: `CLAUDE.md`, `flutter_scaffold_prompt.md`, and `flutter_feature_prompt.md`
- Identified conflicts between the files and verified each against the actual codebase (`register_module.dart`, `injection_container.config.dart`, `bottom_sheet_helper.dart`, all `*_remote_data_source_impl.dart`, all `*_repository_impl.dart`)
- Applied 3 targeted fixes (see Files Changed below)
- Created a new global skill: `flutter-rule-sync` — routes add/edit/remove rule requests to the correct file and section, enforces cross-file consistency
- Enhanced the skill with `§` section references for all `flutter_feature_prompt.md` sections

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | DI scope overview listed `FlutterSecureStorage` as `@singleton` | Medium | `flutter_scaffold_prompt.md` DI Scopes section | `register_module.dart` declares it `@lazySingleton` |
| 2 | DI scope overview listed `Dio` as `@lazySingleton` | Medium | `flutter_scaffold_prompt.md` DI Scopes section | `register_module.dart` declares it `@singleton` |
| 3 | DI scope overview listed `Repositories` and `DataSources` as `@injectable` | High | `flutter_scaffold_prompt.md` DI Scopes section | All `*_repository_impl.dart` use `@LazySingleton(as: Repo)`; all `*_remote_data_source_impl.dart` use `@lazySingleton` |
| 4 | `SharedPreferences @preResolve @singleton` not documented anywhere | Low | `flutter_scaffold_prompt.md` RegisterModule section | `register_module.dart` has a 4th provider not mentioned in any rule file |
| 5 | `CLAUDE.md` claimed `BottomSheetHelper` is `@lazySingleton` with constructor-injected `GlobalKey<NavigatorState>` | High | `CLAUDE.md` `lib/core/` layout table, helpers row | Actual `bottom_sheet_helper.dart` is a static utility class with a private constructor — no DI, takes `BuildContext` at call site |

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/.claude/rules/flutter_scaffold_prompt.md` | Fixed DI Scopes overview: `FlutterSecureStorage` → `@lazySingleton`; `Dio` → `@singleton`; removed DataSources/Repositories from `@injectable`; added them to `@lazySingleton`; added `SharedPreferences` to `@singleton`; added use cases to `@injectable` | Overview contradicted the file's own detailed sections and the actual codebase |
| `mobile/.claude/rules/flutter_scaffold_prompt.md` | Added `SharedPreferences → @preResolve @singleton` entry to the RegisterModule description | Fourth provider existed in code but was undocumented in all 3 rule files |
| `mobile/CLAUDE.md` | Fixed `helpers/` row in the `lib/core/` layout table: separated `BottomSheetHelper` from the "constructor-injected" claim; described it as a static utility class | Actual implementation is `BottomSheetHelper._()` with a static method — not injectable |
| `C:\Users\youss\.claude\skills\flutter-rule-sync\SKILL.md` | New skill created | Routes rule add/edit/remove to the right file+section, enforces consistency across all 3 files |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `mobile/.claude/rules/flutter_feature_prompt.md` | Consistency with CLAUDE.md and scaffold prompt | Fully correct — no changes needed |
| `mobile/lib/core/di/register_module.dart` | DI scopes for all 4 providers | Source of truth; confirmed all fixes above |
| `mobile/lib/core/di/injection_container.config.dart` | Generated scopes matching annotations | Confirmed: data sources = lazySingleton, repositories = lazySingleton, cubits = factory, CartCubit = lazySingleton |
| `mobile/lib/core/helpers/bottom_sheet_helper.dart` | DI registration and constructor | Static class, private constructor, no getIt registration — CLAUDE.md was wrong |

## Pending Tasks

- [ ] None from this session — all identified fixes were applied and verified

## What's Next (ordered)

The user indicated they want to **continue discussing and editing** in the new session. Likely directions:

1. User may want to add new rules to the 3 files using the new `/flutter-rule-sync` skill
2. User may want to further refine or test the `flutter-rule-sync` skill by running it on a real rule change
3. User may want to audit other aspects of the rule files (e.g., the completion checklist in CLAUDE.md vs §12 in feature prompt for alignment)

## Key References

- `mobile/CLAUDE.md` — project law (most authoritative)
- `mobile/.claude/rules/flutter_scaffold_prompt.md` — `lib/core/` blueprint
- `mobile/.claude/rules/flutter_feature_prompt.md` — `lib/features/` guide (has §1–§13)
- `C:\Users\youss\.claude\skills\flutter-rule-sync\SKILL.md` — new skill created this session
- `mobile/lib/core/di/register_module.dart` — source of truth for DI provider scopes
- `mobile/lib/core/di/injection_container.config.dart` — generated, confirms actual registered scopes

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should BottomSheetHelper be fixed to be @lazySingleton (align code to CLAUDE.md) or fix CLAUDE.md to match the code? | Fix CLAUDE.md — the static utility pattern is correct for BottomSheetHelper since it requires BuildContext at the call site |
| Should CartCubit @lazySingleton exception stay in CLAUDE.md only (not propagated to scaffold/feature prompts)? | Yes — it's a project-specific runtime exception, not a general architectural rule |
| Should the flutter-rule-sync skill be placed locally (project .claude/skills/) or globally (C:\Users\youss\.claude\skills/)? | Globally — consistent with all other skills in the project |
| Should § references be added to the skill's routing and ownership tables? | Yes — added to all spots where navigation to a specific section is needed |

## Notes

- `flutter_feature_prompt.md` has 13 numbered sections (§1–§13). Always use § notation when referencing them.
- `CLAUDE.md` and `flutter_scaffold_prompt.md` do not use § numbering — reference them by section heading name.
- The `flutter_scaffold_prompt.md` DI Scopes overview section was the single root cause of 3 of the 5 bugs — the detailed descriptions below the overview were already correct.
- `SharedPreferences` was added to the project for hero slides caching (visible in git log: `feat: enhance HomeContentCubit with SharedPreferences for caching hero slides`). It was not part of the original scaffold plan.
- The `flutter-rule-sync` skill is immediately usable: `/flutter-rule-sync` + describe the rule change.
