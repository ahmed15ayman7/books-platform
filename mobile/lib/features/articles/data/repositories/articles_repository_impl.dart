import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/article_detail.dart';
import '../../domain/repositories/base_articles_repository.dart';
import '../datasources/articles_remote_data_source_impl.dart';

@LazySingleton(as: ArticlesRepository)
class ArticlesRepositoryImpl implements ArticlesRepository {
  const ArticlesRepositoryImpl(this._remote);

  final ArticlesRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, ArticleDetail>> getArticleDetail(String id) =>
      _remote.getArticleDetail(id);
}
