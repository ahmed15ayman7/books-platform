import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/book.dart';
import '../../domain/entities/book_stats.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/category_section.dart';
import '../../domain/entities/hero_slide.dart';
import '../../domain/entities/publisher_summary.dart';
import '../../domain/entities/sort_order.dart';
import '../../domain/repositories/base_books_repository.dart';
import '../datasources/books_remote_data_source_impl.dart';
import '../models/hero_slide_model.dart';

const _kHeroSlidesCacheKey = 'hero_slides_cache';
const _kHeroSlidesCachedAtKey = 'hero_slides_cached_at';
const _kHeroCacheTtl = Duration(minutes: 30);

@LazySingleton(as: BooksRepository)
class BooksRepositoryImpl implements BooksRepository {
  BooksRepositoryImpl(this._remote, this._prefs);

  final BooksRemoteDataSourceImpl _remote;
  final SharedPreferences _prefs;

  @override
  Future<Either<Failure, List<HeroSlide>>> getHeroSlides() async {
    final cached = _loadCachedSlides();
    if (cached.isNotEmpty) return Right(cached);

    final result = await _remote.getHeroSlides();
    if (result.isRight()) {
      _cacheSlides(result.getOrElse(() => []));
      return result;
    }

    final stale = _loadCachedSlides(ignoreExpiry: true);
    if (stale.isNotEmpty) return Right(stale);
    return result;
  }

  @override
  Future<Either<Failure, List<HeroSlide>>> refreshHeroSlides() async {
    final result = await _remote.getHeroSlides();
    if (result.isRight()) {
      _cacheSlides(result.getOrElse(() => []));
    }
    return result;
  }

  List<HeroSlide> _loadCachedSlides({bool ignoreExpiry = false}) {
    final cachedAt = _prefs.getInt(_kHeroSlidesCachedAtKey);
    if (cachedAt == null) return [];
    if (!ignoreExpiry) {
      final age = DateTime.now().millisecondsSinceEpoch - cachedAt;
      if (age > _kHeroCacheTtl.inMilliseconds) return [];
    }
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

  @override
  Future<Either<Failure, PaginatedResponse<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
    int page = 1,
    int limit = 20,
  }) =>
      _remote.getBooks(
        categorySlug: categorySlug,
        status: status,
        sort: sort,
        page: page,
        limit: limit,
      );

  @override
  Future<Either<Failure, Book>> getBookBySlug(String slug, {String? locale}) =>
      _remote.getBookBySlug(slug, locale: locale);

  @override
  Future<Either<Failure, List<Category>>> getCategories() =>
      _remote.getCategories();

  @override
  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers() =>
      _remote.getTopPublishers();

  @override
  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookSlug,
    String categorySlug,
  ) =>
      _remote.getSimilarBooks(bookSlug, categorySlug);

  @override
  Future<Either<Failure, List<Book>>> getBooksByPublisherSlug(String publisherSlug) =>
      _remote.getBooksByPublisherSlug(publisherSlug);

  @override
  Future<Either<Failure, BookStats>> getStats() => _remote.getStats();

  @override
  Future<Either<Failure, PaginatedResponse<Book>>> getTranslatedBooks({
    int page = 1,
    int limit = 20,
  }) =>
      _remote.getTranslatedBooks(page: page, limit: limit);

  @override
  Future<Either<Failure, PaginatedResponse<Book>>> getRecommendedForTranslation({
    int page = 1,
    int limit = 20,
  }) =>
      _remote.getRecommendedForTranslation(page: page, limit: limit);

  @override
  Future<Either<Failure, List<Book>>> getNewlyReleasedBooks({int limit = 20}) =>
      _remote.getNewlyReleasedBooks(limit: limit);

  @override
  Future<Either<Failure, List<CategorySection>>> getCategorySections() =>
      _remote.getCategorySections();
}
