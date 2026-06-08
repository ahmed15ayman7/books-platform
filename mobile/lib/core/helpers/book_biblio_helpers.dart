const _languageNames = <String, ({String ar, String en})>{
  'en': (ar: 'الإنجليزية', en: 'English'),
  'ar': (ar: 'العربية', en: 'Arabic'),
  'fr': (ar: 'الفرنسية', en: 'French'),
  'de': (ar: 'الألمانية', en: 'German'),
  'es': (ar: 'الإسبانية', en: 'Spanish'),
  'it': (ar: 'الإيطالية', en: 'Italian'),
  'zh': (ar: 'الصينية', en: 'Chinese'),
  'ja': (ar: 'اليابانية', en: 'Japanese'),
  'ru': (ar: 'الروسية', en: 'Russian'),
  'pt': (ar: 'البرتغالية', en: 'Portuguese'),
  'tr': (ar: 'التركية', en: 'Turkish'),
  'fa': (ar: 'الفارسية', en: 'Persian'),
  'ur': (ar: 'الأردية', en: 'Urdu'),
};

bool isNumericLegacyCountry(String? value) {
  if (value == null || value.trim().isEmpty) return false;
  return RegExp(r'^\d+$').hasMatch(value.trim());
}

String _normalizeComparableUrl(String value) =>
    value.trim().replaceAll(RegExp(r'/+$'), '').toLowerCase();

/// Resolves country the same way as web [BookBiblioTable]:
/// publisher.countries[0] first, then human-readable top-level country.
String? resolveBookCountry({
  required List<Map<String, dynamic>> countries,
  String? topLevelCountry,
  String? legacyPublishingCountry,
  String? legacyCountryAr,
  String? legacyCountryEn,
  required bool isAr,
}) {
  if (countries.isNotEmpty) {
    final country = countries.first;
    final name = isAr
        ? (country['nameAr'] as String? ?? country['name'] as String? ?? '')
        : (country['name'] as String? ?? country['nameAr'] as String? ?? '');
    if (name.isNotEmpty) return name;
  }

  final country = topLevelCountry?.trim();
  if (country != null && country.isNotEmpty && !isNumericLegacyCountry(country)) {
    return country;
  }

  final legacy = legacyPublishingCountry?.trim();
  if (legacy != null && legacy.isNotEmpty) return legacy;

  final localizedLegacy = isAr
      ? legacyCountryAr?.trim()
      : legacyCountryEn?.trim();
  if (localizedLegacy != null && localizedLegacy.isNotEmpty) {
    return localizedLegacy;
  }

  return null;
}

String? resolveLanguageLabel(String? code, {required bool isAr}) {
  if (code == null || code.trim().isEmpty || code.trim() == '0') return null;

  final key = code.toLowerCase().split('-').first;
  final entry = _languageNames[key];
  if (entry != null) {
    final name = isAr ? entry.ar : entry.en;
    return '$name (${code.toUpperCase()})';
  }
  return code.toUpperCase();
}

String resolvePublisherDisplayName({
  String? nameEn,
  String? nameAr,
  String? title,
  required bool isAr,
}) {
  final ar = nameAr?.trim();
  final en = nameEn?.trim();
  final legacy = title?.trim();
  if (isAr) return ar ?? en ?? legacy ?? '';
  return en ?? ar ?? legacy ?? '';
}

String? resolvePublisherAddress({
  String? address,
  String? websiteUrl,
}) {
  final raw = address?.trim();
  if (raw == null || raw.isEmpty) return null;

  final websiteNorm =
      websiteUrl?.trim().isNotEmpty == true ? _normalizeComparableUrl(websiteUrl!) : null;

  final uniqueTokens = <String>[];
  final seen = <String>{};
  for (final token in raw.split(RegExp(r'\s+')).where((t) => t.isNotEmpty)) {
    final key = _normalizeComparableUrl(token);
    if (seen.contains(key)) continue;
    seen.add(key);
    uniqueTokens.add(token);
  }

  if (uniqueTokens.isEmpty) return null;

  if (websiteNorm != null &&
      uniqueTokens.every((token) => _normalizeComparableUrl(token) == websiteNorm)) {
    return null;
  }

  return uniqueTokens.join(' ');
}

String? resolveBookEdition({
  String? edition,
  String? editionAr,
  required bool isAr,
}) {
  final ar = editionAr?.trim();
  final en = edition?.trim();
  if (isAr) return ar ?? en;
  return en ?? ar;
}
