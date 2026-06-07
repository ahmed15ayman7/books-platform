import 'package:equatable/equatable.dart';

import '../../../articles/domain/entities/article.dart';
import '../../../books/domain/entities/book.dart';
import '../../../publishers/domain/entities/publisher.dart';

sealed class SearchResult extends Equatable {
  const SearchResult();
  @override
  List<Object?> get props => const [];
}

final class BookSearchResult extends SearchResult {
  const BookSearchResult(this.book);
  final Book book;
  @override
  List<Object?> get props => [book.id];
}

final class PublisherSearchResult extends SearchResult {
  const PublisherSearchResult(this.publisher);
  final Publisher publisher;
  @override
  List<Object?> get props => [publisher.id];
}

final class ArticleSearchResult extends SearchResult {
  const ArticleSearchResult(this.article);
  final Article article;
  @override
  List<Object?> get props => [article.id];
}
