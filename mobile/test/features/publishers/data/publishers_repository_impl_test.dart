import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/features/publishers/data/datasources/base_publishers_data_source.dart';
import 'package:booksplatform/features/publishers/data/datasources/publishers_local_data_source_impl.dart';
import 'package:booksplatform/features/publishers/data/repositories/publishers_repository_impl.dart';
import 'package:booksplatform/features/publishers/domain/entities/country.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher_book.dart';

class MockRemoteDataSource extends Mock implements BasePublishersDataSource {}

class MockLocalDataSource extends Mock implements PublishersLocalDataSourceImpl {}

void main() {
  late MockRemoteDataSource mockRemote;
  late MockLocalDataSource mockLocal;
  late PublishersRepositoryImpl repository;

  const publisher = Publisher(
    id: 'bloomsbury',
    name: 'Bloomsbury',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    countryFlag: '🇪🇬',
    bookCount: 12,
  );
  const country = Country(slug: 'egypt', nameEn: 'Egypt', nameAr: 'مصر');
  const books = <PublisherBook>[];
  const failure = NetworkFailure();

  setUpAll(() {
    registerFallbackValue(<Publisher>[]);
    registerFallbackValue(<Country>[]);
    registerFallbackValue(publisher);
    registerFallbackValue(books);
  });

  setUp(() {
    mockRemote = MockRemoteDataSource();
    mockLocal = MockLocalDataSource();
    repository = PublishersRepositoryImpl(mockRemote, mockLocal);

    when(() => mockLocal.savePublishers(any())).thenAnswer((_) async {});
    when(() => mockLocal.saveCountries(any())).thenAnswer((_) async {});
    when(() => mockLocal.savePublisherDetail(any(), any(), any()))
        .thenAnswer((_) async {});
  });

  group('getPublishers', () {
    test('remote success returns Right and populates the cache for the '
        'default (unfiltered) query', () async {
      when(() => mockRemote.getPublishers(countrySlug: null, search: null))
          .thenAnswer((_) async => const Right([publisher]));

      final result = await repository.getPublishers();

      expect(result, const Right<Failure, List<Publisher>>([publisher]));
      verify(() => mockLocal.savePublishers([publisher])).called(1);
    });

    test('remote success for a filtered query does not populate the cache',
        () async {
      when(() => mockRemote.getPublishers(
            countrySlug: 'egypt',
            search: null,
          )).thenAnswer((_) async => const Right([publisher]));

      await repository.getPublishers(countrySlug: 'egypt');

      verifyNever(() => mockLocal.savePublishers(any()));
    });

    test('remote failure falls back to the local cache', () async {
      when(() => mockRemote.getPublishers(countrySlug: null, search: null))
          .thenAnswer((_) async => const Left(failure));
      when(() => mockLocal.getPublishers(countrySlug: null, search: null))
          .thenAnswer((_) async => const Right([publisher]));

      final result = await repository.getPublishers();

      expect(result, const Right<Failure, List<Publisher>>([publisher]));
    });

    test('remote and local failure returns the local Failure', () async {
      when(() => mockRemote.getPublishers(countrySlug: null, search: null))
          .thenAnswer((_) async => const Left(failure));
      when(() => mockLocal.getPublishers(countrySlug: null, search: null))
          .thenAnswer((_) async => const Left(CacheFailure()));

      final result = await repository.getPublishers();

      expect(result, const Left<Failure, List<Publisher>>(CacheFailure()));
    });
  });

  group('getCountries', () {
    test('remote success returns Right and populates the cache', () async {
      when(() => mockRemote.getCountries())
          .thenAnswer((_) async => const Right([country]));

      final result = await repository.getCountries();

      expect(result, const Right<Failure, List<Country>>([country]));
      verify(() => mockLocal.saveCountries([country])).called(1);
    });

    test('remote failure falls back to the local cache', () async {
      when(() => mockRemote.getCountries())
          .thenAnswer((_) async => const Left(failure));
      when(() => mockLocal.getCountries())
          .thenAnswer((_) async => const Right([country]));

      final result = await repository.getCountries();

      expect(result, const Right<Failure, List<Country>>([country]));
    });
  });

  group('getPublisherBySlug', () {
    test('remote success returns Right and populates the cache', () async {
      when(() => mockRemote.getPublisherBySlug('bloomsbury'))
          .thenAnswer((_) async => const Right((publisher, books)));

      final result = await repository.getPublisherBySlug('bloomsbury');

      expect(
        result,
        const Right<Failure, (Publisher, List<PublisherBook>)>(
          (publisher, books),
        ),
      );
      verify(() => mockLocal.savePublisherDetail('bloomsbury', publisher, books))
          .called(1);
    });

    test('remote failure falls back to the local cache', () async {
      when(() => mockRemote.getPublisherBySlug('bloomsbury'))
          .thenAnswer((_) async => const Left(failure));
      when(() => mockLocal.getPublisherBySlug('bloomsbury'))
          .thenAnswer((_) async => const Right((publisher, books)));

      final result = await repository.getPublisherBySlug('bloomsbury');

      expect(
        result,
        const Right<Failure, (Publisher, List<PublisherBook>)>(
          (publisher, books),
        ),
      );
    });
  });
}
