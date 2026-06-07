import 'package:equatable/equatable.dart';

import '../../../articles/domain/entities/article.dart';
import '../../../books/domain/entities/book.dart';
import '../../../publishers/domain/entities/publisher.dart';

class SearchResponse extends Equatable {
  const SearchResponse({
    required this.books,
    required this.articles,
    required this.publishers,
    required this.booksTotal,
    required this.articlesTotal,
    required this.publishersTotal,
    this.hasMore = false,
  });

  final List<Book> books;
  final List<Article> articles;
  final List<Publisher> publishers;
  final int booksTotal;
  final int articlesTotal;
  final int publishersTotal;
  final bool hasMore;

  int get totalResults => booksTotal + articlesTotal + publishersTotal;

  SearchResponse append(SearchResponse other) => SearchResponse(
        books: [...books, ...other.books],
        articles: [...articles, ...other.articles],
        publishers: [...publishers, ...other.publishers],
        booksTotal: other.booksTotal,
        articlesTotal: other.articlesTotal,
        publishersTotal: other.publishersTotal,
        hasMore: other.hasMore,
      );

  @override
  List<Object?> get props => [
        books,
        articles,
        publishers,
        booksTotal,
        articlesTotal,
        publishersTotal,
        hasMore,
      ];
}
