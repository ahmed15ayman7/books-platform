import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/core/storage/wishlist_storage.dart';

@lazySingleton
class WishlistDataSource {
  WishlistDataSource(this._storage);

  final WishlistStorage _storage;

  Future<Either<Failure, List<String>>> getWishlist() async {
    try {
      return right(_storage.getSlugs());
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, Unit>> addToWishlist(String slug) async {
    try {
      await _storage.addSlug(slug);
      return right(unit);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<Either<Failure, Unit>> removeFromWishlist(String slug) async {
    try {
      await _storage.removeSlug(slug);
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
}
