import '../../../articles/data/models/article_model.dart';
import '../../../books/data/models/book_model.dart';
import '../../../publishers/data/models/publisher_model.dart';
import '../../domain/entities/search_response.dart';
import '../../domain/entities/search_suggestion.dart';

class SearchResponseModel {
  const SearchResponseModel({
    required this.books,
    required this.articles,
    required this.publishers,
    required this.totalResults,
  });

  final List<BookModel> books;
  final List<ArticleModel> articles;
  final List<PublisherModel> publishers;
  final int totalResults;

  factory SearchResponseModel.fromJson(Map<String, dynamic> json) {
    // $mobile-debug-skill | Problem: API returns books/articles/publishers as {items:[…], total:N} objects, not flat arrays — casting to List<dynamic> threw '_Map is not a subtype of List'. Fix: extract 'items' from each nested object before mapping.
    final booksObj = json['books'] as Map<String, dynamic>?;
    final articlesObj = json['articles'] as Map<String, dynamic>?;
    final publishersObj = json['publishers'] as Map<String, dynamic>?;
    return SearchResponseModel(
      books: (booksObj?['items'] as List<dynamic>? ?? [])
          .map((e) => BookModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      articles: (articlesObj?['items'] as List<dynamic>? ?? [])
          .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      publishers: (publishersObj?['items'] as List<dynamic>? ?? [])
          .map((e) => PublisherModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalResults: ((booksObj?['total'] as num?)?.toInt() ?? 0) +
          ((articlesObj?['total'] as num?)?.toInt() ?? 0) +
          ((publishersObj?['total'] as num?)?.toInt() ?? 0),
    );
  }

  SearchResponse toEntity() => SearchResponse(
        books: books.map((m) => m.toEntity()).toList(),
        articles: articles.map((m) => m.toEntity()).toList(),
        publishers: publishers.map((m) => m.toEntity()).toList(),
        totalResults: totalResults,
      );
}

class SearchSuggestionModel {
  const SearchSuggestionModel({
    required this.type,
    required this.label,
    required this.slug,
  });

  factory SearchSuggestionModel.fromJson(Map<String, dynamic> json) =>
      SearchSuggestionModel(
        type: json['type'] as String? ?? 'book',
        label: json['label'] as String? ?? '',
        slug: json['slug'] as String? ?? '',
      );

  final String type;
  final String label;
  final String slug;

  SearchSuggestion toEntity() => SearchSuggestion(
        type: type,
        label: label,
        slug: slug,
      );
}
