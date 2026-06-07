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
    required this.booksTotal,
    required this.articlesTotal,
    required this.publishersTotal,
    this.hasMore = false,
  });

  final List<BookModel> books;
  final List<ArticleModel> articles;
  final List<PublisherModel> publishers;
  final int booksTotal;
  final int articlesTotal;
  final int publishersTotal;
  final bool hasMore;

  factory SearchResponseModel.fromJson(Map<String, dynamic> json) {
    final mode = json['mode'] as String? ?? 'preview';

    if (mode == 'section') {
      return _fromSectionJson(json);
    }

    return _fromPreviewJson(json);
  }

  static SearchResponseModel _fromPreviewJson(Map<String, dynamic> json) {
    final booksObj = json['books'] as Map<String, dynamic>?;
    final articlesObj = json['articles'] as Map<String, dynamic>?;
    final publishersObj = json['publishers'] as Map<String, dynamic>?;

    final books = _mapBooks(booksObj?['items'] as List<dynamic>? ?? []);
    final articles = _mapArticles(articlesObj?['items'] as List<dynamic>? ?? []);
    final publishers =
        _mapPublishers(publishersObj?['items'] as List<dynamic>? ?? []);

    return SearchResponseModel(
      books: books,
      articles: articles,
      publishers: publishers,
      booksTotal: (booksObj?['total'] as num?)?.toInt() ?? books.length,
      articlesTotal:
          (articlesObj?['total'] as num?)?.toInt() ?? articles.length,
      publishersTotal:
          (publishersObj?['total'] as num?)?.toInt() ?? publishers.length,
    );
  }

  static SearchResponseModel _fromSectionJson(Map<String, dynamic> json) {
    final type = json['type'] as String? ?? 'books';
    final pagination = json['pagination'] as Map<String, dynamic>?;
    final total = (pagination?['total'] as num?)?.toInt() ?? 0;
    final hasMore = pagination?['hasNextPage'] as bool? ?? false;

    var books = <BookModel>[];
    var articles = <ArticleModel>[];
    var publishers = <PublisherModel>[];
    var booksTotal = 0;
    var articlesTotal = 0;
    var publishersTotal = 0;

    switch (type) {
      case 'books':
        books = _mapBooks(json['books'] as List<dynamic>? ?? []);
        booksTotal = total;
      case 'articles':
        articles = _mapArticles(json['articles'] as List<dynamic>? ?? []);
        articlesTotal = total;
      case 'publishers':
        publishers = _mapPublishers(json['publishers'] as List<dynamic>? ?? []);
        publishersTotal = total;
    }

    return SearchResponseModel(
      books: books,
      articles: articles,
      publishers: publishers,
      booksTotal: booksTotal,
      articlesTotal: articlesTotal,
      publishersTotal: publishersTotal,
      hasMore: hasMore,
    );
  }

  static List<BookModel> _mapBooks(List<dynamic> items) => items
      .map((e) => BookModel.fromJson(e as Map<String, dynamic>))
      .toList();

  static List<ArticleModel> _mapArticles(List<dynamic> items) => items
      .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
      .toList();

  static List<PublisherModel> _mapPublishers(List<dynamic> items) => items
      .map((e) => PublisherModel.fromJson(e as Map<String, dynamic>))
      .toList();

  SearchResponse toEntity() => SearchResponse(
        books: books.map((m) => m.toEntity()).toList(),
        articles: articles.map((m) => m.toEntity()).toList(),
        publishers: publishers.map((m) => m.toEntity()).toList(),
        booksTotal: booksTotal,
        articlesTotal: articlesTotal,
        publishersTotal: publishersTotal,
        hasMore: hasMore,
      );
}

class SearchSuggestionModel {
  const SearchSuggestionModel({
    required this.type,
    required this.label,
    required this.slug,
    this.labelEn,
  });

  factory SearchSuggestionModel.fromJson(Map<String, dynamic> json) =>
      SearchSuggestionModel(
        type: json['type'] as String? ?? 'book',
        label: json['label'] as String? ?? '',
        slug: json['slug'] as String? ?? '',
        labelEn: json['labelEn'] as String?,
      );

  final String type;
  final String label;
  final String slug;
  final String? labelEn;

  SearchSuggestion toEntity() => SearchSuggestion(
        type: type,
        label: label,
        slug: slug,
        labelEn: labelEn,
      );
}
