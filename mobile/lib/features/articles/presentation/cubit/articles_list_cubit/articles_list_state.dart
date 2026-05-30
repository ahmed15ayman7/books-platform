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
  });
  final List<ArticleChannel> channels;
  final List<Article> articles;
  final String activeChannel;
  @override
  List<Object?> get props => [channels, articles, activeChannel];
}

final class ArticlesListError extends ArticlesListState {
  const ArticlesListError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
