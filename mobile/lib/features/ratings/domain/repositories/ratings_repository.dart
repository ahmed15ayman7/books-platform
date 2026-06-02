import 'package:dartz/dartz.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../entities/comment.dart';
import '../entities/rating.dart';

abstract class RatingsRepository {
  Future<Either<Failure, Rating>> getRatings(String productId);

  Future<Either<Failure, Unit>> submitRating(
    String productId,
    String email,
    int stars,
  );

  Future<Either<Failure, PaginatedResponse<Comment>>> getComments(
    String productId, {
    int page = 1,
    int limit = 20,
  });

  Future<Either<Failure, Unit>> submitComment({
    required String authorName,
    required String email,
    required String content,
    String? productId,
    String? articleId,
    String? parentId,
  });
}
