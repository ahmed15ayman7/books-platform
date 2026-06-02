import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../../domain/entities/article.dart';
import '../../../domain/entities/article_channel.dart';
import '../../../domain/repositories/base_articles_repository.dart';
import 'articles_list_state.dart';

@injectable
class ArticlesListCubit extends Cubit<ArticlesListState> {
  ArticlesListCubit(this._repository) : super(const ArticlesListInitial());

  final ArticlesRepository _repository;

  String _activeChannel = Article.kChannelHarvest;

  static const _channels = [
    ArticleChannel(key: Article.kChannelHarvest, nameAr: 'حصاد الكتب', nameEn: 'Book Harvest', count: 0),
    ArticleChannel(key: Article.kChannelIdeas, nameAr: 'جوهر الأفكار', nameEn: 'Essence of Ideas', count: 0),
    ArticleChannel(key: Article.kChannelWorldReads, nameAr: 'قراءات عالمية', nameEn: 'World Reads', count: 0),
    ArticleChannel(key: Article.kChannelBooksTalk, nameAr: 'حديث الكتب', nameEn: 'Book Talk', count: 0),
    ArticleChannel(key: Article.kChannelWatchYourBook, nameAr: 'شاهد كتابك', nameEn: 'Watch Your Book', count: 0),
    ArticleChannel(key: Article.kChannelNovelStory, nameAr: 'رواية وقصة', nameEn: 'Novel & Story', count: 0),
  ];

  Future<void> refresh() => load(channel: _activeChannel);

  Future<void> load({String channel = Article.kChannelHarvest}) async {
    _activeChannel = channel;
    emit(const ArticlesListLoading());
    final result = await _repository.getArticles(channel: channel, page: 1);
    result.fold(
      (failure) => emit(ArticlesListError(core.failureToMessage(failure))),
      (paginated) => emit(ArticlesListSuccess(
        channels: _channels,
        articles: paginated.data,
        activeChannel: channel,
        hasNextPage: paginated.pagination.hasNextPage,
        page: 1,
      )),
    );
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! ArticlesListSuccess || !current.hasNextPage) return;
    final nextPage = current.page + 1;
    final result = await _repository.getArticles(
      channel: _activeChannel,
      page: nextPage,
    );
    result.fold(
      (failure) => emit(ArticlesListError(core.failureToMessage(failure))),
      (paginated) => emit(ArticlesListSuccess(
        channels: _channels,
        articles: [...current.articles, ...paginated.data],
        activeChannel: _activeChannel,
        hasNextPage: paginated.pagination.hasNextPage,
        page: nextPage,
      )),
    );
  }

  Future<void> switchChannel(String channel) => load(channel: channel);
}
