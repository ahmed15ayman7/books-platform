import 'package:equatable/equatable.dart';

import '../../domain/entities/search_result.dart';

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
  const SearchSuccess(this.results);
  final List<SearchResult> results;
  @override
  List<Object?> get props => [results];
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
