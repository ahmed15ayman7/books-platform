import 'package:equatable/equatable.dart';

import '../../../books/domain/entities/book.dart';
import '../../../articles/domain/entities/article.dart';
import '../../../publishers/domain/entities/publisher.dart';

class SearchResponse extends Equatable {
  const SearchResponse({
    required this.books,
    required this.articles,
    required this.publishers,
    required this.totalResults,
  });

  final List<Book> books;
  final List<Article> articles;
  final List<Publisher> publishers;
  final int totalResults;

  @override
  List<Object?> get props => [books, articles, publishers, totalResults];
}
