import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../books/data/datasources/books_mock_data.dart';
import '../../../publishers/data/datasources/publishers_remote_data_source_impl.dart';
import '../../domain/entities/search_result.dart';
import 'search_state.dart';

@injectable
class SearchCubit extends Cubit<SearchState> {
  SearchCubit(this._publishersDs) : super(const SearchInitial());

  final PublishersRemoteDataSourceImpl _publishersDs;

  Timer? _debounce;

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
    final q = query.toLowerCase();
    // Search books
    final matchBooks = BooksMockData.books
        .map((r) => r.toEntity())
        .where((b) =>
            b.titleAr.toLowerCase().contains(q) ||
            b.titleEn.toLowerCase().contains(q) ||
            b.publisher.toLowerCase().contains(q))
        .toList();

    // Search publishers
    final pubResult = await _publishersDs.getPublishers();
    final matchPubs = pubResult.getOrElse(() => []).where((p) =>
        p.name.toLowerCase().contains(q) ||
        p.countryAr.toLowerCase().contains(q) ||
        p.countryEn.toLowerCase().contains(q));

    final results = <SearchResult>[
      ...matchPubs.map(PublisherSearchResult.new),
      ...matchBooks.map(BookSearchResult.new),
    ];

    if (results.isEmpty) {
      emit(SearchEmpty(query));
    } else {
      emit(SearchSuccess(results));
    }
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }
}
