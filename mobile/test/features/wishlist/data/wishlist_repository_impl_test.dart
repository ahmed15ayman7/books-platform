import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/features/wishlist/data/datasources/wishlist_data_source.dart';
import 'package:booksplatform/features/wishlist/data/repositories/wishlist_repository_impl.dart';
import 'package:booksplatform/features/wishlist/domain/entities/wishlist_item.dart';

class MockWishlistDataSource extends Mock implements WishlistDataSource {}

void main() {
  late MockWishlistDataSource mockDataSource;
  late WishlistRepositoryImpl repository;

  setUp(() {
    mockDataSource = MockWishlistDataSource();
    repository = WishlistRepositoryImpl(mockDataSource);
  });

  group('WishlistRepositoryImpl', () {
    test('getWishlist returns Right with item list', () async {
      const items = [
        WishlistItem(bookSlug: 'slug-1'),
        WishlistItem(bookSlug: 'slug-2'),
      ];
      when(() => mockDataSource.getWishlist())
          .thenAnswer((_) async => const Right(items));
      final result = await repository.getWishlist();
      expect(result.isRight(), true);
      result.fold((_) {}, (list) => expect(list, items));
    });

    test('addToWishlist delegates to data source', () async {
      const item = WishlistItem(bookSlug: 'test-slug');
      when(() => mockDataSource.addToWishlist(any()))
          .thenAnswer((_) async => const Right(unit));
      await repository.addToWishlist(item);
      verify(() => mockDataSource.addToWishlist(item)).called(1);
    });

    test('removeFromWishlist delegates to data source', () async {
      when(() => mockDataSource.removeFromWishlist(any()))
          .thenAnswer((_) async => const Right(unit));
      await repository.removeFromWishlist('test-slug');
      verify(() => mockDataSource.removeFromWishlist('test-slug')).called(1);
    });

    test('isInWishlist returns correct bool', () async {
      when(() => mockDataSource.isInWishlist('in-list'))
          .thenAnswer((_) async => const Right(true));
      when(() => mockDataSource.isInWishlist('not-in-list'))
          .thenAnswer((_) async => const Right(false));

      final inList = await repository.isInWishlist('in-list');
      final notInList = await repository.isInWishlist('not-in-list');

      expect(inList.isRight(), true);
      inList.fold((_) {}, (v) => expect(v, true));
      expect(notInList.isRight(), true);
      notInList.fold((_) {}, (v) => expect(v, false));
    });

    test('clearWishlist delegates to data source', () async {
      when(() => mockDataSource.clearWishlist())
          .thenAnswer((_) async => const Right(unit));
      await repository.clearWishlist();
      verify(() => mockDataSource.clearWishlist()).called(1);
    });
  });
}
