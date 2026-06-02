import 'package:equatable/equatable.dart';

import '../../domain/entities/search_response.dart';
import '../../domain/entities/search_result.dart';
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
  const SearchLoading();
}

final class SearchSuccess extends SearchState {
  const SearchSuccess({
    required this.response,
    required this.suggestions,
    required this.query,
  });
  final SearchResponse response;
  final List<SearchSuggestion> suggestions;
  final String query;

  List<SearchResult> get results => [
        ...response.publishers.map(PublisherSearchResult.new),
        ...response.books.map(BookSearchResult.new),
      ];

  @override
  List<Object?> get props => [response, suggestions, query];
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
