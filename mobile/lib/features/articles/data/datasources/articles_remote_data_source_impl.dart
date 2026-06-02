import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/article.dart';
import '../../domain/entities/article_channel.dart';
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
    String? sort,
    String? locale,
  }) =>
      _api.get<PaginatedResponse<Article>>(
        path: '/articles',
        queryParameters: {
          'channel': ?channel,
          'page': page,
          'limit': limit,
          'sort': ?sort,
          'locale': ?locale,
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
          final list = json as List<dynamic>;
          return list
              .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );

  List<ArticleChannel> getChannels() => const [
        ArticleChannel(key: Article.kChannelHarvest, nameAr: 'حصاد الكتب', nameEn: 'Book Harvest', count: 0),
        ArticleChannel(key: Article.kChannelIdeas, nameAr: 'جوهر الأفكار', nameEn: 'Essence of Ideas', count: 0),
        ArticleChannel(key: Article.kChannelWorldReads, nameAr: 'قراءات عالمية', nameEn: 'World Reads', count: 0),
        ArticleChannel(key: Article.kChannelBooksTalk, nameAr: 'حديث الكتب', nameEn: 'Book Talk', count: 0),
        ArticleChannel(key: Article.kChannelWatchYourBook, nameAr: 'شاهد كتابك', nameEn: 'Watch Your Book', count: 0),
        ArticleChannel(key: Article.kChannelNovelStory, nameAr: 'رواية وقصة', nameEn: 'Novel & Story', count: 0),
      ];
}
