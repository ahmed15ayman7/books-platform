import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

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

    final heroSlidesFuture = _repo.getHeroSlides();
    final newlyReleasedFuture = _repo.getNewlyReleasedBooks();
    final translatedFuture = _repo.getTranslatedBooks();
    final categorySectionsFuture = _repo.getCategorySections();
    final publishersFuture = _repo.getTopPublishers();

    final heroSlidesResult = await heroSlidesFuture;
    final newlyReleasedResult = await newlyReleasedFuture;
    final translatedResult = await translatedFuture;
    final categorySectionsResult = await categorySectionsFuture;
    final publishersResult = await publishersFuture;

    for (final r in [
      newlyReleasedResult,
      translatedResult,
      categorySectionsResult,
      publishersResult,
    ]) {
      if (r.isLeft()) {
        emit(HomeContentError(
            core.failureToMessage(r.fold((f) => f, (_) => throw StateError('')))));
        return;
      }
    }

    final categorySections = categorySectionsResult.getOrElse(() => []);
    final categories = categorySections.map((s) => s.category).toList();
    final freshBooks = newlyReleasedResult.getOrElse(() => []);
    final translatedBooks = translatedResult.fold((_) => <Book>[], (p) => p.data);
    final topPublishers = publishersResult.getOrElse(() => []).take(5).toList();

    emit(HomeContentSuccess(
      heroSlides: heroSlidesResult.getOrElse(() => []),
      categories: categories,
      freshBooks: freshBooks,
      translatedBooks: translatedBooks,
      categorySections: categorySections,
      topPublishers: topPublishers,
    ));
  }
}
