import 'package:equatable/equatable.dart';

import '../../../domain/entities/book.dart';
import '../../../domain/entities/category.dart';

sealed class CatalogState extends Equatable {
  const CatalogState();
  @override
  List<Object?> get props => const [];
}

final class CatalogInitial extends CatalogState {
  const CatalogInitial();
}

final class CatalogLoading extends CatalogState {
  const CatalogLoading();
}

final class CatalogSuccess extends CatalogState {
  const CatalogSuccess({
    required this.books,
    this.categories = const [],
    this.hasMore = false,
  });
  final List<Book> books;
  final List<Category> categories;
  final bool hasMore;
  @override
  List<Object?> get props => [books, categories, hasMore];
}

final class CatalogError extends CatalogState {
  const CatalogError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
