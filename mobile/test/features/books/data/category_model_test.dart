import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/books/data/models/category_model.dart';

void main() {
  group('CategoryModel.fromJson', () {
    group('bookCount field — Bug 4', () {
      test('maps count to bookCount', () {
        final json = {'slug': 'fiction', 'nameAr': 'روايات', 'count': 1607};
        expect(CategoryModel.fromJson(json).bookCount, 1607);
      });

      test('falls back to linkedCount when count is absent', () {
        final json = {'slug': 'fiction', 'nameAr': 'روايات', 'linkedCount': 800};
        expect(CategoryModel.fromJson(json).bookCount, 800);
      });

      test('falls back to bookCount when count and linkedCount are absent', () {
        final json = {'slug': 'fiction', 'nameAr': 'روايات', 'bookCount': 500};
        expect(CategoryModel.fromJson(json).bookCount, 500);
      });

      test('returns 0 when no count field is present', () {
        final json = {'slug': 'fiction', 'nameAr': 'روايات'};
        expect(CategoryModel.fromJson(json).bookCount, 0);
      });

      test('count takes priority over linkedCount and bookCount', () {
        final json = {
          'slug': 'fiction',
          'nameAr': 'روايات',
          'count': 1607,
          'linkedCount': 100,
          'bookCount': 50,
        };
        expect(CategoryModel.fromJson(json).bookCount, 1607);
      });
    });

    group('toEntity()', () {
      test('maps bookCount correctly to Category entity', () {
        final json = {
          'slug': 'ideas-and-policies',
          'nameAr': 'أفكار وسياسات',
          'nameEn': 'Ideas and Policies',
          'count': 1607,
        };
        final entity = CategoryModel.fromJson(json).toEntity();
        expect(entity.bookCount, 1607);
        expect(entity.slug, 'ideas-and-policies');
      });
    });
  });
}
