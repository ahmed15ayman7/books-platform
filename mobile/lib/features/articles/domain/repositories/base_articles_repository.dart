import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../entities/article_detail.dart';

abstract class ArticlesRepository {
  Future<Either<Failure, ArticleDetail>> getArticleDetail(String id);
}
