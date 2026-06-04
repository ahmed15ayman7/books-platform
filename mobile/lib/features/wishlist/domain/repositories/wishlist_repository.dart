import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../entities/wishlist_item.dart';

abstract class WishlistRepository {
  Future<Either<Failure, List<WishlistItem>>> getWishlist();
  Future<Either<Failure, Unit>> addToWishlist(WishlistItem item);
  Future<Either<Failure, Unit>> removeFromWishlist(String slug);
  Future<Either<Failure, bool>> isInWishlist(String slug);
  Future<Either<Failure, Unit>> clearWishlist();
}
