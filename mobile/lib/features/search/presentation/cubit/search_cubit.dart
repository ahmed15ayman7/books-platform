import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/entities/search_suggestion.dart';
import '../../domain/repositories/search_repository.dart';
import 'search_state.dart';

@injectable
class SearchCubit extends Cubit<SearchState> {
  SearchCubit(this._repository) : super(const SearchInitial());

  final SearchRepository _repository;

  Timer? _debounce;
  String _lastQuery = '';

  void onQueryChanged(String query) {
    _debounce?.cancel();
    if (query.trim().isEmpty) {
      emit(const SearchInitial());
      return;
    }
    emit(const SearchLoading());
    _debounce = Timer(
      const Duration(milliseconds: 300),
      () => _search(query.trim()),
    );
  }

  Future<void> _search(String query) async {
    _lastQuery = query;
    final searchFuture = _repository.search(query);
    final suggestionsFuture = _repository.getSuggestions(query);
    final searchResult = await searchFuture;
    final suggestionsResult = await suggestionsFuture;

    // Ignore if query changed while awaiting
    if (_lastQuery != query) return;

    final suggestions = suggestionsResult.fold(
      (_) => <SearchSuggestion>[],
      (s) => s,
    );

    searchResult.fold(
      (failure) => emit(SearchError(core.failureToMessage(failure))),
      (response) {
        if (response.totalResults == 0 &&
            response.books.isEmpty &&
            response.articles.isEmpty &&
            response.publishers.isEmpty) {
          emit(SearchEmpty(query));
        } else {
          emit(SearchSuccess(
            response: response,
            suggestions: suggestions,
            query: query,
          ));
        }
      },
    );
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }
}
