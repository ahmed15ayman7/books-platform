import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/articles/data/models/article_detail_model.dart';
import 'package:booksplatform/features/articles/data/models/article_model.dart';

void main() {
  group('ArticleModel.fromJson', () {
    group('readingTime field — Bug 5', () {
      test('maps readingTimeMinutes to readingTime', () {
        final json = _baseArticleJson({'readingTimeMinutes': 9});
        expect(ArticleModel.fromJson(json).readingTime, 9);
      });

      test('falls back to readingTime when readingTimeMinutes is absent', () {
        final json = _baseArticleJson({'readingTime': 4});
        expect(ArticleModel.fromJson(json).readingTime, 4);
      });

      test('returns default 5 when neither field is present', () {
        expect(ArticleModel.fromJson(_baseArticleJson({})).readingTime, 5);
      });

      test('readingTimeMinutes takes priority over readingTime when both present', () {
        final json = _baseArticleJson({'readingTimeMinutes': 9, 'readingTime': 3});
        expect(ArticleModel.fromJson(json).readingTime, 9);
      });
    });

    group('toEntity()', () {
      test('readMinutes and readingTime both reflect readingTimeMinutes from API', () {
        final json = _baseArticleJson({'readingTimeMinutes': 7});
        final entity = ArticleModel.fromJson(json).toEntity();
        expect(entity.readMinutes, 7);
        expect(entity.readingTime, 7);
      });
    });
  });

  group('ArticleDetailModel.fromJson', () {
    group('readingTime field — Bug 6', () {
      test('maps readingTimeMinutes to readingTime', () {
        final json = _baseDetailJson({'readingTimeMinutes': 12});
        expect(ArticleDetailModel.fromJson(json).readingTime, 12);
      });

      test('falls back to readingTime when readingTimeMinutes is absent', () {
        final json = _baseDetailJson({'readingTime': 6});
        expect(ArticleDetailModel.fromJson(json).readingTime, 6);
      });

      test('returns default 5 when neither field is present', () {
        expect(ArticleDetailModel.fromJson(_baseDetailJson({})).readingTime, 5);
      });
    });
  });
}

Map<String, dynamic> _baseArticleJson(Map<String, dynamic> overrides) => {
      'id': 'article-1',
      'slug': 'test-article',
      'title': 'مقال تجريبي',
      'channel': 'harvest',
      ...overrides,
    };

Map<String, dynamic> _baseDetailJson(Map<String, dynamic> overrides) => {
      'id': 'article-1',
      'slug': 'test-article',
      'title': 'مقال تجريبي',
      'channel': 'harvest',
      'bodyParagraphs': [],
      'relatedArticles': [],
      ...overrides,
    };
