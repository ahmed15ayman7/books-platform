import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:booksplatform/core/enums/translation_status.dart';
import 'package:booksplatform/features/publishers/data/datasources/publishers_local_data_source_impl.dart';
import 'package:booksplatform/features/publishers/domain/entities/country.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher.dart';
import 'package:booksplatform/features/publishers/domain/entities/publisher_book.dart';

void main() {
  late SharedPreferences prefs;
  late PublishersLocalDataSourceImpl dataSource;

  const publisher = Publisher(
    id: 'bloomsbury',
    name: 'Bloomsbury',
    nameAr: 'بلومزبري',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    countryFlag: '🇪🇬',
    bookCount: 12,
    countrySlug: 'egypt',
  );

  const book = PublisherBook(
    id: 'book-1',
    titleAr: 'عنوان',
    titleEn: 'Title',
    publisher: 'Bloomsbury',
    coverColors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
    categorySlug: 'fiction',
    status: TranslationStatus.translated,
  );

  const country = Country(slug: 'egypt', nameEn: 'Egypt', nameAr: 'مصر');

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    prefs = await SharedPreferences.getInstance();
    dataSource = PublishersLocalDataSourceImpl(prefs);
  });

  group('publishers list cache', () {
    test('returns CacheFailure when nothing cached', () async {
      final result = await dataSource.getPublishers();
      expect(result.isLeft(), true);
    });

    test('round-trips a saved default list', () async {
      await dataSource.savePublishers([publisher]);
      final result = await dataSource.getPublishers();
      expect(result.isRight(), true);
      result.fold((_) => fail('expected Right'), (list) {
        expect(list, hasLength(1));
        expect(list.first.id, publisher.id);
        expect(list.first.nameAr, publisher.nameAr);
      });
    });

    test('returns CacheFailure for a filtered query without checking storage',
        () async {
      await dataSource.savePublishers([publisher]);
      final byCountry = await dataSource.getPublishers(countrySlug: 'egypt');
      final bySearch = await dataSource.getPublishers(search: 'bloom');
      expect(byCountry.isLeft(), true);
      expect(bySearch.isLeft(), true);
    });
  });

  group('countries cache', () {
    test('returns CacheFailure when nothing cached', () async {
      final result = await dataSource.getCountries();
      expect(result.isLeft(), true);
    });

    test('round-trips saved countries', () async {
      await dataSource.saveCountries([country]);
      final result = await dataSource.getCountries();
      expect(result.isRight(), true);
      result.fold((_) => fail('expected Right'), (list) {
        expect(list, hasLength(1));
        expect(list.first.slug, 'egypt');
        expect(list.first.nameAr, 'مصر');
      });
    });
  });

  group('publisher detail cache', () {
    test('returns CacheFailure when slug not cached', () async {
      final result = await dataSource.getPublisherBySlug('unknown');
      expect(result.isLeft(), true);
    });

    test('round-trips a saved publisher detail including book cover colors',
        () async {
      await dataSource.savePublisherDetail('bloomsbury', publisher, [book]);
      final result = await dataSource.getPublisherBySlug('bloomsbury');
      expect(result.isRight(), true);
      result.fold((_) => fail('expected Right'), (record) {
        final (cachedPublisher, cachedBooks) = record;
        expect(cachedPublisher.id, publisher.id);
        expect(cachedBooks, hasLength(1));
        expect(cachedBooks.first.coverColors, book.coverColors);
        expect(cachedBooks.first.status, TranslationStatus.translated);
      });
    });

    test('detail cache is keyed independently per slug', () async {
      await dataSource.savePublisherDetail('bloomsbury', publisher, [book]);
      final result = await dataSource.getPublisherBySlug('other-publisher');
      expect(result.isLeft(), true);
    });
  });
}
