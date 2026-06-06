import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/book.dart';
import '../../domain/entities/book_stats.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/category_section.dart';
import '../../domain/entities/publisher_summary.dart';
import '../../domain/entities/sort_order.dart';
import '../models/book_model.dart';
import '../models/book_stats_model.dart';
import '../models/category_model.dart';
import '../models/category_section_model.dart';

@lazySingleton
class BooksRemoteDataSourceImpl {
  BooksRemoteDataSourceImpl(this._api);

  final ApiManager _api;

  Future<Either<Failure, List<Book>>> getFeaturedBooks() => _api.get(
        path: '/books',
        queryParameters: {
          'status': 'TRANSLATED',
          'sort': 'newest',
          'limit': 10,
        },
        fromJson: (json) => PaginatedResponse<BookModel>.fromJson(
          json,
          fromJsonT: BookModel.fromJson,
        ).data.map((m) => m.toEntity()).toList(),
      );

  Future<Either<Failure, PaginatedResponse<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Book>>(
        path: '/books',
        queryParameters: {
          'category': ?categorySlug,
          if (status != null) 'status': _statusToString(status),
          'sort': sort == SortOrder.newest ? 'newest' : 'oldest',
          'page': page,
          'limit': limit,
        },
        fromJson: (json) => PaginatedResponse<Book>.fromJson(
          json,
          fromJsonT: (item) => BookModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, Book>> getBookBySlug(String slug, {String? locale}) =>
      _api.get(
        path: '/books/$slug',
        queryParameters: {'locale': ?locale},
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: BookModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, List<Category>>> getCategories() => _api.get(
        path: '/books/categories',
        fromJson: (json) {
          final list = (json as Map<String, dynamic>)['data'] as List<dynamic>;
          return list
              .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );

  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers() async =>
      right([]);

  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookSlug,
    String categorySlug,
  ) =>
      _api.get(
        path: '/books/$bookSlug/similar',
        queryParameters: {'limit': 6},
        // $mobile-debug-skill | Problem: API wraps books under data.books (not data directly); casting data as List threw TypeError, caught as UnexpectedFailure, silently swallowed by getOrElse. Fix: read data['books'] as the list.
        fromJson: (json) {
          final data = (json as Map<String, dynamic>)['data'] as Map<String, dynamic>;
          final list = data['books'] as List<dynamic>;
          return list
              .map((e) => BookModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );

  Future<Either<Failure, List<Book>>> getBooksByPublisherSlug(String publisherSlug) =>
      _api.get(
        path: '/publishers/$publisherSlug/books',
        fromJson: (json) {
          final list = (json as Map<String, dynamic>)['data'] as List<dynamic>;
          return list
              .map((e) => BookModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );

  Future<Either<Failure, BookStats>> getStats() => _api.get(
        path: '/books/stats',
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: BookStatsModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, List<Book>>> getNewlyReleasedBooks({int limit = 20}) =>
      _api.get(
        path: '/books',
        queryParameters: {'sort': 'newest', 'limit': limit},
        fromJson: (json) => PaginatedResponse<BookModel>.fromJson(
          json,
          fromJsonT: BookModel.fromJson,
        ).data.map((m) => m.toEntity()).toList(),
      );

  Future<Either<Failure, List<CategorySection>>> getCategorySections() =>
      _api.get(
        path: '/books/category-sections',
        fromJson: (json) {
          final list = (json as Map<String, dynamic>)['data'] as List<dynamic>;
          return list
              .map((e) => CategorySectionModel.fromJson(
                    e as Map<String, dynamic>,
                  ).toEntity())
              .toList();
        },
      );

  Future<Either<Failure, PaginatedResponse<Book>>> getTranslatedBooks({
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Book>>(
        path: '/books',
        queryParameters: {
          'status': 'TRANSLATED',
          'sort': 'newest',
          'page': page,
          'limit': limit,
        },
        fromJson: (json) => PaginatedResponse<Book>.fromJson(
          json,
          fromJsonT: (item) => BookModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, PaginatedResponse<Book>>> getRecommendedForTranslation({
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Book>>(
        path: '/books',
        queryParameters: {'status': 'NOMINATED', 'page': page, 'limit': limit},
        fromJson: (json) => PaginatedResponse<Book>.fromJson(
          json,
          fromJsonT: (item) => BookModel.fromJson(item).toEntity(),
        ),
      );

  static String _statusToString(TranslationStatus s) => switch (s) {
        TranslationStatus.translated => 'TRANSLATED',
        TranslationStatus.nominated => 'NOMINATED',
        TranslationStatus.newBook => 'NEW',
        TranslationStatus.notTranslated => 'NOT_TRANSLATED',
      };
}
