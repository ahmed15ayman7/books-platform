import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/comment.dart';
import '../../domain/entities/rating.dart';
import '../models/comment_model.dart';
import '../models/rating_model.dart';

@lazySingleton
class RatingsRemoteDataSource {
  RatingsRemoteDataSource(this._api);

  final ApiManager _api;

  Future<Either<Failure, Rating>> getRatings(String productId) => _api.get(
        path: '/ratings',
        queryParameters: {'productId': productId},
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: RatingModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, Unit>> submitRating(
    String productId,
    String email,
    int stars,
  ) =>
      _api.post(
        path: '/ratings',
        data: {'productId': productId, 'email': email, 'stars': stars},
        fromJson: (_) => unit,
      );

  Future<Either<Failure, PaginatedResponse<Comment>>> getComments(
    String productId, {
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Comment>>(
        path: '/comments',
        queryParameters: {'productId': productId, 'page': page, 'limit': limit},
        fromJson: (json) => PaginatedResponse<Comment>.fromJson(
          json,
          fromJsonT: (item) => CommentModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, Unit>> submitComment({
    required String authorName,
    required String email,
    required String content,
    String? productId,
    String? articleId,
    String? parentId,
  }) =>
      _api.post(
        path: '/comments',
        data: {
          'authorName': authorName,
          'email': email,
          'content': content,
          'website': '', // honeypot anti-spam field
          'productId': ?productId,
          'articleId': ?articleId,
          'parentId': ?parentId,
        },
        fromJson: (_) => unit,
      );
}
