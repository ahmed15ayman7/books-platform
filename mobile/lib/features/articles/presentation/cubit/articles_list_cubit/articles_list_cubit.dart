import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../../domain/entities/article_category.dart';
import '../../../domain/repositories/base_articles_repository.dart';
import 'articles_list_state.dart';

@injectable
class ArticlesListCubit extends Cubit<ArticlesListState> {
  ArticlesListCubit(this._repository) : super(const ArticlesListInitial());

  final ArticlesRepository _repository;

  String _activeSlug = '';

  static const List<ArticleCategory> _channels = [
    ArticleCategory(id: '', name: 'All', nameAr: 'الكل', slug: '', linkedCount: 0),
    ArticleCategory(id: 'world-reads', name: 'World Reads', nameAr: 'العالم يقرأ', slug: 'world-reads', linkedCount: 0),
    ArticleCategory(id: 'harvest', name: 'Book Harvest', nameAr: 'حصاد الكتب', slug: 'harvest', linkedCount: 0),
    ArticleCategory(id: 'ideas', name: 'Essence of Ideas', nameAr: 'زبدة الأفكار', slug: 'ideas', linkedCount: 0),
  ];

  static List<ArticleCategory> get channels => _channels;

  Future<void> refresh() => _loadArticles(slug: _activeSlug);

  Future<void> load() async {
    _activeSlug = '';
    emit(const ArticlesListLoading());
    final result = await _repository.getArticles(page: 1);
    result.fold(
      (failure) => emit(ArticlesListError(core.failureToMessage(failure))),
      (paginated) => emit(ArticlesListSuccess(
        articles: paginated.data,
        activeSlug: '',
        hasNextPage: paginated.pagination.hasNextPage,
        page: 1,
      )),
    );
  }

  Future<void> switchCategory(String slug) => _loadArticles(slug: slug);

  Future<void> _loadArticles({required String slug}) async {
    _activeSlug = slug;
    emit(const ArticlesListLoading());
    final result = await _repository.getArticles(
      channel: slug.isEmpty ? null : slug,
      page: 1,
    );
    result.fold(
      (failure) => emit(ArticlesListError(core.failureToMessage(failure))),
      (paginated) => emit(ArticlesListSuccess(
        articles: paginated.data,
        activeSlug: slug,
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
      channel: _activeSlug.isEmpty ? null : _activeSlug,
      page: nextPage,
    );
    result.fold(
      (failure) => emit(ArticlesListError(core.failureToMessage(failure))),
      (paginated) => emit(ArticlesListSuccess(
        articles: [...current.articles, ...paginated.data],
        activeSlug: _activeSlug,
        hasNextPage: paginated.pagination.hasNextPage,
        page: nextPage,
      )),
    );
  }
}
