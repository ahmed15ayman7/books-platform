import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/core/helpers/book_biblio_helpers.dart';

void main() {
  group('resolveBookCountry', () {
    test('prefers publisher country names', () {
      expect(
        resolveBookCountry(
          countries: [
            {'name': 'USA', 'nameAr': 'أمريكا'},
          ],
          topLevelCountry: '18047',
          isAr: true,
        ),
        'أمريكا',
      );
    });

    test('ignores numeric top-level country', () {
      expect(
        resolveBookCountry(
          countries: const [],
          topLevelCountry: '18047',
          isAr: false,
        ),
        isNull,
      );
    });
  });

  group('resolveLanguageLabel', () {
    test('maps known language codes', () {
      expect(resolveLanguageLabel('en', isAr: true), 'الإنجليزية (EN)');
      expect(resolveLanguageLabel('ar', isAr: false), 'Arabic (AR)');
    });

    test('returns null for invalid code 0', () {
      expect(resolveLanguageLabel('0', isAr: true), isNull);
    });
  });

  group('resolvePublisherAddress', () {
    test('hides address when it only repeats website url', () {
      expect(
        resolvePublisherAddress(
          address: 'https://example.com',
          websiteUrl: 'https://example.com',
        ),
        isNull,
      );
    });
  });
}
