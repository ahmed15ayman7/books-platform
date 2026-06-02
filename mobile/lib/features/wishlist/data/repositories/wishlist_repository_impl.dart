import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../../../core/storage/wishlist_storage.dart';
import '../../domain/repositories/wishlist_repository.dart';

@LazySingleton(as: WishlistRepository)
class WishlistRepositoryImpl implements WishlistRepository {
  WishlistRepositoryImpl(this._storage);

  final WishlistStorage _storage;

  @override
  Future<Either<Failure, List<String>>> getWishlist() async {
    try {
      return right(_storage.getSlugs());
    } catch (e) {
      return left(const CacheFailure());
    }
  }

  @override
  Future<Either<Failure, Unit>> addToWishlist(String slug) async {
    try {
      await _storage.addSlug(slug);
      return right(unit);
    } catch (e) {
      return left(const CacheFailure());
    }
  }

  @override
  Future<Either<Failure, Unit>> removeFromWishlist(String slug) async {
    try {
      await _storage.removeSlug(slug);
      return right(unit);
    } catch (e) {
      return left(const CacheFailure());
    }
  }

  @override
  Future<Either<Failure, bool>> isInWishlist(String slug) async {
    try {
      return right(_storage.contains(slug));
    } catch (e) {
      return left(const CacheFailure());
    }
  }

  @override
  Future<Either<Failure, Unit>> clearWishlist() async {
    try {
      await _storage.clear();
      return right(unit);
    } catch (e) {
      return left(const CacheFailure());
    }
  }
}
