import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/storage/wishlist_storage.dart';
import 'package:booksplatform/features/wishlist/data/repositories/wishlist_repository_impl.dart';

class MockWishlistStorage extends Mock implements WishlistStorage {}

void main() {
  late MockWishlistStorage mockStorage;
  late WishlistRepositoryImpl repository;

  setUp(() {
    mockStorage = MockWishlistStorage();
    repository = WishlistRepositoryImpl(mockStorage);
  });

  group('WishlistRepositoryImpl', () {
    test('getWishlist returns Right with slug list', () async {
      when(() => mockStorage.getSlugs()).thenReturn(['slug-1', 'slug-2']);
      final result = await repository.getWishlist();
      expect(result.isRight(), true);
      result.fold((_) {}, (slugs) => expect(slugs, ['slug-1', 'slug-2']));
    });

    test('addToWishlist calls WishlistStorage.addSlug', () async {
      when(() => mockStorage.addSlug(any())).thenAnswer((_) async {});
      await repository.addToWishlist('test-slug');
      verify(() => mockStorage.addSlug('test-slug')).called(1);
    });

    test('removeFromWishlist calls WishlistStorage.removeSlug', () async {
      when(() => mockStorage.removeSlug(any())).thenAnswer((_) async {});
      await repository.removeFromWishlist('test-slug');
      verify(() => mockStorage.removeSlug('test-slug')).called(1);
    });

    test('isInWishlist returns correct bool', () async {
      when(() => mockStorage.contains('in-list')).thenReturn(true);
      when(() => mockStorage.contains('not-in-list')).thenReturn(false);

      final inList = await repository.isInWishlist('in-list');
      final notInList = await repository.isInWishlist('not-in-list');

      expect(inList.isRight(), true);
      inList.fold((_) {}, (v) => expect(v, true));
      expect(notInList.isRight(), true);
      notInList.fold((_) {}, (v) => expect(v, false));
    });

    test('clearWishlist calls WishlistStorage.clear', () async {
      when(() => mockStorage.clear()).thenAnswer((_) async {});
      await repository.clearWishlist();
      verify(() => mockStorage.clear()).called(1);
    });
  });
}
