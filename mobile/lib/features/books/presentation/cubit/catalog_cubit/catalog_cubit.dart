import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/entities/book.dart';
import '../../../domain/entities/category.dart';
import '../../../domain/entities/sort_order.dart';
import '../../../domain/repositories/base_books_repository.dart';
import 'catalog_state.dart';

@injectable
class CatalogCubit extends Cubit<CatalogState> {
  CatalogCubit(this._repo) : super(const CatalogInitial());

  final BooksRepository _repo;

  String? _activeCategory;
  TranslationStatus? _activeStatus;
  SortOrder _sort = SortOrder.newest;
  int _page = 1;
  bool _isLoadingMore = false;
  List<Category> _categories = [];

  Future<void> load() {
    _page = 1;
    return _fetch();
  }

  Future<void> refresh() {
    _page = 1;
    return _fetch();
  }

  Future<void> applyFilter({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder? sort,
  }) {
    _activeCategory = categorySlug;
    _activeStatus = status;
    if (sort != null) _sort = sort;
    _page = 1;
    return _fetch();
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! CatalogSuccess || !current.hasMore || _isLoadingMore) return;
    _isLoadingMore = true;
    _page++;
    final result = await _repo.getBooks(
      categorySlug: _activeCategory,
      status: _activeStatus,
      sort: _sort,
      page: _page,
    );
    result.fold(
      (f) {
        // $mobile-debug-skill | Problem: loadMore page increment would stick on failure leaving pagination in wrong state. Fix: roll back page counter so next attempt retries the same page.
        _page--;
        _isLoadingMore = false;
      },
      (paginated) {
        _isLoadingMore = false;
        final incoming = _clientFilter(paginated.data);
        emit(CatalogSuccess(
          books: [...current.books, ...incoming],
          categories: _categories,
          hasMore: paginated.pagination.hasNextPage && incoming.isNotEmpty,
        ));
      },
    );
  }

  Future<void> _fetch() async {
    emit(const CatalogLoading());

    final booksFuture = _repo.getBooks(
      categorySlug: _activeCategory,
      status: _activeStatus,
      sort: _sort,
    );
    // Load categories once on first fetch — fired in parallel, non-blocking on failure.
    final catFuture = _categories.isEmpty ? _repo.getCategorySections() : null;

    final booksResult = await booksFuture;
    if (catFuture != null) {
      final catResult = await catFuture;
      catResult.fold(
        (_) {},
        (sections) => _categories = sections.map((s) => s.category).toList(),
      );
    }

    booksResult.fold(
      (f) => emit(CatalogError(core.failureToMessage(f))),
      (paginated) => emit(CatalogSuccess(
        books: _clientFilter(paginated.data),
        categories: _categories,
        hasMore: paginated.pagination.hasNextPage,
      )),
    );
  }

  List<Book> _clientFilter(List<Book> books) {
    if (_activeStatus == null) return books;
    return books.where((b) => b.status == _activeStatus).toList();
  }
}
