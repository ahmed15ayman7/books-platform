import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/entities/book.dart';
import '../../../domain/repositories/base_books_repository.dart';
import 'home_content_state.dart';

@injectable
class HomeContentCubit extends Cubit<HomeContentState> {
  HomeContentCubit(this._repo) : super(const HomeContentInitial());

  final BooksRepository _repo;

  Future<void> refresh() => load();

  Future<void> load() async {
    emit(const HomeContentLoading());

    final featuredResult = await _repo.getFeaturedBooks();
    if (featuredResult.isLeft()) {
      final f = featuredResult.fold((f) => f, (_) => null)!;
      emit(HomeContentError(core.failureToMessage(f)));
      return;
    }

    final catResult = await _repo.getCategories();
    if (catResult.isLeft()) {
      final f = catResult.fold((f) => f, (_) => null)!;
      emit(HomeContentError(core.failureToMessage(f)));
      return;
    }

    final allResult = await _repo.getBooks();
    if (allResult.isLeft()) {
      final f = allResult.fold((f) => f, (_) => null)!;
      emit(HomeContentError(core.failureToMessage(f)));
      return;
    }

    final pubResult = await _repo.getTopPublishers();
    if (pubResult.isLeft()) {
      final f = pubResult.fold((f) => f, (_) => null)!;
      emit(HomeContentError(core.failureToMessage(f)));
      return;
    }

    final allBooks = allResult.fold((_) => <Book>[], (p) => p.data);
    final freshBooks = allBooks
        .where((b) => b.isNew || b.status == TranslationStatus.nominated)
        .take(6)
        .toList();
    final translatedBooks = allBooks
        .where((b) => b.status == TranslationStatus.translated)
        .take(6)
        .toList();

    emit(HomeContentSuccess(
      featured: featuredResult.getOrElse(() => []),
      categories: catResult.getOrElse(() => []),
      freshBooks: freshBooks,
      translatedBooks: translatedBooks,
      topPublishers: pubResult.getOrElse(() => []).take(5).toList(),
    ));
  }
}
