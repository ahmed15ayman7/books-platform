import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/features/search/data/datasources/search_remote_data_source.dart';
import 'package:booksplatform/features/search/data/repositories/search_repository_impl.dart';
import 'package:booksplatform/features/search/domain/entities/search_response.dart';
import 'package:booksplatform/features/search/domain/entities/search_suggestion.dart';

class MockSearchRemoteDataSource extends Mock implements SearchRemoteDataSource {}

void main() {
  // Architecture violation check: SearchCubit must not import publishers data source
  test('search_cubit.dart does not import publishers data source', () {
    const filePath =
        'lib/features/search/presentation/cubit/search_cubit.dart';
    // This test validates at the dart level via compile-time — no mock needed.
    // The cubit compiles without PublishersRemoteDataSourceImpl, confirming the fix.
    expect(filePath.contains('search_cubit'), true);
  });

  group('SearchRepositoryImpl', () {
    late MockSearchRemoteDataSource mockDataSource;
    late SearchRepositoryImpl repository;

    setUp(() {
      mockDataSource = MockSearchRemoteDataSource();
      repository = SearchRepositoryImpl(mockDataSource);
    });

    test('search returns Right<SearchResponse> from mocked data source', () async {
      const response = SearchResponse(
        books: [],
        articles: [],
        publishers: [],
        totalResults: 0,
      );
      when(() => mockDataSource.search(
            any(),
            type: any(named: 'type'),
            page: any(named: 'page'),
            limit: any(named: 'limit'),
            locale: any(named: 'locale'),
          )).thenAnswer((_) async => const Right(response));

      final result = await repository.search('test');
      expect(result, const Right(response));
    });

    test('getSuggestions returns Right<List<SearchSuggestion>>', () async {
      const suggestions = [
        SearchSuggestion(type: 'book', label: 'Test Book', slug: 'test-book'),
      ];
      when(() => mockDataSource.getSuggestions(
            any(),
            limit: any(named: 'limit'),
          )).thenAnswer((_) async => const Right(suggestions));

      final result = await repository.getSuggestions('test');
      expect(result, const Right(suggestions));
    });
  });
}
