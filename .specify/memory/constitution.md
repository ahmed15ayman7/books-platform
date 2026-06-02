<!--
  Sync Impact Report
  Version change: (unfilled template) → 1.0.0
  Added sections: Core Principles (I–V), Flutter & Dart Standards, Development Workflow, Governance
  Removed sections: N/A — initial fill from CLAUDE.md
  Templates requiring updates:
    ✅ plan-template.md  — Constitution Check gate language is generic; no update needed
    ✅ spec-template.md  — No constitution-specific references; no update needed
    ✅ tasks-template.md — Test discipline aligns with Principle III; no update needed
  Follow-up TODOs: None — all placeholders resolved
-->

# Books Platform Constitution

## Core Principles

### I. Clean Architecture (NON-NEGOTIABLE)

All product code lives in `lib/features/<feature>/` under strict three-layer boundaries:
Presentation → Domain → Data. Features MUST NOT import from other features; cross-feature
navigation MUST use typed args classes from `lib/core/router/args/`. Domain contracts MUST
return entities, never response models. `ApiManager` is the sole error boundary — no try/catch
is permitted outside it. Data sources return `Either<Failure, T>` directly with no wrapping.

**Rationale**: Enforces independent testability per layer, prevents accidental coupling between
features, and keeps the data transport layer invisible to presentation.

### II. State Management Discipline

Cubits drive all feature state. Features with both mutations and reads MUST use separate action
and list/query cubits to prevent state collisions. `BlocProvider` MUST be created inside
`AppRouter.generateRoute`, never inside a screen widget. UI widgets MUST only observe state and
trigger cubit methods — no business logic is permitted inside widgets.

**Rationale**: Prevents state collisions, makes flows independently testable and predictable,
and keeps the presentation layer free of domain concerns.

### III. Test-First Development

Every bug fix MUST include a test that reproduces the issue before the fix is applied.
Unit tests are required for domain and data layer logic. Widget tests are required for critical
UI flows. Tests MUST be deterministic — no flaky or timing-dependent tests. Each test case
covers exactly one behavior. Tests follow existing structure and naming conventions.

**Rationale**: Validates root-cause fixes rather than symptom patches, prevents regressions,
and ensures each architectural layer can be verified independently.

### IV. Minimal Safe Changes

Always identify and fix the root cause, not symptoms. Make the smallest change that correctly
solves the problem. Do not refactor unrelated code unless explicitly requested. Do not break
existing functionality, APIs, flows, or UX unless explicitly instructed. Never make assumptions
without verifying the relevant code first — state assumptions explicitly if something is unclear.

**Rationale**: Limits blast radius of every change, preserves existing user flows, and ensures
the codebase evolves through deliberate decisions rather than accidental drift.

### V. Security & Reliability

Never hardcode secrets, tokens, or credentials. Never log sensitive data. Properly handle null,
empty, loading, and error states in every flow — silent failures are not permitted. All external
and API data MUST be safely validated and handled. Potential security risks MUST be flagged
proactively. Do not add new packages unless necessary and justified; new packages MUST be
the latest stable version, well-maintained, and production-grade.

**Rationale**: Mobile apps operate in untrusted environments; embedded secrets and silent
failures are production liabilities. Minimal dependencies reduce attack surface and
maintenance burden.

## Flutter & Dart Standards

- **ScreenUtil canvas**: 390 × 844 (`kDesignWidth`/`kDesignHeight`). `.sp`, `.w`, `.h`, `.r`
  MUST only be used inside `build()` methods or lazy getters — never at class-level static init.
- **Layout safety**: Never stack fixed `.h` sections whose total approaches screen height.
  Wrap screen bodies in `SingleChildScrollView`. Use `Expanded` for lists and fill-space sections.
  Apply `SafeArea` at Scaffold body level on every screen. Use `Scaffold.bottomNavigationBar`
  for pinned bottom buttons — not `Positioned(bottom: 0)`.
- **Performance**: Prefer `const` constructors wherever possible. Never perform heavy work
  inside `build()`. Controllers, `FocusNode`, and other expensive objects MUST be created in
  `initState()` and disposed in `dispose()` — never inside `build()`.
- **Modern Dart 3+**: Use `sealed class` + `final class` for cubit states with exhaustive
  `switch` expressions for control flow. Avoid deprecated APIs; prefer idiomatic modern
  approaches.
- **Code quality**: Files and functions MUST stay small and focused. Comments are written only
  when the intent is non-obvious from the code itself. Apply SOLID and DRY principles where
  beneficial; do not force patterns unnecessarily.

## Development Workflow

- **DI**: After adding or modifying any `@injectable` class, run
  `dart run build_runner build --delete-conflicting-outputs` and verify new registrations
  appear in `lib/core/di/injection_container.config.dart`.
- **Routing**: New screens require (1) a route name constant in `AppRoutes`, (2) an args class
  in `lib/core/router/args/` if navigation arguments are needed, and (3) a case in
  `AppRouter.generateRoute` that casts `settings.arguments` with a null guard.
- **Error handling flow**: `DioException → ApiManager._mapDioError() → Failure subtype →
  Left(failure)`. Cubits fold the result: left path emits error state via `failureToMessage()`;
  right path emits success state. Import `failure_messages.dart` with the `as core` alias in
  every cubit for uniformity.
- **Import ordering**: Dart SDK → Flutter SDK → Third-party packages → Project imports.
  Relative imports within a feature; package imports across features. No unused imports permitted.
- **Screen size threshold**: Screen widget code under ~250 lines with no embedded
  `StatefulWidget` stays in a single file. Beyond that threshold, extract into a screen folder
  (`pages/<screen_name>_screen/`) with the screen widget plus one file per extracted component.

## Governance

This constitution supersedes all other practices for this project. Any amendment MUST:

1. Increment `CONSTITUTION_VERSION` following semantic versioning:
   MAJOR — backward-incompatible principle removal or redefinition;
   MINOR — new principle or section added or materially expanded;
   PATCH — clarification, wording fix, or non-semantic refinement.
2. Update `LAST_AMENDED_DATE` to the amendment date in ISO format (YYYY-MM-DD).
3. Propagate changes to all dependent templates in `.specify/templates/`.
4. Embed a Sync Impact Report as an HTML comment at the top of this file.

All implementation plans and code reviews MUST verify compliance with these principles before
merging. Complexity violations MUST be justified in the plan's Complexity Tracking table.
Runtime development guidance and shell commands live in `CLAUDE.md` at the repository root.

**Version**: 1.0.0 | **Ratified**: 2026-06-02 | **Last Amended**: 2026-06-02
