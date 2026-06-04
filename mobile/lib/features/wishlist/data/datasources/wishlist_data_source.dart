import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/core/storage/wishlist_storage.dart';

import '../../domain/entities/wishlist_item.dart';

@lazySingleton
class WishlistDataSource {
  WishlistDataSource(this._storage);

  final WishlistStorage _storage;

  Future<Either<Failure, List<WishlistItem>>> getWishlist() async {
    try {
      return right(
        _storage.getItemMaps().map(_mapToItem).toList(),
      );
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, Unit>> addToWishlist(WishlistItem item) async {
    try {
      await _storage.addItem({
        'slug': item.bookSlug,
        'titleAr': item.titleAr,
        'titleEn': item.titleEn,
        if (item.imageUrl != null) 'imageUrl': item.imageUrl,
      });
      return right(unit);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, Unit>> removeFromWishlist(String slug) async {
    try {
      await _storage.removeItem(slug);
      return right(unit);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, bool>> isInWishlist(String slug) async {
    try {
      return right(_storage.contains(slug));
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, Unit>> clearWishlist() async {
    try {
      await _storage.clear();
      return right(unit);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  static WishlistItem _mapToItem(Map<String, dynamic> m) => WishlistItem(
        bookSlug: m['slug'] as String,
        titleAr: m['titleAr'] as String? ?? '',
        titleEn: m['titleEn'] as String? ?? '',
        imageUrl: m['imageUrl'] as String?,
      );
}
