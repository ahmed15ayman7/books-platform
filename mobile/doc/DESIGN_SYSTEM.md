# Design System Reference

Design context for Claude when working on any UI task in this project.
This file describes the **code structure and usage patterns** of the design system — not specific values. Actual color, size, and style values are defined by the design and live in the source files under `lib/core/theme/` and `lib/core/constants/`.

---

## Canvas & Theme

- Design canvas: 390 × 844 (portrait only)
- Theme mode: Light only — `AppTheme.lightTheme`
- Material version: Material 3 (`useMaterial3: true`)
- Widget style: Material everywhere — no Cupertino widgets

All dimensions in code use ScreenUtil extensions: `.w` (horizontal), `.h` (vertical), `.r` (radius/square), `.sp` (font size). Never use raw pixel literals.

---

## Color Palette — `AppColors`

Import: `package:booksplatform/core/theme/app_colors.dart`

All colors are `static const Color` fields. Reference them by semantic name — never hardcode a hex value in feature code.

### Brand
| Token | Semantic role |
|---|---|
| `AppColors.primary` | Primary actions, links, active states, focused borders |
| `AppColors.primaryDark` | Pressed / hover variant of primary |
| `AppColors.secondary` | Secondary accent, badges, tags |

### Semantic
| Token | Semantic role |
|---|---|
| `AppColors.error` | Error states, destructive actions, error icons |
| `AppColors.success` | Success confirmations |
| `AppColors.warning` | Warnings, cautionary messages |

### Surface & Background
| Token | Semantic role |
|---|---|
| `AppColors.background` | Scaffold background |
| `AppColors.surface` | Cards, dialogs, sheets, AppBar background |
| `AppColors.cardBackground` | Card fill |
| `AppColors.inputFill` | TextField fill color |

### Text
| Token | Semantic role |
|---|---|
| `AppColors.textPrimary` | Headings, body text, labels |
| `AppColors.textSecondary` | Subtitles, helper text, metadata |
| `AppColors.textHint` | Placeholder text, empty-state icons |

### Dividers & Shimmer
| Token | Semantic role |
|---|---|
| `AppColors.divider` | `Divider`, drag handles, separators |
| `AppColors.shimmerBase` | Shimmer loading base |
| `AppColors.shimmerHighlight` | Shimmer loading highlight |

---

## Typography — `AppTextStyles`

Import: `package:booksplatform/core/theme/app_text_styles.dart`

All members are `static get` (not `static const`) because they use `.sp`. Use them only inside `build()` methods or lazy getters — never at class-level initialization.

| Getter | Typical use |
|---|---|
| `AppTextStyles.displayLarge` | Hero screens |
| `AppTextStyles.displayMedium` | Large feature headers |
| `AppTextStyles.headlineLarge` | Page titles |
| `AppTextStyles.headlineMedium` | Section headers |
| `AppTextStyles.headlineSmall` | Card headers |
| `AppTextStyles.titleLarge` | AppBar title, dialog title |
| `AppTextStyles.titleMedium` | List tile titles, button labels |
| `AppTextStyles.bodyLarge` | Primary body copy |
| `AppTextStyles.bodyMedium` | Secondary body copy, snackbar text |
| `AppTextStyles.bodySmall` | Captions, timestamps |
| `AppTextStyles.labelLarge` | Form labels, chips |
| `AppTextStyles.labelSmall` | Badges, micro labels |

To override a single property without losing the base style:
```dart
AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)
```

---

## Font Weights — `AppFontWeight`

Import: `package:booksplatform/core/theme/app_font_weight.dart`

All members are `static const FontWeight`. Use these tokens instead of raw `FontWeight.wXXX` values.

| Token | Weight level |
|---|---|
| `AppFontWeight.regular` | Normal body text |
| `AppFontWeight.medium` | Slightly emphasized |
| `AppFontWeight.semiBold` | Sub-headings, labels |
| `AppFontWeight.bold` | Headings |
| `AppFontWeight.extraBold` | Display / hero text |

---

## Spacing — `AppSpacing`

Import: `package:booksplatform/core/constants/spacing_constants.dart`

All members are `static get` (not `static const`) because they use ScreenUtil. Two strictly separate axes — never use a horizontal token for vertical spacing or vice versa.

### Horizontal axis — `s*` prefix (backed by `.w`)
Tokens: `s4`, `s8`, `s12`, `s16`, `s20`, `s24`, `s32`, `s48`, `s64`

