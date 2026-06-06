import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/repositories/base_books_repository.dart';
import 'home_content_state.dart';

@injectable
class HomeContentCubit extends Cubit<HomeContentState> {
  HomeContentCubit(this._repo) : super(const HomeContentInitial());

  final BooksRepository _repo;

  Future<void> refresh() => load();

  Future<void> load() async {
    emit(const HomeContentLoading());

    // Fire all requests concurrently before first await.
    final featuredFuture = _repo.getFeaturedBooks();
    final categoriesFuture = _repo.getCategories();
    final newlyReleasedFuture = _repo.getNewlyReleasedBooks();
    final translatedFuture = _repo.getTranslatedBooks();
    final categorySectionsFuture = _repo.getCategorySections();
    final publishersFuture = _repo.getTopPublishers();

    final featuredResult = await featuredFuture;
    final categoriesResult = await categoriesFuture;
    final newlyReleasedResult = await newlyReleasedFuture;
    final translatedResult = await translatedFuture;
    final categorySectionsResult = await categorySectionsFuture;
    final publishersResult = await publishersFuture;

    for (final r in [
      featuredResult,
      categoriesResult,
      newlyReleasedResult,
      translatedResult,
      categorySectionsResult,
      publishersResult,
    ]) {
      if (r.isLeft()) {
        emit(HomeContentError(core.failureToMessage(r.fold((f) => f, (_) => throw StateError('')))));
        return;
      }
    }

    emit(HomeContentSuccess(
      featured: featuredResult.getOrElse(() => []),
      categories: categoriesResult.getOrElse(() => []),
      freshBooks: newlyReleasedResult.getOrElse(() => []),
      translatedBooks: translatedResult.fold((_) => [], (p) => p.data),
      categorySections: categorySectionsResult.getOrElse(() => []),
      topPublishers: publishersResult.getOrElse(() => []).take(5).toList(),
    ));
  }
}
