import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../data/models/hero_slide_model.dart';
import '../../../domain/entities/book.dart';
import '../../../domain/entities/hero_slide.dart';
import '../../../domain/repositories/base_books_repository.dart';
import 'home_content_state.dart';

const _kHeroSlidesCacheKey = 'hero_slides_cache';
const _kHeroSlidesCachedAtKey = 'hero_slides_cached_at';
const _kHeroCacheTtl = Duration(minutes: 30);

@injectable
class HomeContentCubit extends Cubit<HomeContentState> {
  HomeContentCubit(this._repo, this._prefs) : super(const HomeContentInitial());

  final BooksRepository _repo;
  final SharedPreferences _prefs;

  Future<void> refresh() => load();

  Future<void> load() async {
    emit(const HomeContentLoading());

    final cachedSlides = _loadCachedSlides();

    // Fire all requests concurrently before first await.
    final heroSlidesFuture = _repo.getHeroSlides();
    final newlyReleasedFuture = _repo.getNewlyReleasedBooks();
    final translatedFuture = _repo.getTranslatedBooks();
    final categorySectionsFuture = _repo.getCategorySections();
    final publishersFuture = _repo.getTopPublishers();

    // Await the fast 4 (~0.5 s) first.
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
        emit(HomeContentError(core.failureToMessage(r.fold((f) => f, (_) => throw StateError('')))));
        return;
      }
    }

    final categorySections = categorySectionsResult.getOrElse(() => []);
    final categories = categorySections.map((s) => s.category).toList();
    final freshBooks = newlyReleasedResult.getOrElse(() => []);
    final translatedBooks = translatedResult.fold((_) => <Book>[], (p) => p.data);
    final topPublishers = publishersResult.getOrElse(() => []).take(5).toList();

    // Emit immediately with cached slides (or [] on first open).
    emit(HomeContentSuccess(
      heroSlides: cachedSlides,
      categories: categories,
      freshBooks: freshBooks,
      translatedBooks: translatedBooks,
      categorySections: categorySections,
      topPublishers: topPublishers,
    ));

    final heroSlidesResult = await heroSlidesFuture;
    if (isClosed) return;

    heroSlidesResult.fold(
      (_) {
        // Network failed — leave cached slides visible, no re-emit.
      },
      (freshSlides) {
        _cacheSlides(freshSlides);
        // Equatable deduplication suppresses re-render if slides are unchanged.
        emit(HomeContentSuccess(
          heroSlides: freshSlides,
          categories: categories,
          freshBooks: freshBooks,
          translatedBooks: translatedBooks,
          categorySections: categorySections,
          topPublishers: topPublishers,
        ));
      },
    );
  }

  List<HeroSlide> _loadCachedSlides() {
    final cachedAt = _prefs.getInt(_kHeroSlidesCachedAtKey);
    if (cachedAt == null) return [];
    final age = DateTime.now().millisecondsSinceEpoch - cachedAt;
    if (age > _kHeroCacheTtl.inMilliseconds) return [];
    final raw = _prefs.getString(_kHeroSlidesCacheKey);
    if (raw == null) return [];
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list
          .map((e) => HeroSlideModel.fromJson(e as Map<String, dynamic>).toEntity())
          .toList();
    } catch (_) {
      return [];
    }
  }

  void _cacheSlides(List<HeroSlide> slides) {
    if (slides.isEmpty) return;
    final json = jsonEncode(
      slides.map((s) => HeroSlideModel.fromEntity(s).toJson()).toList(),
    );
    _prefs.setString(_kHeroSlidesCacheKey, json);
    _prefs.setInt(_kHeroSlidesCachedAtKey, DateTime.now().millisecondsSinceEpoch);
  }
}
