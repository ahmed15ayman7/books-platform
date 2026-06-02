import 'package:equatable/equatable.dart';

import '../../../domain/entities/article.dart';
import '../../../domain/entities/article_channel.dart';

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
    required this.channels,
    required this.articles,
    required this.activeChannel,
    this.hasNextPage = false,
    this.page = 1,
  });
  final List<ArticleChannel> channels;
  final List<Article> articles;
  final String activeChannel;
  final bool hasNextPage;
  final int page;
  @override
  List<Object?> get props => [channels, articles, activeChannel, hasNextPage, page];
}

final class ArticlesListError extends ArticlesListState {
  const ArticlesListError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
