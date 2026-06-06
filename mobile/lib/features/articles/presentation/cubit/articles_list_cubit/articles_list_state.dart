import 'package:equatable/equatable.dart';

import '../../../domain/entities/article.dart';

sealed class ArticlesListState extends Equatable {
  const ArticlesListState();
  @override
  List<Object?> get props => const [];
}

final class ArticlesListInitial extends ArticlesListState {
  const ArticlesListInitial();
}

final class ArticlesListLoading extends ArticlesListState {
  const ArticlesListLoading();
}

final class ArticlesListSuccess extends ArticlesListState {
  const ArticlesListSuccess({
    required this.articles,
    required this.activeSlug,
    this.hasNextPage = false,
    this.page = 1,
  });
  final List<Article> articles;
  final String activeSlug;
  final bool hasNextPage;
  final int page;
  @override
  List<Object?> get props => [articles, activeSlug, hasNextPage, page];
}

final class ArticlesListError extends ArticlesListState {
  const ArticlesListError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
