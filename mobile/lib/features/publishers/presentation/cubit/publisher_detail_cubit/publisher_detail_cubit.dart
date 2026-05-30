import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../../books/domain/repositories/base_books_repository.dart';
import '../../../domain/repositories/base_publishers_repository.dart';
import 'publisher_detail_state.dart';

@injectable
class PublisherDetailCubit extends Cubit<PublisherDetailState> {
  PublisherDetailCubit(this._publishersRepo, this._booksRepo)
      : super(const PublisherDetailInitial());

  final PublishersRepository _publishersRepo;
  final BooksRepository _booksRepo;

  Future<void> load(String slug) async {
    emit(const PublisherDetailLoading());

    final publisherResult = await _publishersRepo.getPublisherBySlug(slug);
    if (publisherResult.isLeft()) {
      final f = publisherResult.fold((f) => f, (_) => null)!;
      emit(PublisherDetailError(core.failureToMessage(f)));
      return;
    }

    final publisher = publisherResult.getOrElse(() => throw StateError(''));
    final booksResult = await _booksRepo.getBooksByPublisherId(publisher.id);

    booksResult.fold(
      (f) => emit(PublisherDetailError(core.failureToMessage(f))),
      (books) => emit(PublisherDetailSuccess(publisher: publisher, books: books)),
    );
  }
}
