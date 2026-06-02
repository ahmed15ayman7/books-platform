enum TranslationStatus { translated, nominated, notTranslated, newBook }

extension TranslationStatusX on TranslationStatus {
  static TranslationStatus fromString(String? s) => switch (s) {
        'TRANSLATED' => TranslationStatus.translated,
        'NOMINATED' => TranslationStatus.nominated,
        'NEW' => TranslationStatus.newBook,
        _ => TranslationStatus.notTranslated,
      };
}
