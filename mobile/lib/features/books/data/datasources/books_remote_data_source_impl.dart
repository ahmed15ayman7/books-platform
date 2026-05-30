import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/book.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/publisher_summary.dart';
import '../../domain/entities/sort_order.dart';
import 'books_mock_data.dart';

@lazySingleton
class BooksRemoteDataSourceImpl {
  // Returns mock data until the backend is live.
  // Replace method bodies with ApiManager calls when the API is ready.

  Future<Either<Failure, List<Book>>> getFeaturedBooks() async {
    final featured = BooksMockData.books.take(3).map((r) => r.toEntity()).toList();
    return right(featured);
  }

  Future<Either<Failure, List<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
  }) async {
    var list = BooksMockData.books.map((r) => r.toEntity()).toList();
    if (categorySlug != null) {
      list = list.where((b) => b.categorySlug == categorySlug).toList();
    }
    if (status != null) {
      list = list.where((b) => b.status == status).toList();
    }
    list.sort((a, b) =>
        sort == SortOrder.newest ? b.year - a.year : a.year - b.year);
    return right(list);
  }

  Future<Either<Failure, Book>> getBookBySlug(String slug) async {
    try {
      final book = BooksMockData.books
          .firstWhere((r) => r.id == slug)
          .toEntity();
      return right(book);
    } catch (_) {
      return left(const ServerFailure(404, 'Book not found'));
    }
  }

  Future<Either<Failure, List<Category>>> getCategories() async {
    return right(BooksMockData.categories.map((r) => r.toEntity()).toList());
  }

  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers() async {
    return right(
        BooksMockData.publishers.map((r) => r.toEntity()).toList());
  }

  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookId,
    String categorySlug,
  ) async {
    final all = BooksMockData.books.map((r) => r.toEntity()).toList();
    final similar = all
        .where((b) => b.id != bookId && b.categorySlug == categorySlug)
        .take(4)
        .toList();
    return right(similar);
  }

  Future<Either<Failure, List<Book>>> getBooksByPublisherId(
    String publisherId,
  ) async {
    final books = BooksMockData.books
        .map((r) => r.toEntity())
        .where((b) => b.publisherId == publisherId)
        .toList();
    return right(books);
  }
}
