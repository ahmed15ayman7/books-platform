import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/article.dart';
import '../../domain/entities/article_detail.dart';
import '../../domain/repositories/base_articles_repository.dart';
import '../datasources/articles_remote_data_source_impl.dart';

@LazySingleton(as: ArticlesRepository)
class ArticlesRepositoryImpl implements ArticlesRepository {
  const ArticlesRepositoryImpl(this._remote);

  final ArticlesRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, ArticleDetail>> getArticleDetail(String slug, {String? locale}) =>
      _remote.getArticleDetail(slug, locale: locale);

  @override
  Future<Either<Failure, PaginatedResponse<Article>>> getArticles({
    String? channel,
    int page = 1,
    int limit = 20,
    String? sort,
    String? locale,
  }) =>
      _remote.getArticles(
        channel: channel,
        page: page,
        limit: limit,
        sort: sort,
        locale: locale,
      );
}