### Vertical axis — `v*` prefix (backed by `.h`)
Tokens: `v4`, `v8`, `v12`, `v16`, `v20`, `v24`, `v32`, `v48`, `v64`

Use `AppSpacing` tokens for `SizedBox` gaps. For `EdgeInsets`, use `.w`/`.h`/`.r` directly when an exact token does not fit.

---

## Theme Defaults (already configured — do not re-style)

The following are set globally in `AppTheme.lightTheme`. Do not override these in individual widgets unless there is a screen-specific reason.

### AppBar
- Background: `surface` — zero elevation, no shadow on scroll
- Title: centered, `AppTextStyles.titleLarge`
- Foreground (icons, back arrow): `textPrimary`

### TextField / Input
- Fill: `inputFill` — rounded corners, no visible border in default/enabled state
- Focused border: `primary` color
- Error border: `error` color
- Hint style: `bodyMedium` + `textHint`

### ElevatedButton
- Background: `primary` — foreground: `surface`
- Full-width minimum height — zero elevation
- Text style: `titleMedium`

### OutlinedButton
- Foreground and border: `primary`
- Full-width minimum height
- Text style: `titleMedium`

### TextButton
- Foreground: `primary`
- Text style: `titleMedium`

### Card
- Color: `cardBackground` — zero elevation, zero margin

### Divider
- Color: `divider`

### BottomSheet
- Background: `surface` — transparent surface tint, top corners rounded

### SnackBar
- Floating behavior, rounded corners
- Per-call background color is set by `SnackBarHelper` (see below)

---

## Core State Widgets

Import path: `package:booksplatform/core/widgets/`

Use these inside `BlocBuilder` — never build custom loading / empty / error UI from scratch.

### `AppLoadingIndicator`
```dart
// Default — centered, primary color
const AppLoadingIndicator()

// Custom size or color
AppLoadingIndicator(size: 24.w, color: AppColors.secondary)
```

### `EmptyStateWidget`
```dart
EmptyStateWidget(
  icon: Icons.library_books_outlined,  // required
  title: 'No books yet',               // required
  subtitle: 'Books you save will appear here.',  // optional
  actionLabel: 'Browse',               // optional
  onAction: () { /* navigate */ },     // optional
)
```

### `ErrorStateWidget`
```dart
ErrorStateWidget(
  message: core.failureToMessage(failure),  // always from failureToMessage
  onRetry: () => cubit.retry(),             // optional
)
```

---

## Overlay Helpers

All three are `@lazySingleton` — access via `getIt<XxxHelper>()`, never as static methods (except `BottomSheetHelper` which takes a `BuildContext`).

### `DialogHelper`
```dart
final dialog = getIt<DialogHelper>();

await dialog.showAppDialog(child: MyDialogWidget());

await dialog.showConfirmDialog(
  title: 'Delete book?',
  message: 'This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: () { /* proceed */ },
  onCancel: () { /* dismiss */ },
);

await dialog.showLoadingDialog();  // non-dismissible overlay
dialog.hideDialog();
```

### `SnackBarHelper`
```dart
final snack = getIt<SnackBarHelper>();

snack.showSuccess('Book saved.');
snack.showError('Failed to load books.');
snack.showInfo('Syncing your library...');
snack.showWarning('Storage almost full.');
```

### `BottomSheetHelper`
```dart
await BottomSheetHelper.showAppBottomSheet(
  context: context,
  child: MySheetContent(),
  isScrollable: true,   // optional — scroll-controlled sheet
  maxHeight: 0.75,      // optional — fraction of screen height (0.0–1.0)
);
```
Sheet includes a drag handle and `SafeArea` at the bottom. Top corners are rounded.

---

## ScreenUtil Quick Reference

| Suffix | Axis | Use for |
|---|---|---|
| `.w` | Horizontal | Horizontal sizes, padding, gaps, icon widths |
| `.h` | Vertical | Vertical sizes, padding, gaps |
| `.r` | Min axis (radius) | `BorderRadius`, circular / square sizes |
| `.sp` | Font | `fontSize` only |

**Rules:**
- Never use `.sp`, `.w`, `.h`, `.r` at class-level static initialization.
- Always use them inside `build()` methods or lazy getters.
- Never use raw pixel literals for any visible UI dimension.
