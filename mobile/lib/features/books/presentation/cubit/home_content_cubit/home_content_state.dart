import 'package:equatable/equatable.dart';

import 'package:booksplatform/features/books/domain/entities/category_section.dart';

import '../../../domain/entities/book.dart';
import '../../../domain/entities/category.dart';
import '../../../domain/entities/hero_slide.dart';
import '../../../domain/entities/publisher_summary.dart';

sealed class HomeContentState extends Equatable {
  const HomeContentState();
  @override
  List<Object?> get props => const [];
}

final class HomeContentInitial extends HomeContentState {
  const HomeContentInitial();
}

final class HomeContentLoading extends HomeContentState {
  const HomeContentLoading();
}

final class HomeContentSuccess extends HomeContentState {
  const HomeContentSuccess({
    required this.heroSlides,
    required this.categories,
    required this.freshBooks,
    required this.translatedBooks,
    required this.topPublishers,
    required this.categorySections,
  });

  final List<HeroSlide> heroSlides;
  final List<Category> categories;
  final List<Book> freshBooks;
  final List<Book> translatedBooks;
  final List<PublisherSummary> topPublishers;
  final List<CategorySection> categorySections;

  @override
  List<Object?> get props =>
      [heroSlides, categories, freshBooks, translatedBooks, topPublishers, categorySections];
}

final class HomeContentError extends HomeContentState {
  const HomeContentError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
