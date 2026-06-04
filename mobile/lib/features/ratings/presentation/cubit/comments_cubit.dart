import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/repositories/ratings_repository.dart';
import 'comments_state.dart';

@injectable
class CommentsCubit extends Cubit<CommentsState> {
  CommentsCubit(this._repository) : super(const CommentsInitial());

  final RatingsRepository _repository;
  String? _productId;
  String? _articleId;

  Future<void> load({String? productId, String? articleId}) async {
    _productId = productId;
    _articleId = articleId;
    emit(const CommentsLoading());
    final result = await _repository.getComments(
      productId: _productId,
      articleId: _articleId,
      page: 1,
    );
    result.fold(
      (failure) => emit(CommentsError(core.failureToMessage(failure))),
      (paginated) => emit(CommentsLoaded(
        comments: paginated.data,
        hasNextPage: paginated.pagination.hasNextPage,
        page: 1,
      )),
    );
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! CommentsLoaded || !current.hasNextPage) return;
    emit(CommentsLoadingMore(current));
    final nextPage = current.page + 1;
    final result = await _repository.getComments(
      productId: _productId,
      articleId: _articleId,
      page: nextPage,
    );
    result.fold(
      (failure) => emit(CommentsError(core.failureToMessage(failure))),
      (paginated) => emit(CommentsLoaded(
        comments: [...current.comments, ...paginated.data],
        hasNextPage: paginated.pagination.hasNextPage,
        page: nextPage,
      )),
    );
  }

  Future<void> submitComment({
    required String authorName,
    required String email,
    required String content,
    String? productId,
    String? articleId,
  }) async {
    emit(const CommentsSubmitting());
    final result = await _repository.submitComment(
      authorName: authorName,
      email: email,
      content: content,
      productId: productId ?? _productId,
      articleId: articleId ?? _articleId,
    );
    result.fold(
      (failure) => emit(CommentsError(core.failureToMessage(failure))),
      (_) {
        emit(const CommentsSubmitted());
        load(productId: _productId, articleId: _articleId);
      },
    );
  }
}
