import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/entities/search_section_type.dart';
import '../../domain/entities/search_suggestion.dart';
import '../../domain/repositories/search_repository.dart';
import 'search_state.dart';

@injectable
class SearchCubit extends Cubit<SearchState> {
  SearchCubit(this._repository) : super(const SearchInitial());

  final SearchRepository _repository;

  Timer? _debounce;
  String _lastQuery = '';
  String _locale = 'ar';
  SearchSectionType _tab = SearchSectionType.all;

  static const _minQueryLength = 2;
  static const _debounceMs = 300;

  void onQueryChanged(String query, String locale) {
    _locale = locale;
    _debounce?.cancel();

    final trimmed = query.trim();
    if (trimmed.isEmpty) {
      _lastQuery = '';
      emit(const SearchInitial());
      return;
    }

    if (trimmed.length < _minQueryLength) {
      _lastQuery = '';
      emit(const SearchInitial());
      return;
    }

    emit(SearchLoading(tab: _tab, query: trimmed));
    _debounce = Timer(
      const Duration(milliseconds: _debounceMs),
      () => _search(trimmed, locale: locale, tab: _tab, page: 1),
    );
  }

  Future<void> changeTab(SearchSectionType tab) async {
    if (_lastQuery.length < _minQueryLength) return;
    _tab = tab;
    emit(SearchLoading(tab: tab, query: _lastQuery));
    await _search(_lastQuery, locale: _locale, tab: tab, page: 1);
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! SearchSuccess ||
        current.tab == SearchSectionType.all ||
        !current.response.hasMore ||
        current.isLoadingMore) {
      return;
    }

    emit(current.copyWith(isLoadingMore: true));
    final nextPage = current.page + 1;
    final result = await _repository.search(
      current.query,
      type: current.tab.apiValue,
      page: nextPage,
      locale: current.locale,
    );

    if (_lastQuery != current.query || _tab != current.tab) return;

    result.fold(
      (failure) => emit(current.copyWith(isLoadingMore: false)),
      (response) => emit(
        current.copyWith(
          response: current.response.append(response),
          page: nextPage,
          isLoadingMore: false,
        ),
      ),
    );
  }

  Future<void> _search(
    String query, {
    required String locale,
    required SearchSectionType tab,
    required int page,
  }) async {
    _lastQuery = query;
    _locale = locale;
    _tab = tab;

    final searchFuture = _repository.search(
      query,
      type: tab.apiValue,
      page: page,
      locale: locale,
    );
    final suggestionsFuture = _repository.getSuggestions(query);
    final searchResult = await searchFuture;
    final suggestionsResult = await suggestionsFuture;

    if (_lastQuery != query || _tab != tab) return;

    final suggestions = suggestionsResult.fold(
      (_) => <SearchSuggestion>[],
      (s) => s,
    );

    searchResult.fold(
      (failure) => emit(SearchError(core.failureToMessage(failure))),
      (response) {
        final isCompletelyEmpty = response.books.isEmpty &&
            response.articles.isEmpty &&
            response.publishers.isEmpty;

        if (tab == SearchSectionType.all && isCompletelyEmpty) {
          emit(SearchEmpty(query));
          return;
        }

        emit(
          SearchSuccess(
            response: response,
            suggestions: suggestions,
            query: query,
            tab: tab,
            locale: locale,
            page: page,
          ),
        );
      },
    );
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }
}
