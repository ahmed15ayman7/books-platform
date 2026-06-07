import 'package:equatable/equatable.dart';

import '../../domain/entities/search_response.dart';
import '../../domain/entities/search_result.dart';
import '../../domain/entities/search_section_type.dart';
import '../../domain/entities/search_suggestion.dart';

sealed class SearchState extends Equatable {
  const SearchState();
  @override
  List<Object?> get props => const [];
}

final class SearchInitial extends SearchState {
  const SearchInitial();
}

final class SearchLoading extends SearchState {
  const SearchLoading({this.tab = SearchSectionType.all, this.query = ''});

  final SearchSectionType tab;
  final String query;

  @override
  List<Object?> get props => [tab, query];
}

final class SearchSuccess extends SearchState {
  const SearchSuccess({
    required this.response,
    required this.suggestions,
    required this.query,
    required this.tab,
    required this.locale,
    this.page = 1,
    this.isLoadingMore = false,
  });

  final SearchResponse response;
  final List<SearchSuggestion> suggestions;
  final String query;
  final SearchSectionType tab;
  final String locale;
  final int page;
  final bool isLoadingMore;

  List<SearchResult> get results => switch (tab) {
        SearchSectionType.all => [
            ...response.publishers.map(PublisherSearchResult.new),
            ...response.books.map(BookSearchResult.new),
            ...response.articles.map(ArticleSearchResult.new),
          ],
        SearchSectionType.books =>
          response.books.map(BookSearchResult.new).toList(),
        SearchSectionType.articles =>
          response.articles.map(ArticleSearchResult.new).toList(),
        SearchSectionType.publishers =>
          response.publishers.map(PublisherSearchResult.new).toList(),
      };

  int totalForTab(SearchSectionType section) => switch (section) {
        SearchSectionType.all => response.totalResults,
        SearchSectionType.books => response.booksTotal,
        SearchSectionType.articles => response.articlesTotal,
        SearchSectionType.publishers => response.publishersTotal,
      };

  bool get isTabEmpty => results.isEmpty;

  SearchSuccess copyWith({
    SearchResponse? response,
    List<SearchSuggestion>? suggestions,
    String? query,
    SearchSectionType? tab,
    String? locale,
    int? page,
    bool? isLoadingMore,
  }) =>
      SearchSuccess(
        response: response ?? this.response,
        suggestions: suggestions ?? this.suggestions,
        query: query ?? this.query,
        tab: tab ?? this.tab,
        locale: locale ?? this.locale,
        page: page ?? this.page,
        isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      );

  @override
  List<Object?> get props => [
        response,
        suggestions,
        query,
        tab,
        locale,
        page,
        isLoadingMore,
      ];
}

final class SearchEmpty extends SearchState {
  const SearchEmpty(this.query);
  final String query;
  @override
  List<Object?> get props => [query];
}

final class SearchError extends SearchState {
  const SearchError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
