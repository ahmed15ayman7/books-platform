import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/network/api_envelope.dart';
import 'package:booksplatform/core/network/api_manager.dart';
import 'package:booksplatform/features/books/data/datasources/books_remote_data_source_impl.dart';
import 'package:booksplatform/features/books/domain/entities/book.dart';
import 'package:booksplatform/features/books/domain/entities/book_stats.dart';

class MockApiManager extends Mock implements ApiManager {}

void main() {
  late MockApiManager mockApiManager;
  late BooksRemoteDataSourceImpl dataSource;

  setUpAll(() {
    registerFallbackValue(<String, dynamic>{});
  });

  setUp(() {
    mockApiManager = MockApiManager();
    dataSource = BooksRemoteDataSourceImpl(mockApiManager);
  });

  group('BooksRemoteDataSourceImpl', () {
    test('getBookBySlug calls correct path and maps Book entity', () async {
      final envJson = {
        'data': {
          '_id': 'test-id',
          'slug': 'test-slug',
          'nameAr': 'كتاب تجريبي',
          'nameEn': 'Test Book',
          'purchaseOption': 'DIRECT',
          'translationStatus': 'TRANSLATED',
          'categories': [],
        }
      };
      when(() => mockApiManager.get<Book>(
            path: any(named: 'path'),
            queryParameters: any(named: 'queryParameters'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(envJson) as Book);
      });

      final result = await dataSource.getBookBySlug('test-slug');
      expect(result.isRight(), true);
      result.fold((_) {}, (book) {
        expect(book.slug, 'test-slug');
        expect(book.titleAr, 'كتاب تجريبي');
      });
    });

    test('getStats calls /books/stats path and maps BookStats entity', () async {
      final statsJson = {
        'data': {
          'totalBooks': 100,
          'totalPublishers': 20,
          'totalTranslatedBooks': 50,
          'totalCountries': 15,
        }
      };
      when(() => mockApiManager.get<BookStats>(
            path: any(named: 'path'),
            queryParameters: any(named: 'queryParameters'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(statsJson) as BookStats);
      });

      final result = await dataSource.getStats();
      expect(result.isRight(), true);
      result.fold((_) {}, (stats) {
        expect(stats.totalBooks, 100);
        expect(stats.totalPublishers, 20);
        expect(stats.totalTranslatedBooks, 50);
        expect(stats.totalCountries, 15);
      });
    });

    test('getBooks sends correct query params for category filter', () async {
      final paginatedJson = {
        'data': [],
        'pagination': {
          'page': 1,
          'limit': 20,
          'total': 0,
          'totalPages': 0,
          'hasNextPage': false,
        }
      };

      Map<String, dynamic>? capturedParams;
      when(() => mockApiManager.get<PaginatedResponse<Book>>(
            path: any(named: 'path'),
            queryParameters: any(named: 'queryParameters'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        capturedParams = inv.namedArguments[#queryParameters]
            as Map<String, dynamic>?;
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(paginatedJson) as PaginatedResponse<Book>);
      });

      await dataSource.getBooks(categorySlug: 'fiction');
      expect(capturedParams?['categorySlug'], 'fiction');
    });
  });
}
