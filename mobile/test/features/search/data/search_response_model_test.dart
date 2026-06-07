import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/search/data/models/search_result_model.dart';

void main() {
  group('SearchResponseModel', () {
    test('parses preview mode with nested section objects', () {
      final model = SearchResponseModel.fromJson({
        'mode': 'preview',
        'query': 'Harvard',
        'books': {
          'items': [
            {
              'id': '1',
              'slug': 'origin',
              'nameEn': 'Origin',
              'nameAr': 'أصل',
            },
          ],
          'total': 55,
        },
        'articles': {'items': [], 'total': 0},
        'publishers': {
          'items': [
            {
              'id': '2',
              'slug': 'harvard-university-press',
              'name': 'Harvard University Press',
            },
          ],
          'total': 1,
        },
      });

      final entity = model.toEntity();
      expect(entity.books.length, 1);
      expect(entity.booksTotal, 55);
      expect(entity.publishers.length, 1);
      expect(entity.publishersTotal, 1);
      expect(entity.totalResults, 56);
      expect(entity.hasMore, false);
    });

    test('parses section mode with flat array and pagination', () {
      final model = SearchResponseModel.fromJson({
        'mode': 'section',
        'type': 'books',
        'query': 'Harvard',
        'pagination': {
          'page': 1,
          'limit': 20,
          'total': 55,
          'totalPages': 3,
          'hasNextPage': true,
          'hasPrevPage': false,
        },
        'books': [
          {
            'id': '1',
            'slug': 'origin',
            'nameEn': 'Origin',
            'nameAr': 'أصل',
          },
        ],
      });

      final entity = model.toEntity();
      expect(entity.books.length, 1);
      expect(entity.booksTotal, 55);
      expect(entity.articles, isEmpty);
      expect(entity.publishers, isEmpty);
      expect(entity.hasMore, true);
    });
  });

  group('SearchSuggestionModel', () {
    test('parses labelEn for localized display', () {
      final model = SearchSuggestionModel.fromJson({
        'type': 'book',
        'label': 'كتاب',
        'labelEn': 'Book EN',
        'slug': 'book-slug',
      });

      final entity = model.toEntity();
      expect(entity.labelEn, 'Book EN');
      expect(entity.displayLabel('en'), 'Book EN');
      expect(entity.displayLabel('ar'), 'كتاب');
    });
  });
}
