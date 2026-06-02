import 'package:dartz/dartz.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../entities/article.dart';
import '../entities/article_detail.dart';

abstract class ArticlesRepository {
  Future<Either<Failure, ArticleDetail>> getArticleDetail(String slug, {String? locale});

  Future<Either<Failure, PaginatedResponse<Article>>> getArticles({
    String? channel,
    int page = 1,
    int limit = 20,
    String? sort,
    String? locale,
  });
}
