import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';

abstract class WishlistRepository {
  Future<Either<Failure, List<String>>> getWishlist();
  Future<Either<Failure, Unit>> addToWishlist(String slug);
  Future<Either<Failure, Unit>> removeFromWishlist(String slug);
  Future<Either<Failure, bool>> isInWishlist(String slug);
  Future<Either<Failure, Unit>> clearWishlist();
}
