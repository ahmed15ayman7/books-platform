import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/book.dart';
import '../../domain/entities/book_stats.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/publisher_summary.dart';
import '../../domain/entities/sort_order.dart';
import '../../domain/repositories/base_books_repository.dart';
import '../datasources/books_remote_data_source_impl.dart';

@LazySingleton(as: BooksRepository)
class BooksRepositoryImpl implements BooksRepository {
  const BooksRepositoryImpl(this._remote);

  final BooksRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, List<Book>>> getFeaturedBooks() =>
      _remote.getFeaturedBooks();

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
  Future<Either<Failure, List<Book>>> getBooksByPublisherId(String publisherId) =>
      _remote.getBooksByPublisherId(publisherId);

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
}
