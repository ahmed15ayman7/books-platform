import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/article.dart';
import '../../domain/entities/article_detail.dart';
import '../models/article_detail_model.dart';
import '../models/article_model.dart';

@lazySingleton
class ArticlesRemoteDataSourceImpl {
  ArticlesRemoteDataSourceImpl(this._api);

  final ApiManager _api;

  Future<Either<Failure, PaginatedResponse<Article>>> getArticles({
    String? channel,
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Article>>(
        path: '/articles',
        queryParameters: {
          'page': page,
          'limit': limit,
          'channel': ?channel,
        },
        fromJson: (json) => PaginatedResponse<Article>.fromJson(
          json,
          fromJsonT: (item) => ArticleModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, ArticleDetail>> getArticleDetail(
    String slug, {
    String? locale,
  }) =>
      _api.get(
        path: '/articles/$slug',
        queryParameters: {'locale': ?locale},
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: ArticleDetailModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, List<Article>>> getRelatedArticles(
    String slug, {
    int limit = 6,
  }) =>
      _api.get(
        path: '/articles/$slug/related',
        queryParameters: {'limit': limit},
        fromJson: (json) {
          final list = (json as Map<String, dynamic>)['data'] as List<dynamic>;
          return list
              .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );

}
