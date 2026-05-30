import 'package:dartz/dartz.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/failure.dart';
import '../entities/book.dart';
import '../entities/category.dart';
import '../entities/publisher_summary.dart';
import '../entities/sort_order.dart';

abstract class BooksRepository {
  Future<Either<Failure, List<Book>>> getFeaturedBooks();

  Future<Either<Failure, List<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
  });

  Future<Either<Failure, Book>> getBookBySlug(String slug);

  Future<Either<Failure, List<Category>>> getCategories();

  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers();

  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookId,
    String categorySlug,
  );

  Future<Either<Failure, List<Book>>> getBooksByPublisherId(String publisherId);
}
