# Localization Setup Guide

This project uses the `easy_localization` package for multi-language support (English and Arabic).

## Translation Files

Translation files are located in `assets/translations/`:
- `en.json` — English translations
- `ar.json` — Arabic translations

## How to Use Translations in Your Code

### 1. **Simple Translation**
```dart
import 'package:easy_localization/easy_localization.dart';

Text('hello'.tr())  // Translates 'hello' key to current language
```

### 2. **Translation with Dynamic Arguments**
```dart
// In JSON: "welcome_message": "Welcome back, {}!"
Text('welcome_message'.tr(args: ['Alex']))  
// Output: "Welcome back, Alex!"
```

### 3. **Get Current Locale**
```dart
context.locale  // Returns current Locale
```

### 4. **Change Language Programmatically**
```dart
ElevatedButton(
  onPressed: () {
    context.setLocale(const Locale('ar'));  // Switch to Arabic
  },
  child: Text('switch_to_arabic'.tr()),
);
```

## Adding New Translation Keys

1. Open `assets/translations/en.json`
2. Add your new key-value pair:
   ```json
   "my_new_key": "My English Text"
   ```
3. Open `assets/translations/ar.json`
4. Add the Arabic translation:
   ```json
   "my_new_key": "نصي بالعربية"
   ```
5. Use it in your code:
   ```dart
   Text('my_new_key'.tr())
   ```

## Example: Language Toggle Button

```dart
BlocBuilder<SettingsCubit, SettingsState>(
  builder: (context, state) {
    return ElevatedButton.icon(
      onPressed: () {
        final newLocale = context.locale.languageCode == 'en'
            ? const Locale('ar')
            : const Locale('en');
        context.setLocale(newLocale);
        // Optionally save the preference
      },
      icon: const Icon(Icons.language),
      label: Text('language'.tr()),
    );
  },
);
```

## Persisting Language Preference

The `easy_localization` package **automatically saves** the user's language preference to local storage. When the app reopens, it restores the last selected language.

## Important Notes

- **Fallback Language:** English (`en`) is set as the fallback locale. If a translation key is missing in the current language, it falls back to English.
- **RTL Support:** Arabic is automatically rendered right-to-left (RTL) without additional configuration.
- **Hot Reload:** After adding new keys to JSON files, run `flutter pub get` and hot restart the app (not just hot reload).
- **Context Availability:** The `.tr()` extension works only when a `BuildContext` is available or inside any Flutter widget. For use outside widgets, import `easy_localization` directly.

## Next Steps

- Start using `'key'.tr()` in your UI widgets
- Add book-specific translation keys as you build features
- Consider creating a language selection screen in the Settings feature
