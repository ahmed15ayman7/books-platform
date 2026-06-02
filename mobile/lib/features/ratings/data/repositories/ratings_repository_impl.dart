import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/comment.dart';
import '../../domain/entities/rating.dart';
import '../../domain/repositories/ratings_repository.dart';
import '../datasources/ratings_remote_data_source.dart';

@LazySingleton(as: RatingsRepository)
class RatingsRepositoryImpl implements RatingsRepository {
  RatingsRepositoryImpl(this._remote);

  final RatingsRemoteDataSource _remote;

  @override
  Future<Either<Failure, Rating>> getRatings(String productId) =>
      _remote.getRatings(productId);

  @override
  Future<Either<Failure, Unit>> submitRating(
    String productId,
    String email,
    int stars,
  ) =>
      _remote.submitRating(productId, email, stars);

  @override
  Future<Either<Failure, PaginatedResponse<Comment>>> getComments(
    String productId, {
    int page = 1,
    int limit = 20,
  }) =>
      _remote.getComments(productId, page: page, limit: limit);

  @override
  Future<Either<Failure, Unit>> submitComment({
    required String authorName,
    required String email,
    required String content,
    String? productId,
    String? articleId,
    String? parentId,
  }) =>
      _remote.submitComment(
        authorName: authorName,
        email: email,
        content: content,
        productId: productId,
        articleId: articleId,
        parentId: parentId,
      );
}
