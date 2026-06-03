import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/books/data/models/book_model.dart';

void main() {
  group('BookModel.fromJson', () {
    group('pages field — Bug 1', () {
      test('maps pageCount to pages', () {
        final json = _baseJson({'pageCount': 320});
        expect(BookModel.fromJson(json).pages, 320);
      });

      test('falls back to pages when pageCount is absent', () {
        final json = _baseJson({'pages': 180});
        expect(BookModel.fromJson(json).pages, 180);
      });

      test('returns 0 when neither pageCount nor pages is present', () {
        expect(BookModel.fromJson(_baseJson({})).pages, 0);
      });

      test('pageCount takes priority over pages when both present', () {
        final json = _baseJson({'pageCount': 300, 'pages': 999});
        expect(BookModel.fromJson(json).pages, 300);
      });
    });

    group('country fields — Bug 2', () {
      test('maps publishingCountry to countryAr and countryEn', () {
        final json = _baseJson({'publishingCountry': 'المملكة المتحدة'});
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'المملكة المتحدة');
        expect(model.countryEn, 'المملكة المتحدة');
      });

      test('falls back to countryAr / countryEn when publishingCountry absent', () {
        final json = _baseJson({'countryAr': 'مصر', 'countryEn': 'Egypt'});
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'مصر');
        expect(model.countryEn, 'Egypt');
      });

      test('publishingCountry takes priority over countryAr/countryEn when all present', () {
        final json = _baseJson({
          'publishingCountry': 'فرنسا',
          'countryAr': 'مصر',
          'countryEn': 'Egypt',
        });
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'فرنسا');
        expect(model.countryEn, 'فرنسا');
      });

      test('returns empty strings when no country field present', () {
        final model = BookModel.fromJson(_baseJson({}));
        expect(model.countryAr, '');
        expect(model.countryEn, '');
      });
    });

    group('toEntity()', () {
      test('maps pages and country correctly to Book entity', () {
        final json = _baseJson({'pageCount': 200, 'publishingCountry': 'ألمانيا'});
        final entity = BookModel.fromJson(json).toEntity();
        expect(entity.pages, 200);
        expect(entity.countryAr, 'ألمانيا');
        expect(entity.countryEn, 'ألمانيا');
      });
    });
  });
}

Map<String, dynamic> _baseJson(Map<String, dynamic> overrides) => {
      'id': 'book-1',
      'slug': 'test-book',
      'nameAr': 'كتاب تجريبي',
      'nameEn': 'Test Book',
      'translationStatus': 'TRANSLATED',
      'categories': [],
      ...overrides,
    };
