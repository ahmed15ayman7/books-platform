import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/book.dart';
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
  Future<Either<Failure, List<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
  }) =>
      _remote.getBooks(categorySlug: categorySlug, status: status, sort: sort);

  @override
  Future<Either<Failure, Book>> getBookBySlug(String slug) =>
      _remote.getBookBySlug(slug);

  @override
  Future<Either<Failure, List<Category>>> getCategories() =>
      _remote.getCategories();

  @override
  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers() =>
      _remote.getTopPublishers();

  @override
  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookId,
    String categorySlug,
  ) =>
      _remote.getSimilarBooks(bookId, categorySlug);
}
