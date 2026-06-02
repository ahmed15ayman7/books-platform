import 'package:equatable/equatable.dart';

import '../../domain/entities/comment.dart';

sealed class CommentsState extends Equatable {
  const CommentsState();
  @override
  List<Object?> get props => const [];
}

final class CommentsInitial extends CommentsState {
  const CommentsInitial();
}

final class CommentsLoading extends CommentsState {
  const CommentsLoading();
}

final class CommentsLoaded extends CommentsState {
  const CommentsLoaded({
    required this.comments,
    required this.hasNextPage,
    required this.page,
  });
  final List<Comment> comments;
  final bool hasNextPage;
  final int page;
  @override
  List<Object?> get props => [comments, hasNextPage, page];
}

final class CommentsLoadingMore extends CommentsState {
  const CommentsLoadingMore(this.current);
  final CommentsLoaded current;
  @override
  List<Object?> get props => [current];
}

final class CommentsSubmitting extends CommentsState {
  const CommentsSubmitting();
}

final class CommentsSubmitted extends CommentsState {
  const CommentsSubmitted();
}

final class CommentsError extends CommentsState {
  const CommentsError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
