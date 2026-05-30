import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/repositories/base_articles_repository.dart';
import 'article_detail_state.dart';

@injectable
class ArticleDetailCubit extends Cubit<ArticleDetailState> {
  ArticleDetailCubit(this._repo) : super(const ArticleDetailInitial());

  final ArticlesRepository _repo;

  Future<void> load(String id) async {
    emit(const ArticleDetailLoading());
    final result = await _repo.getArticleDetail(id);
    result.fold(
      (f) => emit(ArticleDetailError(core.failureToMessage(f))),
      (article) => emit(ArticleDetailSuccess(article)),
    );
  }
}
