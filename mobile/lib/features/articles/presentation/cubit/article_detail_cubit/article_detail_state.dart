import 'package:equatable/equatable.dart';

import '../../../domain/entities/article_detail.dart';

sealed class ArticleDetailState extends Equatable {
  const ArticleDetailState();
  @override
  List<Object?> get props => const [];
}

final class ArticleDetailInitial extends ArticleDetailState {
  const ArticleDetailInitial();
}

final class ArticleDetailLoading extends ArticleDetailState {
  const ArticleDetailLoading();
}

final class ArticleDetailSuccess extends ArticleDetailState {
  const ArticleDetailSuccess(this.article);
  final ArticleDetail article;
  @override
  List<Object?> get props => [article];
}

final class ArticleDetailError extends ArticleDetailState {
  const ArticleDetailError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
