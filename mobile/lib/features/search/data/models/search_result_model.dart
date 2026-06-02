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
    final data = json['data'] as Map<String, dynamic>? ?? json;
    return SearchResponseModel(
      books: (data['books'] as List<dynamic>? ?? [])
          .map((e) => BookModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      articles: (data['articles'] as List<dynamic>? ?? [])
          .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      publishers: (data['publishers'] as List<dynamic>? ?? [])
          .map((e) => PublisherModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalResults: (data['totalResults'] as num?)?.toInt() ?? 0,
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
