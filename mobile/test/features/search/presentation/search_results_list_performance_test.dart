import 'package:booksplatform/core/enums/translation_status.dart';
import 'package:booksplatform/features/articles/domain/entities/article.dart';
import 'package:booksplatform/features/books/domain/entities/book.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher.dart';
import 'package:booksplatform/features/search/domain/entities/search_response.dart';
import 'package:booksplatform/features/search/domain/entities/search_section_type.dart';
import 'package:booksplatform/features/search/presentation/cubit/search_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('SearchSuccess.results performance', () {
    test('builds 100 mixed results in under 10ms', () {
      final state = SearchSuccess(
        response: SearchResponse(
          books: List.generate(34, _book),
          articles: List.generate(33, _article),
          publishers: List.generate(33, _publisher),
          booksTotal: 34,
          articlesTotal: 33,
          publishersTotal: 33,
        ),
        suggestions: const [],
        query: 'test',
        tab: SearchSectionType.all,
        locale: 'ar',
      );

      final stopwatch = Stopwatch()..start();
      final results = state.results;
      stopwatch.stop();

      expect(results.length, 100);
      expect(stopwatch.elapsedMilliseconds, lessThan(10));
    });

    test('repeated access stays under 10ms per call', () {
      final state = SearchSuccess(
        response: SearchResponse(
          books: List.generate(50, _book),
          articles: const [],
          publishers: const [],
          booksTotal: 50,
          articlesTotal: 0,
          publishersTotal: 0,
        ),
        suggestions: const [],
        query: 'book',
        tab: SearchSectionType.books,
        locale: 'en',
      );

      final stopwatch = Stopwatch()..start();
      for (var i = 0; i < 20; i++) {
        expect(state.results.length, 50);
      }
      stopwatch.stop();

      expect(stopwatch.elapsedMilliseconds, lessThan(50));
    });
  });

  group('Publisher displayName in search results', () {
    test('uses Arabic name for ar locale', () {
      const publisher = Publisher(
        id: 'pub-1',
        name: 'Harvard Press',
        nameAr: 'ناشر هارفارد',
        countryAr: 'USA',
        countryEn: 'USA',
        countryFlag: '',
        bookCount: 12,
      );

      expect(publisher.displayName('ar'), 'ناشر هارفارد');
      expect(publisher.displayName('en'), 'Harvard Press');
    });
  });
}

Publisher _publisher(int i) => Publisher(
      id: 'pub-$i',
      name: 'Publisher $i',
      nameAr: 'ناشر $i',
      countryAr: 'مصر',
      countryEn: 'Egypt',
      countryFlag: '',
      bookCount: i + 1,
    );

Book _book(int i) => Book(
      id: 'book-$i',
      slug: 'book-$i',
      titleAr: 'كتاب $i',
      titleEn: 'Book $i',
      publisher: 'Publisher',
      publisherId: 'pub-1',
      countryAr: 'مصر',
      countryEn: 'Egypt',
      countryFlag: '',
      originalLanguage: 'en',
      status: TranslationStatus.translated,
      price: 10,
      categorySlug: 'fiction',
      coverColors: const [Color(0xFF1A1A2E), Color(0xFF16213E)],
      isbn: '978-0',
      pages: 200,
      edition: '1',
      year: 2024,
      descriptionAr: 'وصف',
    );

Article _article(int i) => Article(
      id: 'article-$i',
      slug: 'article-$i',
      title: 'مقال $i',
      titleEn: 'Article $i',
      excerpt: 'Excerpt $i',
      categoryLabel: 'News',
      channel: 'news',
      date: '2024-01-01',
      readMinutes: 5,
      coverColors: const [Color(0xFF1A1A2E), Color(0xFF16213E)],
    );
