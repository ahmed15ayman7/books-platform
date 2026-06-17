import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/network/api_envelope.dart';
import 'package:booksplatform/core/network/api_manager.dart';
import 'package:booksplatform/features/publishers/data/datasources/publishers_remote_data_source_impl.dart';
import 'package:booksplatform/features/publishers/domain/entities/country.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher.dart';

class MockApiManager extends Mock implements ApiManager {}

void main() {
  late MockApiManager mockApiManager;
  late PublishersRemoteDataSourceImpl dataSource;

  setUp(() {
    mockApiManager = MockApiManager();
    dataSource = PublishersRemoteDataSourceImpl(mockApiManager);
  });

  // The data source's fromJson already maps each item through
  // PublisherModel.fromJson().toEntity(), so we exercise the real chain by
  // feeding the raw API-shaped JSON into the captured fromJson closure.
  void stubPublishers(List<Map<String, dynamic>> items) {
    when(() => mockApiManager.get<PaginatedResponse<Publisher>>(
          path: any(named: 'path'),
          queryParameters: any(named: 'queryParameters'),
          fromJson: any(named: 'fromJson'),
        )).thenAnswer((inv) async {
      final fromJson = inv.namedArguments[#fromJson] as Function;
      final raw = <String, dynamic>{
        'data': items,
        'pagination': {'page': 1, 'limit': 100, 'total': 1, 'totalPages': 1},
      };
      return Right(fromJson(raw) as PaginatedResponse<Publisher>);
    });
  }

  group('getCountries — locale preservation', () {
    test('returns a Country with both nameEn and nameAr from the API', () async {
      stubPublishers([
        {
          'id': 'pub-1',
          'slug': 'bloomsbury',
          'name': 'Bloomsbury',
          'nameAr': 'بلومزبري',
          'countries': [
            {'id': 'c1', 'name': 'Egypt', 'nameAr': 'مصر', 'slug': 'egypt'}
          ],
        }
      ]);

      final result = await dataSource.getCountries();

      expect(result.isRight(), true);
      final countries = result.getOrElse(() => const <Country>[]);
      expect(countries, hasLength(1));
      expect(countries.first.slug, 'egypt');
      expect(countries.first.nameEn, 'Egypt');
      expect(countries.first.nameAr, 'مصر');
      expect(countries.first.displayName('en'), 'Egypt');
      expect(countries.first.displayName('ar'), 'مصر');
    });

    test('dedupes publishers that share the same country slug', () async {
      stubPublishers([
        {
          'id': 'pub-1',
          'name': 'Bloomsbury',
          'countries': [
            {'name': 'Egypt', 'nameAr': 'مصر', 'slug': 'egypt'}
          ],
        },
        {
          'id': 'pub-2',
          'name': 'Dar El Shorouk',
          'countries': [
            {'name': 'Egypt', 'nameAr': 'مصر', 'slug': 'egypt'}
          ],
        },
      ]);

      final result = await dataSource.getCountries();

      final countries = result.getOrElse(() => const <Country>[]);
      expect(countries.where((c) => c.slug == 'egypt'), hasLength(1));
    });

    test('sorts countries by English name', () async {
      stubPublishers([
        {
          'id': 'pub-1',
          'name': 'A',
          'countries': [
            {
              'name': 'Saudi Arabia',
              'nameAr': 'السعودية',
              'slug': 'saudi-arabia'
            }
          ],
        },
        {
          'id': 'pub-2',
          'name': 'B',
          'countries': [
            {'name': 'Egypt', 'nameAr': 'مصر', 'slug': 'egypt'}
          ],
        },
      ]);

      final result = await dataSource.getCountries();

      final countries = result.getOrElse(() => const <Country>[]);
      expect(
        countries.map((c) => c.nameEn).toList(),
        ['Egypt', 'Saudi Arabia'],
      );
    });
  });
}
