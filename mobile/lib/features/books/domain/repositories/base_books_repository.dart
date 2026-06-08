import 'package:dartz/dartz.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/failure.dart';
import '../entities/book.dart';
import '../entities/book_stats.dart';
import '../entities/category.dart';
import '../entities/category_section.dart';
import '../entities/hero_slide.dart';
import '../entities/publisher_summary.dart';
import '../entities/sort_order.dart';

abstract class BooksRepository {
  Future<Either<Failure, List<HeroSlide>>> getHeroSlides();

  Future<Either<Failure, PaginatedResponse<Book>>> getBooks({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder sort = SortOrder.newest,
    int page = 1,
    int limit = 20,
  });

  Future<Either<Failure, Book>> getBookBySlug(String slug, {String? locale});

  Future<Either<Failure, List<Category>>> getCategories();

  Future<Either<Failure, List<PublisherSummary>>> getTopPublishers();

  Future<Either<Failure, List<Book>>> getSimilarBooks(
    String bookSlug,
    String categorySlug,
  );

  Future<Either<Failure, List<Book>>> getBooksByPublisherSlug(String publisherSlug);

  Future<Either<Failure, BookStats>> getStats();

  Future<Either<Failure, PaginatedResponse<Book>>> getTranslatedBooks({
    int page = 1,
    int limit = 20,
  });

  Future<Either<Failure, PaginatedResponse<Book>>> getRecommendedForTranslation({
    int page = 1,
    int limit = 20,
  });

  Future<Either<Failure, List<Book>>> getNewlyReleasedBooks({int limit = 20});

  Future<Either<Failure, List<CategorySection>>> getCategorySections();
}
