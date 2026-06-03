import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/repositories/wishlist_repository.dart';
import '../datasources/wishlist_data_source.dart';

@LazySingleton(as: WishlistRepository)
class WishlistRepositoryImpl implements WishlistRepository {
  WishlistRepositoryImpl(this._dataSource);

  final WishlistDataSource _dataSource;

  @override
  Future<Either<Failure, List<String>>> getWishlist() =>
      _dataSource.getWishlist();

  @override
  Future<Either<Failure, Unit>> addToWishlist(String slug) =>
      _dataSource.addToWishlist(slug);

  @override
  Future<Either<Failure, Unit>> removeFromWishlist(String slug) =>
      _dataSource.removeFromWishlist(slug);

  @override
  Future<Either<Failure, bool>> isInWishlist(String slug) =>
      _dataSource.isInWishlist(slug);

  @override
  Future<Either<Failure, Unit>> clearWishlist() => _dataSource.clearWishlist();
}
