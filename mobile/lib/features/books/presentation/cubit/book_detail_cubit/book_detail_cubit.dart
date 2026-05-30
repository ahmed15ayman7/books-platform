import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/repositories/base_books_repository.dart';
import 'book_detail_state.dart';

@injectable
class BookDetailCubit extends Cubit<BookDetailState> {
  BookDetailCubit(this._repo) : super(const BookDetailInitial());

  final BooksRepository _repo;

  Future<void> load(String slug) async {
    emit(const BookDetailLoading());
    final bookResult = await _repo.getBookBySlug(slug);
    bookResult.fold(
      (f) => emit(BookDetailError(core.failureToMessage(f))),
      (book) async {
        final similarResult =
            await _repo.getSimilarBooks(book.id, book.categorySlug);
        final similar = similarResult.getOrElse(() => []);
        emit(BookDetailSuccess(book: book, similarBooks: similar));
      },
    );
  }
}
