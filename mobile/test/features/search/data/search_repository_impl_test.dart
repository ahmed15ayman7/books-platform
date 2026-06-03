import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/features/search/data/datasources/search_remote_data_source.dart';
import 'package:booksplatform/features/search/data/repositories/search_repository_impl.dart';
import 'package:booksplatform/features/search/domain/entities/search_response.dart';
import 'package:booksplatform/features/search/domain/entities/search_suggestion.dart';

class MockSearchRemoteDataSource extends Mock implements SearchRemoteDataSource {}

void main() {
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
