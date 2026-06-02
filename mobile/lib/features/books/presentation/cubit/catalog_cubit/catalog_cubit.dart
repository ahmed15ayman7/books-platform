import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/network/failure_messages.dart' as core;
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

  Future<void> refresh() => _fetch();

  Future<void> load() => _fetch();

  Future<void> applyFilter({
    String? categorySlug,
    TranslationStatus? status,
    SortOrder? sort,
  }) {
    _activeCategory = categorySlug;
    _activeStatus = status;
    if (sort != null) _sort = sort;
    return _fetch();
  }

  Future<void> _fetch() async {
    emit(const CatalogLoading());
    final result = await _repo.getBooks(
      categorySlug: _activeCategory,
      status: _activeStatus,
      sort: _sort,
    );
    result.fold(
      (f) => emit(CatalogError(core.failureToMessage(f))),
      (paginated) => emit(CatalogSuccess(
        books: paginated.data,
        hasMore: paginated.pagination.hasNextPage,
      )),
    );
  }
}
